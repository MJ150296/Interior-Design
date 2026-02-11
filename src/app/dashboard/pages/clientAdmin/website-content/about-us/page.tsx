"use client";
import React, { useCallback, useEffect, useState } from "react";
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
// import DashboardLayoutClient from "@/app/dashboard/client_side_layout/ClientSideDashboardLayout";
import { useAppDispatch, useAppSelector } from "@/app/redux/store/hooks";
import {
  fetchAboutContent,
  selectAboutContent,
  selectAboutError,
  selectAboutLoading,
  updateAboutContent,
} from "@/app/redux/slices/aboutUsPageSlice";
import type { AboutContent } from "@/app/types/content/about";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const defaultValues: AboutContent = {
  hero: {
    upperTitle: "A FEW WORDS ABOUT",
    title: "Our Firm",
    subtitle: "Award Winning Interior Design Firm in UTTARAKHAND",
    backgroundImageUrl: "/Riddhi Interior Design/About/cover.jpg",
  },
  stats: [
    { value: "12+", label: "Years Experience" },
    { value: "250+", label: "Projects Completed" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "25+", label: "Awards Received" },
  ],
  story: {
    title: "Our Story",
    subtitle: "Transforming Spaces with Elegance & Style",
    content: "At Riddhi Interiors, we believe every space tells a story...",
    content2: "At Riddhi Interiors, we believe every space tells a story...",
    quote: "Your trusted interior design partner in Dehradun...",
    imageUrl: "/Riddhi Interior Design/About/story.jpg",
    cities: "Dehradun, Mussoorie, Haridwar, Rishikesh, Roorkee",
  },
  coreValues: [
    {
      title: "Innovation",
      description:
        "We embrace new ideas and technologies to create unique spaces",
      icon: "💡",
    },
    {
      title: "Excellence",
      description: "We pursue perfection in every detail of our work",
      icon: "⭐",
    },
    {
      title: "Integrity",
      description: "We build relationships based on trust and transparency",
      icon: "🤝",
    },
    {
      title: "Sustainability",
      description: "We prioritize eco-friendly materials and practices",
      icon: "🌿",
    },
  ],
  teamMembers: [
    {
      name: "Riddhi Sharma",
      title: "Founder & Principal Designer",
      bio: "With over 15 years of experience in interior design...",
      imageUrl: "/Riddhi Interior Design/owner.jpg",
      tags: ["Residential Design", "Space Planning", "Color Theory"],
    },
    {
      name: "Aarav Mehta",
      title: "Interior Architect",
      bio: "Aarav combines structural knowledge with aesthetic sensibility...",
      imageUrl: "/Riddhi Interior Design/owner.jpg",
      tags: ["Architectural Design", "3D Modeling", "Project Management"],
    },
    {
      name: "Simran Kaur",
      title: "3D Visualizer & Designer",
      bio: "Simran transforms concepts into photorealistic visualizations...",
      imageUrl: "/Riddhi Interior Design/owner.jpg",
      tags: ["3D Rendering", "Material Selection", "Lighting Design"],
    },
  ],
  connect: {
    socialLinks: [
      { platform: "Instagram", imageURL: "", url: "https://instagram.com" },
      { platform: "Facebook", imageURL: "", url: "https://facebook.com" },
      { platform: "Twitter", imageURL: "", url: "https://twitter.com" },
      { platform: "LinkedIn", imageURL: "", url: "https://linkedin.com" },
    ],
    address: "Tilak Road, Dehradun, Uttarakhand 248001",
    hours: "Open Monday-Saturday: 9AM - 7PM",
    phone: "+91 78959 27366",
  },
};

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

