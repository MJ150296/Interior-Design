"use client";
import React, { useState, useCallback, useEffect } from "react";
import { FiImage, FiMessageSquare, FiPlus, FiSave, FiX, FiStar, FiPhone } from "react-icons/fi";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ContactContent } from "@/app/types/content/public";
import { iconOptions, getStaticIcon } from "@/app/utils/staticIcons";
import AdminToast from "@/app/dashboard/components/AdminToast";
import { useAdminToast } from "@/app/dashboard/hooks/useAdminToast";
import { useAppDispatch, useAppSelector } from "@/app/redux/store/hooks";
import { initializeContent, updateContent, markSaved, selectContactContent, selectContactIsDirty } from "@/app/redux/slices/contactPageSlice";

interface ContactPageClientProps {
  initialContent: ContactContent;
}

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function ContactPageClient({ initialContent }: ContactPageClientProps) {
  const dispatch = useAppDispatch();
  const reduxContent = useAppSelector(selectContactContent);
  const isDirty = useAppSelector(selectContactIsDirty);
  
  const [activeTab, setActiveTab] = useState("hero");
  const [isSaving, setIsSaving] = useState(false);
  const { toast, showToast } = useAdminToast();

  useEffect(() => {
    if (!reduxContent) dispatch(initializeContent(initialContent));
  }, [dispatch, initialContent, reduxContent]);

  const formData = reduxContent || initialContent;

  const saveFormData = useCallback(async () => {
    if (isSaving || !isDirty) return false;
    setIsSaving(true);
    try {
      const response = await fetch("/api/website-content/contactPage/updateContent", {
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
    } finally { setIsSaving(false); }
  }, [formData, showToast, isSaving, isDirty, dispatch]);

  const onSubmit = async (e: React.FormEvent) => { e.preventDefault(); await saveFormData(); };

  const handleInputChange = (path: string, value: string | number) => {
    if (!formData) return;
    const newData: ContactContent = JSON.parse(JSON.stringify(formData));
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
    const newData: ContactContent = JSON.parse(JSON.stringify(formData));
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
    const newData: ContactContent = JSON.parse(JSON.stringify(formData));
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
    array.splice(index, 1);
    dispatch(updateContent(newData));
  };

  const tabItems = [
    { value: "hero", icon: <FiImage />, label: "Hero" },
    { value: "whyChooseUs", icon: <FiStar />, label: "Why Choose Us" },
    { value: "contactInfo", icon: <FiPhone />, label: "Contact Info" },
  ];

  return (
    <form onSubmit={onSubmit}>
      <AdminToast message={toast?.message ?? null} tone={toast?.tone} />
      <div className="flex flex-col min-h-screen bg-linear-to-br from-slate-50 to-lime-50 dark:from-slate-900 dark:to-slate-800">
        <motion.header className="flex flex-col bg-white dark:bg-slate-800 shadow-sm" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
          <div className="flex justify-between items-center p-4">
            <div>
              <h1 className="text-2xl font-bold text-lime-900 dark:text-lime-100">Contact Page Content Management</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage your contact page content and information</p>
            </div>
            <Button type="submit" variant="default" disabled={isSaving} className={cn("flex items-center gap-2 transition-all", isDirty && "ring-2 ring-lime-500")}>
              {isSaving ? "Saving..." : <><FiSave className="w-4 h-4" />{isDirty ? "Publish Changes*" : "Publish Changes"}</>}
            </Button>
          </div>
          <div className="border-t border-b border-gray-100 dark:border-slate-700 px-4 py-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 bg-lime-50 dark:bg-slate-700 gap-1 p-1 w-full">
                {tabItems.map((item, index) => (
                  <TabsTrigger key={index} value={item.value} className="flex flex-col items-center h-auto py-2 px-1 text-xs data-[state=active]:bg-lime-500 data-[state=active]:text-white transition-all">
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
              <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700">
                <CardHeader className="bg-lime-50 dark:bg-slate-700"><CardTitle className="text-lime-900 dark:text-lime-100">Hero Section</CardTitle></CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div><Label>Title</Label><Input value={formData.hero?.title || ""} onChange={(e) => handleInputChange("hero.title", e.target.value)} className="mt-1" /></div>
                  <div><Label>Subtitle</Label><Textarea value={formData.hero?.subtitle || ""} onChange={(e) => handleInputChange("hero.subtitle", e.target.value)} rows={3} className="mt-1" /></div>
                  <div><Label>Button Text</Label><Input value={formData.hero?.buttonText || ""} onChange={(e) => handleInputChange("hero.buttonText", e.target.value)} className="mt-1" /></div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="whyChooseUs" className="mt-4">
              <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700">
                <CardHeader className="bg-lime-50 dark:bg-slate-700"><CardTitle className="text-lime-900 dark:text-lime-100">Why Choose Us Section</CardTitle></CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div><Label>Section Title</Label><Input value={formData.whyChooseUs?.title || ""} onChange={(e) => handleInputChange("whyChooseUs.title", e.target.value)} className="mt-1" /></div>
                  <div><Label>Section Description</Label><Textarea value={formData.whyChooseUs?.description || ""} onChange={(e) => handleInputChange("whyChooseUs.description", e.target.value)} rows={3} className="mt-1" /></div>
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <Label className="text-lg">Tabs Content</Label>
                      <Button onClick={() => addArrayItem("whyChooseUs.tabs", { title: "New Tab", icon: "star", contentTitle: "Content Title", description: "Tab description" })} type="button" className="bg-lime-500 hover:bg-lime-600 text-white"><FiPlus className="w-4 h-4" /> Add Tab</Button>
                    </div>
                    <div className="space-y-4">
                      {(formData.whyChooseUs?.tabs || []).map((tab: { title: string; icon: string; contentTitle: string; description: string }, index: number) => (
                        <Card key={index} className="p-4 bg-lime-50 dark:bg-slate-700">
                          <div className="flex justify-between items-center mb-3">
                            <Badge className="bg-lime-500 text-white">Tab {index + 1}</Badge>
                            <Button variant="ghost" size="sm" onClick={() => removeArrayItem("whyChooseUs.tabs", index)} type="button" className="text-red-500"><FiX className="w-4 h-4" /></Button>
                          </div>
                          <div className="space-y-4">
                            <div><Label>Tab Title</Label><Input value={tab.title} onChange={(e) => handleInputChange(`whyChooseUs.tabs.${index}.title`, e.target.value)} className="mt-1" /></div>
                            <div>
                              <Label>Tab Icon</Label>
                              <Select value={tab.icon} onValueChange={(value) => handleInputChange(`whyChooseUs.tabs.${index}.icon`, value)}>
                                <SelectTrigger className="w-full"><SelectValue placeholder="Select an icon" /></SelectTrigger>
                                <SelectContent>
                                  {iconOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      <div className="flex items-center gap-2">{getStaticIcon(option.value)}{option.label}</div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div><Label>Content Title</Label><Input value={tab.contentTitle} onChange={(e) => handleInputChange(`whyChooseUs.tabs.${index}.contentTitle`, e.target.value)} className="mt-1" /></div>
                            <div><Label>Content Description</Label><Textarea value={tab.description} onChange={(e) => handleInputChange(`whyChooseUs.tabs.${index}.description`, e.target.value)} rows={3} className="mt-1" /></div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <Label className="text-lg">Feature Cards</Label>
                      <Button onClick={() => addArrayItem("whyChooseUs.features", { icon: "star", title: "New Feature", description: "Feature description" })} type="button" className="bg-lime-500 hover:bg-lime-600 text-white"><FiPlus className="w-4 h-4" /> Add Feature</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(formData.whyChooseUs?.features || []).map((feature: { icon: string; title: string; description: string }, index: number) => (
                        <Card key={index} className="p-4 bg-lime-50 dark:bg-slate-700">
                          <div className="flex justify-between items-center mb-3">
                            <Badge className="bg-lime-500 text-white">Feature {index + 1}</Badge>
                            <Button variant="ghost" size="sm" onClick={() => removeArrayItem("whyChooseUs.features", index)} type="button" className="text-red-500"><FiX className="w-4 h-4" /></Button>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <Label>Icon</Label>
                              <Select value={feature.icon} onValueChange={(value) => handleInputChange(`whyChooseUs.features.${index}.icon`, value)}>
                                <SelectTrigger className="w-full"><SelectValue placeholder="Select an icon" /></SelectTrigger>
                                <SelectContent>
                                  {iconOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      <div className="flex items-center gap-2">{getStaticIcon(option.value)}{option.label}</div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div><Label>Feature Title</Label><Input value={feature.title} onChange={(e) => handleInputChange(`whyChooseUs.features.${index}.title`, e.target.value)} className="mt-1" /></div>
                            <div><Label>Feature Description</Label><Textarea value={feature.description} onChange={(e) => handleInputChange(`whyChooseUs.features.${index}.description`, e.target.value)} rows={3} className="mt-1" /></div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contactInfo" className="mt-4">
              <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700">
                <CardHeader className="bg-lime-50 dark:bg-slate-700">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lime-900 dark:text-lime-100">Contact Information</CardTitle>
                    <Button onClick={() => addArrayItem("contactInfo.items", { icon: "phone", title: "New Contact", details: "Contact details" })} type="button" className="bg-lime-500 hover:bg-lime-600 text-white"><FiPlus className="w-4 h-4" /> Add Contact Info</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(formData.contactInfo?.items || []).map((item: { icon: string; title: string; details: string }, index: number) => (
                      <Card key={index} className="p-4 bg-lime-50 dark:bg-slate-700">
                        <div className="flex justify-between items-center mb-3">
                          <Badge className="bg-lime-500 text-white">Item {index + 1}</Badge>
                          <Button variant="ghost" size="sm" onClick={() => removeArrayItem("contactInfo.items", index)} type="button" className="text-red-500"><FiX className="w-4 h-4" /></Button>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <Label>Icon</Label>
                            <Select value={item.icon} onValueChange={(value) => handleInputChange(`contactInfo.items.${index}.icon`, value)}>
                              <SelectTrigger className="w-full"><SelectValue placeholder="Select an icon" /></SelectTrigger>
                              <SelectContent>
                                {iconOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    <div className="flex items-center gap-2">{getStaticIcon(option.value)}{option.label}</div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div><Label>Title</Label><Input value={item.title} onChange={(e) => handleInputChange(`contactInfo.items.${index}.title`, e.target.value)} className="mt-1" /></div>
                          <div><Label>Details</Label><Input value={item.details} onChange={(e) => handleInputChange(`contactInfo.items.${index}.details`, e.target.value)} className="mt-1" /></div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </form>
  );
}