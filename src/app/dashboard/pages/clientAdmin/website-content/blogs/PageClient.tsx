"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  FiImage, FiEdit, FiMessageSquare, FiSettings, FiPlus, FiSave, FiUpload, FiX, FiStar, FiLoader, FiCalendar,
} from "react-icons/fi";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";
import AdminToast from "@/app/dashboard/components/AdminToast";
import { useAdminToast } from "@/app/dashboard/hooks/useAdminToast";
import type { BlogContent } from "@/app/types/content/public";
import { useAppDispatch, useAppSelector } from "@/app/redux/store/hooks";
import { initializeContent, updateContent, markSaved, selectBlogContent, selectBlogIsDirty } from "@/app/redux/slices/blogPageSlice";
import { nanoid } from "nanoid";

interface BlogPageClientProps {
  initialContent: BlogContent;
}

type Article = BlogContent["articles"][0];

const formatDateDisplay = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  } catch { return dateString; }
};

const formatDateForInput = (displayDate: string): string => {
  try {
    const date = new Date(displayDate);
    if (isNaN(date.getTime())) {
      const parts = displayDate.match(/(\d+)\s+(\w+),?\s+(\d+)/);
      if (parts) {
        const day = parseInt(parts[1]);
        const monthStr = parts[2];
        const year = parseInt(parts[3]);
        const months: Record<string, number> = { 'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5, 'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11 };
        const month = months[monthStr.substring(0, 3)];
        if (month !== undefined) {
          const localDate = new Date(year, month, day);
          return `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
        }
      }
      return new Date().toISOString().split('T')[0];
    }
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  } catch { return new Date().toISOString().split('T')[0]; }
};

const ARTICLES_PER_PAGE = 1;

export default function BlogPageClient({ initialContent }: BlogPageClientProps) {
  const dispatch = useAppDispatch();
  const reduxContent = useAppSelector(selectBlogContent);
  const isDirty = useAppSelector(selectBlogIsDirty);
  
  const [activeTab, setActiveTab] = useState("hero");
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast, showToast } = useAdminToast();
  const formDataRef = useRef(reduxContent || initialContent);

  useEffect(() => {
    if (!reduxContent) dispatch(initializeContent(initialContent));
  }, [dispatch, initialContent, reduxContent]);

  const formData = reduxContent || initialContent;
  formDataRef.current = formData;

  const saveFormData = useCallback(async () => {
    if (isSaving || !isDirty) return false;
    setIsSaving(true);
    const finalData = formDataRef.current;
    try {
      const response = await fetch("/api/website-content/blogPage/updateContent", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });
      if (response.ok) {
        dispatch(markSaved());
        showToast("Content published");
        return true;
      } else {
        const error = await response.text();
        showToast(`Failed to save: ${error}`, "error");
        return false;
      }
    } catch (error) {
      console.error("Save failed:", error);
      showToast("Error saving content", "error");
      return false;
    } finally { setIsSaving(false); }
  }, [showToast, isSaving, isDirty, dispatch]);

  const onSubmit = async (e: React.FormEvent) => { e.preventDefault(); await saveFormData(); };

  const generateSlug = (name: string): string => name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+/, "").replace(/-+$/, "");

  const uploadFile = async (file: File, section: string, customFolder?: string): Promise<string> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const folderPath = customFolder ? `riddhi_interiors/blog/${section}/${customFolder}` : `riddhi_interiors/blog/${section}`;
      formData.append("folderPath", folderPath);
      const MAX_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_SIZE) { showToast("File size exceeds 5MB limit", "error"); return ""; }
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) { showToast("Only JPG, PNG, or WebP images are allowed", "error"); return ""; }
      const response = await fetch("/api/cloudinary/upload", { method: "POST", body: formData });
      if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || "Upload failed"); }
      const { secure_url } = await response.json();
      return secure_url;
    } catch (error) {
      console.error("Upload failed:", error);
      showToast(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`, "error");
      return "";
    } finally { setUploading(false); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldPath: string, section: string, customFolder?: string) => {
    if (!e.target.files?.[0] || !formData) return;
    const file = e.target.files[0];
    e.target.value = "";
    setUploading(true);
    try {
      const fileUrl = await uploadFile(file, section, customFolder);
      if (fileUrl) {
        const updatedFormData = structuredClone(formData);
        const parts = fieldPath.split(".");
        let current: unknown = updatedFormData;
        for (let i = 0; i < parts.length - 1; i++) current = (current as Record<string, unknown>)[parts[i]];
        (current as Record<string, unknown>)[parts[parts.length - 1]] = fileUrl;
        dispatch(updateContent(updatedFormData));
        await saveFormData();
      }
    } catch (error) { console.error("Upload failed:", error); }
    finally { setUploading(false); }
  };

  const handleInputChange = (path: string, value: string | number | string[]) => {
    if (!formData) return;
    const newData: BlogContent = structuredClone(formData);
    const parts = path.split(".");
    const lastPart = parts.pop()!;
    let current: unknown = newData;
    for (const part of parts) {
      if (Array.isArray(current) && /^\d+$/.test(part)) current = current[parseInt(part)];
      else if (typeof current === "object" && current !== null) current = (current as Record<string, unknown>)[part];
    }
    if (typeof current === "object" && current !== null) (current as Record<string, unknown>)[lastPart] = value;
    dispatch(updateContent(newData));
  };

  const addArrayItem = <T,>(arrayPath: string, newItem: T) => {
    if (!formData) return;
    const newData: BlogContent = structuredClone(formData);
    const parts = arrayPath.split(".");
    let current: unknown = newData;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (typeof current === "object" && current !== null && part in (current as Record<string, unknown>)) current = (current as Record<string, unknown>)[part];
    }
    const lastPart = parts[parts.length - 1];
    if (typeof current === "object" && current !== null && Array.isArray((current as Record<string, unknown>)[lastPart])) ((current as Record<string, unknown>)[lastPart] as T[]).push(newItem);
    dispatch(updateContent(newData));
  };

  const removeArrayItem = (arrayPath: string, index: number) => {
    if (!formData) return;
    const newData: BlogContent = structuredClone(formData);
    const parts = arrayPath.split(".");
    let current: unknown = newData;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (Array.isArray(current) && /^\d+$/.test(part)) current = current[parseInt(part)];
      else if (typeof current === "object" && current !== null) current = (current as Record<string, unknown>)[part];
    }
    const lastPart = parts[parts.length - 1];
    if (typeof current !== "object" || current === null) return;
    const array = (current as Record<string, unknown>)[lastPart];
    if (!Array.isArray(array)) return;
    const item = array[index];
    let imageUrl = "";
    if (typeof item === "object" && item !== null) {
      if ("imageUrl" in item) imageUrl = item.imageUrl as string;
      else if ("backgroundImageUrl" in item) imageUrl = item.backgroundImageUrl as string;
    }
    if (imageUrl && imageUrl.includes("res.cloudinary.com")) {
      let folderPath = "";
      if (arrayPath.includes("articles") && typeof item === "object" && item !== null && "title" in item) {
        const slug = generateSlug(item.title as string);
        folderPath = `riddhi_interiors/blog/${slug}`;
      } else {
        const url = new URL(imageUrl);
        const urlParts = url.pathname.split("/").filter(Boolean);
        folderPath = urlParts.slice(1, -1).join("/");
      }
      fetch("/api/cloudinary/delete", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ folderPath }) }).catch((err) => console.error("Delete failed:", err));
    }
    array.splice(index, 1);
    dispatch(updateContent(newData));
  };

  const updateCategory = (index: number, value: string) => {
    if (!formData) return;
    const newData: BlogContent = structuredClone(formData);
    newData.categories[index] = value;
    dispatch(updateContent(newData));
  };

  const addCategory = () => {
    if (!formData) return;
    const newData: BlogContent = structuredClone(formData);
    newData.categories.push("New Category");
    dispatch(updateContent(newData));
  };

  const removeCategory = (index: number) => {
    if (!formData) return;
    const newData: BlogContent = structuredClone(formData);
    newData.categories.splice(index, 1);
    dispatch(updateContent(newData));
  };

  const tabItems = [
    { value: "hero", icon: <FiImage />, label: "Hero" },
    { value: "featured", icon: <FiStar />, label: "Featured" },
    { value: "categories", icon: <FiSettings />, label: "Categories" },
    { value: "articles", icon: <FiEdit />, label: "Articles" },
    { value: "newsletter", icon: <FiMessageSquare />, label: "Newsletter" },
  ];

  const sortedArticles = React.useMemo(() => {
    if (!formData.articles) return [];
    return [...formData.articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [formData.articles]);

  const totalArticles = sortedArticles.length;
  const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);
  const indexOfLastArticle = currentPage * ARTICLES_PER_PAGE;
  const indexOfFirstArticle = indexOfLastArticle - ARTICLES_PER_PAGE;
  const currentPageArticles = sortedArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  return (
    <form onSubmit={onSubmit}>
      <AdminToast message={toast?.message ?? null} tone={toast?.tone} />
      <div className="flex flex-col min-h-screen bg-linear-to-br from-slate-50 to-lime-50 dark:from-slate-900 dark:to-slate-800">
        <header className="flex flex-col bg-white dark:bg-slate-800 shadow-sm">
          <div className="flex justify-between items-center p-4">
            <div>
              <h1 className="text-2xl font-bold text-lime-900 dark:text-lime-100">Blog Page Content Management</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage your blog page content and articles</p>
            </div>
            <Button type="submit" variant="default" disabled={isSaving} className={cn("flex items-center gap-2 transition-all", isDirty && "ring-2 ring-lime-500")}>
              {isSaving ? <><FiLoader className="w-4 h-4 animate-spin" />Saving...</> : <><FiSave className="w-4 h-4" />{isDirty ? "Publish Changes*" : "Publish Changes"}</>}
            </Button>
          </div>
          <div className="border-t border-b border-gray-100 dark:border-slate-700 px-4 py-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5 bg-lime-50 dark:bg-slate-700 gap-1 p-1 w-full">
                {tabItems.map((item, index) => (
                  <TabsTrigger key={index} value={item.value} className="flex flex-col items-center h-auto py-2 px-1 text-xs data-[state=active]:bg-lime-500 data-[state=active]:text-white transition-all">
                    <span>{item.icon}</span><span>{item.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Tabs value={activeTab} className="w-full">
            <TabsContent value="hero" className="mt-4">
              <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700">
                <CardHeader className="bg-lime-50 dark:bg-slate-700"><CardTitle className="text-lime-900 dark:text-lime-100">Hero Section</CardTitle></CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
                    <div className="w-32 h-32 border-2 border-dashed border-lime-300 rounded-lg flex items-center justify-center overflow-hidden bg-lime-50 dark:bg-slate-700">
                      {formData.hero.backgroundImageUrl ? <Image src={formData.hero.backgroundImageUrl} alt="Hero background" width={128} height={128} className="object-cover w-full h-full" /> : <FiImage className="text-lime-400 text-2xl" />}
                    </div>
                    <div className="flex-1">
                      <Label>Background Image</Label>
                      <div className="relative mt-2">
                        <Button variant="outline" disabled={uploading} type="button" className="w-full md:w-auto flex items-center gap-2 border-lime-300 text-lime-700">
                          {uploading ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiUpload className="w-4 h-4" />}
                          {uploading ? "Uploading..." : "Upload Image"}
                        </Button>
                        <Input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleFileUpload(e, "hero.backgroundImageUrl", "hero")} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div><Label>Pre-Title</Label><Input value={formData.hero.preTitle || ""} onChange={(e) => handleInputChange("hero.preTitle", e.target.value)} className="mt-1" /></div>
                    <div><Label>Title</Label><Input value={formData.hero.title || ""} onChange={(e) => handleInputChange("hero.title", e.target.value)} className="mt-1" /></div>
                    <div><Label>Subtitle</Label><Textarea value={formData.hero.subtitle || ""} onChange={(e) => handleInputChange("hero.subtitle", e.target.value)} rows={3} className="mt-1" /></div>
                    <div><Label>Search Placeholder</Label><Input value={formData.hero.searchPlaceholder || ""} onChange={(e) => handleInputChange("hero.searchPlaceholder", e.target.value)} className="mt-1" /></div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="featured" className="mt-4">
              <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700">
                <CardHeader className="bg-lime-50 dark:bg-slate-700"><CardTitle className="text-lime-900 dark:text-lime-100">Featured Posts</CardTitle></CardHeader>
                <CardContent className="p-6">
                  <div className="mb-4"><Label>Featured Section Title</Label><Input value={formData.featured?.title || ""} onChange={(e) => handleInputChange("featured.title", e.target.value)} className="mt-1" /></div>
                  <div className="border-t border-lime-200 pt-4 mt-4">
                    <h3 className="text-lg font-medium text-lime-800 mb-4">Select Featured Posts</h3>
                    {formData.articles && formData.articles.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {formData.articles.map((article: Article, index: number) => {
                          const articleId = String(article.id || `temp-${index}`);
                          const isFeatured = formData.featured?.postIds?.some((id: string) => String(id) === articleId);
                          return (
                            <div
                              key={articleId}
                              className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg ${isFeatured ? "border-lime-500 bg-lime-50 dark:bg-lime-900/20" : "border-lime-200 dark:border-slate-600"}`}
                              onClick={() => {
                                const currentIds = (formData.featured?.postIds || []).map((id: string | number) => String(id));
                                const newIds = isFeatured ? currentIds.filter((id: string) => id !== articleId) : [...currentIds, articleId];
                                handleInputChange("featured.postIds", newIds);
                              }}
                            >
                              <div className={`absolute top-2 right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center ${isFeatured ? "bg-lime-500 text-white" : "bg-gray-200 dark:bg-gray-600"}`}>
                                {isFeatured && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                              </div>
                              <div className="relative h-32 w-full">
                                {article.imageUrl ? (
                                  <Image src={article.imageUrl} alt={article.title} fill className="object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-lime-100 dark:bg-lime-800 flex items-center justify-center"><FiImage className="text-lime-400 text-2xl" /></div>
                                )}
                              </div>
                              <div className="p-3">
                                <Badge variant="secondary" className="text-xs bg-lime-100 text-lime-700">{article.category}</Badge>
                                <h4 className="font-medium text-sm text-gray-800 dark:text-gray-200 line-clamp-2 mt-1">{article.title}</h4>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-8">No articles available. Please add articles first in the Articles tab.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories" className="mt-4">
              <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700">
                <CardHeader className="bg-lime-50 dark:bg-slate-700">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lime-900 dark:text-lime-100">Blog Categories</CardTitle>
                    <Button onClick={addCategory} type="button" className="bg-lime-500 hover:bg-lime-600 text-white flex items-center gap-2">
                      <FiPlus className="w-4 h-4" /> Add Category
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {formData.categories?.map((category: string, index: number) => (
                      <Card key={index} className="p-4 bg-lime-50 dark:bg-slate-700 border-lime-200 dark:border-slate-600">
                        <div className="flex justify-between items-center mb-3">
                          <Badge className="bg-lime-500 text-white">Category {index + 1}</Badge>
                          {index > 0 && (
                            <Button variant="ghost" size="sm" onClick={() => removeCategory(index)} type="button" className="text-red-500 hover:text-red-700">
                              <FiX className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div>
                          <Label>Category Name</Label>
                          <Input value={category} onChange={(e) => updateCategory(index, e.target.value)} className="mt-1" />
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="articles" className="mt-4">
              <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700">
                <CardHeader className="bg-lime-50 dark:bg-slate-700">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lime-900 dark:text-lime-100">Blog Articles</CardTitle>
                    <Button
                      onClick={() =>
                        addArrayItem("articles", {
                          id: Date.now(),
                          imageUrl: "",
                          category: formData.categories[1] || "Trends",
                          title: "New Article",
                          description: "",
                          author: "",
                          authorBio: "",
                          date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
                          content: { hero: { title: "", subtitle: "", imageUrl: "" }, meta: { readTime: "5 min read" }, body: [], features: [], tips: [] },
                        })
                      }
                      type="button"
                      className="bg-lime-500 hover:bg-lime-600 text-white flex items-center gap-2"
                    >
                      <FiPlus className="w-4 h-4" /> Add Article
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {currentPageArticles.map((article: Article, index: number) => {
                      const actualIndex = indexOfFirstArticle + index;
                      return (
                        <Card key={article.id ?? actualIndex} className="p-5 bg-lime-50 dark:bg-slate-700 border-lime-200 dark:border-slate-600">
                          <div className="flex flex-row items-center justify-between p-4 -mx-5 -mt-5 mb-5 bg-lime-100 dark:bg-slate-600">
                            <Badge variant="secondary" className="bg-lime-500 text-white">Article {actualIndex + 1}</Badge>
                            <Button variant="ghost" size="sm" onClick={() => removeArrayItem("articles", actualIndex)} type="button" className="text-red-500 hover:text-red-700">
                              <FiX className="w-4 h-4" />
                            </Button>
                          </div>
                          <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
                              <div className="w-24 h-24 border-2 border-dashed border-lime-300 rounded-lg flex items-center justify-center overflow-hidden bg-white dark:bg-slate-800">
                                {article.imageUrl ? (
                                  <Image src={article.imageUrl} alt="Article preview" width={96} height={96} className="object-cover w-full h-full" />
                                ) : (
                                  <FiImage className="text-lime-400 text-2xl" />
                                )}
                              </div>
                              <div className="flex-1">
                                <Label>Article Image</Label>
                                <div className="relative mt-2">
                                  <Button variant="outline" disabled={uploading} type="button" className="w-full md:w-auto flex items-center gap-2 border-lime-300 text-lime-700">
                                    {uploading ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiUpload className="w-4 h-4" />}
                                    {uploading ? "Uploading..." : "Upload Image"}
                                  </Button>
                                  <Input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleFileUpload(e, `articles.${actualIndex}.imageUrl`, "articles", generateSlug(article.title))} />
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div><Label>Title</Label><Input value={article.title} onChange={(e) => handleInputChange(`articles.${actualIndex}.title`, e.target.value)} className="mt-1" /></div>
                              <div><Label>Author</Label><Input value={article.author} onChange={(e) => handleInputChange(`articles.${actualIndex}.author`, e.target.value)} className="mt-1" /></div>
                              <div>
                                <Label>Category</Label>
                                <select value={article.category} onChange={(e) => handleInputChange(`articles.${actualIndex}.category`, e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                  {formData.categories?.map((cat: string) => (<option key={cat} value={cat}>{cat}</option>))}
                                </select>
                              </div>
                              <div>
                                <Label className="flex items-center gap-2"><FiCalendar className="w-4 h-4" /> Date</Label>
                                <div className="relative mt-1">
                                  <Input type="date" value={formatDateForInput(article.date)} onChange={(e) => { const formattedDate = formatDateDisplay(e.target.value); handleInputChange(`articles.${actualIndex}.date`, formattedDate); }} className="mt-1 pl-10" />
                                  <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                              </div>
                            </div>
                            <div className="mt-4">
                              <Label>Description</Label>
                              <Textarea value={article.description} onChange={(e) => handleInputChange(`articles.${actualIndex}.description`, e.target.value)} rows={3} className="mt-1" />
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                      <Button type="button" variant="outline" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Previous</Button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button key={page} type="button" variant={currentPage === page ? "default" : "outline"} onClick={() => setCurrentPage(page)} className="w-10 h-10">{page}</Button>
                      ))}
                      <Button type="button" variant="outline" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Next</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="newsletter" className="mt-4">
              <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700">
                <CardHeader className="bg-lime-50 dark:bg-slate-700"><CardTitle className="text-lime-900 dark:text-lime-100">Newsletter Section</CardTitle></CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div><Label>Title</Label><Input value={formData.newsletter.title} onChange={(e) => handleInputChange("newsletter.title", e.target.value)} className="mt-1" /></div>
                  <div><Label>Description</Label><Textarea value={formData.newsletter.description} onChange={(e) => handleInputChange("newsletter.description", e.target.value)} rows={3} className="mt-1" /></div>
                  <div><Label>Placeholder Text</Label><Input value={formData.newsletter.placeholder} onChange={(e) => handleInputChange("newsletter.placeholder", e.target.value)} className="mt-1" /></div>
                  <div><Label>Button Text</Label><Input value={formData.newsletter.buttonText} onChange={(e) => handleInputChange("newsletter.buttonText", e.target.value)} className="mt-1" /></div>
                  <div><Label>Privacy Text</Label><Input value={formData.newsletter.privacyText} onChange={(e) => handleInputChange("newsletter.privacyText", e.target.value)} className="mt-1" /></div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </form>
  );
}
