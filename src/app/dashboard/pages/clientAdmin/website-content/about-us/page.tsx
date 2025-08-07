"use client";
import React, { useEffect, useState } from "react";
import {
  FiLayout,
  FiImage,
  FiEdit,
  FiUsers,
  FiMessageSquare,
  FiSettings,
  FiPlus,
  FiMinus,
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
  fetchAboutContent,
  selectAboutContent,
  selectAboutError,
  selectAboutLoading,
  updateAboutContent,
} from "@/app/redux/slices/aboutUsPageSlice";
import Image from "next/image";

// Define Types
type StatItem = {
  value: string;
  label: string;
};

type CoreValueItem = {
  title: string;
  description: string;
  icon: string;
};

type TeamMember = {
  name: string;
  title: string;
  bio: string;
  imageUrl: string;
  tags: string[];
};

type SocialLink = {
  platform: string;
  imageURL: string;
  url: string;
};

type HeroSection = {
  title: string;
  subtitle: string;
  upperTitle: string;
  backgroundImageUrl: string;
};

type StorySection = {
  title: string;
  subtitle: string;
  content: string;
  content2: string;
  quote: string;
  imageUrl: string;
  cities: string;
};

type ConnectSection = {
  socialLinks: SocialLink[];
  address: string;
  hours: string;
  phone: string;
};

export type AboutContent = {
  hero: HeroSection;
  stats: StatItem[];
  story: StorySection;
  coreValues: CoreValueItem[];
  teamMembers: TeamMember[];
  connect: ConnectSection;
};

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

