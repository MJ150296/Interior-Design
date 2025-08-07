"use client";
import React, { useState } from "react";
import {
  FiImage,
  FiEdit,
  FiUsers,
  FiMessageSquare,
  FiSettings,
  FiPlus,
  FiMinus,
  FiSearch,
  FiCalendar,
} from "react-icons/fi";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import DashboardLayoutClient from "@/app/dashboard/client_side_layout/ClientSideDashboardLayout";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define Zod schemas
const blogPostSchema = z.object({
  id: z.number(),
  title: z.string().min(10, "Title must be at least 10 characters"),
  excerpt: z.string().min(30, "Excerpt must be at least 30 characters"),
  author: z.string().min(2, "Author name must be at least 2 characters"),
  date: z.string().refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
    message: "Date must be in YYYY-MM-DD format",
  }),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().url("Invalid URL format").or(z.literal("")),
  content: z
    .string()
    .min(100, "Content must be at least 100 characters")
    .optional(),
  featured: z.boolean(), // Removed .default() to fix type issues
});

const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
});

const blogPageSchema = z.object({
  hero: z.object({
    backgroundImageUrl: z.string().url("Invalid URL format").or(z.literal("")),
    preTitle: z.string().min(5, "Pre-title must be at least 5 characters"),
    title: z.string().min(5, "Title must be at least 5 characters"),
    subtitle: z.string().min(10, "Subtitle must be at least 10 characters"),
  }),
  categories: z.array(categorySchema),
  blogPosts: z.array(blogPostSchema),
  featuredPostId: z.number().optional(),
  newsletter: z.object({
    title: z.string().min(10, "Title must be at least 10 characters"),
    description: z
      .string()
      .min(20, "Description must be at least 20 characters"),
  }),
});

// Infer TypeScript type from Zod schema
type BlogPageContent = z.infer<typeof blogPageSchema>;

const defaultValues: BlogPageContent = {
  hero: {
    backgroundImageUrl: "/Riddhi Interior Design/Projects/cover.jpg",
    preTitle: "INSIGHTS & INSPIRATION",
    title: "Design Journal",
    subtitle:
      "Explore Ideas, Trends, and Expert Advice on Beautiful Living Spaces.",
  },
  categories: [
    { name: "All" },
    { name: "Trends" },
    { name: "Space Planning" },
    { name: "Residential" },
    { name: "Color Theory" },
    { name: "Budget Design" },
  ],
  blogPosts: [
    {
      id: 1,
      title: "Top Interior Design Trends for 2025",
      excerpt:
        "Discover the biggest interior design trends for 2025—from natural textures and bold color accents to smart homes and sustainable materials.",
      author: "Riddhi Sharma",
      date: "2025-05-15",
      category: "Trends",
      imageUrl:
        "/Riddhi Interior Design/Blogs/top_interior_design_trends_for_the_year.jpeg",
      featured: true,
      content: "",
    },
    {
      id: 2,
      title: "Small Space Solutions: Big Impact Design",
      excerpt:
        "Living in a compact apartment? Learn how to maximize space with clever furniture, lighting, and color tricks that transform tight areas into stylish sanctuaries.",
      author: "Arjun Patel",
      date: "2025-04-28",
      category: "Space Planning",
      imageUrl: "/Riddhi Interior Design/Blogs/small_space_makeover_ideas.jpeg",
      featured: false,
      content: "",
    },
    {
      id: 3,
      title: "Creating Timeless Living Spaces",
      excerpt:
        "From layout planning to material choices, explore how to design a modern living room that's stylish, practical, and tailored to your lifestyle.",
      author: "Neha Kapoor",
      date: "2025-06-03",
      category: "Residential",
      imageUrl:
        "/Riddhi Interior Design/Blogs/modern_living_room_design_tips.jpeg",
      featured: false,
      content: "",
    },
  ],
  newsletter: {
    title: "Design Inspiration Delivered",
    description:
      "Join our newsletter and receive exclusive design tips, trend reports, and special offers.",
  },
};

