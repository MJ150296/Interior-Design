"use client";
import React, { useEffect } from "react";
import {
  FiLayout,
  FiImage,
  FiEdit,
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
  fetchPortfolioContent,
  selectPortfolioContent,
  selectPortfolioError,
  selectPortfolioLoading,
  updatePortfolioContent,
  addProject,
  removeProject,
  addQuote,
  removeQuote,
  addStat,
  removeStat,
  updateField,
} from "@/app/redux/slices/portfolioPageSlice";

// Define TypeScript interfaces
export interface Project {
  id: number;
  title: string;
  location: string;
  category: string;
  imageUrl: string;
  hoverTitle: string;
  hoverDescription: string;
}

interface Stat {
  value: string;
  label: string;
}

interface HeroContent {
  backgroundImageUrl: string;
  title: string;
  subtitle: string;
  preTitle: string;
}

interface QuoteContent {
  text: string;
  author: string;
}

interface CtaContent {
  title: string;
  description: string;
}

export interface PortfolioContent {
  hero: HeroContent;
  quotes: QuoteContent[];
  residentialProjects: Project[];
  commercialProjects: Project[];
  stats: Stat[];
  cta: CtaContent;
}

const PortfolioAdminDashboard = () => {
  const [previewMode, setPreviewMode] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("hero");
  const [uploading, setUploading] = React.useState(false);

  const dispatch = useAppDispatch();
  const portfolioData = useAppSelector(selectPortfolioContent);
  const loading = useAppSelector(selectPortfolioLoading);
  const error = useAppSelector(selectPortfolioError);

  // Load content on mount
  useEffect(() => {
    dispatch(fetchPortfolioContent());
  }, [dispatch]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  // Handle input changes
  const handleInputChange = (
    section: keyof PortfolioContent,
    field: string,
    value: string,
    index?: number
  ) => {
    dispatch(updateField({ section, field, value, index }));
  };

  // Handle file uploads
  const uploadFile = async (
    file: File,
    section: string,
    identifier?: string
  ): Promise<string> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folderPath", `riddhi_interiors/portfolio/${section}`);
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
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      alert(`Upload failed: ${errorMessage}`);
      return "";
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    section: keyof PortfolioContent,
    field: string,
    index?: number
  ) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    e.target.value = ""; // Reset input

    const identifier = index !== undefined ? `${section}-${index}` : section;
    const fileUrl = await uploadFile(file, section, identifier);

    if (fileUrl) {
      if (index !== undefined) {
        handleInputChange(section, field, fileUrl, index);
      } else {
        handleInputChange(section, field, fileUrl);
      }
    }
  };

  // Handle form submission
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioData) return;

    try {
      await dispatch(updatePortfolioContent(portfolioData)).unwrap();
      alert("Changes published successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to publish changes");
    }
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

  if (!portfolioData) {
    return (
      <DashboardLayoutClient>
        <div className="flex justify-center items-center h-screen">
          <p>Loading portfolio content...</p>
        </div>
      </DashboardLayoutClient>
    );
  }

  return (
    <DashboardLayoutClient>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <header className="flex flex-col">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-lime-900 dark:text-[#e8e6e3] p-4">
                  Portfolio Page Content Management
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 px-4">
                  Manage your portfolio page content and projects
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
                  {loading ? "Publishing..." : "Publish Changes"}
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
                    {tabItems.map((item, index) => (
                      <TabsTrigger
                        key={index}
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
                      <p>Portfolio page preview will appear here</p>
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
                          {portfolioData.hero.backgroundImageUrl ? (
                            <img
                              src={portfolioData.hero.backgroundImageUrl}
                              alt="Hero background preview"
                              className="max-w-full max-h-full object-cover"
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
                                  "hero",
                                  "backgroundImageUrl"
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <Label>Pre-Title</Label>
                        <Input
                          value={portfolioData.hero.preTitle}
                          onChange={(e) =>
                            handleInputChange(
                              "hero",
                              "preTitle",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="mb-4">
                        <Label>Title</Label>
                        <Input
                          value={portfolioData.hero.title}
                          onChange={(e) =>
                            handleInputChange("hero", "title", e.target.value)
                          }
                        />
                      </div>

                      <div className="mb-4">
                        <Label>Subtitle</Label>
                        <Textarea
                          value={portfolioData.hero.subtitle}
                          onChange={(e) =>
                            handleInputChange(
                              "hero",
                              "subtitle",
                              e.target.value
                            )
                          }
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Quotes Tab */}
                <TabsContent value="quotes">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Quotes Section</CardTitle>
                        <Button
                          onClick={() => dispatch(addQuote())}
                          type="button"
                        >
                          + Add Quote
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {portfolioData.quotes.map(
                        (quote: QuoteContent, index: number) => (
                          <Card key={index} className="mb-4 p-4">
                            <div className="flex justify-between items-center mb-3">
                              <Badge>Quote {index + 1}</Badge>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => dispatch(removeQuote(index))}
                                type="button"
                              >
                                Remove
                              </Button>
                            </div>
                            <div className="mb-4">
                              <Label>Quote Text</Label>
                              <Textarea
                                value={quote.text}
                                onChange={(e) =>
                                  handleInputChange(
                                    "quotes",
                                    "text",
                                    e.target.value,
                                    index
                                  )
                                }
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label>Author</Label>
                              <Input
                                value={quote.author}
                                onChange={(e) =>
                                  handleInputChange(
                                    "quotes",
                                    "author",
                                    e.target.value,
                                    index
                                  )
                                }
                              />
                            </div>
                          </Card>
                        )
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Residential Projects Tab */}
                <TabsContent value="residential">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Residential Projects</CardTitle>
                        <Button
                          onClick={() => dispatch(addProject("residential"))}
                          type="button"
                          disabled={loading}
                        >
                          + Add Project
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {portfolioData.residentialProjects.map(
                          (project: Project, index: number) => (
                            <Card key={index} className="p-5">
                              <CardHeader className="flex flex-row items-center justify-between">
                                <div className="flex items-center">
                                  <Badge variant="secondary">
                                    Project {index + 1}
                                  </Badge>
                                </div>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    dispatch(
                                      removeProject({
                                        type: "residential",
                                        index,
                                      })
                                    )
                                  }
                                  type="button"
                                >
                                  Remove
                                </Button>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center space-x-4 mb-6">
                                  <div className="w-24 h-24 border rounded-md flex items-center justify-center">
                                    {project.imageUrl ? (
                                      <img
                                        src={project.imageUrl}
                                        alt="Project preview"
                                        className="max-w-full max-h-full object-cover"
                                      />
                                    ) : (
                                      <FiImage className="text-gray-400 text-2xl" />
                                    )}
                                  </div>
                                  <div>
                                    <Label>Project Image</Label>
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
                                            "residentialProjects",
                                            "imageUrl",
                                            index
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
                                          "residentialProjects",
                                          "title",
                                          e.target.value,
                                          index
                                        )
                                      }
                                    />
                                  </div>
                                  <div>
                                    <Label>Location</Label>
                                    <Input
                                      value={project.location}
                                      onChange={(e) =>
                                        handleInputChange(
                                          "residentialProjects",
                                          "location",
                                          e.target.value,
                                          index
                                        )
                                      }
                                    />
                                  </div>
                                  <div>
                                    <Label>Category</Label>
                                    <Input
                                      value={project.category}
                                      onChange={(e) =>
                                        handleInputChange(
                                          "residentialProjects",
                                          "category",
                                          e.target.value,
                                          index
                                        )
                                      }
                                    />
                                  </div>
                                </div>

                                <div className="mt-4">
                                  <Label>Hover Title</Label>
                                  <Input
                                    value={project.hoverTitle}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "residentialProjects",
                                        "hoverTitle",
                                        e.target.value,
                                        index
                                      )
                                    }
                                  />
                                </div>

                                <div className="mt-4">
                                  <Label>Hover Description</Label>
                                  <Textarea
                                    value={project.hoverDescription}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "residentialProjects",
                                        "hoverDescription",
                                        e.target.value,
                                        index
                                      )
                                    }
                                    rows={3}
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Commercial Projects Tab */}
                <TabsContent value="commercial">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Commercial Projects</CardTitle>
                        <Button
                          onClick={() => dispatch(addProject("commercial"))}
                          type="button"
                          disabled={loading}
                        >
                          + Add Project
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {portfolioData.commercialProjects.map(
                          (project: Project, index: number) => (
                            <Card key={index} className="p-5">
                              <CardHeader className="flex flex-row items-center justify-between">
                                <div className="flex items-center">
                                  <Badge variant="secondary">
                                    Project {index + 1}
                                  </Badge>
                                </div>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    dispatch(
                                      removeProject({
                                        type: "commercial",
                                        index,
                                      })
                                    )
                                  }
                                  type="button"
                                >
                                  Remove
                                </Button>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center space-x-4 mb-6">
                                  <div className="w-24 h-24 border rounded-md flex items-center justify-center">
                                    {project.imageUrl ? (
                                      <img
                                        src={project.imageUrl}
                                        alt="Project preview"
                                        className="max-w-full max-h-full object-cover"
                                      />
                                    ) : (
                                      <FiImage className="text-gray-400 text-2xl" />
                                    )}
                                  </div>
                                  <div>
                                    <Label>Project Image</Label>
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
                                            "commercialProjects",
                                            "imageUrl",
                                            index
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
                                          "commercialProjects",
                                          "title",
                                          e.target.value,
                                          index
                                        )
                                      }
                                    />
                                  </div>
                                  <div>
                                    <Label>Location</Label>
                                    <Input
                                      value={project.location}
                                      onChange={(e) =>
                                        handleInputChange(
                                          "commercialProjects",
                                          "location",
                                          e.target.value,
                                          index
                                        )
                                      }
                                    />
                                  </div>
                                  <div>
                                    <Label>Category</Label>
                                    <Input
                                      value={project.category}
                                      onChange={(e) =>
                                        handleInputChange(
                                          "commercialProjects",
                                          "category",
                                          e.target.value,
                                          index
                                        )
                                      }
                                    />
                                  </div>
                                </div>

                                <div className="mt-4">
                                  <Label>Hover Title</Label>
                                  <Input
                                    value={project.hoverTitle}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "commercialProjects",
                                        "hoverTitle",
                                        e.target.value,
                                        index
                                      )
                                    }
                                  />
                                </div>

                                <div className="mt-4">
                                  <Label>Hover Description</Label>
                                  <Textarea
                                    value={project.hoverDescription}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "commercialProjects",
                                        "hoverDescription",
                                        e.target.value,
                                        index
                                      )
                                    }
                                    rows={3}
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          )
                        )}
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
                        {portfolioData.stats.map(
                          (item: Stat, index: number) => (
                            <Card key={index} className="p-4">
                              <div className="flex justify-between items-center mb-4">
                                <Badge variant="secondary">
                                  Stat {index + 1}
                                </Badge>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => dispatch(removeStat(index))}
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
                                    handleInputChange(
                                      "stats",
                                      "value",
                                      e.target.value,
                                      index
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <Label>Label</Label>
                                <Input
                                  value={item.label}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "stats",
                                      "label",
                                      e.target.value,
                                      index
                                    )
                                  }
                                />
                              </div>
                            </Card>
                          )
                        )}

                        <Button
                          onClick={() => dispatch(addStat())}
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

                {/* CTA Tab */}
                <TabsContent value="cta">
                  <Card>
                    <CardHeader>
                      <CardTitle>Call to Action Section</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <Label>Title</Label>
                        <Input
                          value={portfolioData.cta.title}
                          onChange={(e) =>
                            handleInputChange("cta", "title", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={portfolioData.cta.description}
                          onChange={(e) =>
                            handleInputChange(
                              "cta",
                              "description",
                              e.target.value
                            )
                          }
                          rows={3}
                        />
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

export default PortfolioAdminDashboard;
