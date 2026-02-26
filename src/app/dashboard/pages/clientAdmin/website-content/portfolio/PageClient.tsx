"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  FiLayout,
  FiImage,
  FiEdit,
  FiMessageSquare,
  FiSettings,
  FiPlus,
  FiSave,
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
import DashboardLayoutClient from "@/app/dashboard/client_side_layout/ClientSideDashboardLayout";
import { useAppDispatch, useAppSelector } from "@/app/redux/store/hooks";
import {
  fetchPortfolioContent,
  selectPortfolioContent,
  selectPortfolioError,
  selectPortfolioLoading,
  updatePortfolioContent,
} from "@/app/redux/slices/portfolioPageSlice";
import type {
  PortfolioContent,
  Project,
  QuoteContent,
  Stat,
} from "@/app/types/content/portfolio";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import AdminToast from "@/app/dashboard/components/AdminToast";
import { useAdminToast } from "@/app/dashboard/hooks/useAdminToast";

// Animation variants
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

const defaultValues: PortfolioContent = {
  hero: {
    backgroundImageUrl: "/Riddhi Interior Design/Portfolio/cover.jpg",
    title: "Our Portfolio",
    subtitle: "Showcasing Excellence in Interior Design Across Uttarakhand",
    preTitle: "EXPLORE OUR WORK",
  },
  quotes: [
    {
      text: "Riddhi Interiors transformed our home into a masterpiece. Their attention to detail and creative solutions exceeded our expectations.",
      author: "Rajesh & Priya Sharma, Dehradun",
    },
    {
      text: "The commercial space design perfectly captured our brand identity while maximizing functionality. A truly professional team!",
      author: "Vikram Singh, Business Owner, Haridwar",
    },
  ],
  residentialProjects: [
    {
      id: 1,
      title: "Modern Hillside Villa",
      location: "Mussoorie",
      category: "Residential",
      imageUrl:
        "/Riddhi Interior Design/Portfolio/Residential/modern-hillside-villa/cover.jpg",
      hoverTitle: "Contemporary Luxury",
      hoverDescription:
        "A 5,000 sq.ft villa with panoramic mountain views featuring open-plan living spaces and premium finishes",
      exploreLink: "",
    },
    {
      id: 2,
      title: "Heritage Bungalow Restoration",
      location: "Dehradun",
      category: "Residential",
      imageUrl:
        "/Riddhi Interior Design/Portfolio/Residential/heritage-bungalow-restoration/cover.jpg",
      hoverTitle: "Classic Elegance",
      hoverDescription:
        "Restoration of a colonial-era bungalow preserving original architectural elements while adding modern comforts",
      exploreLink: "",
    },
  ],
  commercialProjects: [
    {
      id: 1,
      title: "Premium Restaurant Design",
      location: "Rishikesh",
      category: "Commercial",
      imageUrl:
        "/Riddhi Interior Design/Portfolio/Commercial/premium-restaurant-design/cover.jpg",
      hoverTitle: "Ambiance Creation",
      hoverDescription:
        "A 120-seat fine dining establishment with custom lighting and bespoke furniture",
      exploreLink: "",
    },
    {
      id: 2,
      title: "Corporate Office Space",
      location: "Dehradun",
      category: "Commercial",
      imageUrl:
        "/Riddhi Interior Design/Portfolio/Commercial/corporate-office-space/cover.jpg",
      hoverTitle: "Productive Environment",
      hoverDescription:
        "A 10,000 sq.ft office designed for productivity with ergonomic furniture and collaborative spaces",
      exploreLink: "",
    },
  ],
  stats: [
    { value: "250+", label: "Projects Completed" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "15+", label: "Cities Served" },
    { value: "12+", label: "Years Experience" },
  ],
  cta: {
    title: "Ready to Start Your Project?",
    description:
      "Let's discuss how we can transform your space into something extraordinary. Our team is ready to bring your vision to life with our expert design services.",
  },
};

const PortfolioAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("hero");
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<PortfolioContent>(defaultValues);
  const [isSaving, setIsSaving] = useState(false);
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());
  const { toast, showToast } = useAdminToast();

  const dispatch = useAppDispatch();
  const portfolioData = useAppSelector(selectPortfolioContent);
  const loading = useAppSelector(selectPortfolioLoading);
  const error = useAppSelector(selectPortfolioError);

  // Save form data to backend
  const saveFormData = useCallback(
    async (dataToSave?: PortfolioContent) => {
      setIsSaving(true);
      try {
        await dispatch(updatePortfolioContent(dataToSave || formData)).unwrap();
        setChangedFields(new Set()); // Reset changed fields after successful save
        showToast("Content published");
        return true;
      } catch (error) {
        console.error("Save failed:", error);
        alert("Failed to save changes. Please try again.");
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [formData, dispatch, showToast]
  );

  // Manual save for text changes
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await saveFormData();
    if (success) {
      // Show success animation/feedback
    }
  };

  // Update the uploadFile function to accept a custom folder name
  const uploadFile = async (
    file: File,
    section: string,
    customFolder?: string
  ): Promise<string> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Use custom folder if provided, otherwise use section
      const folderPath = customFolder
        ? `riddhi_interiors/portfolio/${section}/${customFolder}`
        : `riddhi_interiors/portfolio/${section}`;

      formData.append("folderPath", folderPath);

      // Validate file size (5MB max)
      const MAX_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        alert("File size exceeds 5MB limit");
        return "";
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        alert("Only JPG, PNG, or WebP images are allowed");
        return "";
      }

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
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      alert(`Upload failed: ${errorMessage}`);
      return "";
    } finally {
      setUploading(false);
    }
  };

  // Update the handleFileUpload for projects
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldPath: string,
    section: string,
    projectTitle?: string
  ) => {
    if (!e.target.files?.[0] || !formData) return;
    const file = e.target.files[0];
    e.target.value = ""; // Reset input

    setUploading(true);

    try {
      // Generate folder name from project title if provided
      const folderName = projectTitle ? generateSlug(projectTitle) : undefined;
      const fileUrl = await uploadFile(file, section, folderName);

      if (fileUrl) {
        // Update form data
        const updatedFormData = JSON.parse(JSON.stringify(formData));
        const parts = fieldPath.split(".");
        let current = updatedFormData;
        for (let i = 0; i < parts.length - 1; i++) {
          current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = fileUrl;

        setFormData(updatedFormData);
        const success = await saveFormData(updatedFormData);

        if (success) {
          console.log("Image uploaded and saved successfully");
        } else {
          console.error("Failed to save image URL to database");
        }
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchPortfolioContent());
  }, [dispatch]);

  // Update form when Redux data changes
  useEffect(() => {
    if (portfolioData) {
      console.log("Loaded portfolio data:", portfolioData);

      setFormData(portfolioData);
      setChangedFields(new Set()); // Reset changed fields when data is loaded
    }
  }, [portfolioData]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  // Add this helper function to generate project name slugs for cloudinary
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  };

  // Improved handleInputChange function
  const handleInputChange = (path: string, value: string) => {
    if (!formData) return;

    setFormData((prev) => {
      if (!prev) return prev;

      const newData: PortfolioContent = JSON.parse(JSON.stringify(prev));
      const parts = path.split(".");

      // Track changed field
      setChangedFields((prevFields) => new Set(prevFields.add(path)));

      // Traverse the object using reduce with proper type checking
      const lastPart = parts.pop()!;
      let current: unknown = newData;

      for (const part of parts) {
        if (Array.isArray(current) && /^\d+$/.test(part)) {
          current = current[parseInt(part)];
        } else if (typeof current === "object" && current !== null) {
          current = (current as Record<string, unknown>)[part];
        } else {
          console.error("Invalid path encountered");
          return newData;
        }
      }

      // Set the value with proper type checking
      if (typeof current === "object" && current !== null) {
        (current as Record<string, unknown>)[lastPart] = value;
      }

      return newData;
    });
  };

  // Add new item to array
  const addArrayItem = <T,>(arrayPath: string, newItem: T) => {
    if (!formData) return;

    setFormData((prev) => {
      if (!prev) return prev;

      const newData: PortfolioContent = JSON.parse(JSON.stringify(prev));
      const parts = arrayPath.split(".");

      // Track changed field
      setChangedFields((prevFields) => new Set(prevFields.add(arrayPath)));

      // Traverse to the parent object
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

      return newData;
    });
  };

  // Update the removeArrayItem function for projects
  const removeArrayItem = async (arrayPath: string, index: number) => {
    if (!formData) return;

    setFormData((prev) => {
      if (!prev) return prev;

      const newData: PortfolioContent = JSON.parse(JSON.stringify(prev));
      const parts = arrayPath.split(".");

      // Track changed field
      setChangedFields((prevFields) => new Set(prevFields.add(arrayPath)));

      // Traverse to the parent of the array with proper type checking
      let current: unknown = newData;

      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (Array.isArray(current) && /^\d+$/.test(part)) {
          current = current[parseInt(part)];
        } else if (typeof current === "object" && current !== null) {
          current = (current as Record<string, unknown>)[part];
        } else {
          console.error("Invalid path encountered");
          return newData;
        }
      }

      // Get the array with proper type checking
      const lastPart = parts[parts.length - 1];
      if (typeof current !== "object" || current === null) {
        console.error("Invalid path: expected an object");
        return newData;
      }

      const array = (current as Record<string, unknown>)[lastPart];
      if (!Array.isArray(array)) {
        console.error("Invalid path: expected an array");
        return newData;
      }

      const item = array[index];

      // Extract URL from the item
      let imageUrl = "";
      if (typeof item === "object" && item !== null) {
        if ("imageUrl" in item) imageUrl = item.imageUrl as string;
        else if ("backgroundImageUrl" in item)
          imageUrl = item.backgroundImageUrl as string;
      }

      // Delete from Cloudinary if valid URL - use project title for folder
      if (imageUrl && imageUrl.includes("res.cloudinary.com")) {
        let folderPath = "";

        // Handle project deletion
        if (
          arrayPath.includes("Projects") &&
          typeof item === "object" &&
          item !== null &&
          "title" in item
        ) {
          const section = arrayPath.includes("residential")
            ? "residential"
            : "commercial";
          const slug = generateSlug(item.title as string);
          folderPath = `riddhi_interiors/portfolio/${section}/${slug}`;
        } else {
          // For hero section, delete the specific file
          const url = new URL(imageUrl);
          const parts = url.pathname.split("/").filter(Boolean);
          folderPath = parts.slice(1, -1).join("/");
        }

        fetch("/api/cloudinary/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folderPath }),
        }).catch((err) => console.error("Delete failed:", err));
      }

      // Remove from array
      array.splice(index, 1);

      return newData;
    });
  };

  // Tab navigation items
  const tabItems = [
    { value: "hero", icon: <FiImage />, label: "Hero" },
    { value: "quotes", icon: <FiEdit />, label: "Quotes" },
    { value: "residential", icon: <FiLayout />, label: "Residential" },
    { value: "commercial", icon: <FiLayout />, label: "Commercial" },
    { value: "stats", icon: <FiSettings />, label: "Stats" },
    { value: "cta", icon: <FiMessageSquare />, label: "CTA" },
  ];

  if (!formData) {
    return (
      <DashboardLayoutClient>
        <div className="flex justify-center items-center h-screen">
          <p>Loading portfolio content...</p>
        </div>
      </DashboardLayoutClient>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <AdminToast message={toast?.message ?? null} tone={toast?.tone} />
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-lime-50 dark:from-slate-900 dark:to-slate-800">
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
                Portfolio Page Content Management
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage your portfolio page content and projects
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                type="submit"
                variant="default"
                disabled={loading || isSaving}
                className={cn(
                  "flex items-center gap-2 transition-all",
                  changedFields.size > 0 && "ring-2 ring-lime-500"
                )}
              >
                {isSaving ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <FiSave className="w-4 h-4" />
                    </motion.div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="w-4 h-4" />
                    {changedFields.size > 0
                      ? "Publish Changes*"
                      : "Publish Changes"}
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="border-t border-b border-gray-100 dark:border-slate-700 px-4 py-2">
            <div className="flex items-center justify-center py-2">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 md:grid-cols-6 bg-lime-50 dark:bg-slate-700 gap-1 p-1 w-full">
                  {tabItems.map((item, index) => (
                    <TabsTrigger
                      key={index}
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
          {error && (
            <motion.div
              className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <FiX className="mr-2" /> {error}
            </motion.div>
          )}

          <Tabs value={activeTab} className="w-full">
            {/* Hero Tab */}
            <TabsContent value="hero" className="mt-4">
              <motion.div variants={fadeIn} initial="hidden" animate="visible">
                <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 overflow-hidden">
                  <CardHeader className="bg-lime-50 dark:bg-slate-700">
                    <CardTitle className="text-lime-900 dark:text-lime-100">
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
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              variant="outline"
                              disabled={uploading}
                              type="button"
                              className="w-full md:w-auto flex items-center gap-2 border-lime-300 text-lime-700 hover:bg-lime-50"
                            >
                              {uploading ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear",
                                  }}
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
                                "hero.backgroundImageUrl",
                                "hero"
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Pre-Title</Label>
                        <Input
                          value={formData.hero.preTitle}
                          onChange={(e) =>
                            handleInputChange("hero.preTitle", e.target.value)
                          }
                          className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                        />
                      </div>

                      <div>
                        <Label>Title</Label>
                        <Input
                          value={formData.hero.title}
                          onChange={(e) =>
                            handleInputChange("hero.title", e.target.value)
                          }
                          className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                        />
                      </div>

                      <div>
                        <Label>Subtitle</Label>
                        <Textarea
                          value={formData.hero.subtitle}
                          onChange={(e) =>
                            handleInputChange("hero.subtitle", e.target.value)
                          }
                          rows={3}
                          className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Quotes Tab */}
            <TabsContent value="quotes" className="mt-4">
              <motion.div variants={fadeIn} initial="hidden" animate="visible">
                <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 overflow-hidden">
                  <CardHeader className="bg-lime-50 dark:bg-slate-700">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lime-900 dark:text-lime-100">
                        Quotes Section
                      </CardTitle>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={() =>
                            addArrayItem("quotes", {
                              text: "",
                              author: "",
                            })
                          }
                          type="button"
                          className="bg-lime-500 hover:bg-lime-600 text-white flex items-center gap-2"
                        >
                          <FiPlus className="w-4 h-4" /> Add Quote
                        </Button>
                      </motion.div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      className="space-y-4"
                      variants={staggerChildren}
                      initial="hidden"
                      animate="visible"
                    >
                      {formData.quotes.map(
                        (quote: QuoteContent, index: number) => (
                          <motion.div
                            key={index}
                            variants={scaleIn}
                            whileHover={{ y: -3 }}
                          >
                            <Card className="p-4 bg-lime-50 dark:bg-slate-700 border-lime-200 dark:border-slate-600">
                              <div className="flex justify-between items-center mb-3">
                                <Badge className="bg-lime-500 text-white">
                                  Quote {index + 1}
                                </Badge>
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      removeArrayItem("quotes", index)
                                    }
                                    type="button"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <FiX className="w-4 h-4" />
                                  </Button>
                                </motion.div>
                              </div>
                              <div className="mb-4">
                                <Label>Quote Text</Label>
                                <Textarea
                                  value={quote.text}
                                  onChange={(e) =>
                                    handleInputChange(
                                      `quotes.${index}.text`,
                                      e.target.value
                                    )
                                  }
                                  rows={3}
                                  className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                />
                              </div>
                              <div>
                                <Label>Author</Label>
                                <Input
                                  value={quote.author}
                                  onChange={(e) =>
                                    handleInputChange(
                                      `quotes.${index}.author`,
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                />
                              </div>
                            </Card>
                          </motion.div>
                        )
                      )}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Residential Projects Tab */}
            <TabsContent value="residential" className="mt-4">
              <motion.div variants={fadeIn} initial="hidden" animate="visible">
                <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 overflow-hidden">
                  <CardHeader className="bg-lime-50 dark:bg-slate-700">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lime-900 dark:text-lime-100">
                        Residential Projects
                      </CardTitle>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={() =>
                            addArrayItem("residentialProjects", {
                              id: Date.now(),
                              title: "New Project",
                              location: "",
                              category: "",
                              imageUrl: "",
                              hoverTitle: "",
                              hoverDescription: "",
                              exploreLink: "",
                            })
                          }
                          type="button"
                          disabled={loading}
                          className="bg-lime-500 hover:bg-lime-600 text-white flex items-center gap-2"
                        >
                          <FiPlus className="w-4 h-4" /> Add Project
                        </Button>
                      </motion.div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      className="space-y-6"
                      variants={staggerChildren}
                      initial="hidden"
                      animate="visible"
                    >
                      {formData.residentialProjects.map(
                        (project: Project, index: number) => (
                          <motion.div
                            key={index}
                            variants={scaleIn}
                            whileHover={{ y: -5 }}
                          >
                            <Card className="p-5 bg-lime-50 dark:bg-slate-700 border-lime-200 dark:border-slate-600 overflow-hidden">
                              <div className="flex flex-row items-center justify-between p-4 -mx-5 -mt-5 mb-5 bg-lime-100 dark:bg-slate-600">
                                <div className="flex items-center">
                                  <Badge
                                    variant="secondary"
                                    className="bg-lime-500 text-white"
                                  >
                                    Project {index + 1}
                                  </Badge>
                                </div>
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      removeArrayItem(
                                        "residentialProjects",
                                        index
                                      )
                                    }
                                    type="button"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <FiX className="w-4 h-4" />
                                  </Button>
                                </motion.div>
                              </div>
                              <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
                                  <div className="w-24 h-24 border-2 border-dashed border-lime-300 rounded-lg flex items-center justify-center overflow-hidden bg-white dark:bg-slate-800">
                                    {project.imageUrl ? (
                                      <Image
                                        src={project.imageUrl}
                                        alt="Project preview"
                                        width={96}
                                        height={96}
                                        className="object-cover w-full h-full"
                                      />
                                    ) : (
                                      <FiImage className="text-lime-400 text-2xl" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <Label>Project Image</Label>
                                    <div className="relative mt-2">
                                      <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                      >
                                        <Button
                                          variant="outline"
                                          disabled={uploading}
                                          type="button"
                                          className="w-full md:w-auto flex items-center gap-2 border-lime-300 text-lime-700 hover:bg-lime-50"
                                        >
                                          {uploading ? (
                                            <motion.div
                                              animate={{ rotate: 360 }}
                                              transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                                ease: "linear",
                                              }}
                                            >
                                              <FiUpload className="w-4 h-4" />
                                            </motion.div>
                                          ) : (
                                            <FiUpload className="w-4 h-4" />
                                          )}
                                          {uploading
                                            ? "Uploading..."
                                            : "Upload Image"}
                                        </Button>
                                      </motion.div>
                                      <Input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept="image/*"
                                        onChange={(e) =>
                                          handleFileUpload(
                                            e,
                                            `residentialProjects.${index}.imageUrl`,
                                            "residential",
                                            project.title
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label>Project Title</Label>
                                    <Input
                                      value={project.title}
                                      onChange={(e) =>
                                        handleInputChange(
                                          `residentialProjects.${index}.title`,
                                          e.target.value
                                        )
                                      }
                                      className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                    />
                                  </div>
                                  <div>
                                    <Label>Location</Label>
                                    <Input
                                      value={project.location}
                                      onChange={(e) =>
                                        handleInputChange(
                                          `residentialProjects.${index}.location`,
                                          e.target.value
                                        )
                                      }
                                      className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                    />
                                  </div>
                                  <div>
                                    <Label>Category</Label>
                                    <Input
                                      value={project.category}
                                      onChange={(e) =>
                                        handleInputChange(
                                          `residentialProjects.${index}.category`,
                                          e.target.value
                                        )
                                      }
                                      className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                    />
                                  </div>
                                </div>

                                <div className="mt-4">
                                  <Label>Hover Title</Label>
                                  <Input
                                    value={project.hoverTitle}
                                    onChange={(e) =>
                                      handleInputChange(
                                        `residentialProjects.${index}.hoverTitle`,
                                        e.target.value
                                      )
                                    }
                                    className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                  />
                                </div>

                                <div className="mt-4">
                                  <Label>Hover Description</Label>
                                  <Textarea
                                    value={project.hoverDescription}
                                    onChange={(e) =>
                                      handleInputChange(
                                        `residentialProjects.${index}.hoverDescription`,
                                        e.target.value
                                      )
                                    }
                                    rows={3}
                                    className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                  />
                                </div>

                                <div className="mt-4">
                                  <Label>Explore Project Link</Label>
                                  <Input
                                    value={project.exploreLink}
                                    onChange={(e) =>
                                      handleInputChange(
                                        `residentialProjects.${index}.exploreLink`,
                                        e.target.value
                                      )
                                    }
                                    placeholder="https://example.com/project-details"
                                    className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )
                      )}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Commercial Projects Tab */}
            <TabsContent value="commercial" className="mt-4">
              <motion.div variants={fadeIn} initial="hidden" animate="visible">
                <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 overflow-hidden">
                  <CardHeader className="bg-lime-50 dark:bg-slate-700">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lime-900 dark:text-lime-100">
                        Commercial Projects
                      </CardTitle>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={() =>
                            addArrayItem("commercialProjects", {
                              id: Date.now(),
                              title: "New Project",
                              location: "",
                              category: "",
                              imageUrl: "",
                              hoverTitle: "",
                              hoverDescription: "",
                              exploreLink: "",
                            })
                          }
                          type="button"
                          disabled={loading}
                          className="bg-lime-500 hover:bg-lime-600 text-white flex items-center gap-2"
                        >
                          <FiPlus className="w-4 h-4" /> Add Project
                        </Button>
                      </motion.div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      className="space-y-6"
                      variants={staggerChildren}
                      initial="hidden"
                      animate="visible"
                    >
                      {formData.commercialProjects.map(
                        (project: Project, index: number) => (
                          <motion.div
                            key={index}
                            variants={scaleIn}
                            whileHover={{ y: -5 }}
                          >
                            <Card className="p-5 bg-lime-50 dark:bg-slate-700 border-lime-200 dark:border-slate-600 overflow-hidden">
                              <div className="flex flex-row items-center justify-between p-4 -mx-5 -mt-5 mb-5 bg-lime-100 dark:bg-slate-600">
                                <div className="flex items-center">
                                  <Badge
                                    variant="secondary"
                                    className="bg-lime-500 text-white"
                                  >
                                    Project {index + 1}
                                  </Badge>
                                </div>
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      removeArrayItem(
                                        "commercialProjects",
                                        index
                                      )
                                    }
                                    type="button"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <FiX className="w-4 h-4" />
                                  </Button>
                                </motion.div>
                              </div>
                              <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
                                  <div className="w-24 h-24 border-2 border-dashed border-lime-300 rounded-lg flex items-center justify-center overflow-hidden bg-white dark:bg-slate-800">
                                    {project.imageUrl ? (
                                      <Image
                                        src={project.imageUrl}
                                        alt="Project preview"
                                        width={96}
                                        height={96}
                                        className="object-cover w-full h-full"
                                      />
                                    ) : (
                                      <FiImage className="text-lime-400 text-2xl" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <Label>Project Image</Label>
                                    <div className="relative mt-2">
                                      <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                      >
                                        <Button
                                          variant="outline"
                                          disabled={uploading}
                                          type="button"
                                          className="w-full md:w-auto flex items-center gap-2 border-lime-300 text-lime-700 hover:bg-lime-50"
                                        >
                                          {uploading ? (
                                            <motion.div
                                              animate={{ rotate: 360 }}
                                              transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                                ease: "linear",
                                              }}
                                            >
                                              <FiUpload className="w-4 h-4" />
                                            </motion.div>
                                          ) : (
                                            <FiUpload className="w-4 h-4" />
                                          )}
                                          {uploading
                                            ? "Uploading..."
                                            : "Upload Image"}
                                        </Button>
                                      </motion.div>
                                      <Input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept="image/*"
                                        onChange={(e) =>
                                          handleFileUpload(
                                            e,
                                            `commercialProjects.${index}.imageUrl`,
                                            "commercial",
                                            project.title
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label>Project Title</Label>
                                    <Input
                                      value={project.title}
                                      onChange={(e) =>
                                        handleInputChange(
                                          `commercialProjects.${index}.title`,
                                          e.target.value
                                        )
                                      }
                                      className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                    />
                                  </div>
                                  <div>
                                    <Label>Location</Label>
                                    <Input
                                      value={project.location}
                                      onChange={(e) =>
                                        handleInputChange(
                                          `commercialProjects.${index}.location`,
                                          e.target.value
                                        )
                                      }
                                      className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                    />
                                  </div>
                                  <div>
                                    <Label>Category</Label>
                                    <Input
                                      value={project.category}
                                      onChange={(e) =>
                                        handleInputChange(
                                          `commercialProjects.${index}.category`,
                                          e.target.value
                                        )
                                      }
                                      className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                    />
                                  </div>
                                </div>

                                <div className="mt-4">
                                  <Label>Hover Title</Label>
                                  <Input
                                    value={project.hoverTitle}
                                    onChange={(e) =>
                                      handleInputChange(
                                        `commercialProjects.${index}.hoverTitle`,
                                        e.target.value
                                      )
                                    }
                                    className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                  />
                                </div>

                                <div className="mt-4">
                                  <Label>Hover Description</Label>
                                  <Textarea
                                    value={project.hoverDescription}
                                    onChange={(e) =>
                                      handleInputChange(
                                        `commercialProjects.${index}.hoverDescription`,
                                        e.target.value
                                      )
                                    }
                                    rows={3}
                                    className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                  />
                                </div>

                                <div className="mt-4">
                                  <Label>Explore Project Link</Label>
                                  <Input
                                    value={project.exploreLink}
                                    onChange={(e) =>
                                      handleInputChange(
                                        `commercialProjects.${index}.exploreLink`,
                                        e.target.value
                                      )
                                    }
                                    placeholder="https://example.com/project-details"
                                    className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )
                      )}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Stats Tab */}
            <TabsContent value="stats" className="mt-4">
              <motion.div variants={fadeIn} initial="hidden" animate="visible">
                <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 overflow-hidden">
                  <CardHeader className="bg-lime-50 dark:bg-slate-700">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lime-900 dark:text-lime-100">
                        Statistics Section
                      </CardTitle>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={() =>
                            addArrayItem("stats", {
                              value: "",
                              label: "",
                            })
                          }
                          type="button"
                          className="bg-lime-500 hover:bg-lime-600 text-white flex items-center gap-2"
                        >
                          <FiPlus className="w-4 h-4" /> Add Statistic
                        </Button>
                      </motion.div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      className="space-y-4"
                      variants={staggerChildren}
                      initial="hidden"
                      animate="visible"
                    >
                      {formData.stats.map((stat: Stat, index: number) => (
                        <motion.div
                          key={index}
                          variants={scaleIn}
                          whileHover={{ y: -3 }}
                        >
                          <Card className="p-4 bg-lime-50 dark:bg-slate-700 border-lime-200 dark:border-slate-600">
                            <div className="flex justify-between items-center mb-3">
                              <Badge className="bg-lime-500 text-white">
                                Stat {index + 1}
                              </Badge>
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    removeArrayItem("stats", index)
                                  }
                                  type="button"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <FiX className="w-4 h-4" />
                                </Button>
                              </motion.div>
                            </div>
                            <div className="mb-4">
                              <Label>Value</Label>
                              <Input
                                value={stat.value}
                                onChange={(e) =>
                                  handleInputChange(
                                    `stats.${index}.value`,
                                    e.target.value
                                  )
                                }
                                className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                              />
                            </div>
                            <div>
                              <Label>Label</Label>
                              <Input
                                value={stat.label}
                                onChange={(e) =>
                                  handleInputChange(
                                    `stats.${index}.label`,
                                    e.target.value
                                  )
                                }
                                className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                              />
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* CTA Tab */}
            <TabsContent value="cta" className="mt-4">
              <motion.div variants={fadeIn} initial="hidden" animate="visible">
                <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 overflow-hidden">
                  <CardHeader className="bg-lime-50 dark:bg-slate-700">
                    <CardTitle className="text-lime-900 dark:text-lime-100">
                      Call to Action Section
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={formData.cta.title}
                          onChange={(e) =>
                            handleInputChange("cta.title", e.target.value)
                          }
                          className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={formData.cta.description}
                          onChange={(e) =>
                            handleInputChange("cta.description", e.target.value)
                          }
                          rows={3}
                          className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </form>
  );
};

export default PortfolioAdminDashboard;
