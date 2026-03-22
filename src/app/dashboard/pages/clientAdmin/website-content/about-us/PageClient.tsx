"use client";
import React, { useCallback, useState, useEffect } from "react";
import {
  FiLayout,
  FiImage,
  FiEdit,
  FiUsers,
  FiMessageSquare,
  FiSettings,
  FiPlus,
  FiMinus,
  FiSave,
  FiEye,
  FiEyeOff,
  FiUpload,
  FiX,
} from "react-icons/fi";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { AboutContent } from "@/app/types/content/about";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import AdminToast from "@/app/dashboard/components/AdminToast";
import { useAdminToast } from "@/app/dashboard/hooks/useAdminToast";
import { useAppDispatch, useAppSelector } from "@/app/redux/store/hooks";
import { initializeContent, updateContent, markSaved, selectAboutContent, selectAboutIsDirty } from "@/app/redux/slices/aboutUsPageSlice";

interface AboutUsPageClientProps {
  initialContent: AboutContent;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const staggerChildren = {
  visible: { transition: { staggerChildren: 0.05 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
};

export default function AboutUsPageClient({ initialContent }: AboutUsPageClientProps) {
  const dispatch = useAppDispatch();
  const reduxContent = useAppSelector(selectAboutContent);
  const isDirty = useAppSelector(selectAboutIsDirty);
  
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast, showToast } = useAdminToast();

  // Initialize Redux with SSR data on mount
  useEffect(() => {
    if (!reduxContent) {
      dispatch(initializeContent(initialContent));
    }
  }, [dispatch, initialContent, reduxContent]);

  const formData = reduxContent || initialContent;

  const generateSlug = (name: string): string => {
    return name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
  };

  const handleInputChange = (path: string, value: string) => {
    if (!formData) return;
    const newData: AboutContent = JSON.parse(JSON.stringify(formData));
    const parts = path.split(".");
    const lastPart = parts.pop()!;
    let current: unknown = newData;
    for (const part of parts) {
      if (Array.isArray(current) && /^\d+$/.test(part)) {
        current = current[parseInt(part)];
      } else if (typeof current === "object" && current !== null) {
        current = (current as Record<string, unknown>)[part];
      }
    }
    if (typeof current === "object" && current !== null) {
      (current as Record<string, unknown>)[lastPart] = value;
    }
    dispatch(updateContent(newData));
  };

  const addArrayItem = <T,>(arrayPath: string, newItem: T) => {
    if (!formData) return;
    const newData: AboutContent = JSON.parse(JSON.stringify(formData));
    const parts = arrayPath.split(".");
    let current: Record<string, unknown> = newData;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (current && typeof current === "object" && part in current) {
        current = current[part] as Record<string, unknown>;
      }
    }
    const lastPart = parts[parts.length - 1];
    if (current && Array.isArray(current[lastPart])) {
      (current[lastPart] as T[]).push(newItem);
    }
    dispatch(updateContent(newData));
  };

  const removeArrayItem = async (arrayPath: string, index: number) => {
    if (!formData) return;
    const newData: AboutContent = JSON.parse(JSON.stringify(formData));
    const parts = arrayPath.split(".");
    let current: unknown = newData;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (Array.isArray(current) && /^\d+$/.test(part)) {
        current = current[parseInt(part)];
      } else if (typeof current === "object" && current !== null) {
        current = (current as Record<string, unknown>)[part];
      }
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
      if (arrayPath === "teamMembers" && typeof item === "object" && item !== null && "name" in item) {
        const slug = generateSlug(item.name as string);
        folderPath = `riddhi_interiors/aboutUs/team/${slug}`;
      } else {
        const url = new URL(imageUrl);
        const parts = url.pathname.split("/").filter(Boolean);
        folderPath = parts.slice(1, -1).join("/");
      }
      fetch("/api/cloudinary/delete", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ folderPath }) }).catch((err) => console.error("Delete failed:", err));
    }
    array.splice(index, 1);
    dispatch(updateContent(newData));
  };

  const addTagToTeamMember = (index: number) => {
    if (!formData) return;
    const newData = JSON.parse(JSON.stringify(formData));
    if (newData.teamMembers[index]) {
      newData.teamMembers[index].tags.push("");
      dispatch(updateContent(newData));
    }
  };

  const removeTagFromTeamMember = (memberIndex: number, tagIndex: number) => {
    if (!formData) return;
    const newData = JSON.parse(JSON.stringify(formData));
    if (newData.teamMembers[memberIndex]) {
      newData.teamMembers[memberIndex].tags.splice(tagIndex, 1);
      dispatch(updateContent(newData));
    }
  };

  const saveFormData = useCallback(async () => {
    if (isSaving || !isDirty) return false;
    setIsSaving(true);
    try {
      const response = await fetch("/api/website-content/aboutUsPage/updateContent", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
    } finally {
      setIsSaving(false);
    }
  }, [formData, showToast, isSaving, isDirty, dispatch]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveFormData();
  };

  const uploadFile = async (file: File, section: string, customFolder?: string): Promise<string> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const folderPath = customFolder ? `riddhi_interiors/aboutUs/${section}/${customFolder}` : `riddhi_interiors/aboutUs/${section}`;
      formData.append("folderPath", folderPath);
      const response = await fetch("/api/cloudinary/upload", { method: "POST", body: formData });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }
      const { secure_url } = await response.json();
      return secure_url;
    } catch (error) {
      console.error("Upload failed:", error);
      showToast(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`, "error");
      return "";
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldPath: string, section: string, teamMemberName?: string) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    e.target.value = "";
    setUploading(true);
    try {
      const folderName = teamMemberName ? generateSlug(teamMemberName) : undefined;
      const fileUrl = await uploadFile(file, section, folderName);
      if (fileUrl) {
        const updatedFormData = JSON.parse(JSON.stringify(formData));
        const parts = fieldPath.split(".");
        let current = updatedFormData;
        for (let i = 0; i < parts.length - 1; i++) {
          current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = fileUrl;
        dispatch(updateContent(updatedFormData));
        await saveFormData();
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const tabItems = [
    { value: "hero", icon: <FiImage />, label: "Hero" },
    { value: "stats", icon: <FiSettings />, label: "Stats" },
    { value: "story", icon: <FiEdit />, label: "Our Story" },
    { value: "values", icon: <FiLayout />, label: "Core Values" },
    { value: "team", icon: <FiUsers />, label: "Team" },
    { value: "connect", icon: <FiMessageSquare />, label: "Connect" },
  ];

  return (
    <form onSubmit={onSubmit}>
      <AdminToast message={toast?.message ?? null} tone={toast?.tone} />
      <div className="flex flex-col min-h-screen bg-linear-to-br from-slate-50 to-lime-50 dark:from-slate-900 dark:to-slate-800">
        <motion.header className="flex flex-col bg-white dark:bg-slate-800 shadow-sm" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
          <div className="flex justify-between items-center p-4">
            <div>
              <h1 className="text-2xl font-bold text-lime-900 dark:text-lime-100">About Us Page Content Management</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage your website's About Us page content</p>
            </div>
            <div className="flex space-x-3">
              <Button onClick={() => setPreviewMode(!previewMode)} variant={previewMode ? "secondary" : "outline"} type="button" className="flex items-center gap-2">
                {previewMode ? <><FiEyeOff className="w-4 h-4" /> Exit Preview</> : <><FiEye className="w-4 h-4" /> Preview Mode</>}
              </Button>
              <Button type="submit" variant="default" disabled={isSaving || !isDirty} className={cn("flex items-center gap-2 transition-all", isDirty && "ring-2 ring-lime-500")}>
                {isSaving ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><FiSave className="w-4 h-4" /></motion.div>Saving...</> : <><FiSave className="w-4 h-4" />{isDirty ? "Publish Changes*" : "Publish Changes"}</>}
              </Button>
            </div>
          </div>
          <div className="border-t border-b border-gray-100 dark:border-slate-700 px-4 py-2">
            <div className="flex items-center justify-center py-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 md:grid-cols-6 bg-lime-50 dark:bg-slate-700 gap-1 p-1 w-full">
                  {tabItems.map((item) => (
                    <TabsTrigger key={item.value} value={item.value} className="flex flex-col items-center h-auto py-2 px-1 text-xs data-[state=active]:bg-lime-500 data-[state=active]:text-white transition-all">
                      <span>{item.icon}</span><span>{item.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </motion.header>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          {previewMode ? (
            <Card className="overflow-hidden">
              <CardHeader className="bg-lime-50 dark:bg-slate-700"><CardTitle className="flex items-center gap-2"><FiEye className="w-5 h-5" /> Preview Mode</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="border-2 border-dashed rounded-xl w-full h-150 flex items-center justify-center text-gray-500 bg-gray-50 dark:bg-slate-900">
                  <div className="text-center"><FiLayout className="text-4xl mx-auto mb-3" /><p>About Us page preview will appear here</p></div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Tabs value={activeTab} className="w-full">
              <TabsContent value="hero" className="mt-4">
                <motion.div variants={fadeIn} initial="hidden" animate="visible">
                  <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 overflow-hidden">
                    <CardHeader className="bg-lime-50 dark:bg-slate-700"><CardTitle className="text-lime-900 dark:text-lime-100 p-3">Hero Section</CardTitle></CardHeader>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
                        <div className="w-32 h-32 border-2 border-dashed border-lime-300 rounded-lg flex items-center justify-center overflow-hidden bg-lime-50 dark:bg-slate-700">
                          {formData.hero.backgroundImageUrl ? <Image src={formData.hero.backgroundImageUrl} alt="Hero background preview" width={128} height={128} className="object-cover w-full h-full" /> : <FiImage className="text-lime-400 text-2xl" />}
                        </div>
                        <div className="flex-1">
                          <Label>Background Image</Label>
                          <div className="relative mt-2">
                            <Button variant="outline" disabled={uploading} type="button" className="w-full md:w-auto flex items-center gap-2 border-lime-300 text-lime-700 hover:bg-lime-50">
                              {uploading ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><FiUpload className="w-4 h-4" /></motion.div>Uploading...</> : <><FiUpload className="w-4 h-4" />Upload Image</>}
                            </Button>
                            <Input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleFileUpload(e, "hero.backgroundImageUrl", "hero")} />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div><Label>Upper Title</Label><Input value={formData.hero.upperTitle || ""} onChange={(e) => handleInputChange("hero.upperTitle", e.target.value)} className="mt-1 focus:ring-lime-500 focus:border-lime-500" /></div>
                        <div><Label>Title</Label><Input value={formData.hero.title || ""} onChange={(e) => handleInputChange("hero.title", e.target.value)} className="mt-1 focus:ring-lime-500 focus:border-lime-500" /></div>
                        <div><Label>Subtitle</Label><Textarea value={formData.hero.subtitle || ""} onChange={(e) => handleInputChange("hero.subtitle", e.target.value)} rows={3} className="mt-1 focus:ring-lime-500 focus:border-lime-500" /></div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="stats" className="mt-4">
                <motion.div variants={fadeIn} initial="hidden" animate="visible">
                  <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 overflow-hidden">
                    <CardHeader className="bg-lime-50 dark:bg-slate-700"><CardTitle className="text-lime-900 dark:text-lime-100 p-3">Statistics Section</CardTitle></CardHeader>
                    <CardContent className="p-6">
                      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={staggerChildren} initial="hidden" animate="visible">
                        {formData.stats.map((item, index) => (
                          <motion.div key={index} variants={scaleIn} whileHover={{ y: -5 }}>
                            <Card className="p-4 bg-lime-50 dark:bg-slate-700 border-lime-200 dark:border-slate-600 relative overflow-hidden">
                              <div className="flex justify-between items-center mb-4">
                                <Badge variant="secondary" className="bg-lime-500 text-white">Stat {index + 1}</Badge>
                                <Button variant="ghost" size="sm" onClick={() => removeArrayItem("stats", index)} type="button" className="text-red-500 hover:text-red-700 hover:bg-red-50"><FiX className="w-4 h-4" /></Button>
                              </div>
                              <div className="mb-4"><Label>Value</Label><Input value={item.value || ""} onChange={(e) => handleInputChange(`stats.${index}.value`, e.target.value)} className="mt-1 font-bold text-lg focus:ring-lime-500 focus:border-lime-500" /></div>
                              <div><Label>Label</Label><Input value={item.label || ""} onChange={(e) => handleInputChange(`stats.${index}.label`, e.target.value)} className="mt-1 focus:ring-lime-500 focus:border-lime-500" /></div>
                            </Card>
                          </motion.div>
                        ))}
                      </motion.div>
                      <Button onClick={() => addArrayItem("stats", { value: "", label: "" })} variant="outline" className="mt-6 w-full border-lime-300 text-lime-700 hover:bg-lime-50 flex items-center justify-center gap-2" type="button"><FiPlus className="w-4 h-4" /> Add New Statistic</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="story" className="mt-4">
                <motion.div variants={fadeIn} initial="hidden" animate="visible">
                  <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 overflow-hidden">
                    <CardHeader className="bg-lime-50 dark:bg-slate-700"><CardTitle className="text-lime-900 dark:text-lime-100 p-3">Our Story Section</CardTitle></CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div><Label>Title</Label><Input value={formData.story.title || ""} onChange={(e) => handleInputChange("story.title", e.target.value)} className="mt-1 focus:ring-lime-500 focus:border-lime-500" /></div>
                      <div><Label>Subtitle</Label><Input value={formData.story.subtitle || ""} onChange={(e) => handleInputChange("story.subtitle", e.target.value)} className="mt-1 focus:ring-lime-500 focus:border-lime-500" /></div>
                      <div><Label>Content</Label><Textarea value={formData.story.content || ""} onChange={(e) => handleInputChange("story.content", e.target.value)} rows={6} className="mt-1 focus:ring-lime-500 focus:border-lime-500" /></div>
                      <div><Label>Content 2</Label><Textarea value={formData.story.content2 || ""} onChange={(e) => handleInputChange("story.content2", e.target.value)} rows={6} className="mt-1 focus:ring-lime-500 focus:border-lime-500" /></div>
                      <div><Label>Cities Served</Label><Input value={formData.story.cities || ""} onChange={(e) => handleInputChange("story.cities", e.target.value)} placeholder="Comma separated list" className="mt-1 focus:ring-lime-500 focus:border-lime-500" /></div>
                      <div><Label>Quote</Label><Textarea value={formData.story.quote || ""} onChange={(e) => handleInputChange("story.quote", e.target.value)} rows={3} className="mt-1 focus:ring-lime-500 focus:border-lime-500" /></div>
                      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                        <div className="w-32 h-32 border-2 border-dashed border-lime-300 rounded-lg flex items-center justify-center overflow-hidden bg-lime-50 dark:bg-slate-700">
                          {formData.story.imageUrl ? <Image src={formData.story.imageUrl} alt="Story image preview" width={128} height={128} className="object-cover w-full h-full" /> : <FiImage className="text-lime-400 text-2xl" />}
                        </div>
                        <div className="flex-1">
                          <Label>Story Image</Label>
                          <div className="relative mt-2">
                            <Button variant="outline" disabled={uploading} type="button" className="w-full md:w-auto flex items-center gap-2 border-lime-300 text-lime-700 hover:bg-lime-50">
                              {uploading ? "Uploading..." : "Upload Image"}
                            </Button>
                            <Input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleFileUpload(e, "story.imageUrl", "story")} />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="values" className="mt-4">
                <motion.div variants={fadeIn} initial="hidden" animate="visible">
                  <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 overflow-hidden">
                    <CardHeader className="bg-lime-50 dark:bg-slate-700"><CardTitle className="text-lime-900 dark:text-lime-100 p-3">Core Values Section</CardTitle></CardHeader>
                    <CardContent className="p-6">
                      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={staggerChildren} initial="hidden" animate="visible">
                        {formData.coreValues.map((item, index) => (
                          <motion.div key={index} variants={scaleIn} whileHover={{ y: -5 }}>
                            <Card className="p-4 bg-lime-50 dark:bg-slate-700 border-lime-200 dark:border-slate-600">
                              <div className="flex justify-between items-center mb-4">
                                <Badge variant="secondary" className="bg-lime-500 text-white">Value {index + 1}</Badge>
                                <Button variant="ghost" size="sm" onClick={() => removeArrayItem("coreValues", index)} type="button" className="text-red-500 hover:text-red-700 hover:bg-red-50"><FiX className="w-4 h-4" /></Button>
                              </div>
                              <div className="mb-4"><Label>Title</Label><Input value={item.title || ""} onChange={(e) => handleInputChange(`coreValues.${index}.title`, e.target.value)} className="mt-1 focus:ring-lime-500 focus:border-lime-500" /></div>
                              <div className="mb-4"><Label>Description</Label><Textarea value={item.description || ""} onChange={(e) => handleInputChange(`coreValues.${index}.description`, e.target.value)} rows={3} className="mt-1 focus:ring-lime-500 focus:border-lime-500" /></div>
                              <div><Label>Icon (Emoji)</Label><Input value={item.icon || ""} onChange={(e) => handleInputChange(`coreValues.${index}.icon`, e.target.value)} placeholder="e.g., 💡" className="mt-1 focus:ring-lime-500 focus:border-lime-500 text-2xl h-12" /></div>
                            </Card>
                          </motion.div>
                        ))}
                        <Button className="h-full flex flex-col items-center justify-center border-2 border-dashed bg-white border-lime-300 p-8 text-lime-700 hover:bg-lime-50" onClick={() => addArrayItem("coreValues", { title: "", description: "", icon: "" })} type="button"><FiPlus className="text-2xl mb-2" /><p>Add New Value</p></Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="team" className="mt-4">
                <motion.div variants={fadeIn} initial="hidden" animate="visible">
                  <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 overflow-hidden">
                    <CardHeader className="bg-lime-50 dark:bg-slate-700">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lime-900 dark:text-lime-100 p-3">Team Members</CardTitle>
                        <Button onClick={() => addArrayItem("teamMembers", { name: "New Team Member", title: "", bio: "", imageUrl: "", tags: [] })} type="button" className="bg-lime-500 hover:bg-lime-600 text-white flex items-center gap-2"><FiPlus className="w-4 h-4" /> Add Team Member</Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <motion.div className="space-y-6" variants={staggerChildren} initial="hidden" animate="visible">
                        {formData.teamMembers.map((member, index) => (
                          <motion.div key={index} variants={scaleIn} whileHover={{ y: -5 }}>
                            <Card className="p-5 bg-lime-50 dark:bg-slate-700 border-lime-200 dark:border-slate-600 overflow-hidden">
                              <div className="flex flex-row items-center justify-between p-4 -mx-5 -mt-5 mb-5 bg-lime-100 dark:bg-slate-600">
                                <Badge variant="secondary" className="bg-lime-500 text-white">Member {index + 1}</Badge>
                                <Button variant="ghost" size="sm" onClick={() => removeArrayItem("teamMembers", index)} type="button" className="text-red-500 hover:text-red-700 hover:bg-red-50"><FiX className="w-4 h-4" /></Button>
                              </div>
                              <CardContent className="p-0 space-y-4">
                                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                                  <div className="w-24 h-24 border-2 border-dashed border-lime-300 rounded-lg flex items-center justify-center overflow-hidden bg-white dark:bg-slate-800">
                                    {member.imageUrl ? <Image src={member.imageUrl} alt="Team member" width={96} height={96} className="object-cover w-full h-full" /> : <FiImage className="text-lime-400 text-2xl" />}
                                  </div>
                                  <div className="flex-1">
                                    <Label>Profile Image</Label>
                                    <div className="relative mt-2">
                                      <Button variant="outline" disabled={uploading} type="button" className="w-full md:w-auto flex items-center gap-2 border-lime-300 text-lime-700">{uploading ? "Uploading..." : "Upload Image"}</Button>
                                      <Input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleFileUpload(e, `teamMembers.${index}.imageUrl`, "team", member.name)} />
                                    </div>
                                  </div>
                                </div>
                                <div><Label>Name</Label><Input value={member.name || ""} onChange={(e) => handleInputChange(`teamMembers.${index}.name`, e.target.value)} className="mt-1 focus:ring-lime-500 focus:border-lime-500" /></div>
                                <div><Label>Title</Label><Input value={member.title || ""} onChange={(e) => handleInputChange(`teamMembers.${index}.title`, e.target.value)} className="mt-1 focus:ring-lime-500 focus:border-lime-500" /></div>
                                <div><Label>Bio</Label><Textarea value={member.bio || ""} onChange={(e) => handleInputChange(`teamMembers.${index}.bio`, e.target.value)} rows={4} className="mt-1 focus:ring-lime-500 focus:border-lime-500" /></div>
                                <div>
                                  <Label>Tags/Skills</Label>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {member.tags.map((tag, tagIndex) => (
                                      <div key={tagIndex} className="flex items-center bg-lime-100 dark:bg-slate-600 px-3 py-1 rounded-full">
                                        <Input value={tag || ""} onChange={(e) => handleInputChange(`teamMembers.${index}.tags.${tagIndex}`, e.target.value)} className="bg-transparent border-none p-0 w-32 focus:ring-0 focus:outline-none" />
                                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 p-0 h-5 w-5" onClick={() => removeTagFromTeamMember(index, tagIndex)} type="button"><FiMinus className="w-3 h-3" /></Button>
                                      </div>
                                    ))}
                                    <Button variant="outline" size="sm" onClick={() => addTagToTeamMember(index)} type="button" className="border-lime-300 text-lime-700 hover:bg-lime-50"><FiPlus className="w-3 h-3" /> Add Tag</Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="connect" className="mt-4">
                <motion.div variants={fadeIn} initial="hidden" animate="visible">
                  <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 overflow-hidden">
                    <CardHeader className="bg-lime-50 dark:bg-slate-700"><CardTitle className="text-lime-900 dark:text-lime-100 p-3">Connect Section</CardTitle></CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-4 text-lime-900 dark:text-lime-100">Social Links</h3>
                          <div className="space-y-4">
                            {formData.connect.socialLinks.map((item, index) => (
                              <Card key={index} className="p-4 bg-lime-50 dark:bg-slate-700 border-lime-200 dark:border-slate-600">
                                <div className="flex justify-between items-center mb-4">
                                  <Badge variant="secondary" className="bg-lime-500 text-white">Link {index + 1}</Badge>
                                  <Button variant="ghost" size="sm" onClick={() => removeArrayItem("connect.socialLinks", index)} type="button" className="text-red-500 hover:text-red-700"><FiX className="w-4 h-4" /></Button>
                                </div>
                                <div className="space-y-4">
                                  <div><Label>Platform</Label><Input value={item.platform || ""} onChange={(e) => handleInputChange(`connect.socialLinks.${index}.platform`, e.target.value)} className="mt-1 focus:ring-lime-500 focus:border-lime-500" /></div>
                                  <div><Label>URL</Label><Input value={item.url || ""} onChange={(e) => handleInputChange(`connect.socialLinks.${index}.url`, e.target.value)} className="mt-1 focus:ring-lime-500 focus:border-lime-500" /></div>
                                </div>
                              </Card>
                            ))}
                            <Button onClick={() => addArrayItem("connect.socialLinks", { platform: "", imageURL: "", url: "" })} type="button" variant="outline" className="w-full border-lime-300 text-lime-700 hover:bg-lime-50"><FiPlus className="w-4 h-4" /> Add Social Link</Button>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-4 text-lime-900 dark:text-lime-100">Contact Information</h3>
                          <div className="space-y-4">
                            <div><Label>Address</Label><Input value={formData.connect.address || ""} onChange={(e) => handleInputChange("connect.address", e.target.value)} className="mt-1 focus:ring-lime-500 focus:border-lime-500" /></div>
                            <div><Label>Business Hours</Label><Input value={formData.connect.hours || ""} onChange={(e) => handleInputChange("connect.hours", e.target.value)} className="mt-1 focus:ring-lime-500 focus:border-lime-500" /></div>
                            <div><Label>Phone Number</Label><Input value={formData.connect.phone || ""} onChange={(e) => handleInputChange("connect.phone", e.target.value)} className="mt-1 focus:ring-lime-500 focus:border-lime-500" /></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </form>
  );
}