const BlogAdminDashboard = () => {
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const [uploading, setUploading] = useState(false);

  const form = useForm<BlogPageContent>({
    resolver: zodResolver(blogPageSchema),
    defaultValues,
    mode: "onChange",
  });

  // Field arrays for repeatable sections
  const categoryFields = useFieldArray({
    control: form.control,
    name: "categories",
  });

  const blogPostFields = useFieldArray({
    control: form.control,
    name: "blogPosts",
  });

  const onSubmit = (data: BlogPageContent) => {
    console.log("Form submitted:", data);
    // Add your publish logic here
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      // Simulate file upload
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return URL.createObjectURL(file);
    } catch (error) {
      console.error("Upload failed:", error);
      return "";
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    index?: number
  ) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];
    const fileUrl = await uploadFile(file);

    if (fileUrl) {
      if (index !== undefined) {
        // For array fields
        form.setValue(`${fieldName}.${index}.imageUrl` as any, fileUrl);
      } else {
        // For single fields
        form.setValue(fieldName as any, fileUrl);
      }
    }
  };

  const handleSetFeatured = (index: number) => {
    const currentPosts = form.getValues().blogPosts;
    const updatedPosts = currentPosts.map((post, i) => ({
      ...post,
      featured: i === index,
    }));
    form.setValue("blogPosts", updatedPosts);
  };

  // Tab navigation items
  const tabItems = [
    { value: "hero", icon: <FiImage />, label: "Hero" },
    { value: "categories", icon: <FiSettings />, label: "Categories" },
    { value: "posts", icon: <FiEdit />, label: "Blog Posts" },
    { value: "newsletter", icon: <FiMessageSquare />, label: "Newsletter" },
  ];

  return (
    <DashboardLayoutClient>
      <FormProvider {...form}>
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <header className="flex flex-col">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-lime-900 dark:text-[#e8e6e3] p-4">
                  Blog Page Content Management
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 px-4">
                  Manage your blog content, categories, and featured posts
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => setPreviewMode(!previewMode)}
                  variant={previewMode ? "secondary" : "outline"}
                >
                  {previewMode ? "Exit Preview" : "Preview Mode"}
                </Button>
                <Button onClick={form.handleSubmit(onSubmit)} variant="default">
                  Publish Changes
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
                  <TabsList className="grid grid-cols-4 bg-lime-100 gap-1">
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
            {previewMode ? (
              <Card>
                <CardHeader>
                  <CardTitle>Preview Mode</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed rounded-xl w-full h-[600px] flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <FiPlus className="text-4xl mx-auto mb-3" />
                      <p>Blog page preview will appear here</p>
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
                          {form.watch("hero.backgroundImageUrl") ? (
                            <img
                              src={form.watch("hero.backgroundImageUrl")}
                              alt="Hero background preview"
                              className="max-w-full max-h-full"
                            />
                          ) : (
                            <FiImage className="text-gray-400 text-2xl" />
                          )}
                        </div>
                        <div>
                          <Label>Background Image</Label>
                          <div className="relative mt-2">
                            <Button variant="outline" disabled={uploading}>
                              {uploading ? "Uploading..." : "Upload Image"}
                            </Button>
                            <Input
                              type="file"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              accept="image/*"
                              onChange={(e) =>
                                handleFileUpload(e, "hero.backgroundImageUrl")
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name="hero.preTitle"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>Pre-Title</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="hero.title"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="hero.subtitle"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>Subtitle</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={3} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Categories Tab */}
                <TabsContent value="categories">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Blog Categories</CardTitle>
                        <Button
                          onClick={() =>
                            categoryFields.append({ name: "New Category" })
                          }
                        >
                          + Add Category
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {categoryFields.fields.map((category, index) => (
                          <Card key={category.id} className="p-4">
                            <div className="flex justify-between items-center mb-4">
                              <Badge variant="secondary">
                                Category {index + 1}
                              </Badge>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => categoryFields.remove(index)}
                              >
                                Remove
                              </Button>
                            </div>
                            <FormField
                              control={form.control}
                              name={`categories.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Category Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Blog Posts Tab */}
                <TabsContent value="posts">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Blog Posts</CardTitle>
                        <Button
                          onClick={() =>
                            blogPostFields.append({
                              id: blogPostFields.fields.length + 1,
                              title: `New Blog Post ${
                                blogPostFields.fields.length + 1
                              }`,
                              excerpt: "",
                              author: "",
                              date: new Date().toISOString().split("T")[0],
                              category: form.watch("categories")[0]?.name || "",
                              imageUrl: "",
                              featured: false,
                              content: "",
                            })
                          }
                        >
                          + Add Post
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {blogPostFields.fields.map((post, index) => (
                          <Card key={post.id} className="p-5">
                            <CardHeader className="flex flex-row items-center justify-between">
                              <div className="flex items-center">
                                <Badge
                                  variant={
                                    post.featured ? "default" : "secondary"
                                  }
                                >
                                  {post.featured
                                    ? "Featured Post"
                                    : `Post ${index + 1}`}
                                </Badge>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => blogPostFields.remove(index)}
                              >
                                Remove
                              </Button>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center space-x-4 mb-6">
                                <div className="w-24 h-24 border rounded-md flex items-center justify-center">
                                  {form.watch(`blogPosts.${index}.imageUrl`) ? (
                                    <img
                                      src={form.watch(
                                        `blogPosts.${index}.imageUrl`
                                      )}
                                      alt="Blog post preview"
                                      className="max-w-full max-h-full"
                                    />
                                  ) : (
                                    <FiImage className="text-gray-400 text-2xl" />
                                  )}
                                </div>
                                <div>
                                  <Label>Featured Image</Label>
                                  <div className="relative mt-2">
                                    <Button
                                      variant="outline"
                                      disabled={uploading}
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
                                          `blogPosts.${index}.imageUrl`,
                                          index
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name={`blogPosts.${index}.title`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Post Title</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`blogPosts.${index}.author`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Author</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`blogPosts.${index}.date`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Publish Date</FormLabel>
                                      <FormControl>
                                        <div className="relative">
                                          <Input {...field} type="date" />
                                          <FiCalendar className="absolute right-3 top-3 text-gray-400" />
                                        </div>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`blogPosts.${index}.category`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Category</FormLabel>
                                      <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                      >
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {form
                                            .watch("categories")
                                            .map((category) => (
                                              <SelectItem
                                                key={category.name}
                                                value={category.name}
                                              >
                                                {category.name}
                                              </SelectItem>
                                            ))}
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <FormField
                                control={form.control}
                                name={`blogPosts.${index}.featured`}
                                render={({ field }) => (
                                  <FormItem className="mt-4 flex items-center">
                                    <FormControl>
                                      <input
                                        type="checkbox"
                                        checked={field.value}
                                        onChange={(e) => {
                                          handleSetFeatured(index);
                                        }}
                                        className="mr-2 h-4 w-4 rounded border-gray-300 text-lime-600 focus:ring-lime-500"
                                      />
                                    </FormControl>
                                    <FormLabel className="!mt-0">
                                      Set as featured post
                                    </FormLabel>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`blogPosts.${index}.excerpt`}
                                render={({ field }) => (
                                  <FormItem className="mt-4">
                                    <FormLabel>Excerpt</FormLabel>
                                    <FormControl>
                                      <Textarea {...field} rows={3} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`blogPosts.${index}.content`}
                                render={({ field }) => (
                                  <FormItem className="mt-4">
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                      <Textarea {...field} rows={6} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Newsletter Tab */}
                <TabsContent value="newsletter">
                  <Card>
                    <CardHeader>
                      <CardTitle>Newsletter Section</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="newsletter.title"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="newsletter.description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={3} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </main>
        </div>
      </FormProvider>
    </DashboardLayoutClient>
  );
};

export default BlogAdminDashboard;