const AboutAdminDashboard = () => {
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<AboutContent>(defaultValues);
  const [isSaving, setIsSaving] = useState(false);
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());

  const dispatch = useAppDispatch();
  const reduxContent = useAppSelector(selectAboutContent);
  const loading = useAppSelector(selectAboutLoading);
  const error = useAppSelector(selectAboutError);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchAboutContent());
  }, [dispatch]);

  // Update form when Redux data changes
  useEffect(() => {
    if (reduxContent) {
      setFormData(reduxContent);
      setChangedFields(new Set()); // Reset changed fields when data is loaded
    }
  }, [reduxContent]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  // Add this helper function to generate team member name slugs for cloudinary
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  };

  const handleInputChange = (path: string, value: string) => {
    if (!formData) return;

    setFormData((prev) => {
      if (!prev) return prev;

      const newData: AboutContent = JSON.parse(JSON.stringify(prev));
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
    setFormData((prev) => {
      const newData: AboutContent = JSON.parse(JSON.stringify(prev));
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

  const removeArrayItem = async (arrayPath: string, index: number) => {
    if (!formData) return;

    setFormData((prev) => {
      if (!prev) return prev;

      const newData: AboutContent = JSON.parse(JSON.stringify(prev));
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
        else if ("imageURL" in item) imageUrl = item.imageURL as string;
        else if ("backgroundImageUrl" in item)
          imageUrl = item.backgroundImageUrl as string;
      }

      // Delete from Cloudinary if valid URL - use team member name for folder
      if (imageUrl && imageUrl.includes("res.cloudinary.com")) {
        let folderPath = "";

        // Handle team member deletion differently
        if (
          arrayPath === "teamMembers" &&
          typeof item === "object" &&
          item !== null &&
          "name" in item
        ) {
          const slug = generateSlug(item.name as string);
          folderPath = `riddhi_interiors/aboutUs/team/${slug}`;
        } else {
          // For other items, use the existing logic
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

  // Add new tag to team member
  const addTagToTeamMember = (index: number) => {
    setFormData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      if (newData.teamMembers[index]) {
        newData.teamMembers[index].tags.push("");

        // Track changed field
        setChangedFields(
          (prevFields) => new Set(prevFields.add(`teamMembers.${index}.tags`))
        );
      }
      return newData;
    });
  };

  // Remove tag from team member
  const removeTagFromTeamMember = (memberIndex: number, tagIndex: number) => {
    setFormData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      if (newData.teamMembers[memberIndex]) {
        newData.teamMembers[memberIndex].tags.splice(tagIndex, 1);

        // Track changed field
        setChangedFields(
          (prevFields) =>
            new Set(prevFields.add(`teamMembers.${memberIndex}.tags`))
        );
      }
      return newData;
    });
  };

  // Save form data to backend
  const saveFormData = useCallback(
    async (dataToSave?: AboutContent) => {
      setIsSaving(true);
      try {
        await dispatch(updateAboutContent(dataToSave || formData)).unwrap();
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
        ? `riddhi_interiors/aboutUs/${section}/${customFolder}`
        : `riddhi_interiors/aboutUs/${section}`;

      formData.append("folderPath", folderPath);

      // Rest of your existing upload logic...
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
      alert(
        `Upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      return "";
    } finally {
      setUploading(false);
    }
  };

  // Update the handleFileUpload for team members
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldPath: string,
    section: string,
    teamMemberName?: string
  ) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    e.target.value = "";

    setUploading(true);

    try {
      // Generate folder name from team member name if provided
      const folderName = teamMemberName
        ? generateSlug(teamMemberName)
        : undefined;
      const fileUrl = await uploadFile(file, section, folderName);

      if (fileUrl) {
        // Update form data and save as before
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

  // Tab navigation items
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
                  About Us Page Content Management
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage your website&apos;s About Us page content
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
            {error && (
              <motion.div
                className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <FiX className="mr-2" /> {error}
              </motion.div>
            )}

            {previewMode ? (
              <Card className="overflow-hidden">
                <CardHeader className="bg-lime-50 dark:bg-slate-700">
                  <CardTitle className="flex items-center gap-2">
                    <FiEye className="w-5 h-5" /> Preview Mode
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="border-2 border-dashed rounded-xl w-full h-[600px] flex items-center justify-center text-gray-500 bg-gray-50 dark:bg-slate-900">
                    <div className="text-center">
                      <FiLayout className="text-4xl mx-auto mb-3" />
                      <p>About Us page preview will appear here</p>
                      <p className="text-sm mt-2 text-gray-400">
                        Note: Actual content will be rendered based on your
                        current edits
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Tabs value={activeTab} className="w-full">
                {/* Hero Tab */}
                <TabsContent value="hero" className="mt-4">
                  <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                  >
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
                            <Label>Upper Title</Label>
                            <Input
                              value={formData.hero.upperTitle || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "hero.upperTitle",
                                  e.target.value
                                )
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
                                handleInputChange(
                                  "hero.subtitle",
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

                {/* Stats Tab */}
                <TabsContent value="stats" className="mt-4">
                  <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                  >
                    <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 overflow-hidden">
                      <CardHeader className="bg-lime-50 dark:bg-slate-700">
                        <CardTitle className="text-lime-900 dark:text-lime-100 p-3">
                          Statistics Section
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <motion.div
                          className="grid grid-cols-1 md:grid-cols-2 gap-4"
                          variants={staggerChildren}
                          initial="hidden"
                          animate="visible"
                        >
                          {formData.stats.map((item, index) => (
                            <motion.div
                              key={index}
                              variants={scaleIn}
                              whileHover={{ y: -5 }}
                            >
                              <Card className="p-4 bg-lime-50 dark:bg-slate-700 border-lime-200 dark:border-slate-600 relative overflow-hidden">
                                <div className="flex justify-between items-center mb-4">
                                  <Badge
                                    variant="secondary"
                                    className="bg-lime-500 text-white"
                                  >
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
                                    value={item.value || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        `stats.${index}.value`,
                                        e.target.value
                                      )
                                    }
                                    className="mt-1 font-bold text-lg focus:ring-lime-500 focus:border-lime-500"
                                  />
                                </div>
                                <div>
                                  <Label>Label</Label>
                                  <Input
                                    value={item.label || ""}
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

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            onClick={() =>
                              addArrayItem("stats", {
                                value: "",
                                label: "",
                              })
                            }
                            variant="outline"
                            className="mt-6 w-full border-lime-300 text-lime-700 hover:bg-lime-50 flex items-center justify-center gap-2"
                            type="button"
                          >
                            <FiPlus className="w-4 h-4" /> Add New Statistic
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* Story Tab */}
                <TabsContent value="story" className="mt-4">
                  <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                  >
                    <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 overflow-hidden">
                      <CardHeader className="bg-lime-50 dark:bg-slate-700">
                        <CardTitle className="text-lime-900 dark:text-lime-100 p-3">
                          Our Story Section
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <Label>Title</Label>
                            <Input
                              value={formData.story.title || ""}
                              onChange={(e) =>
                                handleInputChange("story.title", e.target.value)
                              }
                              className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                            />
                          </div>

                          <div>
                            <Label>Subtitle</Label>
                            <Input
                              value={formData.story.subtitle || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "story.subtitle",
                                  e.target.value
                                )
                              }
                              className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                            />
                          </div>

                          <div>
                            <Label>Content</Label>
                            <Textarea
                              value={formData.story.content || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "story.content",
                                  e.target.value
                                )
                              }
                              rows={6}
                              className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                            />
                          </div>
                          <div>
                            <Label>Content 2</Label>
                            <Textarea
                              value={formData.story.content2 || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "story.content2",
                                  e.target.value
                                )
                              }
                              rows={6}
                              className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                            />
                          </div>

                          <div>
                            <Label>Cities Served</Label>
                            <Input
                              value={formData.story.cities || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "story.cities",
                                  e.target.value
                                )
                              }
                              placeholder="Comma separated list"
                              className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                            />
                          </div>

                          <div>
                            <Label>Quote</Label>
                            <Textarea
                              value={formData.story.quote || ""}
                              onChange={(e) =>
                                handleInputChange("story.quote", e.target.value)
                              }
                              rows={3}
                              className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                            />
                          </div>

                          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                            <div className="w-32 h-32 border-2 border-dashed border-lime-300 rounded-lg flex items-center justify-center overflow-hidden bg-lime-50 dark:bg-slate-700">
                              {formData.story.imageUrl ? (
                                <Image
                                  src={formData.story.imageUrl}
                                  alt="Story image preview"
                                  width={128}
                                  height={128}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <FiImage className="text-lime-400 text-2xl" />
                              )}
                            </div>
                            <div className="flex-1">
                              <Label>Story Image</Label>
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
                                      "story.imageUrl",
                                      "story"
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* Core Values Tab */}
                <TabsContent value="values" className="mt-4">
                  <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                  >
                    <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 overflow-hidden">
                      <CardHeader className="bg-lime-50 dark:bg-slate-700">
                        <CardTitle className="text-lime-900 dark:text-lime-100 p-3">
                          Core Values Section
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <motion.div
                          className="grid grid-cols-1 md:grid-cols-2 gap-4"
                          variants={staggerChildren}
                          initial="hidden"
                          animate="visible"
                        >
                          {formData.coreValues.map((item, index) => (
                            <motion.div
                              key={index}
                              variants={scaleIn}
                              whileHover={{ y: -5 }}
                            >
                              <Card className="p-4 bg-lime-50 dark:bg-slate-700 border-lime-200 dark:border-slate-600">
                                <div className="flex justify-between items-center mb-4">
                                  <Badge
                                    variant="secondary"
                                    className="bg-lime-500 text-white"
                                  >
                                    Value {index + 1}
                                  </Badge>
                                  <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        removeArrayItem("coreValues", index)
                                      }
                                      type="button"
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <FiX className="w-4 h-4" />
                                    </Button>
                                  </motion.div>
                                </div>
                                <div className="mb-4">
                                  <Label>Title</Label>
                                  <Input
                                    value={item.title || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        `coreValues.${index}.title`,
                                        e.target.value
                                      )
                                    }
                                    className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                  />
                                </div>
                                <div className="mb-4">
                                  <Label>Description</Label>
                                  <Textarea
                                    value={item.description || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        `coreValues.${index}.description`,
                                        e.target.value
                                      )
                                    }
                                    rows={3}
                                    className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                  />
                                </div>
                                <div>
                                  <Label>Icon (Emoji)</Label>
                                  <Input
                                    value={item.icon || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        `coreValues.${index}.icon`,
                                        e.target.value
                                      )
                                    }
                                    placeholder="e.g., 💡"
                                    className="mt-1 focus:ring-lime-500 focus:border-lime-500 text-2xl h-12"
                                  />
                                </div>
                              </Card>
                            </motion.div>
                          ))}
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              className="h-full flex flex-col items-center justify-center border-2 border-dashed bg-white border-lime-300 p-8 text-lime-700 hover:bg-lime-50"
                              onClick={() =>
                                addArrayItem("coreValues", {
                                  title: "",
                                  description: "",
                                  icon: "",
                                })
                              }
                              type="button"
                            >
                              <FiPlus className="text-2xl mb-2" />
                              <p>Add New Value</p>
                            </Button>
                          </motion.div>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* Team Tab */}
                <TabsContent value="team" className="mt-4">
                  <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                  >
                    <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 overflow-hidden">
                      <CardHeader className="bg-lime-50 dark:bg-slate-700">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lime-900 dark:text-lime-100 p-3">
                            Team Members
                          </CardTitle>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              onClick={() =>
                                addArrayItem("teamMembers", {
                                  name: "New Team Member",
                                  title: "",
                                  bio: "",
                                  imageUrl: "",
                                  tags: [],
                                })
                              }
                              type="button"
                              className="bg-lime-500 hover:bg-lime-600 text-white flex items-center gap-2"
                            >
                              <FiPlus className="w-4 h-4" /> Add Team Member
                            </Button>
                          </motion.div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <motion.div
                          className="space-y-6"
                          variants={staggerChildren}
                          initial="hidden"
                          animate="visible"
                        >
                          {formData.teamMembers.map((member, index) => (
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
                                      Member {index + 1}
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
                                        removeArrayItem("teamMembers", index)
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
                                      {member.imageUrl ? (
                                        <Image
                                          src={
                                            member?.imageUrl ||
                                            "/Riddhi Interior Design/Logo.png"
                                          }
                                          alt="Team member preview"
                                          width={96}
                                          height={96}
                                          className="object-cover w-full h-full"
                                        />
                                      ) : (
                                        <FiImage className="text-lime-400 text-2xl" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <Label>Profile Image</Label>
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
                                              `teamMembers.${index}.imageUrl`,
                                              "team",
                                              member.name || `team-${index}`
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mb-4">
                                    <Label>Name</Label>
                                    <Input
                                      value={member.name || ""}
                                      onChange={(e) =>
                                        handleInputChange(
                                          `teamMembers.${index}.name`,
                                          e.target.value
                                        )
                                      }
                                      className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                    />
                                  </div>

                                  <div className="mb-4">
                                    <Label>Title</Label>
                                    <Input
                                      value={member.title || ""}
                                      onChange={(e) =>
                                        handleInputChange(
                                          `teamMembers.${index}.title`,
                                          e.target.value
                                        )
                                      }
                                      className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                    />
                                  </div>

                                  <div className="mb-4">
                                    <Label>Bio</Label>
                                    <Textarea
                                      value={member.bio || ""}
                                      onChange={(e) =>
                                        handleInputChange(
                                          `teamMembers.${index}.bio`,
                                          e.target.value
                                        )
                                      }
                                      rows={4}
                                      className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                    />
                                  </div>

                                  <div className="mb-4">
                                    <Label>Tags/Skills</Label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {member.tags.map((tag, tagIndex) => (
                                        <motion.div
                                          key={tagIndex}
                                          className="flex items-center bg-lime-100 dark:bg-slate-600 px-3 py-1 rounded-full"
                                          whileHover={{ scale: 1.05 }}
                                        >
                                          <Input
                                            value={tag || ""}
                                            onChange={(e) =>
                                              handleInputChange(
                                                `teamMembers.${index}.tags.${tagIndex}`,
                                                e.target.value
                                              )
                                            }
                                            className="bg-transparent border-none p-0 w-32 focus:ring-0 focus:outline-none"
                                          />
                                          <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                          >
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-0 h-5 w-5"
                                              onClick={() =>
                                                removeTagFromTeamMember(
                                                  index,
                                                  tagIndex
                                                )
                                              }
                                              type="button"
                                            >
                                              <FiMinus className="w-3 h-3" />
                                            </Button>
                                          </motion.div>
                                        </motion.div>
                                      ))}
                                      <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                      >
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                            addTagToTeamMember(index)
                                          }
                                          type="button"
                                          className="border-lime-300 text-lime-700 hover:bg-lime-50 flex items-center gap-1"
                                        >
                                          <FiPlus className="w-3 h-3" /> Add Tag
                                        </Button>
                                      </motion.div>
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

                {/* Connect Tab */}
                <TabsContent value="connect" className="mt-4">
                  <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                  >
                    <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 overflow-hidden">
                      <CardHeader className="bg-lime-50 dark:bg-slate-700">
                        <CardTitle className="text-lime-900 dark:text-lime-100 p-3">
                          Connect Section
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold mb-4 text-lime-900 dark:text-lime-100">
                              Social Links
                            </h3>
                            <motion.div
                              className="space-y-4"
                              variants={staggerChildren}
                              initial="hidden"
                              animate="visible"
                            >
                              {formData.connect.socialLinks.map(
                                (item, index) => (
                                  <motion.div
                                    key={index}
                                    variants={scaleIn}
                                    whileHover={{ y: -3 }}
                                  >
                                    <Card className="p-4 bg-lime-50 dark:bg-slate-700 border-lime-200 dark:border-slate-600">
                                      <div className="flex justify-between items-center mb-4">
                                        <Badge
                                          variant="secondary"
                                          className="bg-lime-500 text-white"
                                        >
                                          Link {index + 1}
                                        </Badge>
                                        <motion.div
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                        >
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                              removeArrayItem(
                                                "connect.socialLinks",
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
                                      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
                                        <div className="w-24 h-24 border-2 border-dashed border-lime-300 rounded-lg flex items-center justify-center overflow-hidden bg-white dark:bg-slate-800">
                                          {item.imageURL ? (
                                            <Image
                                              src={item.imageURL}
                                              alt="social link preview"
                                              width={96}
                                              height={96}
                                              className="object-cover w-full h-full"
                                            />
                                          ) : (
                                            <FiImage className="text-lime-400 text-2xl" />
                                          )}
                                        </div>
                                        <div className="flex-1">
                                          <Label>Social Icon</Label>
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
                                                  : "Upload Icon"}
                                              </Button>
                                            </motion.div>
                                            <Input
                                              type="file"
                                              className="absolute inset-0 opacity-0 cursor-pointer"
                                              accept="image/*"
                                              onChange={(e) =>
                                                handleFileUpload(
                                                  e,
                                                  `connect.socialLinks.${index}.imageURL`,
                                                  "social",
                                                  item.platform ||
                                                    `social-${index}`
                                                )
                                              }
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="mb-4">
                                        <Label>Platform</Label>
                                        <Input
                                          value={item.platform || ""}
                                          onChange={(e) =>
                                            handleInputChange(
                                              `connect.socialLinks.${index}.platform`,
                                              e.target.value
                                            )
                                          }
                                          className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                        />
                                      </div>
                                      <div>
                                        <Label>URL</Label>
                                        <Input
                                          value={item.url || ""}
                                          onChange={(e) =>
                                            handleInputChange(
                                              `connect.socialLinks.${index}.url`,
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
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Button
                                  onClick={() =>
                                    addArrayItem("connect.socialLinks", {
                                      platform: "",
                                      imageURL: "",
                                      url: "",
                                    })
                                  }
                                  type="button"
                                  variant="outline"
                                  className="w-full border-lime-300 text-lime-700 hover:bg-lime-50 flex items-center justify-center gap-2"
                                >
                                  <FiPlus className="w-4 h-4" /> Add Social Link
                                </Button>
                              </motion.div>
                            </motion.div>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold mb-4 text-lime-900 dark:text-lime-100">
                              Contact Information
                            </h3>
                            <div className="space-y-4">
                              <div>
                                <Label>Address</Label>
                                <Input
                                  value={formData.connect.address || ""}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "connect.address",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                />
                              </div>
                              <div>
                                <Label>Business Hours</Label>
                                <Input
                                  value={formData.connect.hours || ""}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "connect.hours",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                />
                              </div>
                              <div>
                                <Label>Phone Number</Label>
                                <Input
                                  value={formData.connect.phone || ""}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "connect.phone",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                />
                              </div>
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
};

export default AboutAdminDashboard;
