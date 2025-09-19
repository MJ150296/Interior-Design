"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  FiImage,
  FiEdit,
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
  BlogContent,
  Article,
  selectBlogContent,
  selectBlogLoading,
  selectBlogError,
  updateBlogContent,
} from "../../../../../redux/slices/blogPageSlice";
import { fetchBlogContent } from "../../../../../redux/slices/blogPageSlice";

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

// Update the defaultValues to match BlogContent interface
const defaultValues: BlogContent = {
  hero: {
    backgroundImageUrl: "/Riddhi%20Interior%20Design/Projects/cover.jpg",
    preTitle: "INSIGHTS & INSPIRATION",
    title: "Design Journal",
    subtitle:
      "Explore Ideas, Trends, and Expert Advice on Beautiful Living Spaces.",
    searchPlaceholder: "Search blog posts...",
  },
  featured: {
    title: "Featured Inspiration",
    post: {
      id: 1,
      imageUrl:
        "/Riddhi%20Interior%20Design/Blogs/top_interior_design_trends_for_the_year.jpeg",
      category: "Trends",
      title: "Top Interior Design Trends for 2025",
      description:
        "Discover the biggest interior design trends for 2025—from natural textures and bold color accents to smart homes and sustainable materials.",
      author: "Riddhi Sharma",
      date: "May 15, 2025",
    },
  },
  categories: [
    "All",
    "Trends",
    "Space Planning",
    "Residential",
    "Color Theory",
    "Budget Design",
  ],
  articles: [
    {
      id: 1,
      imageUrl:
        "/Riddhi%20Interior%20Design/Blogs/top_interior_design_trends_for_the_year.jpeg",
      category: "Trends",
      title: "Top Interior Design Trends for 2025",
      description:
        "Discover the biggest interior design trends for 2025—from natural textures and bold color accents to smart homes and sustainable materials.",
      author: "Riddhi Sharma",
      date: "May 15, 2025",
    },
    {
      id: 2,
      imageUrl:
        "/Riddhi%20Interior%20Design/Blogs/small_space_makeover_ideas.jpeg",
      category: "Space Planning",
      title: "Small Space Solutions: Big Impact Design",
      description:
        "Living in a compact apartment? Learn how to maximize space with clever furniture, lighting, and color tricks that transform tight areas into stylish sanctuaries.",
      author: "Arjun Patel",
      date: "April 28, 2025",
    },
    {
      id: 3,
      imageUrl:
        "/Riddhi%20Interior%20Design/Blogs/modern_living_room_design_tips.jpeg",
      category: "Residential",
      title: "Creating Timeless Living Spaces",
      description:
        "From layout planning to material choices, explore how to design a modern living room that's stylish, practical, and tailored to your lifestyle.",
      author: "Neha Kapoor",
      date: "June 3, 2025",
    },
    {
      id: 4,
      imageUrl:
        "/Riddhi%20Interior%20Design/Blogs/how_to_choose_the_right_color_palette.jpeg",
      category: "Color Theory",
      title: "The Art of Color: Designing with Hue",
      description:
        "Choosing the right colors can make or break your interiors. Learn how to build a cohesive palette that enhances mood, style, and functionality.",
      author: "Riddhi Sharma",
      date: "May 22, 2025",
    },
    {
      id: 5,
      imageUrl:
        "/Riddhi%20Interior%20Design/Blogs/affordable_interior_upgrades_for_your_home%20(2).jpeg",
      category: "Budget Design",
      title: "Transform Your Space: Budget-Friendly Makeovers",
      description:
        "Refresh your home without breaking the bank. Discover smart, budget-friendly design updates that boost style and comfort.",
      author: "Vikram Mehta",
      date: "April 10, 2025",
    },
  ],
  newsletter: {
    title: "Design Inspiration Delivered",
    description:
      "Join our newsletter and receive exclusive design tips, trend reports, and special offers.",
    placeholder: "Your email address",
    buttonText: "Subscribe",
    privacyText: "We respect your privacy. Unsubscribe at any time.",
  },
  fullBlogs: [],
} as unknown as BlogContent;

const BlogAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("hero");
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<BlogContent>(defaultValues);
  const [isSaving, setIsSaving] = useState(false);
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());

  const dispatch = useAppDispatch();
  const blogData = useAppSelector(selectBlogContent);
  const loading = useAppSelector(selectBlogLoading) as boolean;
  const error = useAppSelector(selectBlogError) as string;

  // Save form data to backend
  const saveFormData = useCallback(
    async (dataToSave?: BlogContent) => {
      setIsSaving(true);
      try {
        await dispatch(updateBlogContent(dataToSave || formData)).unwrap();
        setChangedFields(new Set());
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
    await saveFormData();
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

      const folderPath = customFolder
        ? `riddhi_interiors/blog/${section}/${customFolder}`
        : `riddhi_interiors/blog/${section}`;

      formData.append("folderPath", folderPath);

      const MAX_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        alert("File size exceeds 5MB limit");
        return "";
      }

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
    customFolder?: string
  ) => {
    if (!e.target.files?.[0] || !formData) return;
    const file = e.target.files[0];
    e.target.value = "";

    setUploading(true);

    try {
      const fileUrl = await uploadFile(file, section, customFolder);

      if (fileUrl) {
        const updatedFormData = JSON.parse(JSON.stringify(formData));
        const parts = fieldPath.split(".");
        let current: unknown = updatedFormData;

        for (let i = 0; i < parts.length - 1; i++) {
          current = (current as Record<string, unknown>)[parts[i]];
        }

        (current as Record<string, unknown>)[parts[parts.length - 1]] = fileUrl;
        setFormData(updatedFormData);
        await saveFormData(updatedFormData);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchBlogContent());
  }, [dispatch]);

  // Update form when Redux data changes
  useEffect(() => {
    if (blogData) {
      setFormData(blogData);
      setChangedFields(new Set());
    }
  }, [blogData]);

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
  const handleInputChange = (
    path: string,
    value: string | number | number[]
  ) => {
    if (!formData) return;

    setFormData((prev: BlogContent) => {
      if (!prev) return prev;

      const newData: BlogContent = JSON.parse(JSON.stringify(prev));
      const parts = path.split(".");

      setChangedFields((prevFields) => new Set(prevFields.add(path)));

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

      if (typeof current === "object" && current !== null) {
        (current as Record<string, unknown>)[lastPart] = value;
      }

      return newData;
    });
  };

  // Add new item to array
  const addArrayItem = <T,>(arrayPath: string, newItem: T) => {
    if (!formData) return;

    setFormData((prev: BlogContent) => {
      if (!prev) return prev;

      const newData: BlogContent = JSON.parse(JSON.stringify(prev));
      const parts = arrayPath.split(".");

      setChangedFields((prevFields) => new Set(prevFields.add(arrayPath)));

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
        ((current as Record<string, unknown>)[lastPart] as T[]).push(newItem);
      }

      return newData;
    });
  };

  // Remove item from array
  const removeArrayItem = async (arrayPath: string, index: number) => {
    if (!formData) return;

    setFormData((prev: BlogContent) => {
      if (!prev) return prev;

      const newData: BlogContent = JSON.parse(JSON.stringify(prev));
      const parts = arrayPath.split(".");

      setChangedFields((prevFields) => new Set(prevFields.add(arrayPath)));

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
      let imageUrl = "";

      if (typeof item === "object" && item !== null) {
        if ("imageUrl" in item) imageUrl = item.imageUrl as string;
        else if ("backgroundImageUrl" in item) {
          imageUrl = item.backgroundImageUrl as string;
        }
      }

      if (imageUrl && imageUrl.includes("res.cloudinary.com")) {
        let folderPath = "";

        if (
          arrayPath.includes("articles") &&
          typeof item === "object" &&
          item !== null &&
          "title" in item
        ) {
          const slug = generateSlug(item.title as string);
          folderPath = `riddhi_interiors/blog/${slug}`;
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

      array.splice(index, 1);
      return newData;
    });
  };

  // Update category
  const updateCategory = (index: number, value: string) => {
    if (!formData) return;

    setFormData((prev: BlogContent) => {
      if (!prev) return prev;

      const newData: BlogContent = JSON.parse(JSON.stringify(prev));
      newData.categories[index] = value;

      setChangedFields((prevFields) => new Set(prevFields.add("categories")));
      return newData;
    });
  };

  // Add category
  const addCategory = () => {
    if (!formData) return;

    setFormData((prev: BlogContent) => {
      if (!prev) return prev;

      const newData: BlogContent = JSON.parse(JSON.stringify(prev));
      newData.categories.push("New Category");

      setChangedFields((prevFields) => new Set(prevFields.add("categories")));
      return newData;
    });
  };

  // Remove category
  const removeCategory = (index: number) => {
    if (!formData) return;

    setFormData((prev: BlogContent) => {
      if (!prev) return prev;

      const newData: BlogContent = JSON.parse(JSON.stringify(prev));
      newData.categories.splice(index, 1);

      setChangedFields((prevFields) => new Set(prevFields.add("categories")));
      return newData;
    });
  };

  // Tab navigation items
  const tabItems = [
    { value: "hero", icon: <FiImage />, label: "Hero" },
    { value: "featured", icon: <FiStar />, label: "Featured" },
    { value: "categories", icon: <FiSettings />, label: "Categories" },
    { value: "articles", icon: <FiEdit />, label: "Articles" },
    { value: "newsletter", icon: <FiMessageSquare />, label: "Newsletter" },
  ];

  if (!formData) {
    return (
      <DashboardLayoutClient>
        <div className="flex justify-center items-center h-screen">
          <p>Loading blog content...</p>
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
                Blog Page Content Management
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage your blog page content and articles
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

                      <div>
                        <Label>Search Placeholder</Label>
                        <Input
                          value={formData.hero.searchPlaceholder || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "hero.searchPlaceholder",
                              e.target.value
                            )
                          }
                          className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Featured Tab */}
            <TabsContent value="featured" className="mt-4">
              <motion.div variants={fadeIn} initial="hidden" animate="visible">
                <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 overflow-hidden">
                  <CardHeader className="bg-lime-50 dark:bg-slate-700">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lime-900 dark:text-lime-100">
                        Featured Post
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <Label>Featured Section Title</Label>
                      <Input
                        value={formData.featured.title || ""}
                        onChange={(e) =>
                          handleInputChange("featured.title", e.target.value)
                        }
                        className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                      />
                    </div>

                    <div className="border-t border-lime-200 pt-4 mt-4">
                      <h3 className="text-lg font-medium text-lime-800 mb-4">
                        Featured Post Details
                      </h3>

                      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
                        <div className="w-32 h-32 border-2 border-dashed border-lime-300 rounded-lg flex items-center justify-center overflow-hidden bg-lime-50 dark:bg-slate-700">
                          {formData.featured.post.imageUrl ? (
                            <Image
                              src={formData.featured.post.imageUrl}
                              alt="Featured post preview"
                              width={128}
                              height={128}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <FiImage className="text-lime-400 text-2xl" />
                          )}
                        </div>
                        <div className="flex-1">
                          <Label>Featured Post Image</Label>
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
                                  "featured.post.imageUrl",
                                  "featured",
                                  generateSlug(formData.featured.post.title)
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label>Category</Label>
                          <select
                            value={formData.featured.post.category}
                            onChange={(e) =>
                              handleInputChange(
                                "featured.post.category",
                                e.target.value
                              )
                            }
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {formData.categories?.map((cat: string) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label>Author</Label>
                          <Input
                            value={formData.featured.post.author}
                            onChange={(e) =>
                              handleInputChange(
                                "featured.post.author",
                                e.target.value
                              )
                            }
                            className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                          />
                        </div>
                        <div>
                          <Label>Date</Label>
                          <Input
                            value={formData.featured.post.date}
                            onChange={(e) =>
                              handleInputChange(
                                "featured.post.date",
                                e.target.value
                              )
                            }
                            className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <Label>Title</Label>
                        <Input
                          value={formData.featured.post.title}
                          onChange={(e) =>
                            handleInputChange(
                              "featured.post.title",
                              e.target.value
                            )
                          }
                          className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                        />
                      </div>

                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={formData.featured.post.description}
                          onChange={(e) =>
                            handleInputChange(
                              "featured.post.description",
                              e.target.value
                            )
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
                        Blog Categories
                      </CardTitle>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={addCategory}
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
                        (category: string, index: number) => (
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
                                {index > 0 && (
                                  <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeCategory(index)}
                                      type="button"
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <FiX className="w-4 h-4" />
                                    </Button>
                                  </motion.div>
                                )}
                              </div>
                              <div>
                                <Label>Category Name</Label>
                                <Input
                                  value={category}
                                  onChange={(e) =>
                                    updateCategory(index, e.target.value)
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

            {/* Articles Tab */}
            <TabsContent value="articles" className="mt-4">
              <motion.div variants={fadeIn} initial="hidden" animate="visible">
                <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 overflow-hidden">
                  <CardHeader className="bg-lime-50 dark:bg-slate-700">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lime-900 dark:text-lime-100">
                        Blog Articles
                      </CardTitle>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={() =>
                            addArrayItem("articles", {
                              id: Date.now(),
                              imageUrl: "",
                              category: formData.categories[1] || "Trends",
                              title: "New Article",
                              description: "",
                              author: "",
                              date: new Date().toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }),
                            })
                          }
                          type="button"
                          disabled={loading}
                          className="bg-lime-500 hover:bg-lime-600 text-white flex items-center gap-2"
                        >
                          <FiPlus className="w-4 h-4" /> Add Article
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
                      {formData.articles?.map(
                        (article: Article, index: number) => (
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
                                    Article {index + 1}
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
                                      removeArrayItem("articles", index)
                                    }
                                    type="button"
                                    className="text-red-50 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <FiX className="w-4 h-4" />
                                  </Button>
                                </motion.div>
                              </div>
                              <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
                                  <div className="w-24 h-24 border-2 border-dashed border-lime-300 rounded-lg flex items-center justify-center overflow-hidden bg-white dark:bg-slate-800">
                                    {article.imageUrl ? (
                                      <Image
                                        src={article.imageUrl}
                                        alt="Article preview"
                                        width={96}
                                        height={96}
                                        className="object-cover w-full h-full"
                                      />
                                    ) : (
                                      <FiImage className="text-lime-400 text-2xl" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <Label>Article Image</Label>
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
                                            `articles.${index}.imageUrl`,
                                            "articles",
                                            generateSlug(article.title)
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label>Title</Label>
                                    <Input
                                      value={article.title}
                                      onChange={(e) =>
                                        handleInputChange(
                                          `articles.${index}.title`,
                                          e.target.value
                                        )
                                      }
                                      className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                    />
                                  </div>
                                  <div>
                                    <Label>Author</Label>
                                    <Input
                                      value={article.author}
                                      onChange={(e) =>
                                        handleInputChange(
                                          `articles.${index}.author`,
                                          e.target.value
                                        )
                                      }
                                      className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                    />
                                  </div>
                                  <div>
                                    <Label>Category</Label>
                                    <select
                                      value={article.category}
                                      onChange={(e) =>
                                        handleInputChange(
                                          `articles.${index}.category`,
                                          e.target.value
                                        )
                                      }
                                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      {formData.categories?.map(
                                        (cat: string) => (
                                          <option key={cat} value={cat}>
                                            {cat}
                                          </option>
                                        )
                                      )}
                                    </select>
                                  </div>
                                  <div>
                                    <Label>Date</Label>
                                    <Input
                                      value={article.date}
                                      onChange={(e) =>
                                        handleInputChange(
                                          `articles.${index}.date`,
                                          e.target.value
                                        )
                                      }
                                      className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                    />
                                  </div>
                                </div>

                                <div className="mt-4">
                                  <Label>Description</Label>
                                  <Textarea
                                    value={article.description}
                                    onChange={(e) =>
                                      handleInputChange(
                                        `articles.${index}.description`,
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

            {/* Newsletter Tab */}
            <TabsContent value="newsletter" className="mt-4">
              <motion.div variants={fadeIn} initial="hidden" animate="visible">
                <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 overflow-hidden">
                  <CardHeader className="bg-lime-50 dark:bg-slate-700">
                    <CardTitle className="text-lime-900 dark:text-lime-100">
                      Newsletter Section
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={formData.newsletter.title}
                          onChange={(e) =>
                            handleInputChange(
                              "newsletter.title",
                              e.target.value
                            )
                          }
                          className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={formData.newsletter.description}
                          onChange={(e) =>
                            handleInputChange(
                              "newsletter.description",
                              e.target.value
                            )
                          }
                          rows={3}
                          className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                        />
                      </div>
                      <div>
                        <Label>Placeholder Text</Label>
                        <Input
                          value={formData.newsletter.placeholder}
                          onChange={(e) =>
                            handleInputChange(
                              "newsletter.placeholder",
                              e.target.value
                            )
                          }
                          className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                        />
                      </div>
                      <div>
                        <Label>Button Text</Label>
                        <Input
                          value={formData.newsletter.buttonText}
                          onChange={(e) =>
                            handleInputChange(
                              "newsletter.buttonText",
                              e.target.value
                            )
                          }
                          className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                        />
                      </div>
                      <div>
                        <Label>Privacy Text</Label>
                        <Input
                          value={formData.newsletter.privacyText}
                          onChange={(e) =>
                            handleInputChange(
                              "newsletter.privacyText",
                              e.target.value
                            )
                          }
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

export default BlogAdminDashboard;