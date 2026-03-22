"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  FiLayout,
  FiImage,
  FiEdit,
  FiSettings,
  FiPlus,
  FiMinus,
  FiSave,
  FiEye,
  FiEyeOff,
  FiUpload,
  FiX,
  FiHome,
  FiMail,
} from "react-icons/fi";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import AdminToast from "@/app/dashboard/components/AdminToast";
import { useAdminToast } from "@/app/dashboard/hooks/useAdminToast";
import Image from "next/image";
import type { ServiceContent } from "@/app/types/content/services";

interface ServicesPageClientProps {
  initialContent: ServiceContent;
}

// Animation variants (same as about page)
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

export function ServicesPageClient({ initialContent }: ServicesPageClientProps) {
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<ServiceContent>(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());
  const { toast, showToast } = useAdminToast();

  // Helper to generate slug for folder names
  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  };

  // Generic input change handler using path (like about page)
  const handleInputChange = (path: string, value: string) => {
    setFormData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const parts = path.split(".");

      // Track changed field
      setChangedFields((prevFields) => new Set(prevFields.add(path)));

      let current: any = newData;
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (Array.isArray(current) && /^\d+$/.test(part)) {
          current = current[parseInt(part)];
        } else {
          current = current[part];
        }
      }
      const lastPart = parts[parts.length - 1];
      current[lastPart] = value;

      return newData;
    });
  };

  // Add item to an array (services, sections, paragraphs, etc.)
  const addArrayItem = <T,>(arrayPath: string, newItem: T) => {
    setFormData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const parts = arrayPath.split(".");

      setChangedFields((prevFields) => new Set(prevFields.add(arrayPath)));

      let current: any = newData;
      for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
      }
      const lastPart = parts[parts.length - 1];
      if (!Array.isArray(current[lastPart])) {
        current[lastPart] = [];
      }
      current[lastPart].push(newItem);
      return newData;
    });
  };

  // Remove item from an array
  const removeArrayItem = async (arrayPath: string, index: number) => {
    // If it's an image field, we might want to delete from Cloudinary
    // We'll implement similar image deletion logic later

    setFormData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const parts = arrayPath.split(".");

      setChangedFields((prevFields) => new Set(prevFields.add(arrayPath)));

      let current: any = newData;
      for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
      }
      const lastPart = parts[parts.length - 1];
      if (Array.isArray(current[lastPart])) {
        // Optional: delete associated image from Cloudinary if it's a service or section with image
        const item = current[lastPart][index];
        if (item && (item.backgroundImage || item.image?.src)) {
          const imageUrl = item.backgroundImage || item.image?.src;
          if (imageUrl && imageUrl.includes("res.cloudinary.com")) {
            // Extract folder path and delete (similar to about page)
            try {
              const url = new URL(imageUrl);
              const pathParts = url.pathname.split("/").filter(Boolean);
              const folderPath = pathParts.slice(1, -1).join("/"); // remove version and filename
              fetch("/api/cloudinary/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ folderPath }),
              }).catch((err) => console.error("Delete failed:", err));
            } catch (err) {
              console.error("Error parsing URL for deletion", err);
            }
          }
        }
        current[lastPart].splice(index, 1);
      }
      return newData;
    });
  };

  // Add a new service
  const addService = () => {
    addArrayItem("services", {
      slug: "",
      title: "",
      backgroundImage: "",
      button: { text: "", link: "" },
      sections: [
        {
          heading: "",
          paragraphs: [""],
          highlightedLink: { url: "", text: "" },
          image: { src: "", alt: "" },
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  // Add a new section to a service
  const addSection = (serviceIndex: number) => {
    const newSection = {
      heading: "",
      paragraphs: [""],
      highlightedLink: { url: "", text: "" },
      image: { src: "", alt: "" },
    };
    addArrayItem(`services.${serviceIndex}.sections`, newSection);
  };

  // Add a new paragraph to a section
  const addParagraph = (serviceIndex: number, sectionIndex: number) => {
    addArrayItem(`services.${serviceIndex}.sections.${sectionIndex}.paragraphs`, "");
  };

  // Remove a paragraph
  const removeParagraph = (serviceIndex: number, sectionIndex: number, paragraphIndex: number) => {
    removeArrayItem(`services.${serviceIndex}.sections.${sectionIndex}.paragraphs`, paragraphIndex);
  };

  // Save form data to backend
  const saveFormData = useCallback(
    async (dataToSave?: ServiceContent) => {
      // Prevent concurrent saves - guard against double-click
      if (isSaving) return false;
      
      setIsSaving(true);
      try {
        const response = await fetch("/api/services/updateContent", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSave?.services || formData.services),
        });

        if (response.ok) {
          setChangedFields(new Set());
          showToast("Services content published");
          return true;
        } else {
          const error = await response.text();
          showToast(`Failed to save: ${error}`, "error");
          return false;
        }
      } catch (error) {
        console.error("Save error:", error);
        showToast("Error saving content", "error");
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [formData, showToast, isSaving]
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveFormData();
  };

  // File upload handler (Cloudinary)
  const uploadFile = async (
    file: File,
    section: string,
    customFolder?: string
  ): Promise<string> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const folderPath = customFolder
        ? `riddhi_interiors/services/${section}/${customFolder}`
        : `riddhi_interiors/services/${section}`;
      formData.append("folderPath", folderPath);

      const response = await fetch("/api/cloudinary/upload", {
        method: "POST",
        body: formData,
      });

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

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldPath: string,
    section: string,
    customName?: string
  ) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    e.target.value = "";

    const folderName = customName ? generateSlug(customName) : undefined;
    const fileUrl = await uploadFile(file, section, folderName);

    if (fileUrl) {
      handleInputChange(fieldPath, fileUrl);
      // Optionally auto-save after upload? We'll let user publish manually.
    }
  };

  // Tab navigation items
  const tabItems = [
    { value: "hero", icon: <FiImage />, label: "Hero" },
    { value: "cta", icon: <FiMail />, label: "CTA" },
    { value: "services", icon: <FiSettings />, label: "Services" },
  ];

  return (
    <form onSubmit={onSubmit}>
      <AdminToast message={toast?.message ?? null} tone={toast?.tone} />
      <div className="flex flex-col min-h-screen bg-linear-to-br from-slate-50 to-lime-50 dark:from-slate-900 dark:to-slate-800">
        {/* Header */}
        <motion.header
          className="flex flex-col bg-white dark:bg-slate-800 shadow-sm"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center p-4">
            <div>
              <h1 className="text-2xl font-bold text-lime-900 dark:text-lime-100">
                Services Page Content Management
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage your website's services page content
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => setPreviewMode(!previewMode)}
                variant={previewMode ? "secondary" : "outline"}
                type="button"
                className="flex items-center gap-2"
              >
                {previewMode ? (
                  <>
                    <FiEyeOff className="w-4 h-4" /> Exit Preview
                  </>
                ) : (
                  <>
                    <FiEye className="w-4 h-4" /> Preview Mode
                  </>
                )}
              </Button>
              <Button
                type="submit"
                variant="default"
                disabled={isSaving}
                className={cn(
                  "flex items-center gap-2 transition-all",
                  changedFields.size > 0 && "ring-2 ring-lime-500"
                )}
              >
                {isSaving ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <FiSave className="w-4 h-4" />
                    </motion.div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="w-4 h-4" />
                    {changedFields.size > 0 ? "Publish Changes*" : "Publish Changes"}
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="border-t border-b border-gray-100 dark:border-slate-700 px-4 py-2">
            <div className="flex items-center justify-center py-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 md:grid-cols-3 bg-lime-50 dark:bg-slate-700 gap-1 p-1 w-full">
                  {tabItems.map((item) => (
                    <TabsTrigger
                      key={item.value}
                      value={item.value}
                      className="flex flex-col items-center h-auto py-2 px-1 text-xs data-[state=active]:bg-lime-500 data-[state=active]:text-white transition-all"
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {previewMode ? (
            <Card className="overflow-hidden">
              <CardHeader className="bg-lime-50 dark:bg-slate-700">
                <CardTitle className="flex items-center gap-2">
                  <FiEye className="w-5 h-5" /> Preview Mode
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border-2 border-dashed rounded-xl w-full h-150 flex items-center justify-center text-gray-500 bg-gray-50 dark:bg-slate-900">
                  <div className="text-center">
                    <FiLayout className="text-4xl mx-auto mb-3" />
                    <p>Services page preview will appear here</p>
                    <p className="text-sm mt-2 text-gray-400">
                      Note: Actual content will be rendered based on your current edits
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Tabs value={activeTab} className="w-full">
              {/* Hero Tab */}
              <TabsContent value="hero" className="mt-4">
                <motion.div variants={fadeIn} initial="hidden" animate="visible">
                  <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 overflow-hidden">
                    <CardHeader className="bg-lime-50 dark:bg-slate-700">
                      <CardTitle className="text-lime-900 dark:text-lime-100 p-3">
                        Hero Section
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
                        <div className="w-32 h-32 border-2 border-dashed border-lime-300 rounded-lg flex items-center justify-center overflow-hidden bg-lime-50 dark:bg-slate-700">
                          {formData.hero.backgroundImageUrl ? (
                            <Image
                              src={formData.hero.backgroundImageUrl}
                              alt="Hero background preview"
                              width={128}
                              height={128}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <FiImage className="text-lime-400 text-2xl" />
                          )}
                        </div>
                        <div className="flex-1">
                          <Label>Background Image</Label>
                          <div className="relative mt-2">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                variant="outline"
                                disabled={uploading}
                                type="button"
                                className="w-full md:w-auto flex items-center gap-2 border-lime-300 text-lime-700 hover:bg-lime-50"
                              >
                                {uploading ? (
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  >
                                    <FiUpload className="w-4 h-4" />
                                  </motion.div>
                                ) : (
                                  <FiUpload className="w-4 h-4" />
                                )}
                                {uploading ? "Uploading..." : "Upload Image"}
                              </Button>
                            </motion.div>
                            <Input
                              type="file"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, "hero.backgroundImageUrl", "hero")}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label>Title</Label>
                          <Input
                            value={formData.hero.title}
                            onChange={(e) => handleInputChange("hero.title", e.target.value)}
                            className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                          />
                        </div>
                        <div>
                          <Label>Subtitle</Label>
                          <Textarea
                            value={formData.hero.subtitle}
                            onChange={(e) => handleInputChange("hero.subtitle", e.target.value)}
                            rows={3}
                            className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* CTA Tab */}
              <TabsContent value="cta" className="mt-4">
                <motion.div variants={fadeIn} initial="hidden" animate="visible">
                  <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 overflow-hidden">
                    <CardHeader className="bg-lime-50 dark:bg-slate-700">
                      <CardTitle className="text-lime-900 dark:text-lime-100 p-3">
                        Call to Action
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Title</Label>
                          <Input
                            value={formData.cta.title}
                            onChange={(e) => handleInputChange("cta.title", e.target.value)}
                            className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Input
                            value={formData.cta.description}
                            onChange={(e) => handleInputChange("cta.description", e.target.value)}
                            className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Button Text</Label>
                          <Input
                            value={formData.cta.buttonText}
                            onChange={(e) => handleInputChange("cta.buttonText", e.target.value)}
                            className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                          />
                        </div>
                        <div>
                          <Label>Button Link</Label>
                          <Input
                            value={formData.cta.buttonLink}
                            onChange={(e) => handleInputChange("cta.buttonLink", e.target.value)}
                            className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="services" className="mt-4">
                <motion.div variants={fadeIn} initial="hidden" animate="visible">
                  <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 overflow-hidden">
                    <CardHeader className="bg-lime-50 dark:bg-slate-700">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lime-900 dark:text-lime-100 p-3">
                          Services
                        </CardTitle>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={addService}
                            type="button"
                            className="bg-lime-500 hover:bg-lime-600 text-white flex items-center gap-2"
                          >
                            <FiPlus className="w-4 h-4" /> Add Service
                          </Button>
                        </motion.div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      {formData.services.length === 0 ? (
                        <p className="text-gray-500">No services added yet. Click "Add Service" to get started.</p>
                      ) : (
                        <motion.div
                          className="space-y-6"
                          variants={staggerChildren}
                          initial="hidden"
                          animate="visible"
                        >
                          {formData.services.map((service, serviceIndex) => (
                            <motion.div key={serviceIndex} variants={scaleIn} whileHover={{ y: -5 }}>
                              <Card className="border-2 border-lime-200 dark:border-slate-700 overflow-hidden">
                                <CardHeader className="bg-lime-100 dark:bg-slate-600 flex flex-row items-center justify-between">
                                  <CardTitle className="text-lime-900 dark:text-lime-100">
                                    Service {serviceIndex + 1}
                                  </CardTitle>
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => removeArrayItem("services", serviceIndex)}
                                      disabled={formData.services.length === 1}
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <FiX className="w-4 h-4" />
                                    </Button>
                                  </motion.div>
                                </CardHeader>
                                <CardContent className="p-5 space-y-4">
                                  {/* Basic Info */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Label>Title</Label>
                                      <Input
                                        value={service.title}
                                        onChange={(e) => handleInputChange(`services.${serviceIndex}.title`, e.target.value)}
                                        className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                      />
                                    </div>
                                    <div>
                                      <Label>Slug</Label>
                                      <Input
                                        value={service.slug}
                                        onChange={(e) => handleInputChange(`services.${serviceIndex}.slug`, e.target.value)}
                                        className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                      />
                                    </div>
                                  </div>

                                  {/* Background Image with upload */}
                                  <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-4">
                                    <div className="w-24 h-24 border-2 border-dashed border-lime-300 rounded-lg flex items-center justify-center overflow-hidden bg-lime-50 dark:bg-slate-700">
                                      {service.backgroundImage ? (
                                        <Image
                                          src={service.backgroundImage}
                                          alt="Service background preview"
                                          width={96}
                                          height={96}
                                          className="object-cover w-full h-full"
                                        />
                                      ) : (
                                        <FiImage className="text-lime-400 text-2xl" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <Label>Background Image</Label>
                                      <div className="relative mt-2">
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                          <Button
                                            variant="outline"
                                            disabled={uploading}
                                            type="button"
                                            className="w-full md:w-auto flex items-center gap-2 border-lime-300 text-lime-700 hover:bg-lime-50"
                                          >
                                            {uploading ? (
                                              <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                              >
                                                <FiUpload className="w-4 h-4" />
                                              </motion.div>
                                            ) : (
                                              <FiUpload className="w-4 h-4" />
                                            )}
                                            {uploading ? "Uploading..." : "Upload Image"}
                                          </Button>
                                        </motion.div>
                                        <Input
                                          type="file"
                                          className="absolute inset-0 opacity-0 cursor-pointer"
                                          accept="image/*"
                                          onChange={(e) =>
                                            handleFileUpload(
                                              e,
                                              `services.${serviceIndex}.backgroundImage`,
                                              "service-background",
                                              service.title || `service-${serviceIndex}`
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {/* Button */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Label>Button Text</Label>
                                      <Input
                                        value={service.button.text}
                                        onChange={(e) =>
                                          handleInputChange(`services.${serviceIndex}.button.text`, e.target.value)
                                        }
                                        className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                      />
                                    </div>
                                    <div>
                                      <Label>Button Link</Label>
                                      <Input
                                        value={service.button.link}
                                        onChange={(e) =>
                                          handleInputChange(`services.${serviceIndex}.button.link`, e.target.value)
                                        }
                                        className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                      />
                                    </div>
                                  </div>

                                  {/* Sections */}
                                  <div>
                                    <div className="flex justify-between items-center mb-4">
                                      <Label className="text-lg">Sections</Label>
                                      <Button
                                        variant="outline"
                                        onClick={() => addSection(serviceIndex)}
                                        type="button"
                                        className="border-lime-300 text-lime-700 hover:bg-lime-50 flex items-center gap-1"
                                      >
                                        <FiPlus className="w-4 h-4" /> Add Section
                                      </Button>
                                    </div>
                                    {service.sections.map((section, sectionIndex) => (
                                      <Card key={sectionIndex} className="mb-4 border border-lime-200 dark:border-slate-700">
                                        <CardHeader className="bg-lime-50 dark:bg-slate-700 flex flex-row items-center justify-between py-2">
                                          <CardTitle className="text-sm">Section {sectionIndex + 1}</CardTitle>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeArrayItem(`services.${serviceIndex}.sections`, sectionIndex)}
                                            disabled={service.sections.length === 1}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                          >
                                            <FiMinus className="w-4 h-4" />
                                          </Button>
                                        </CardHeader>
                                        <CardContent className="p-4 space-y-3">
                                          <div>
                                            <Label>Heading</Label>
                                            <Input
                                              value={section.heading}
                                              onChange={(e) =>
                                                handleInputChange(
                                                  `services.${serviceIndex}.sections.${sectionIndex}.heading`,
                                                  e.target.value
                                                )
                                              }
                                              className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                            />
                                          </div>

                                          {/* Paragraphs */}
                                          <div>
                                            <Label>Paragraphs</Label>
                                            <div className="space-y-2 mt-1">
                                              {section.paragraphs.map((para, paraIndex) => (
                                                <div key={paraIndex} className="flex gap-2">
                                                  <Textarea
                                                    value={para}
                                                    onChange={(e) =>
                                                      handleInputChange(
                                                        `services.${serviceIndex}.sections.${sectionIndex}.paragraphs.${paraIndex}`,
                                                        e.target.value
                                                      )
                                                    }
                                                    rows={2}
                                                    className="flex-1 focus:ring-lime-500 focus:border-lime-500"
                                                  />
                                                  <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => removeParagraph(serviceIndex, sectionIndex, paraIndex)}
                                                    disabled={section.paragraphs.length === 1}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                  >
                                                    <FiX className="w-4 h-4" />
                                                  </Button>
                                                </div>
                                              ))}
                                              <Button
                                                variant="outline"
                                                onClick={() => addParagraph(serviceIndex, sectionIndex)}
                                                type="button"
                                                className="border-lime-300 text-lime-700 hover:bg-lime-50 flex items-center gap-1"
                                              >
                                                <FiPlus className="w-4 h-4" /> Add Paragraph
                                              </Button>
                                            </div>
                                          </div>

                                          {/* Highlighted Link */}
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                              <Label>Link Text</Label>
                                              <Input
                                                value={section.highlightedLink.text}
                                                onChange={(e) =>
                                                  handleInputChange(
                                                    `services.${serviceIndex}.sections.${sectionIndex}.highlightedLink.text`,
                                                    e.target.value
                                                  )
                                                }
                                                className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                              />
                                            </div>
                                            <div>
                                              <Label>Link URL</Label>
                                              <Input
                                                value={section.highlightedLink.url}
                                                onChange={(e) =>
                                                  handleInputChange(
                                                    `services.${serviceIndex}.sections.${sectionIndex}.highlightedLink.url`,
                                                    e.target.value
                                                  )
                                                }
                                                className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                              />
                                            </div>
                                          </div>

                                          {/* Image */}
                                          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                                            <div className="w-20 h-20 border-2 border-dashed border-lime-300 rounded-lg flex items-center justify-center overflow-hidden bg-lime-50 dark:bg-slate-700">
                                              {section.image.src ? (
                                                <Image
                                                  src={section.image.src}
                                                  alt={section.image.alt || "Section image preview"}
                                                  width={80}
                                                  height={80}
                                                  className="object-cover w-full h-full"
                                                />
                                              ) : (
                                                <FiImage className="text-lime-400 text-xl" />
                                              )}
                                            </div>
                                            <div className="flex-1">
                                              <Label>Section Image</Label>
                                              <div className="relative mt-2">
                                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                                  <Button
                                                    variant="outline"
                                                    disabled={uploading}
                                                    type="button"
                                                    className="w-full md:w-auto flex items-center gap-2 border-lime-300 text-lime-700 hover:bg-lime-50"
                                                  >
                                                    {uploading ? (
                                                      <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                      >
                                                        <FiUpload className="w-4 h-4" />
                                                      </motion.div>
                                                    ) : (
                                                      <FiUpload className="w-4 h-4" />
                                                    )}
                                                    {uploading ? "Uploading..." : "Upload Image"}
                                                  </Button>
                                                </motion.div>
                                                <Input
                                                  type="file"
                                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                                  accept="image/*"
                                                  onChange={(e) =>
                                                    handleFileUpload(
                                                      e,
                                                      `services.${serviceIndex}.sections.${sectionIndex}.image.src`,
                                                      "section-images",
                                                      `service-${serviceIndex}-section-${sectionIndex}`
                                                    )
                                                  }
                                                />
                                              </div>
                                            </div>
                                          </div>
                                          <div>
                                            <Label>Image Alt Text</Label>
                                            <Input
                                              value={section.image.alt}
                                              onChange={(e) =>
                                                handleInputChange(
                                                  `services.${serviceIndex}.sections.${sectionIndex}.image.alt`,
                                                  e.target.value
                                                )
                                              }
                                              className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                            />
                                          </div>
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
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