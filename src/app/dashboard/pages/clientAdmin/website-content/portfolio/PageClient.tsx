"use client";
import React, { useState, useCallback, useEffect } from "react";
import {
  FiLayout, FiImage, FiEdit, FiMessageSquare, FiSettings, FiPlus, FiSave, FiUpload, FiX,
} from "react-icons/fi";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { PortfolioContent, Project, QuoteContent, Stat } from "@/app/types/content/portfolio";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import AdminToast from "@/app/dashboard/components/AdminToast";
import { useAdminToast } from "@/app/dashboard/hooks/useAdminToast";
import { useAppDispatch, useAppSelector } from "@/app/redux/store/hooks";
import { initializeContent, updateContent, markSaved, selectPortfolioContent, selectPortfolioIsDirty } from "@/app/redux/slices/portfolioPageSlice";

interface PortfolioPageClientProps {
  initialContent: PortfolioContent;
}

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };
const staggerChildren = { visible: { transition: { staggerChildren: 0.05 } } };
const scaleIn = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } } };

export default function PortfolioPageClient({ initialContent }: PortfolioPageClientProps) {
  const dispatch = useAppDispatch();
  const reduxContent = useAppSelector(selectPortfolioContent);
  const isDirty = useAppSelector(selectPortfolioIsDirty);
  
  const [activeTab, setActiveTab] = useState("hero");
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast, showToast } = useAdminToast();

  useEffect(() => {
    if (!reduxContent) dispatch(initializeContent(initialContent));
  }, [dispatch, initialContent, reduxContent]);

  const formData = reduxContent || initialContent;

  const generateSlug = (name: string): string => name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+/, "").replace(/-+$/, "");

  const handleInputChange = (path: string, value: string) => {
    if (!formData) return;
    const newData: PortfolioContent = JSON.parse(JSON.stringify(formData));
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
    const newData: PortfolioContent = JSON.parse(JSON.stringify(formData));
    const parts = arrayPath.split(".");
    let current: Record<string, unknown> = newData;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (current && typeof current === "object" && part in current) current = current[part] as Record<string, unknown>;
    }
    const lastPart = parts[parts.length - 1];
    if (current && Array.isArray(current[lastPart])) (current[lastPart] as T[]).push(newItem);
    dispatch(updateContent(newData));
  };

  const removeArrayItem = (arrayPath: string, index: number) => {
    if (!formData) return;
    const newData: PortfolioContent = JSON.parse(JSON.stringify(formData));
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
      if (arrayPath.includes("Projects") && typeof item === "object" && item !== null && "title" in item) {
        const section = arrayPath.includes("residential") ? "residential" : "commercial";
        const slug = generateSlug(item.title as string);
        folderPath = `riddhi_interiors/portfolio/${section}/${slug}`;
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

  const saveFormData = useCallback(async () => {
    if (isSaving || !isDirty) return false;
    setIsSaving(true);
    try {
      const response = await fetch("/api/website-content/portfolioPage/updateContent", {
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

  const onSubmit = async (e: React.FormEvent) => { e.preventDefault(); await saveFormData(); };

  const uploadFile = async (file: File, section: string, customFolder?: string): Promise<string> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const folderPath = customFolder ? `riddhi_interiors/portfolio/${section}/${customFolder}` : `riddhi_interiors/portfolio/${section}`;
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldPath: string, section: string, projectTitle?: string) => {
    if (!e.target.files?.[0] || !formData) return;
    const file = e.target.files[0];
    e.target.value = "";
    setUploading(true);
    try {
      const folderName = projectTitle ? generateSlug(projectTitle) : undefined;
      const fileUrl = await uploadFile(file, section, folderName);
      if (fileUrl) {
        const updatedFormData = JSON.parse(JSON.stringify(formData));
        const parts = fieldPath.split(".");
        let current = updatedFormData;
        for (let i = 0; i < parts.length - 1; i++) current = current[parts[i]];
        current[parts[parts.length - 1]] = fileUrl;
        dispatch(updateContent(updatedFormData));
        await saveFormData();
      }
    } catch (error) { console.error("Upload failed:", error); }
    finally { setUploading(false); }
  };

  const tabItems = [
    { value: "hero", icon: <FiImage />, label: "Hero" },
    { value: "quotes", icon: <FiEdit />, label: "Quotes" },
    { value: "residential", icon: <FiLayout />, label: "Residential" },
    { value: "commercial", icon: <FiLayout />, label: "Commercial" },
    { value: "stats", icon: <FiSettings />, label: "Stats" },
    { value: "cta", icon: <FiMessageSquare />, label: "CTA" },
  ];

  return (
    <form onSubmit={onSubmit}>
      <AdminToast message={toast?.message ?? null} tone={toast?.tone} />
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-lime-50 dark:from-slate-900 dark:to-slate-800">
        <motion.header className="flex flex-col bg-white dark:bg-slate-800 shadow-sm" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
          <div className="flex justify-between items-center p-4">
            <div>
              <h1 className="text-2xl font-bold text-lime-900 dark:text-lime-100">Portfolio Page Content Management</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage your portfolio page content and projects</p>
            </div>
            <Button type="submit" variant="default" disabled={isSaving || !isDirty} className={cn("flex items-center gap-2 transition-all", isDirty && "ring-2 ring-lime-500")}>
              {isSaving ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><FiSave className="w-4 h-4" /></motion.div>Saving...</> : <><FiSave className="w-4 h-4" />{isDirty ? "Publish Changes*" : "Publish Changes"}</>}
            </Button>
          </div>
          <div className="border-t border-b border-gray-100 dark:border-slate-700 px-4 py-2">
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
        </motion.header>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Tabs value={activeTab} className="w-full">
            <TabsContent value="hero" className="mt-4">
              <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 overflow-hidden">
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
                          {uploading ? "Uploading..." : "Upload Image"}
                        </Button>
                        <Input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleFileUpload(e, "hero.backgroundImageUrl", "hero")} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div><Label>Pre-Title</Label><Input value={formData.hero.preTitle} onChange={(e) => handleInputChange("hero.preTitle", e.target.value)} className="mt-1" /></div>
                    <div><Label>Title</Label><Input value={formData.hero.title} onChange={(e) => handleInputChange("hero.title", e.target.value)} className="mt-1" /></div>
                    <div><Label>Subtitle</Label><Textarea value={formData.hero.subtitle} onChange={(e) => handleInputChange("hero.subtitle", e.target.value)} rows={3} className="mt-1" /></div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="mt-4">
              <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700">
                <CardHeader className="bg-lime-50 dark:bg-slate-700">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lime-900 dark:text-lime-100">Statistics</CardTitle>
                    <Button onClick={() => addArrayItem("stats", { value: "", label: "" })} type="button" className="bg-lime-500 hover:bg-lime-600 text-white"><FiPlus className="w-4 h-4" /> Add Stat</Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {formData.stats.map((stat: Stat, index: number) => (
                      <Card key={index} className="p-4 bg-lime-50 dark:bg-slate-700">
                        <div className="flex justify-between items-center mb-3">
                          <Badge className="bg-lime-500 text-white">Stat {index + 1}</Badge>
                          <Button variant="ghost" size="sm" onClick={() => removeArrayItem("stats", index)} type="button" className="text-red-500"><FiX className="w-4 h-4" /></Button>
                        </div>
                        <div className="mb-4"><Label>Value</Label><Input value={stat.value} onChange={(e) => handleInputChange(`stats.${index}.value`, e.target.value)} className="mt-1" /></div>
                        <div><Label>Label</Label><Input value={stat.label} onChange={(e) => handleInputChange(`stats.${index}.label`, e.target.value)} className="mt-1" /></div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cta" className="mt-4">
              <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700">
                <CardHeader className="bg-lime-50 dark:bg-slate-700"><CardTitle className="text-lime-900 dark:text-lime-100">Call to Action</CardTitle></CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div><Label>Title</Label><Input value={formData.cta.title} onChange={(e) => handleInputChange("cta.title", e.target.value)} className="mt-1" /></div>
                  <div><Label>Description</Label><Textarea value={formData.cta.description} onChange={(e) => handleInputChange("cta.description", e.target.value)} rows={3} className="mt-1" /></div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </form>
  );
}