"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
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
  FiChevronUp,
  FiChevronDown,
  FiLoader,
  FiCalendar,
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
import AdminToast from "@/app/dashboard/components/AdminToast";
import { useAdminToast } from "@/app/dashboard/hooks/useAdminToast";

import { cn } from "@/lib/utils";
import Image from "next/image";

// Import TypeScript interfaces
import {
  BlogContent,
  Article,
  ContentBlock,
  selectBlogContent,
  selectBlogLoading,
  selectBlogError,
  updateBlogContent,
} from "../../../../../redux/slices/blogPageSlice";
import { fetchBlogContent } from "../../../../../redux/slices/blogPageSlice";
import { nanoid } from "@reduxjs/toolkit";

// Helper function to format date as "Feb 15, 2026"
const formatDateDisplay = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  } catch {
    return dateString;
  }
};

// Helper function to convert display date to input date format (YYYY-MM-DD)
// Fixes timezone issue by using local date components
const formatDateForInput = (displayDate: string): string => {
  try {
    // Parse the date string (assuming it's in format like "Feb 19, 2026" or "19 Feb 2026")
    const date = new Date(displayDate);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      // Try parsing manually if the above fails
      // Handle formats like "Feb 15, 2026" or "15 Feb 2026"
      const parts = displayDate.match(/(\d+)\s+(\w+),?\s+(\d+)/);
      if (parts) {
        const day = parseInt(parts[1]);
        const monthStr = parts[2];
        const year = parseInt(parts[3]);
        
        const months: Record<string, number> = {
          'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
          'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
        };
        
        const month = months[monthStr.substring(0, 3)];
        if (month !== undefined) {
          // Create date using local time (no timezone conversion)
          const localDate = new Date(year, month, day);
          const yearStr = localDate.getFullYear();
          const monthStr2 = String(localDate.getMonth() + 1).padStart(2, '0');
          const dayStr = String(localDate.getDate()).padStart(2, '0');
          return `${yearStr}-${monthStr2}-${dayStr}`;
        }
      }
      
      // Default to today
      const today = new Date();
      return today.toISOString().split('T')[0];
    }
    
    // Use local time components to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
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
    postIds: ["1"],
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
      id: nanoid(),
      imageUrl:
        "/Riddhi%20Interior%20Design/Blogs/top_interior_design_trends_for_the_year.jpeg",
      category: "Trends",
      title: "Top Interior Design Trends for 2025",
      description:
        "Discover the biggest interior design trends for 2025—from natural textures and bold color accents to smart homes and sustainable materials.",
      author: "Riddhi Sharma",
      authorBio: "Interior Design Expert at Riddhi Interiors",
      date: "May 15, 2025",
      content: {
        hero: {
          title: "Top Interior Design Trends for 2025",
          subtitle: "Discover what's shaping the future of interior design",
          imageUrl: "/Riddhi%20Interior%20Design/Blogs/top_interior_design_trends_for_the_year.jpeg",
        },
        meta: {
          readTime: "5 min read",
        },
        body: [],
        features: [],
        tips: [],
      },
    },
    {
      id: nanoid(),
      imageUrl:
        "/Riddhi%20Interior%20Design/Blogs/small_space_makeover_ideas.jpeg",
      category: "Space Planning",
      title: "Small Space Solutions: Big Impact Design",
      description:
        "Living in a compact apartment? Learn how to maximize space with clever furniture, lighting, and color tricks that transform tight areas into stylish sanctuaries.",
      author: "Arjun Patel",
      authorBio: "Space Planning Specialist",
      date: "April 28, 2025",
      content: {
        hero: {
          title: "Small Space Solutions: Big Impact Design",
          subtitle: "Maximize your compact living spaces",
          imageUrl: "/Riddhi%20Interior%20Design/Blogs/small_space_makeover_ideas.jpeg",
        },
        meta: {
          readTime: "4 min read",
        },
        body: [],
        features: [],
        tips: [],
      },
    },
    {
      id: nanoid(),
      imageUrl:
        "/Riddhi%20Interior%20Design/Blogs/modern_living_room_design_tips.jpeg",
      category: "Residential",
      title: "Creating Timeless Living Spaces",
      description:
        "From layout planning to material choices, explore how to design a modern living room that's stylish, practical, and tailored to your lifestyle.",
      author: "Neha Kapoor",
      authorBio: "Residential Design Expert",
      date: "June 3, 2025",
      content: {
        hero: {
          title: "Creating Timeless Living Spaces",
          subtitle: "Design a living room that stands the test of time",
          imageUrl: "/Riddhi%20Interior%20Design/Blogs/modern_living_room_design_tips.jpeg",
        },
        meta: {
          readTime: "6 min read",
        },
        body: [],
        features: [],
        tips: [],
      },
    },
    {
      id: nanoid(),
      imageUrl:
        "/Riddhi%20Interior%20Design/Blogs/how_to_choose_the_right_color_palette.jpeg",
      category: "Color Theory",
      title: "The Art of Color: Designing with Hue",
      description:
        "Choosing the right colors can make or break your interiors. Learn how to build a cohesive palette that enhances mood, style, and functionality.",
      author: "Riddhi Sharma",
      authorBio: "Interior Design Expert at Riddhi Interiors",
      date: "May 22, 2025",
      content: {
        hero: {
          title: "The Art of Color: Designing with Hue",
          subtitle: "Master the science and art of color in interior design",
          imageUrl: "/Riddhi%20Interior%20Design/Blogs/how_to_choose_the_right_color_palette.jpeg",
        },
        meta: {
          readTime: "5 min read",
        },
        body: [],
        features: [],
        tips: [],
      },
    },
    {
      id: nanoid(),
      imageUrl:
        "/Riddhi%20Interior%20Design/Blogs/affordable_interior_upgrades_for_your_home%20(2).jpeg",
      category: "Budget Design",
      title: "Transform Your Space: Budget-Friendly Makeovers",
      description:
        "Refresh your home without breaking the bank. Discover smart, budget-friendly design updates that boost style and comfort.",
      author: "Vikram Mehta",
      authorBio: "Budget Design Specialist",
      date: "April 10, 2025",
      content: {
        hero: {
          title: "Transform Your Space: Budget-Friendly Makeovers",
          subtitle: "Get maximum impact with minimum spend",
          imageUrl: "/Riddhi%20Interior%20Design/Blogs/affordable_interior_upgrades_for_your_home%20(2).jpeg",
        },
        meta: {
          readTime: "4 min read",
        },
        body: [],
        features: [],
        tips: [],
      },
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
} as unknown as BlogContent;

