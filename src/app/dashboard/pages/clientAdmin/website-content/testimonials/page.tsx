"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  FiImage,
  FiEdit,
  FiUsers,
  FiMessageSquare,
  FiSettings,
  FiPlus,
  FiSave,
  FiUpload,
  FiX,
  FiStar,
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

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Import TypeScript interfaces
import {
  Testimonial,
  Stat,
  HeroContent,
  Category,
  CtaContent,
  TestimonialContent,
  selectTestimonialContent,
  selectTestimonialLoading,
  selectTestimonialError,
  updateTestimonialContent,
} from "../../../../../redux/slices/testimonialPageSlice";
import { fetchTestimonialContent } from "../../../../../redux/slices/testimonialPageSlice";

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

const defaultValues: TestimonialContent = {
  hero: {
    backgroundImageUrl: "/Riddhi Interior Design/Projects/cover.jpg",
    preTitle: "CLIENT EXPERIENCES",
    title: "Designed with Trust",
    subtitle:
      "Stories of Spaces Transformed, Lives Touched, and Dreams Designed.",
  },
  categories: [{ name: "All" }],
  testimonials: [
    {
      id: 1,
      imageUrl: "/Riddhi Interior Design/masonry-4.jpg",
      category: "Residential",
      quote:
        "Riddhi Interior Design turned our empty flat into a warm and stylish home. Their attention to detail is unmatched!",
      author: "Anita Sharma",
      role: "Homeowner, Noida",
      rating: 5,
    },
    {
      id: 2,
      imageUrl: "/Riddhi Interior Design/why-choose-us.jpg",
      category: "Commercial",
      quote:
        "Our office space reflects professionalism and creativity now — exactly what we wanted. Highly recommend their team.",
      author: "Rajeev Mehta",
      role: "Founder, Mehta & Co.",
      rating: 5,
    },
  ],
  stats: [
    { value: "250+", label: "Projects Completed" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "15+", label: "Years Experience" },
    { value: "50+", label: "Awards Received" },
  ],
  cta: {
    title: "Ready to Transform Your Space?",
    description:
      "Join hundreds of satisfied clients who have experienced the Riddhi Interiors difference. Schedule your consultation today.",
  },
};

const TestimonialAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("hero");
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<TestimonialContent>(() => ({
    ...defaultValues,
    categories: defaultValues.categories || [{ name: "All" }],
  }));
  const [isSaving, setIsSaving] = useState(false);
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());

  const dispatch = useAppDispatch();
  const testimonialData = useAppSelector(selectTestimonialContent);
  const loading = useAppSelector(selectTestimonialLoading);
  const error = useAppSelector(selectTestimonialError);

  // Save form data to backend
  const saveFormData = useCallback(
    async (dataToSave?: TestimonialContent) => {
      setIsSaving(true);
      try {
        await dispatch(
          updateTestimonialContent(dataToSave || formData)
        ).unwrap();
        setChangedFields(new Set()); // Reset changed fields after successful save
        return true;
      } catch (error) {
        console.error("Save failed:", error);
        alert("Failed to save changes. Please try again.");
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [formData, dispatch]
  );

  // Manual save for text changes
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await saveFormData();
    if (success) {
      // Show success animation/feedback
    }
  };

  // Upload file function
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
        ? `riddhi_interiors/testimonials/${section}/${customFolder}`
        : `riddhi_interiors/testimonials/${section}`;

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

  // Handle file upload
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldPath: string,
    section: string,
    authorName?: string
  ) => {
    if (!e.target.files?.[0] || !formData) return;
    const file = e.target.files[0];
    e.target.value = ""; // Reset input

    setUploading(true);

    try {
      // Generate folder name from author name if provided
      const folderName = authorName ? generateSlug(authorName) : undefined;
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
    dispatch(fetchTestimonialContent());
  }, [dispatch]);

  // Update form when Redux data changes
  useEffect(() => {
    if (testimonialData) {
      console.log("Loaded testimonial data:", testimonialData);

      const mappedData: TestimonialContent = {
        hero: testimonialData.hero || defaultValues.hero,
        categories: testimonialData.categories || defaultValues.categories,
        testimonials:
          testimonialData.testimonials || defaultValues.testimonials,
        stats: testimonialData.stats || defaultValues.stats,
        cta: testimonialData.cta || defaultValues.cta,
      };

      setFormData(mappedData);
      setChangedFields(new Set());
    }
  }, [testimonialData]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  // Helper function to generate slugs for cloudinary
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  };

  // Handle input changes
  const handleInputChange = (path: string, value: string | number) => {
    if (!formData) return;

    setFormData((prev) => {
      if (!prev) return prev;

      const newData: TestimonialContent = JSON.parse(JSON.stringify(prev));
      const parts = path.split(".");

      // Track changed field
      setChangedFields((prevFields) => new Set(prevFields.add(path)));

      // Traverse the object
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

      // Set the value safely
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

      const newData: TestimonialContent = JSON.parse(JSON.stringify(prev));
      const parts = arrayPath.split(".");

      // Track changed field
      setChangedFields((prevFields) => new Set(prevFields.add(arrayPath)));

      // Traverse dynamically
      let current: unknown = newData;
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (
          typeof current === "object" &&
          current !== null &&
          part in (current as Record<string, unknown>)
        ) {
          current = (current as Record<string, unknown>)[part];
        }
      }

      const lastPart = parts[parts.length - 1];
      if (
        typeof current === "object" &&
        current !== null &&
        Array.isArray((current as Record<string, unknown>)[lastPart])
      ) {
        (current as Record<string, unknown>)[lastPart] = [
          ...((current as Record<string, unknown>)[lastPart] as T[]),
          newItem,
        ];
      }

      return newData;
    });
  };

  // Remove item from array
  const removeArrayItem = async (arrayPath: string, index: number) => {
    if (!formData) return;

    setFormData((prev) => {
      if (!prev) return prev;

      const newData: TestimonialContent = JSON.parse(JSON.stringify(prev));
      const parts = arrayPath.split(".");

      // Track changed field
      setChangedFields((prevFields) => new Set(prevFields.add(arrayPath)));

      // Traverse to the parent
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

      // Validate array
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

      // Extract image URL
      let imageUrl = "";
      if (typeof item === "object" && item !== null) {
        if ("imageUrl" in item) imageUrl = item.imageUrl as string;
        else if ("backgroundImageUrl" in item) {
          imageUrl = item.backgroundImageUrl as string;
        }
      }

      // Delete from Cloudinary
      if (imageUrl && imageUrl.includes("res.cloudinary.com")) {
        let folderPath = "";

        if (
          arrayPath.includes("testimonials") &&
          typeof item === "object" &&
          item !== null &&
          "author" in item
        ) {
          const slug = generateSlug(item.author as string);
          folderPath = `riddhi_interiors/testimonials/${slug}`;
        } else {
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

      // Remove item
      array.splice(index, 1);

      return newData;
    });
  };

  // Tab navigation items
  const tabItems = [
    { value: "hero", icon: <FiImage />, label: "Hero" },
    { value: "categories", icon: <FiSettings />, label: "Categories" },
    { value: "testimonials", icon: <FiUsers />, label: "Testimonials" },
    { value: "stats", icon: <FiSettings />, label: "Stats" },
    { value: "cta", icon: <FiMessageSquare />, label: "CTA" },
  ];

  if (!formData) {
    return (
      <DashboardLayoutClient>
        <div className="flex justify-center items-center h-screen">
          <p>Loading testimonial content...</p>
        </div>
      </DashboardLayoutClient>
    );
  }

  return (
    <form onSubmit={onSubmit}>
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
                Testimonials Page Content Management
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage your testimonials page content and client feedback
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
                <TabsList className="grid grid-cols-5 bg-lime-50 dark:bg-slate-700 gap-1 p-1 w-full">
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
                          value={formData.hero.preTitle || ""}
                          onChange={(e) =>
                            handleInputChange("hero.preTitle", e.target.value)
                          }
                          className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                        />
                      </div>

                      <div>
                        <Label>Title</Label>
                        <Input
                          value={formData.hero.title || ""}
                          onChange={(e) =>
                            handleInputChange("hero.title", e.target.value)
                          }
                          className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                        />
                      </div>

                      <div>
                        <Label>Subtitle</Label>
                        <Textarea
                          value={formData.hero.subtitle || ""}
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

            {/* Categories Tab */}
            <TabsContent value="categories" className="mt-4">
              <motion.div variants={fadeIn} initial="hidden" animate="visible">
                <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 overflow-hidden">
                  <CardHeader className="bg-lime-50 dark:bg-slate-700">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lime-900 dark:text-lime-100">
                        Testimonial Categories
                      </CardTitle>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={() =>
                            addArrayItem("categories", {
                              name: "New Category",
                            })
                          }
                          type="button"
                          className="bg-lime-500 hover:bg-lime-600 text-white flex items-center gap-2"
                        >
                          <FiPlus className="w-4 h-4" /> Add Category
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
                      {formData.categories?.map(
                        (category: Category, index: number) => (
                          <motion.div
                            key={index}
                            variants={scaleIn}
                            whileHover={{ y: -3 }}
                          >
                            <Card className="p-4 bg-lime-50 dark:bg-slate-700 border-lime-200 dark:border-slate-600">
                              <div className="flex justify-between items-center mb-3">
                                <Badge className="bg-lime-500 text-white">
                                  Category {index + 1}
                                </Badge>
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      removeArrayItem("categories", index)
                                    }
                                    type="button"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <FiX className="w-4 h-4" />
                                  </Button>
                                </motion.div>
                              </div>
                              <div>
                                <Label>Category Name</Label>
                                <Input
                                  value={category?.name || ""}
                                  onChange={(e) =>
                                    handleInputChange(
                                      `categories.${index}.name`,
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

            {/* Testimonials Tab */}
            <TabsContent value="testimonials" className="mt-4">
              <motion.div variants={fadeIn} initial="hidden" animate="visible">
                <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 overflow-hidden">
                  <CardHeader className="bg-lime-50 dark:bg-slate-700">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lime-900 dark:text-lime-100">
                        Client Testimonials
                      </CardTitle>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={() =>
                            addArrayItem("testimonials", {
                              id: Date.now(),
                              imageUrl: "",
                              category: formData.categories[0]?.name || "",
                              quote: "",
                              author: "",
                              role: "",
                              rating: 5,
                            })
                          }
                          type="button"
                          disabled={loading}
                          className="bg-lime-500 hover:bg-lime-600 text-white flex items-center gap-2"
                        >
                          <FiPlus className="w-4 h-4" /> Add Testimonial
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
                      {formData.testimonials?.map(
                        (testimonial: Testimonial, index: number) => (
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
                                    Testimonial {index + 1}
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
                                      removeArrayItem("testimonials", index)
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
                                    {testimonial.imageUrl ? (
                                      <Image
                                        src={testimonial.imageUrl}
                                        alt="Testimonial preview"
                                        width={96}
                                        height={96}
                                        className="object-cover w-full h-full"
                                      />
                                    ) : (
                                      <FiImage className="text-lime-400 text-2xl" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <Label>Client Photo</Label>
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
                                            : "Upload Photo"}
                                        </Button>
                                      </motion.div>
                                      <Input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept="image/*"
                                        onChange={(e) =>
                                          handleFileUpload(
                                            e,
                                            `testimonials.${index}.imageUrl`,
                                            "testimonials",
                                            testimonial.author
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label>Client Name</Label>
                                    <Input
                                      value={testimonial.author}
                                      onChange={(e) =>
                                        handleInputChange(
                                          `testimonials.${index}.author`,
                                          e.target.value
                                        )
                                      }
                                      className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                    />
                                  </div>
                                  <div>
                                    <Label>Client Role</Label>
                                    <Input
                                      value={testimonial.role}
                                      onChange={(e) =>
                                        handleInputChange(
                                          `testimonials.${index}.role`,
                                          e.target.value
                                        )
                                      }
                                      className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                    />
                                  </div>
                                  <div>
                                    <Label>Category</Label>
                                    <select
                                      value={testimonial.category}
                                      onChange={(e) =>
                                        handleInputChange(
                                          `testimonials.${index}.category`,
                                          e.target.value
                                        )
                                      }
                                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      {formData.categories?.map((cat) => (
                                        <option key={cat.name} value={cat.name}>
                                          {cat.name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div>
                                    <Label>Rating (1-5)</Label>
                                    <select
                                      value={testimonial.rating}
                                      onChange={(e) =>
                                        handleInputChange(
                                          `testimonials.${index}.rating`,
                                          Number(e.target.value)
                                        )
                                      }
                                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      {[1, 2, 3, 4, 5].map((num) => (
                                        <option key={num} value={num}>
                                          {num} {num === 1 ? "Star" : "Stars"}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                <div className="mt-4">
                                  <Label>Testimonial Quote</Label>
                                  <Textarea
                                    value={testimonial.quote}
                                    onChange={(e) =>
                                      handleInputChange(
                                        `testimonials.${index}.quote`,
                                        e.target.value
                                      )
                                    }
                                    rows={3}
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
                      {formData.stats?.map((stat: Stat, index: number) => (
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
                          value={formData.cta?.title}
                          onChange={(e) =>
                            handleInputChange("cta.title", e.target.value)
                          }
                          className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={formData.cta?.description}
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

export default TestimonialAdminDashboard;