const AboutAdminDashboard = () => {
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<AboutContent>(defaultValues);

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
    }
  }, [reduxContent]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  // Handle input changes
  const handleInputChange = (
    path: string,
    value: string,
    index?: number,
    subIndex?: number
  ) => {
    setFormData((prev) => {
      const newData: AboutContent = JSON.parse(JSON.stringify(prev));
      const parts = path.split(".");

      // Traverse the object with proper typing
      let current:
        | Record<string, unknown>
        | CoreValueItem[]
        | StatItem[]
        | TeamMember[]
        | SocialLink[] = newData;
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (current && typeof current === "object" && part in current) {
          current = current[part] as typeof current;
        }
      }

      const lastPart = parts[parts.length - 1];
      if (current && typeof current === "object" && lastPart in current) {
        if (subIndex !== undefined && Array.isArray(current[lastPart])) {
          (current[lastPart] as string[])[subIndex] = value;
        } else {
          (current as Record<string, unknown>)[lastPart] = value;
        }
      }

      return newData;
    });
  };

  // Handle array changes
  const handleArrayChange = (
    arrayPath: string,
    index: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => {
      const newData: AboutContent = JSON.parse(JSON.stringify(prev));
      const parts = arrayPath.split(".");

      // Traverse to the array
      let current:
        | Record<string, unknown>
        | CoreValueItem[]
        | StatItem[]
        | TeamMember[]
        | SocialLink[] = newData;
      for (const part of parts) {
        if (current && typeof current === "object" && part in current) {
          current = current[part] as typeof current;
        }
      }

      // Update the array item
      if (Array.isArray(current) && current[index]) {
        (current[index] as Record<string, unknown>)[field] = value;
      }

      return newData;
    });
  };

  // Handle array item changes for nested arrays (like tags)
  const handleNestedArrayChange = (
    arrayPath: string,
    index: number,
    nestedArrayName: string,
    nestedIndex: number,
    value: string
  ) => {
    setFormData((prev) => {
      const newData: AboutContent = JSON.parse(JSON.stringify(prev));
      const parts = arrayPath.split(".");

      // Traverse to the array
      let current:
        | Record<string, unknown>
        | CoreValueItem[]
        | StatItem[]
        | TeamMember[]
        | SocialLink[] = newData;
      for (const part of parts) {
        if (current && typeof current === "object" && part in current) {
          current = current[part] as typeof current;
        }
      }

      // Update the nested array
      if (Array.isArray(current) && current[index]) {
        const item = current[index] as Record<string, unknown>;
        if (item && Array.isArray(item[nestedArrayName])) {
          (item[nestedArrayName] as string[])[nestedIndex] = value;
        }
      }

      return newData;
    });
  };

  // Add new item to array
  const addArrayItem = <T,>(arrayPath: string, newItem: T) => {
    setFormData((prev) => {
      const newData: AboutContent = JSON.parse(JSON.stringify(prev));
      const parts = arrayPath.split(".");

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

  // Remove item from array
  const removeArrayItem = (arrayName: string, index: number) => {
    setFormData((prev) => {
      const newData: AboutContent = JSON.parse(JSON.stringify(prev));
      const arrayPath = arrayName.split(".");

      // Start with the root object
      let current: unknown = newData;

      // Traverse all parts except the last one
      for (let i = 0; i < arrayPath.length - 1; i++) {
        const part = arrayPath[i];
        if (current && typeof current === "object" && part in current) {
          current = (current as Record<string, unknown>)[part];
        } else {
          // Path doesn't exist, return early
          return newData;
        }
      }

      // Now current should be the parent of the array
      const lastPart = arrayPath[arrayPath.length - 1];
      if (
        current &&
        typeof current === "object" &&
        lastPart in current &&
        Array.isArray((current as Record<string, unknown>)[lastPart])
      ) {
        const array = (current as Record<string, unknown>)[
          lastPart
        ] as unknown[];
        array.splice(index, 1);
      }

      return newData;
    });
  };

  // Add new tag to team member
  const addTagToTeamMember = (index: number) => {
    setFormData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      if (newData.teamMembers[index]) {
        newData.teamMembers[index].tags.push("");
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
      }
      return newData;
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting data:", formData);
    try {
      await dispatch(updateAboutContent(formData)).unwrap();
      alert("About page content saved successfully!");
    } catch {
      alert("Failed to save content. Please try again.");
    }
  };

  const uploadFile = async (
    file: File,
    section: string,
    identifier?: string
  ): Promise<string> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folderPath", `riddhi_interiors/aboutUs/${section}`);
      if (identifier) formData.append("identifier", identifier);

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

      const response = await fetch("/api/cloudinaryUpload", {
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

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldPath: string,
    section: string,
    index?: number
  ) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    e.target.value = "";

    const identifier = index !== undefined ? `${section}-${index}` : section;
    const fileUrl = await uploadFile(file, section, identifier);

    if (fileUrl) {
      handleInputChange(fieldPath, fileUrl);
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
    <DashboardLayoutClient>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <header className="flex flex-col">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-lime-900 dark:text-[#e8e6e3] p-4">
                  About Us Page Content Management
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 px-4">
                  Manage your website&apos;s About Us page content
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => setPreviewMode(!previewMode)}
                  variant={previewMode ? "secondary" : "outline"}
                  type="button"
                >
                  {previewMode ? "Exit Preview" : "Preview Mode"}
                </Button>
                <Button type="submit" variant="default" disabled={loading}>
                  {loading ? "Saving..." : "Publish Changes"}
                </Button>
              </div>
            </div>
            <div className="border-b p-10 flex justify-center items-center">
              <div className="flex items-center">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="hidden md:block"
                >
                  <TabsList className="grid grid-cols-6 bg-lime-100 gap-1">
                    {tabItems.map((item) => (
                      <TabsTrigger
                        key={item.value}
                        value={item.value}
                        className="flex flex-col items-center h-auto py-2 px-1 text-xs"
                      >
                        <span className="mb-1">{item.icon}</span>
                        <span>{item.label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            {previewMode ? (
              <Card>
                <CardHeader>
                  <CardTitle>Preview Mode</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed rounded-xl w-full h-[600px] flex items-center justify-center text-gray-500">
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
                <TabsContent value="hero">
                  <Card>
                    <CardHeader>
                      <CardTitle>Hero Section</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-32 h-32 border rounded-md flex items-center justify-center">
                          {formData.hero.backgroundImageUrl ? (
                            <Image
                              src={formData.hero.backgroundImageUrl}
                              alt="Hero background preview"
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <FiImage className="text-gray-400 text-2xl" />
                          )}
                        </div>
                        <div>
                          <Label>Background Image</Label>
                          <div className="relative mt-2">
                            <Button
                              variant="outline"
                              disabled={uploading}
                              type="button"
                            >
                              {uploading ? "Uploading..." : "Upload Image"}
                            </Button>
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
                      <div className="mb-4">
                        <Label>Upper Title</Label>
                        <Input
                          value={formData.hero.upperTitle}
                          onChange={(e) =>
                            handleInputChange("hero.upperTitle", e.target.value)
                          }
                        />
                      </div>
                      <div className="mb-4">
                        <Label>Title</Label>
                        <Input
                          value={formData.hero.title}
                          onChange={(e) =>
                            handleInputChange("hero.title", e.target.value)
                          }
                        />
                      </div>
                      <div className="mb-4">
                        <Label>Subtitle</Label>
                        <Textarea
                          value={formData.hero.subtitle}
                          onChange={(e) =>
                            handleInputChange("hero.subtitle", e.target.value)
                          }
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Stats Tab */}
                <TabsContent value="stats">
                  <Card>
                    <CardHeader>
                      <CardTitle>Statistics Section</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {formData.stats.map((item, index) => (
                          <Card key={index} className="p-4">
                            <div className="flex justify-between items-center mb-4">
                              <Badge variant="secondary">
                                Stat {index + 1}
                              </Badge>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeArrayItem("stats", index)}
                                type="button"
                              >
                                <FiMinus />
                              </Button>
                            </div>
                            <div className="mb-4">
                              <Label>Value</Label>
                              <Input
                                value={item.value}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "stats",
                                    index,
                                    "value",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label>Label</Label>
                              <Input
                                value={item.label}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "stats",
                                    index,
                                    "label",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </Card>
                        ))}

                        <Button
                          onClick={() =>
                            addArrayItem("stats", {
                              value: "",
                              label: "",
                            })
                          }
                          variant="ghost"
                          className="mt-4"
                          type="button"
                        >
                          <FiPlus className="mr-2" /> Add New Statistic
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Story Tab */}
                <TabsContent value="story">
                  <Card>
                    <CardHeader>
                      <CardTitle>Our Story Section</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <Label>Title</Label>
                        <Input
                          value={formData.story.title}
                          onChange={(e) =>
                            handleInputChange("story.title", e.target.value)
                          }
                        />
                      </div>

                      <div className="mb-4">
                        <Label>Subtitle</Label>
                        <Input
                          value={formData.story.subtitle}
                          onChange={(e) =>
                            handleInputChange("story.subtitle", e.target.value)
                          }
                        />
                      </div>

                      <div className="mb-4">
                        <Label>Content</Label>
                        <Textarea
                          value={formData.story.content}
                          onChange={(e) =>
                            handleInputChange("story.content", e.target.value)
                          }
                          rows={6}
                        />
                      </div>
                      <div className="mb-4">
                        <Label>Content 2</Label>
                        <Textarea
                          value={formData.story.content2}
                          onChange={(e) =>
                            handleInputChange("story.content2", e.target.value)
                          }
                          rows={6}
                        />
                      </div>

                      <div className="mb-4">
                        <Label>Cities Served</Label>
                        <Input
                          value={formData.story.cities}
                          onChange={(e) =>
                            handleInputChange("story.cities", e.target.value)
                          }
                          placeholder="Comma separated list"
                        />
                      </div>

                      <div className="mb-4">
                        <Label>Quote</Label>
                        <Textarea
                          value={formData.story.quote}
                          onChange={(e) =>
                            handleInputChange("story.quote", e.target.value)
                          }
                          rows={3}
                        />
                      </div>

                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-32 h-32 border rounded-md flex items-center justify-center">
                          {formData.story.imageUrl ? (
                            <Image
                              src={formData.story.imageUrl}
                              alt="Story image preview"
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <FiImage className="text-gray-400 text-2xl" />
                          )}
                        </div>
                        <div>
                          <Label>Story Image</Label>
                          <div className="relative mt-2">
                            <Button
                              variant="outline"
                              disabled={uploading}
                              type="button"
                            >
                              {uploading ? "Uploading..." : "Upload Image"}
                            </Button>
                            <Input
                              type="file"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              accept="image/*"
                              onChange={(e) =>
                                handleFileUpload(e, "story.imageUrl", "story")
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Core Values Tab */}
                <TabsContent value="values">
                  <Card>
                    <CardHeader>
                      <CardTitle>Core Values Section</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {formData.coreValues.map((item, index) => (
                          <Card key={index} className="p-4">
                            <div className="flex justify-between items-center mb-4">
                              <Badge variant="secondary">
                                Value {index + 1}
                              </Badge>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  removeArrayItem("coreValues", index)
                                }
                                type="button"
                              >
                                Remove
                              </Button>
                            </div>
                            <div className="mb-4">
                              <Label>Title</Label>
                              <Input
                                value={item.title}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "coreValues",
                                    index,
                                    "title",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="mb-4">
                              <Label>Description</Label>
                              <Textarea
                                value={item.description}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "coreValues",
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label>Icon (Emoji)</Label>
                              <Input
                                value={item.icon}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "coreValues",
                                    index,
                                    "icon",
                                    e.target.value
                                  )
                                }
                                placeholder="e.g., 💡"
                              />
                            </div>
                          </Card>
                        ))}
                        <Button
                          className="h-full flex flex-col items-center justify-center border-2 border-dashed p-8"
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
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Team Tab */}
                <TabsContent value="team">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Team Members</CardTitle>
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
                        >
                          + Add Team Member
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {formData.teamMembers.map((member, index) => (
                          <Card key={index} className="p-5">
                            <div className="flex flex-row items-center justify-between p-4">
                              <div className="flex items-center">
                                <Badge variant="secondary">
                                  Member {index + 1}
                                </Badge>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  removeArrayItem("teamMembers", index)
                                }
                                type="button"
                              >
                                Remove
                              </Button>
                            </div>
                            <CardContent>
                              <div className="flex items-center space-x-4 mb-6">
                                <div className="w-24 h-24 border rounded-md flex items-center justify-center">
                                  {member.imageUrl ? (
                                    <Image
                                      src={member.imageUrl}
                                      alt="Team member preview"
                                      fill
                                      className="object-contain"
                                    />
                                  ) : (
                                    <FiImage className="text-gray-400 text-2xl" />
                                  )}
                                </div>
                                <div>
                                  <Label>Profile Image</Label>
                                  <div className="relative mt-2">
                                    <Button
                                      variant="outline"
                                      disabled={uploading}
                                      type="button"
                                    >
                                      {uploading
                                        ? "Uploading..."
                                        : "Upload Image"}
                                    </Button>
                                    <Input
                                      type="file"
                                      className="absolute inset-0 opacity-0 cursor-pointer"
                                      accept="image/*"
                                      onChange={(e) =>
                                        handleFileUpload(
                                          e,
                                          `teamMembers.${index}.imageUrl`,
                                          "team",
                                          index
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="mb-4">
                                <Label>Name</Label>
                                <Input
                                  value={member.name}
                                  onChange={(e) =>
                                    handleArrayChange(
                                      "teamMembers",
                                      index,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>

                              <div className="mb-4">
                                <Label>Title</Label>
                                <Input
                                  value={member.title}
                                  onChange={(e) =>
                                    handleArrayChange(
                                      "teamMembers",
                                      index,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>

                              <div className="mb-4">
                                <Label>Bio</Label>
                                <Textarea
                                  value={member.bio}
                                  onChange={(e) =>
                                    handleArrayChange(
                                      "teamMembers",
                                      index,
                                      "bio",
                                      e.target.value
                                    )
                                  }
                                  rows={4}
                                />
                              </div>

                              <div className="mb-4">
                                <Label>Tags/Skills</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {member.tags.map((tag, tagIndex) => (
                                    <div
                                      key={tagIndex}
                                      className="flex items-center bg-lime-100 px-3 py-1 rounded-full"
                                    >
                                      <Input
                                        value={tag}
                                        onChange={(e) =>
                                          handleNestedArrayChange(
                                            "teamMembers",
                                            index,
                                            "tags",
                                            tagIndex,
                                            e.target.value
                                          )
                                        }
                                        className="bg-transparent border-none p-0 w-32"
                                      />
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-destructive"
                                        onClick={() =>
                                          removeTagFromTeamMember(
                                            index,
                                            tagIndex
                                          )
                                        }
                                        type="button"
                                      >
                                        <FiMinus />
                                      </Button>
                                    </div>
                                  ))}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addTagToTeamMember(index)}
                                    type="button"
                                  >
                                    <FiPlus className="mr-1" /> Add Tag
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Connect Tab */}
                <TabsContent value="connect">
                  <Card>
                    <CardHeader>
                      <CardTitle>Connect Section</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-4">
                            Social Links
                          </h3>
                          <div className="space-y-4">
                            {formData.connect.socialLinks.map((item, index) => (
                              <Card key={index} className="p-4">
                                <div className="flex justify-between items-center mb-4">
                                  <Badge variant="secondary">
                                    Link {index + 1}
                                  </Badge>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                      removeArrayItem(
                                        "connect.socialLinks",
                                        index
                                      )
                                    }
                                    type="button"
                                  >
                                    Remove
                                  </Button>
                                </div>
                                <div className="mb-4">
                                  <Label>Platform</Label>
                                  <Input
                                    value={item.platform}
                                    onChange={(e) =>
                                      handleArrayChange(
                                        "connect.socialLinks",
                                        index,
                                        "platform",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                                <div>
                                  <Label>Social Icon Upload</Label>
                                  <div className="relative mt-2">
                                    <Button
                                      variant="outline"
                                      disabled={uploading}
                                      type="button"
                                    >
                                      {uploading
                                        ? "Uploading..."
                                        : "Upload Image"}
                                    </Button>
                                    <Input
                                      type="file"
                                      className="absolute inset-0 opacity-0 cursor-pointer"
                                      accept="image/*"
                                      onChange={(e) =>
                                        handleFileUpload(
                                          e,
                                          `connect.socialLinks.${index}.imageURL`,
                                          "social",
                                          index
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label>URL</Label>
                                  <Input
                                    value={item.url}
                                    onChange={(e) =>
                                      handleArrayChange(
                                        "connect.socialLinks",
                                        index,
                                        "url",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </Card>
                            ))}
                            <Button
                              onClick={() =>
                                addArrayItem("connect.socialLinks", {
                                  platform: "",
                                  imageURL: "",
                                  url: "",
                                })
                              }
                              type="button"
                              variant="ghost"
                            >
                              <FiPlus className="mr-2" /> Add Social Link
                            </Button>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-4">
                            Contact Information
                          </h3>
                          <div className="mb-4">
                            <Label>Address</Label>
                            <Input
                              value={formData.connect.address}
                              onChange={(e) =>
                                handleInputChange(
                                  "connect.address",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="mb-4">
                            <Label>Business Hours</Label>
                            <Input
                              value={formData.connect.hours}
                              onChange={(e) =>
                                handleInputChange(
                                  "connect.hours",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label>Phone Number</Label>
                            <Input
                              value={formData.connect.phone}
                              onChange={(e) =>
                                handleInputChange(
                                  "connect.phone",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </main>
        </div>
      </form>
    </DashboardLayoutClient>
  );
};

export default AboutAdminDashboard;