const ARTICLES_PER_PAGE = 1;

const BlogAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("hero");
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<BlogContent>(defaultValues);
  const [isSaving, setIsSaving] = useState(false);
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const { toast, showToast } = useAdminToast();

  // Use ref to store latest formData to avoid closure stale values
  const formDataRef = useRef(formData);
  formDataRef.current = formData;

  const dispatch = useAppDispatch();
  const blogData = useAppSelector(selectBlogContent);
  const loading = useAppSelector(selectBlogLoading);
  const error = useAppSelector(selectBlogError);

  // Save form data to backend - use ref to get latest value
  const saveFormData = useCallback(
    async (dataToSave?: BlogContent) => {
      setIsSaving(true);
      const finalData = dataToSave ?? formDataRef.current;
      try {
        console.log("data to save", finalData);

        await dispatch(updateBlogContent(finalData)).unwrap();
        await dispatch(fetchBlogContent()).unwrap();

        setChangedFields(new Set());
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
    [dispatch, showToast]
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
        const updatedFormData = structuredClone(formData);
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
      // Deep clone and ensure all nested content objects are properly initialized
      const normalizedData = JSON.parse(JSON.stringify(blogData));

      // Initialize articles content if missing
      if (normalizedData.articles && Array.isArray(normalizedData.articles)) {
        normalizedData.articles = normalizedData.articles.map((article: Article) => {
          // Only add content if it doesn't exist or is empty
          if (!article.content || typeof article.content !== 'object') {
            return {
              ...article,
              content: {
                hero: { title: article.title || "", subtitle: "", imageUrl: article.imageUrl || "" },
                meta: { readTime: "5 min read" },
                body: [],
                features: [],
                tips: [],
              },
            };
          }
          // Ensure nested content properties exist
          return {
            ...article,
            content: {
              hero: article.content.hero || { title: article.title || "", subtitle: "", imageUrl: article.imageUrl || "" },
              meta: article.content.meta || { readTime: "5 min read" },
              body: article.content.body || [],
              features: article.content.features || [],
              tips: article.content.tips || [],
            },
          };
        });
      }

      // Remove old featured.post object if it exists (we now use postIds instead)
      if (normalizedData.featured?.post) {
        delete normalizedData.featured.post;
      }

      setFormData(normalizedData);
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
    value: string | number | string[] | number[] | ContentBlock[]
  ) => {
    if (!formData) return;

    const newData: BlogContent = structuredClone(formData);
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
        return;
      }
    }

    if (typeof current === "object" && current !== null) {
      (current as Record<string, unknown>)[lastPart] = value;
    }

    setFormData(newData);
  };

  // Add new item to array
  const addArrayItem = <T,>(arrayPath: string, newItem: T) => {
    if (!formData) return;

    const newData: BlogContent = structuredClone(formData);
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

    setFormData(newData);
  };

  // Remove item from array - use useRef to track if we should save
  const removeArrayItem = async (arrayPath: string, index: number) => {
    if (!formData) return;

    const newData: BlogContent = structuredClone(formData);
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
        return;
      }
    }

    const lastPart = parts[parts.length - 1];
    if (typeof current !== "object" || current === null) {
      console.error("Invalid path: expected an object");
      return;
    }

    const array = (current as Record<string, unknown>)[lastPart];
    if (!Array.isArray(array)) {
      console.error("Invalid path: expected an array");
      return;
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

    setFormData(newData);
  };

  // Update category
  const updateCategory = (index: number, value: string) => {
    if (!formData) return;

    const newData: BlogContent = structuredClone(formData);
    newData.categories[index] = value;

    setChangedFields((prevFields) => new Set(prevFields.add("categories")));
    setFormData(newData);
  };

  // Add category
  const addCategory = () => {
    if (!formData) return;

    const newData: BlogContent = structuredClone(formData);
    newData.categories.push("New Category");

    setChangedFields((prevFields) => new Set(prevFields.add("categories")));
    setFormData(newData);
  };

  // Remove category
  const removeCategory = (index: number) => {
    if (!formData) return;

    const newData: BlogContent = structuredClone(formData);
    newData.categories.splice(index, 1);

    setChangedFields((prevFields) => new Set(prevFields.add("categories")));
    setFormData(newData);
  };

  // Move content block up
  const moveBlockUp = (articleIndex: number, blockIndex: number) => {
    if (!formData || blockIndex === 0) return;

    const newData: BlogContent = structuredClone(formData);
    const body = newData.articles[articleIndex].content.body;

    if (body && body.length > 1) {
      const temp = body[blockIndex];
      body[blockIndex] = body[blockIndex - 1];
      body[blockIndex - 1] = temp;

      setChangedFields((prevFields) => new Set(prevFields.add(`articles.${articleIndex}.content.body`)));
      setFormData(newData);
    }
  };

  // Move content block down
  const moveBlockDown = (articleIndex: number, blockIndex: number) => {
    if (!formData) return;

    const newData: BlogContent = structuredClone(formData);
    const body = newData.articles[articleIndex].content.body;

    if (body && blockIndex < body.length - 1) {
      const temp = body[blockIndex];
      body[blockIndex] = body[blockIndex + 1];
      body[blockIndex + 1] = temp;

      setChangedFields((prevFields) => new Set(prevFields.add(`articles.${articleIndex}.content.body`)));
      setFormData(newData);
    }
  };

  // Tab navigation items
  const tabItems = [
    { value: "hero", icon: <FiImage />, label: "Hero" },
    { value: "featured", icon: <FiStar />, label: "Featured" },
    { value: "categories", icon: <FiSettings />, label: "Categories" },
    { value: "articles", icon: <FiEdit />, label: "Articles" },
    { value: "newsletter", icon: <FiMessageSquare />, label: "Newsletter" },
  ];

  // Sort articles by date (latest first)
  const sortedArticles = React.useMemo(() => {
    if (!formData.articles) return [];
    return [...formData.articles].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  }, [formData.articles]);

  // Pagination logic
  const totalArticles = sortedArticles.length;
  const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);
  const indexOfLastArticle = currentPage * ARTICLES_PER_PAGE;
  const indexOfFirstArticle = indexOfLastArticle - ARTICLES_PER_PAGE;
  const currentPageArticles = sortedArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  // Reset to page 1 when articles count changes (e.g., after adding/removing)
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalArticles, totalPages, currentPage]);

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
      <AdminToast message={toast?.message ?? null} tone={toast?.tone} />
      <div className="flex flex-col min-h-screen bg-linear-to-br from-slate-50 to-lime-50 dark:from-slate-900 dark:to-slate-800">
        {/* Header */}
        <header
          className="flex flex-col bg-white dark:bg-slate-800 shadow-sm animate-[slideInDown_0.3s_ease-out]"
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
                  "flex items-center gap-2 transition-all hover:scale-105 active:scale-95",
                  changedFields.size > 0 && "ring-2 ring-lime-500"
                )}
              >
                {isSaving ? (
                  <>
                    <FiLoader className="w-4 h-4 animate-spin" />
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
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Tabs value={activeTab} className="w-full">
            {/* Hero Tab */}
            <TabsContent value="hero" className="mt-4">
              <div className="animate-[fadeIn_0.3s_ease-out]">
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
                          <div className="hover:scale-[1.02] active:scale-[0.98] transition-transform inline-block">
                            <Button
                              variant="outline"
                              disabled={uploading}
                              type="button"
                              className="w-full md:w-auto flex items-center gap-2 border-lime-300 text-lime-700 hover:bg-lime-50"
                            >
                              {uploading ? (
                                <FiLoader className="w-4 h-4 animate-spin" />
                              ) : (
                                <FiUpload className="w-4 h-4" />
                              )}
                              {uploading ? "Uploading..." : "Upload Image"}
                            </Button>
                          </div>
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
              </div>
            </TabsContent>

            {/* Featured Tab */}
            <TabsContent value="featured" className="mt-4">
              <div className="animate-[fadeIn_0.3s_ease-out]">
                <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 overflow-hidden">
                  <CardHeader className="bg-lime-50 dark:bg-slate-700">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lime-900 dark:text-lime-100">
                        Featured Posts
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <Label>Featured Section Title</Label>
                      <Input
                        value={formData.featured?.title || ""}
                        onChange={(e) =>
                          handleInputChange("featured.title", e.target.value)
                        }
                        className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                      />
                    </div>

                    <div className="border-t border-lime-200 pt-4 mt-4">
                      <h3 className="text-lg font-medium text-lime-800 mb-4">
                        Select Featured Posts
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                        Check the articles you want to display in the featured section. The selected posts will be shown in the featured carousel on your blog page.
                      </p>

                      {formData.articles && formData.articles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {formData.articles.map((article: Article, index: number) => {
                            // Ensure articleId is always a string
                            const articleId = String(article.id || `temp-${index}`);
                            const isFeatured = formData.featured?.postIds?.some((id: string) => String(id) === articleId);
                            
                            return (
                              <div
                                key={articleId}
                                className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg animate-[scaleIn_0.2s_ease-out] ${isFeatured
                                  ? "border-lime-500 bg-lime-50 dark:bg-lime-900/20"
                                  : "border-lime-200 dark:border-slate-600 hover:border-lime-300"
                                  }`}
                                onClick={() => {
                                  const currentIds = (formData.featured?.postIds || []).map((id: string | number) => String(id));
                                  let newIds: string[];
                                  if (isFeatured) {
                                    newIds = currentIds.filter((id: string) => id !== articleId);
                                  } else {
                                    newIds = [...currentIds, articleId];
                                  }
                                  console.log("Toggling featured - articleId:", articleId, "isFeatured:", isFeatured, "newIds:", newIds);
                                  handleInputChange("featured.postIds", newIds);
                                }}
                              >
                                {/* Checkmark overlay */}
                                <div className={`absolute top-2 right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center ${isFeatured
                                  ? "bg-lime-500 text-white"
                                  : "bg-gray-200 dark:bg-gray-600"
                                  }`}>
                                  {isFeatured && (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>

                                {/* Article thumbnail */}
                                <div className="relative h-32 w-full">
                                  {article.imageUrl ? (
                                    <Image
                                      src={article.imageUrl}
                                      alt={article.title}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-lime-100 dark:bg-lime-800 flex items-center justify-center">
                                      <FiImage className="text-lime-400 text-2xl" />
                                    </div>
                                  )}
                                </div>

                                {/* Article info */}
                                <div className="p-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="secondary" className="text-xs bg-lime-100 text-lime-700 dark:bg-lime-800 dark:text-lime-300">
                                      {article.category}
                                    </Badge>
                                  </div>
                                  <h4 className="font-medium text-sm text-gray-800 dark:text-gray-200 line-clamp-2">
                                    {article.title}
                                  </h4>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {article.author}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500 dark:text-gray-400">
                            No articles available. Please add articles first in the Articles tab.
                          </p>
                        </div>
                      )}

                      {formData.featured?.postIds && formData.featured.postIds.length > 0 && (
                        <div className="mt-6 p-4 bg-lime-50 dark:bg-lime-900/20 rounded-lg">
                          <p className="text-sm text-lime-700 dark:text-lime-300">
                            <strong>{formData.featured.postIds.length}</strong> post(s) selected as featured
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories" className="mt-4">
              <div className="animate-[fadeIn_0.3s_ease-out]">
                <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 overflow-hidden">
                  <CardHeader className="bg-lime-50 dark:bg-slate-700">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lime-900 dark:text-lime-100">
                        Blog Categories
                      </CardTitle>
                      <div className="hover:scale-105 active:scale-95 transition-transform inline-block">
                        <Button
                          onClick={addCategory}
                          type="button"
                          className="bg-lime-500 hover:bg-lime-600 text-white flex items-center gap-2"
                        >
                          <FiPlus className="w-4 h-4" /> Add Category
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {formData.categories?.map(
                        (category: string, index: number) => (
                          <div
                            key={index}
                            className="animate-[scaleIn_0.2s_ease-out] hover:-translate-y-1 transition-transform"
                          >
                            <Card className="p-4 bg-lime-50 dark:bg-slate-700 border-lime-200 dark:border-slate-600">
                              <div className="flex justify-between items-center mb-3">
                                <Badge className="bg-lime-500 text-white">
                                  Category {index + 1}
                                </Badge>
                                {index > 0 && (
                                  <div className="hover:scale-110 active:scale-90 transition-transform">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeCategory(index)}
                                      type="button"
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <FiX className="w-4 h-4" />
                                    </Button>
                                  </div>
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
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Articles Tab */}
            <TabsContent value="articles" className="mt-4">
              <div className="animate-[fadeIn_0.3s_ease-out]">
                <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 overflow-hidden">
                  <CardHeader className="bg-lime-50 dark:bg-slate-700">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lime-900 dark:text-lime-100">
                        Blog Articles
                      </CardTitle>
                      <div className="hover:scale-105 active:scale-95 transition-transform inline-block">
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
                              date: new Date().toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }),
                              content: {
                                hero: {
                                  title: "",
                                  subtitle: "",
                                  imageUrl: "",
                                },
                                meta: {
                                  readTime: "5 min read",
                                },
                                body: [],
                                features: [],
                                tips: [],
                              },
                            })
                          }
                          type="button"
                          disabled={loading}
                          className="bg-lime-500 hover:bg-lime-600 text-white flex items-center gap-2"
                        >
                          <FiPlus className="w-4 h-4" /> Add Article
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {currentPageArticles.map(
                        (article: Article, index: number) => {
                          const actualIndex = indexOfFirstArticle + index;
                          return (
                            <div
                              key={article.id ?? actualIndex}
                              className="animate-[scaleIn_0.2s_ease-out] hover:-translate-y-1 transition-transform"
                            >
                              <Card className="p-5 bg-lime-50 dark:bg-slate-700 border-lime-200 dark:border-slate-600 overflow-hidden">
                                <div className="flex flex-row items-center justify-between p-4 -mx-5 -mt-5 mb-5 bg-lime-100 dark:bg-slate-600">
                                  <div className="flex items-center">
                                    <Badge
                                      variant="secondary"
                                      className="bg-lime-500 text-white"
                                    >
                                      Article {actualIndex + 1}
                                    </Badge>
                                  </div>
                                  <div className="hover:scale-110 active:scale-90 transition-transform">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        removeArrayItem("articles", actualIndex)
                                      }
                                      type="button"
                                      className="text-red-50 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <FiX className="w-4 h-4" />
                                    </Button>
                                  </div>
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
                                        <div className="hover:scale-[1.02] active:scale-[0.98] transition-transform inline-block">
                                          <Button
                                            variant="outline"
                                            disabled={uploading}
                                            type="button"
                                            className="w-full md:w-auto flex items-center gap-2 border-lime-300 text-lime-700 hover:bg-lime-50"
                                          >
                                            {uploading ? (
                                              <FiLoader className="w-4 h-4 animate-spin" />
                                            ) : (
                                              <FiUpload className="w-4 h-4" />
                                            )}
                                            {uploading
                                              ? "Uploading..."
                                              : "Upload Image"}
                                          </Button>
                                        </div>
                                        <Input
                                          type="file"
                                          className="absolute inset-0 opacity-0 cursor-pointer"
                                          accept="image/*"
                                          onChange={(e) =>
                                            handleFileUpload(
                                              e,
                                              `articles.${actualIndex}.imageUrl`,
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
                                            `articles.${actualIndex}.title`,
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
                                            `articles.${actualIndex}.author`,
                                            e.target.value
                                          )
                                        }
                                        className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                      />
                                    </div>
                                    <div>
                                      <Label>Author Bio</Label>
                                      <Input
                                        value={article.authorBio || ""}
                                        onChange={(e) =>
                                          handleInputChange(
                                            `articles.${actualIndex}.authorBio`,
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
                                            `articles.${actualIndex}.category`,
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
                                      <Label className="flex items-center gap-2">
                                        <FiCalendar className="w-4 h-4" /> Date
                                      </Label>
                                      <div className="relative mt-1">
                                        <Input
                                          type="date"
                                          value={formatDateForInput(article.date)}
                                          onChange={(e) => {
                                            const formattedDate = formatDateDisplay(e.target.value);
                                            handleInputChange(
                                              `articles.${actualIndex}.date`,
                                              formattedDate
                                            );
                                          }}
                                          className="mt-1 focus:ring-lime-500 focus:border-lime-500 pl-10"
                                        />
                                        <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mt-4">
                                    <Label>Description</Label>
                                    <Textarea
                                      value={article.description}
                                      onChange={(e) =>
                                        handleInputChange(
                                          `articles.${actualIndex}.description`,
                                          e.target.value
                                        )
                                      }
                                      rows={3}
                                      className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                    />
                                  </div>

                                  {/* Article Content Section */}
                                  <div className="mt-6 border-t border-lime-200 pt-4">
                                    <h4 className="text-md font-medium text-lime-800 mb-4">
                                      Article Content Details
                                    </h4>

                                    {/* Content Hero */}
                                    <div className="mb-4">
                                      <Label className="text-lime-700">Content Hero Title</Label>
                                      <Input
                                        value={article.content?.hero?.title || ""}
                                        onChange={(e) =>
                                          handleInputChange(
                                            `articles.${actualIndex}.content.hero.title`,
                                            e.target.value
                                          )
                                        }
                                        className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                        placeholder="Enter content hero title"
                                      />
                                    </div>

                                    <div className="mb-4">
                                      <Label className="text-lime-700">Content Hero Subtitle</Label>
                                      <Input
                                        value={article.content?.hero?.subtitle || ""}
                                        onChange={(e) =>
                                          handleInputChange(
                                            `articles.${actualIndex}.content.hero.subtitle`,
                                            e.target.value
                                          )
                                        }
                                        className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                        placeholder="Enter content hero subtitle"
                                      />
                                    </div>

                                    {/* Content Hero Image */}
                                    <div className="mb-4">
                                      <Label className="text-lime-700">Content Hero Image</Label>
                                      <div className="flex items-center gap-4 mt-1">
                                        <div className="w-20 h-20 border-2 border-dashed border-lime-300 rounded-lg flex items-center justify-center overflow-hidden bg-lime-50 dark:bg-slate-700">
                                          {article.content?.hero?.imageUrl ? (
                                            <Image
                                              src={article.content.hero.imageUrl}
                                              alt="Content hero preview"
                                              width={80}
                                              height={80}
                                              className="object-cover w-full h-full"
                                            />
                                          ) : (
                                            <FiImage className="text-lime-400 text-xl" />
                                          )}
                                        </div>
                                        <div className="relative">
                                          <div className="hover:scale-[1.02] active:scale-[0.98] transition-transform inline-block">
                                            <Button
                                              variant="outline"
                                              disabled={uploading}
                                              type="button"
                                              className="border-lime-300 text-lime-700 hover:bg-lime-50"
                                            >
                                              {uploading ? "Uploading..." : "Upload Image"}
                                            </Button>
                                          </div>
                                          <Input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            accept="image/*"
                                            onChange={(e) =>
                                              handleFileUpload(
                                                e,
                                                `articles.${actualIndex}.content.hero.imageUrl`,
                                                "articles",
                                                `${generateSlug(article.title)}/hero`
                                              )
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    {/* Meta Read Time */}
                                    <div className="mb-4">
                                      <Label className="text-lime-700">Read Time</Label>
                                      <Input
                                        value={article.content?.meta?.readTime || ""}
                                        onChange={(e) =>
                                          handleInputChange(
                                            `articles.${actualIndex}.content.meta.readTime`,
                                            e.target.value
                                          )
                                        }
                                        className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                        placeholder="e.g., 5 min read"
                                      />
                                    </div>

                                    {/* Body/Content Blocks */}
                                    <div className="mb-4">
                                      <Label className="text-lime-700">Body Content Blocks</Label>
                                      {(article.content?.body || []).map((block, bIndex) => {
                                        // Calculate which set this block belongs to
                                        let setNumber = 0;
                                        let isInSet = false;
                                        if (block.blockSetId) {
                                          // Count how many unique blockSetIds appear before this block
                                          const seenSets = new Set<string>();
                                          for (let i = 0; i <= bIndex; i++) {
                                            const b = (article.content?.body || [])[i];
                                            if (b.blockSetId) {
                                              seenSets.add(b.blockSetId);
                                            }
                                          }
                                          setNumber = seenSets.size;
                                          isInSet = true;
                                        }

                                        return (
                                          <Card key={bIndex} className={cn(
                                            "p-3 mt-2 bg-white dark:bg-slate-600 border-lime-200",
                                            isInSet && "border-lime-500 border-2"
                                          )}>
                                            <div className="flex justify-between items-center mb-2">
                                              <div className="flex items-center gap-1">
                                                {isInSet && (
                                                  <Badge className="bg-lime-600 text-white text-xs mr-1">
                                                    Set {setNumber}
                                                  </Badge>
                                                )}
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  type="button"
                                                  disabled={bIndex === 0}
                                                  onClick={() => moveBlockUp(actualIndex, bIndex)}
                                                  className={cn(
                                                    "text-lime-600 hover:text-lime-800 hover:bg-lime-50 p-1 h-7 w-7",
                                                    bIndex === 0 && "opacity-30 cursor-not-allowed"
                                                  )}
                                                  title="Move up"
                                                >
                                                  <FiChevronUp className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  type="button"
                                                  disabled={bIndex === (article.content?.body || []).length - 1}
                                                  onClick={() => moveBlockDown(actualIndex, bIndex)}
                                                  className={cn(
                                                    "text-lime-600 hover:text-lime-800 hover:bg-lime-50 p-1 h-7 w-7",
                                                    bIndex === (article.content?.body || []).length - 1 && "opacity-30 cursor-not-allowed"
                                                  )}
                                                  title="Move down"
                                                >
                                                  <FiChevronDown className="w-4 h-4" />
                                                </Button>
                                                <select
                                                  value={block.type}
                                                  onChange={(e) => {
                                                    const newBody = [...(article.content?.body || [])];
                                                    newBody[bIndex] = { ...newBody[bIndex], type: e.target.value as "paragraph" | "image" | "heading" | "list" | "quote" };
                                                    handleInputChange(
                                                      `articles.${actualIndex}.content.body`,
                                                      newBody
                                                    );
                                                  }}
                                                  className="flex h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ml-2"
                                                >
                                                  <option value="paragraph">Paragraph</option>
                                                  <option value="heading">Heading</option>
                                                  <option value="image">Image</option>
                                                  <option value="list">List</option>
                                                  <option value="quote">Quote</option>
                                                </select>
                                              </div>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                type="button"
                                                onClick={() => {
                                                  const newBody = (article.content?.body || []).filter((_, i) => i !== bIndex);
                                                  handleInputChange(
                                                    `articles.${actualIndex}.content.body`,
                                                    newBody
                                                  );
                                                }}
                                                className="text-red-500 hover:text-red-700"
                                              >
                                                <FiX className="w-4 h-4" />
                                              </Button>
                                            </div>

                                            {/* Title field */}
                                            {(block.type === "heading" || block.type === "quote") && (
                                              <Input
                                                value={block.title || ""}
                                                onChange={(e) => {
                                                  const newBody = [...(article.content?.body || [])];
                                                  newBody[bIndex] = { ...newBody[bIndex], title: e.target.value };
                                                  handleInputChange(
                                                    `articles.${actualIndex}.content.body`,
                                                    newBody
                                                  );
                                                }}
                                                className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                                placeholder={block.type === "heading" ? "Heading text" : "Quote text"}
                                              />
                                            )}

                                            {/* Text field */}
                                            {(block.type === "paragraph" || block.type === "heading") && (
                                              <Textarea
                                                value={block.text || ""}
                                                onChange={(e) => {
                                                  const newBody = [...(article.content?.body || [])];
                                                  newBody[bIndex] = { ...newBody[bIndex], text: e.target.value };
                                                  handleInputChange(
                                                    `articles.${actualIndex}.content.body`,
                                                    newBody
                                                  );
                                                }}
                                                className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                                placeholder="Enter text content"
                                                rows={2}
                                              />
                                            )}

                                            {/* Image Upload field */}
                                            {block.type === "image" && (
                                              <div className="space-y-2">
                                                <div className="flex items-center gap-4">
                                                  <div className="w-24 h-24 border-2 border-dashed border-lime-300 rounded-lg flex items-center justify-center overflow-hidden bg-lime-50 dark:bg-slate-700">
                                                    {block.url ? (
                                                      <Image
                                                        src={block.url}
                                                        alt="Block image preview"
                                                        width={96}
                                                        height={96}
                                                        className="object-cover w-full h-full"
                                                      />
                                                    ) : (
                                                      <FiImage className="text-lime-400 text-2xl" />
                                                    )}
                                                  </div>
                                                  <div className="relative">
                                                    <div className="hover:scale-[1.02] active:scale-[0.98] transition-transform inline-block">
                                                      <Button
                                                        variant="outline"
                                                        disabled={uploading}
                                                        type="button"
                                                        className="border-lime-300 text-lime-700 hover:bg-lime-50"
                                                      >
                                                        {uploading ? "Uploading..." : "Upload Image"}
                                                      </Button>
                                                    </div>
                                                    <Input
                                                      type="file"
                                                      className="absolute inset-0 opacity-0 cursor-pointer"
                                                      accept="image/*"
                                                      onChange={(e) => {
                                                        if (!e.target.files?.[0]) return;
                                                        const file = e.target.files[0];
                                                        e.target.value = "";

                                                        const uploadImage = async () => {
                                                          setUploading(true);
                                                          try {
                                                            const fileUrl = await uploadFile(
                                                              file,
                                                              "articles",
                                                              `${generateSlug(article.title)}/body/${bIndex}`
                                                            );

                                                            if (fileUrl) {
                                                              const newBody = [...(article.content?.body || [])];
                                                              newBody[bIndex] = { ...newBody[bIndex], url: fileUrl };
                                                              handleInputChange(
                                                                `articles.${actualIndex}.content.body`,
                                                                newBody
                                                              );
                                                            }
                                                          } catch (error) {
                                                            console.error("Upload failed:", error);
                                                          } finally {
                                                            setUploading(false);
                                                          }
                                                        };

                                                        uploadImage();
                                                      }}
                                                    />
                                                  </div>
                                                </div>
                                                <Input
                                                  value={block.caption || ""}
                                                  onChange={(e) => {
                                                    const newBody = [...(article.content?.body || [])];
                                                    newBody[bIndex] = { ...newBody[bIndex], caption: e.target.value };
                                                    handleInputChange(
                                                      `articles.${actualIndex}.content.body`,
                                                      newBody
                                                    );
                                                  }}
                                                  className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                                  placeholder="Image caption"
                                                />
                                              </div>
                                            )}

                                            {/* List items field */}
                                            {block.type === "list" && (
                                              <div className="mt-1">
                                                {(block.items || []).map((item, iIndex) => (
                                                  <div key={iIndex} className="flex items-center gap-2 mt-1">
                                                    <Input
                                                      value={item}
                                                      onChange={(e) => {
                                                        const newBody = [...(article.content?.body || [])];
                                                        const newItems = [...(newBody[bIndex].items || [])];
                                                        newItems[iIndex] = e.target.value;
                                                        newBody[bIndex] = { ...newBody[bIndex], items: newItems };
                                                        handleInputChange(
                                                          `articles.${actualIndex}.content.body`,
                                                          newBody
                                                        );
                                                      }}
                                                      className="flex-1 focus:ring-lime-500 focus:border-lime-500"
                                                      placeholder={`List item ${iIndex + 1}`}
                                                    />
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      type="button"
                                                      onClick={() => {
                                                        const newBody = [...(article.content?.body || [])];
                                                        const newItems = (newBody[bIndex].items || []).filter((_, i) => i !== iIndex);
                                                        newBody[bIndex] = { ...newBody[bIndex], items: newItems };
                                                        handleInputChange(
                                                          `articles.${actualIndex}.content.body`,
                                                          newBody
                                                        );
                                                      }}
                                                      className="text-red-500 hover:text-red-700"
                                                    >
                                                      <FiX className="w-4 h-4" />
                                                    </Button>
                                                  </div>
                                                ))}
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  type="button"
                                                  onClick={() => {
                                                    const newBody = [...(article.content?.body || [])];
                                                    const newItems = [...(newBody[bIndex].items || []), ""];
                                                    newBody[bIndex] = { ...newBody[bIndex], items: newItems };
                                                    handleInputChange(
                                                      `articles.${actualIndex}.content.body`,
                                                      newBody
                                                    );
                                                  }}
                                                  className="mt-2 border-lime-300 text-lime-700 hover:bg-lime-50"
                                                >
                                                  <FiPlus className="w-3 h-3 mr-1" /> Add Item
                                                </Button>
                                              </div>
                                            )}

                                            {/* Quote text field */}
                                            {block.type === "quote" && (
                                              <Textarea
                                                value={block.text || ""}
                                                onChange={(e) => {
                                                  const newBody = [...(article.content?.body || [])];
                                                  newBody[bIndex] = { ...newBody[bIndex], text: e.target.value };
                                                  handleInputChange(
                                                    `articles.${actualIndex}.content.body`,
                                                    newBody
                                                  );
                                                }}
                                                className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                                placeholder="Quote text"
                                                rows={2}
                                              />
                                            )}
                                          </Card>)
                                      })}
                                      <div className="flex gap-2 mt-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          type="button"
                                          onClick={() => {
                                            // Add single paragraph block
                                            const newBlock = { type: "paragraph" as const, text: "" };
                                            const newBody = [...(article.content?.body || []), newBlock];
                                            handleInputChange(
                                              `articles.${actualIndex}.content.body`,
                                              newBody
                                            );
                                          }}
                                          className="border-lime-300 text-lime-700 hover:bg-lime-50"
                                        >
                                          <FiPlus className="w-4 h-4 mr-1" /> Add Block
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          type="button"
                                          onClick={() => {
                                            // Generate a unique blockSetId to group these blocks together
                                            const blockSetId = nanoid();

                                            // Add blocks in the desired order: Image, Heading, Paragraph, List, Quote
                                            const newBlocks = [
                                              { type: "image" as const, url: "", caption: "", blockSetId },
                                              { type: "heading" as const, title: "", text: "", blockSetId },
                                              { type: "paragraph" as const, text: "", blockSetId },
                                              { type: "list" as const, items: [""], blockSetId },
                                              { type: "quote" as const, title: "", text: "", blockSetId },
                                            ];
                                            const newBody = [...(article.content?.body || []), ...newBlocks];
                                            handleInputChange(
                                              `articles.${actualIndex}.content.body`,
                                              newBody
                                            );
                                          }}
                                          className="border-lime-500 text-lime-700 hover:bg-lime-50 font-medium"
                                        >
                                          <FiPlus className="w-4 h-4 mr-1" /> Add Block Set
                                        </Button>
                                      </div>
                                    </div>

                                    {/* Features */}
                                    <div className="mb-4">
                                      <Label className="text-lime-700">Features</Label>
                                      {(article.content?.features || []).map((feature, fIndex) => (
                                        <div key={fIndex} className="flex items-center gap-2 mt-1">
                                          <Input
                                            value={feature}
                                            onChange={(e) => {
                                              const newFeatures = [...(article.content?.features || [])];
                                              newFeatures[fIndex] = e.target.value;
                                              handleInputChange(
                                                `articles.${actualIndex}.content.features`,
                                                newFeatures
                                              );
                                            }}
                                            className="flex-1 focus:ring-lime-500 focus:border-lime-500"
                                            placeholder={`Feature ${fIndex + 1}`}
                                          />
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            type="button"
                                            onClick={() => {
                                              const newFeatures = (article.content?.features || []).filter((_, i) => i !== fIndex);
                                              handleInputChange(
                                                `articles.${actualIndex}.content.features`,
                                                newFeatures
                                              );
                                            }}
                                            className="text-red-500 hover:text-red-700"
                                          >
                                            <FiX className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      ))}
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        type="button"
                                        onClick={() => {
                                          const newFeatures = [...(article.content?.features || []), ""];
                                          handleInputChange(
                                            `articles.${actualIndex}.content.features`,
                                            newFeatures
                                          );
                                        }}
                                        className="mt-2 border-lime-300 text-lime-700 hover:bg-lime-50"
                                      >
                                        <FiPlus className="w-4 h-4 mr-1" /> Add Feature
                                      </Button>
                                    </div>

                                    {/* Tips */}
                                    <div className="mb-4">
                                      <Label className="text-lime-700">Tips</Label>
                                      {(article.content?.tips || []).map((tip, tIndex) => (
                                        <div key={tIndex} className="flex items-center gap-2 mt-1">
                                          <Input
                                            value={tip}
                                            onChange={(e) => {
                                              const newTips = [...(article.content?.tips || [])];
                                              newTips[tIndex] = e.target.value;
                                              handleInputChange(
                                                `articles.${actualIndex}.content.tips`,
                                                newTips
                                              );
                                            }}
                                            className="flex-1 focus:ring-lime-500 focus:border-lime-500"
                                            placeholder={`Tip ${tIndex + 1}`}
                                          />
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            type="button"
                                            onClick={() => {
                                              const newTips = (article.content?.tips || []).filter((_, i) => i !== tIndex);
                                              handleInputChange(
                                                `articles.${actualIndex}.content.tips`,
                                                newTips
                                              );
                                            }}
                                            className="text-red-500 hover:text-red-700"
                                          >
                                            <FiX className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      ))}
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        type="button"
                                        onClick={() => {
                                          const newTips = [...(article.content?.tips || []), ""];
                                          handleInputChange(
                                            `articles.${actualIndex}.content.tips`,
                                            newTips
                                          );
                                        }}
                                        className="mt-2 border-lime-300 text-lime-700 hover:bg-lime-50"
                                      >
                                        <FiPlus className="w-4 h-4 mr-1" /> Add Tip
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )
                        }
                      )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-8">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="border-lime-300 text-lime-700 hover:bg-lime-50"
                        >
                          Previous
                        </Button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            type="button"
                            variant={currentPage === page ? "default" : "outline"}
                            onClick={() => setCurrentPage(page)}
                            className={cn(
                              "w-10 h-10",
                              currentPage === page
                                ? "bg-lime-600 text-white"
                                : "border-lime-300 text-lime-700 hover:bg-lime-50"
                            )}
                          >
                            {page}
                          </Button>
                        ))}

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="border-lime-300 text-lime-700 hover:bg-lime-50"
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Newsletter Tab */}
            <TabsContent value="newsletter" className="mt-4">
              <div className="animate-[fadeIn_0.3s_ease-out]">
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
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </form>
  );
};

export default BlogAdminDashboard;
