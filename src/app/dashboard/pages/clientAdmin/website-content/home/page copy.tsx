// "use client";
// import React, { useState } from "react";
// import {
//   FiLayout,
//   FiImage,
//   FiEdit,
//   FiUsers,
//   FiMessageSquare,
//   FiSettings,
//   FiPlus,
//   FiMinus,
// } from "react-icons/fi";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import DashboardLayoutClient from "@/app/dashboard/client_side_layout/ClientSideDashboardLayout";
// import { useForm, useFieldArray, FormProvider } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";

// // Define Zod schemas
// const carouselItemSchema = z.object({
//   id: z.number(),
//   title: z.string().min(2, "Title must be at least 2 characters"),
//   videoUrl: z.string().url("Invalid URL format").or(z.literal("")),
//   subtitle: z.string().min(2, "Subtitle must be at least 2 characters"),
//   highlightedWord: z.string().min(1, "Highlighted word is required"),
//   buttonText: z.string().min(1, "Button text is required"),
//   buttonLink: z.string().url("Invalid URL format"),
// });

// const serviceSchema = z.object({
//   id: z.number(),
//   title: z.string().min(2, "Title must be at least 2 characters"),
//   description: z.string().min(10, "Description must be at least 10 characters"),
//   imageUrl: z.string().url("Invalid URL format").or(z.literal("")),
// });

// const statsSchema = z.object({
//   value: z.string().min(1, "Value is required"),
//   label: z.string().min(5, "Label must be at least 5 characters"),
// });

// const estimateCardSchema = z.object({
//   id: z.number(),
//   title: z.string().min(2, "Title must be at least 2 characters"),
//   description: z.string().min(10, "Description must be at least 10 characters"),
//   imageUrl: z.string().url("Invalid URL format").or(z.literal("")),
//   iconUrl: z.string().url("Invalid URL format").or(z.literal("")),
// });

// const blogPostSchema = z.object({
//   id: z.number(),
//   title: z.string().min(2, "Title must be at least 2 characters"),
//   excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
//   date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
//   imageUrl: z.string().url("Invalid URL format").or(z.literal("")),
//   link: z.string().url("Invalid URL format"),
// });

// const contentSchema = z.object({
//   carousel: z.array(carouselItemSchema),
//   services: z.array(serviceSchema),
//   about: z.object({
//     title: z.string().min(10, "Title must be at least 10 characters"),
//     subtitle: z.string().min(5, "Subtitle must be at least 5 characters"),
//     content: z.string().min(50, "Content must be at least 50 characters"),
//     quote: z.string().min(10, "Quote must be at least 10 characters"),
//     imageUrl: z.string().url("Invalid URL format").or(z.literal("")),
//   }),
//   gallery: z.array(
//     z.object({
//       id: z.number(),
//       url: z.string().url("Invalid URL format"),
//       caption: z.string().optional(),
//     })
//   ),
//   founder: z.object({
//     name: z.string().min(2, "Name must be at least 2 characters"),
//     title: z.string().min(5, "Title must be at least 5 characters"),
//     bio: z.string().min(50, "Bio must be at least 50 characters"),
//     quote: z.string().min(10, "Quote must be at least 10 characters"),
//     imageUrl: z.string().url("Invalid URL format").or(z.literal("")),
//   }),
//   stats: z.array(statsSchema),
//   estimateCards: z.array(estimateCardSchema),
//   blogPosts: z.array(blogPostSchema),
//   cta: z.object({
//     title: z.string().min(10, "Title must be at least 10 characters"),
//     description: z
//       .string()
//       .min(20, "Description must be at least 20 characters"),
//   }),
// });

// // Infer TypeScript types from Zod schemas
// type Content = z.infer<typeof contentSchema>;

// const defaultValues: Content = {
//   carousel: [
//     {
//       id: 1,
//       title: "Transform Your Living Space",
//       videoUrl: "/Riddhi Interior Design/videos/video1.mp4",
//       subtitle: "Elevate your home with our designs",
//       highlightedWord: "Living",
//       buttonText: "View Our Projects",
//       buttonLink: "/projects",
//     },
//   ],
//   services: [
//     {
//       id: 1,
//       title: "Modular Interiors",
//       description: "Elevate your space with our custom modular interiors",
//       imageUrl: "/Riddhi Interior Design/modular-interior.jpg",
//     },
//     {
//       id: 2,
//       title: "Full Home Interiors",
//       description: "From living rooms to bedrooms, we create cohesive designs",
//       imageUrl: "/Riddhi Interior Design/full-home.jpg",
//     },
//     {
//       id: 3,
//       title: "Luxury Interiors",
//       description:
//         "Experience the epitome of luxury with our bespoke solutions",
//       imageUrl: "/Riddhi Interior Design/luxury.jpg",
//     },
//   ],
//   about: {
//     title: "Crafting Dream Spaces with Elegance",
//     subtitle: "Riddhi Interiors - Tilak Road, Dehradun",
//     content:
//       "At Riddhi Interiors, we believe your space should be a reflection of your personality...",
//     quote:
//       "Your home, your style — elevated with personalized design and timeless craftsmanship.",
//     imageUrl: "/Riddhi Interior Design/masonry-1.jpg",
//   },
//   gallery: [
//     {
//       id: 1,
//       url: "/Riddhi Interior Design/masonry-1.jpg",
//       caption: "Project 1",
//     },
//     {
//       id: 2,
//       url: "/Riddhi Interior Design/masonry-2.jpg",
//       caption: "Project 2",
//     },
//   ],
//   founder: {
//     name: "John Doe",
//     title: "Founder & Lead Designer",
//     bio: "John Doe, the visionary behind Riddhi Interiors, brings over a decade of experience...",
//     quote:
//       "Design is not just about what you see. It's how you live in the space.",
//     imageUrl: "/Riddhi Interior Design/owner.jpg",
//   },
//   stats: [
//     { value: "10+", label: "Flexible payment options to suit your budget" },
//     { value: "45", label: "Days Move-In Guarentee" },
//     { value: "120+", label: "Quality Checks" },
//     { value: "30+", label: "Cities Served" },
//   ],
//   estimateCards: [
//     {
//       id: 1,
//       title: "Full Home Interiors",
//       description:
//         "Get end-to-end design solutions tailored to your entire home layout",
//       imageUrl: "/Riddhi Interior Design/interior.png",
//       iconUrl: "/Riddhi Interior Design/calculator.png",
//     },
//     {
//       id: 2,
//       title: "Modular Kitchen",
//       description:
//         "Design a smart, functional and aesthetic kitchen setup within your budget",
//       imageUrl: "/Riddhi Interior Design/kitchen.png",
//       iconUrl: "/Riddhi Interior Design/calculator.png",
//     },
//     {
//       id: 3,
//       title: "Wardrobe Solutions",
//       description:
//         "Maximize space and style with personalized wardrobe designs",
//       imageUrl: "/Riddhi Interior Design/wardrobe.png",
//       iconUrl: "/Riddhi Interior Design/calculator.png",
//     },
//   ],
//   blogPosts: [
//     {
//       id: 1,
//       title: "Top Interior Design Trends for 2025",
//       excerpt: "Discover the biggest interior design trends for 2025...",
//       date: "2025-01-15",
//       imageUrl:
//         "/Riddhi Interior Design/Blogs/top_interior_design_trends_for_the_year.jpeg",
//       link: "/blogs/interior-design-trends-2025",
//     },
//     {
//       id: 2,
//       title: "Small Space Solutions: Big Impact Design",
//       excerpt: "Living in a compact apartment? Learn how to maximize space...",
//       date: "2025-02-20",
//       imageUrl: "/Riddhi Interior Design/Blogs/small_space_makeover_ideas.jpeg",
//       link: "/blogs/small-space-makeover-ideas",
//     },
//   ],
//   cta: {
//     title: "Ready to Transform Your Space?",
//     description:
//       "Schedule a free consultation with our design experts to discuss your vision",
//   },
// };

// const AdminDashboard = () => {
//   const [previewMode, setPreviewMode] = useState(false);
//   const [activeTab, setActiveTab] = useState("carousel");
//   const [uploading, setUploading] = useState(false);

//   const form = useForm<Content>({
//     resolver: zodResolver(contentSchema),
//     defaultValues,
//     mode: "onChange",
//   });

//   // Field arrays for repeatable sections
//   const carouselFields = useFieldArray({
//     control: form.control,
//     name: "carousel",
//   });

//   const serviceFields = useFieldArray({
//     control: form.control,
//     name: "services",
//   });

//   const statsFields = useFieldArray({
//     control: form.control,
//     name: "stats",
//   });

//   const estimateCardFields = useFieldArray({
//     control: form.control,
//     name: "estimateCards",
//   });

//   const blogPostFields = useFieldArray({
//     control: form.control,
//     name: "blogPosts",
//   });

//   const galleryFields = useFieldArray({
//     control: form.control,
//     name: "gallery",
//   });

//   const onSubmit = (data: Content) => {
//     console.log("Form submitted:", data);
//     // Add your publish logic here
//   };

//   const uploadFile = async (file: File) => {
//     setUploading(true);
//     try {
//       // Simulate file upload
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       return URL.createObjectURL(file);
//     } catch (error) {
//       console.error("Upload failed:", error);
//       return "";
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleFileUpload = async (
//     e: React.ChangeEvent<HTMLInputElement>,
//     fieldName: string,
//     index?: number
//   ) => {
//     if (!e.target.files?.[0]) return;

//     const file = e.target.files[0];
//     const fileUrl = await uploadFile(file);

//     if (fileUrl) {
//       if (index !== undefined) {
//         // For array fields
//         form.setValue(`${fieldName}.${index}.imageUrl` as any, fileUrl);
//       } else {
//         // For single fields
//         form.setValue(fieldName as any, fileUrl);
//       }
//     }
//   };

//   // Tab navigation items
//   const tabItems = [
//     { value: "carousel", icon: <FiImage />, label: "Carousel" },
//     { value: "services", icon: <FiLayout />, label: "Services" },
//     { value: "about", icon: <FiUsers />, label: "About" },
//     { value: "gallery", icon: <FiImage />, label: "Gallery" },
//     { value: "founder", icon: <FiUsers />, label: "Founder" },
//     { value: "stats", icon: <FiSettings />, label: "Stats" },
//     { value: "estimate", icon: <FiSettings />, label: "Estimate" },
//     { value: "blog", icon: <FiMessageSquare />, label: "Blog" },
//     { value: "cta", icon: <FiSettings />, label: "CTA" },
//   ];

//   return (
//     <DashboardLayoutClient>
//       <FormProvider {...form}>
//         <div className="flex flex-col min-h-screen">
//           {/* Header */}
//           <header className="flex flex-col">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h1 className="text-2xl font-bold text-lime-900 dark:text-[#e8e6e3] p-4">
//                   Home Page Content Management
//                 </h1>
//                 <p className="text-sm text-gray-600 dark:text-gray-400 px-4">
//                   Manage your website's home page content
//                 </p>
//               </div>
//               <div className="flex space-x-3">
//                 <Button
//                   onClick={() => setPreviewMode(!previewMode)}
//                   variant={previewMode ? "secondary" : "outline"}
//                 >
//                   {previewMode ? "Exit Preview" : "Preview Mode"}
//                 </Button>
//                 <Button onClick={form.handleSubmit(onSubmit)} variant="default">
//                   Publish Changes
//                 </Button>
//               </div>
//             </div>
//             <div className="border-b p-10 flex justify-center items-center">
//               <div className="flex items-center">
//                 <Tabs
//                   value={activeTab}
//                   onValueChange={setActiveTab}
//                   className="hidden md:block"
//                 >
//                   <TabsList className="grid grid-cols-9 bg-lime-100 gap-1">
//                     {tabItems.map((item) => (
//                       <TabsTrigger
//                         key={item.value}
//                         value={item.value}
//                         className="flex flex-col items-center h-auto py-2 px-1 text-xs"
//                       >
//                         <span className="mb-1">{item.icon}</span>
//                         <span>{item.label}</span>
//                       </TabsTrigger>
//                     ))}
//                   </TabsList>
//                 </Tabs>
//               </div>
//             </div>
//           </header>

//           {/* Main Content */}
//           <main className="flex-1 overflow-auto p-6">
//             {previewMode ? (
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Preview Mode</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="border-2 border-dashed rounded-xl w-full h-[600px] flex items-center justify-center text-gray-500">
//                     <div className="text-center">
//                       <FiLayout className="text-4xl mx-auto mb-3" />
//                       <p>Website content preview will appear here</p>
//                       <p className="text-sm mt-2 text-gray-400">
//                         Note: Actual content will be rendered based on your
//                         current edits
//                       </p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ) : (
//               <Tabs value={activeTab} className="w-full">
//                 {/* Carousel Tab */}
//                 <TabsContent value="carousel">
//                   <Card className="bg-transparent border-none shadow-none">
//                     <CardHeader>
//                       <CardTitle className="text-lg text-lime-900">
//                         Hero Carousel Management
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-4">
//                         {carouselFields.fields.map((item, index) => (
//                           <Card key={item.id} className="p-5">
//                             <CardHeader className="flex flex-row items-center justify-between">
//                               <div className="flex items-center">
//                                 <Badge variant="secondary">
//                                   Slide {index + 1}
//                                 </Badge>
//                               </div>
//                               <Button
//                                 variant="destructive"
//                                 size="sm"
//                                 onClick={() => carouselFields.remove(index)}
//                               >
//                                 Remove
//                               </Button>
//                             </CardHeader>
//                             <CardContent>
//                               <FormField
//                                 control={form.control}
//                                 name={`carousel.${index}.title`}
//                                 render={({ field }) => (
//                                   <FormItem className="mb-4">
//                                     <FormLabel>Title</FormLabel>
//                                     <FormControl>
//                                       <Input {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />

//                               <FormField
//                                 control={form.control}
//                                 name={`carousel.${index}.subtitle`}
//                                 render={({ field }) => (
//                                   <FormItem className="mb-4">
//                                     <FormLabel>Subtitle</FormLabel>
//                                     <FormControl>
//                                       <Input {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />

//                               <FormField
//                                 control={form.control}
//                                 name={`carousel.${index}.highlightedWord`}
//                                 render={({ field }) => (
//                                   <FormItem className="mb-4">
//                                     <FormLabel>Highlighted Word</FormLabel>
//                                     <FormControl>
//                                       <Input {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />

//                               <div className="mb-4 flex items-end space-x-2">
//                                 <FormField
//                                   control={form.control}
//                                   name={`carousel.${index}.videoUrl`}
//                                   render={({ field }) => (
//                                     <FormItem className="w-full">
//                                       <FormLabel>Video URL</FormLabel>
//                                       <FormControl>
//                                         <Input
//                                           {...field}
//                                           placeholder="https://yourdomain.com/video.mp4"
//                                         />
//                                       </FormControl>
//                                       <FormMessage />
//                                     </FormItem>
//                                   )}
//                                 />
//                                 <div className="relative">
//                                   <Button
//                                     variant="outline"
//                                     className="mt-3"
//                                     disabled={uploading}
//                                   >
//                                     {uploading
//                                       ? "Uploading..."
//                                       : "Upload Video"}
//                                   </Button>
//                                   <Input
//                                     type="file"
//                                     className="absolute inset-0 opacity-0 cursor-pointer"
//                                     accept="video/*"
//                                     onChange={(e) =>
//                                       handleFileUpload(
//                                         e,
//                                         `carousel.${index}.videoUrl`,
//                                         index
//                                       )
//                                     }
//                                   />
//                                 </div>
//                               </div>

//                               <div className="grid grid-cols-2 gap-4">
//                                 <FormField
//                                   control={form.control}
//                                   name={`carousel.${index}.buttonText`}
//                                   render={({ field }) => (
//                                     <FormItem>
//                                       <FormLabel>Button Text</FormLabel>
//                                       <FormControl>
//                                         <Input {...field} />
//                                       </FormControl>
//                                       <FormMessage />
//                                     </FormItem>
//                                   )}
//                                 />
//                                 <FormField
//                                   control={form.control}
//                                   name={`carousel.${index}.buttonLink`}
//                                   render={({ field }) => (
//                                     <FormItem>
//                                       <FormLabel>Button Link URL</FormLabel>
//                                       <FormControl>
//                                         <Input
//                                           {...field}
//                                           placeholder="https://example.com"
//                                         />
//                                       </FormControl>
//                                       <FormMessage />
//                                     </FormItem>
//                                   )}
//                                 />
//                               </div>
//                             </CardContent>
//                           </Card>
//                         ))}

//                         <Button
//                           onClick={() =>
//                             carouselFields.append({
//                               id: carouselFields.fields.length + 1,
//                               title: `New Slide ${
//                                 carouselFields.fields.length + 1
//                               }`,
//                               videoUrl: "",
//                               subtitle: "",
//                               highlightedWord: "",
//                               buttonText: "",
//                               buttonLink: "",
//                             })
//                           }
//                           variant="ghost"
//                           className="mt-4"
//                         >
//                           <FiPlus className="mr-2" /> Add New Slide
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>

//                 {/* Services Tab */}
//                 <TabsContent value="services">
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Services Management</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-6">
//                         {serviceFields.fields.map((item, index) => (
//                           <Card key={item.id} className="p-5">
//                             <CardHeader className="flex flex-row items-center justify-between">
//                               <div className="flex items-center">
//                                 <Badge variant="secondary">
//                                   Service {index + 1}
//                                 </Badge>
//                               </div>
//                               <Button
//                                 variant="destructive"
//                                 size="sm"
//                                 onClick={() => serviceFields.remove(index)}
//                               >
//                                 Remove
//                               </Button>
//                             </CardHeader>
//                             <CardContent>
//                               <FormField
//                                 control={form.control}
//                                 name={`services.${index}.title`}
//                                 render={({ field }) => (
//                                   <FormItem className="mb-4">
//                                     <FormLabel>Service Title</FormLabel>
//                                     <FormControl>
//                                       <Input {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />

//                               <FormField
//                                 control={form.control}
//                                 name={`services.${index}.description`}
//                                 render={({ field }) => (
//                                   <FormItem className="mb-4">
//                                     <FormLabel>Description</FormLabel>
//                                     <FormControl>
//                                       <Textarea {...field} rows={3} />
//                                     </FormControl>
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />

//                               <div className="flex items-center space-x-4 mb-4">
//                                 <div className="w-24 h-24 border rounded-md flex items-center justify-center">
//                                   {form.watch(`services.${index}.imageUrl`) ? (
//                                     <img
//                                       src={form.watch(
//                                         `services.${index}.imageUrl`
//                                       )}
//                                       alt="Service preview"
//                                       className="max-w-full max-h-full"
//                                     />
//                                   ) : (
//                                     <FiImage className="text-gray-400 text-2xl" />
//                                   )}
//                                 </div>
//                                 <div>
//                                   <Label>Service Image</Label>
//                                   <div className="relative mt-2">
//                                     <Button
//                                       variant="outline"
//                                       disabled={uploading}
//                                     >
//                                       {uploading
//                                         ? "Uploading..."
//                                         : "Upload Image"}
//                                     </Button>
//                                     <Input
//                                       type="file"
//                                       className="absolute inset-0 opacity-0 cursor-pointer"
//                                       accept="image/*"
//                                       onChange={(e) =>
//                                         handleFileUpload(
//                                           e,
//                                           `services.${index}.imageUrl`,
//                                           index
//                                         )
//                                       }
//                                     />
//                                   </div>
//                                 </div>
//                               </div>
//                             </CardContent>
//                           </Card>
//                         ))}

//                         <Button
//                           onClick={() =>
//                             serviceFields.append({
//                               id: serviceFields.fields.length + 1,
//                               title: `New Service ${
//                                 serviceFields.fields.length + 1
//                               }`,
//                               description: "",
//                               imageUrl: "",
//                             })
//                           }
//                           variant="ghost"
//                           className="mt-4"
//                         >
//                           <FiPlus className="mr-2" /> Add New Service
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>

//                 {/* About Tab */}
//                 <TabsContent value="about">
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>About Section</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <FormField
//                         control={form.control}
//                         name="about.title"
//                         render={({ field }) => (
//                           <FormItem className="mb-4">
//                             <FormLabel>Title</FormLabel>
//                             <FormControl>
//                               <Input {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="about.subtitle"
//                         render={({ field }) => (
//                           <FormItem className="mb-4">
//                             <FormLabel>Subtitle</FormLabel>
//                             <FormControl>
//                               <Input {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="about.content"
//                         render={({ field }) => (
//                           <FormItem className="mb-4">
//                             <FormLabel>Content</FormLabel>
//                             <FormControl>
//                               <Textarea {...field} rows={6} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="about.quote"
//                         render={({ field }) => (
//                           <FormItem className="mb-4">
//                             <FormLabel>Quote</FormLabel>
//                             <FormControl>
//                               <Textarea {...field} rows={3} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <div className="flex items-center space-x-4 mb-4">
//                         <div className="w-32 h-32 border rounded-md flex items-center justify-center">
//                           {form.watch("about.imageUrl") ? (
//                             <img
//                               src={form.watch("about.imageUrl")}
//                               alt="About preview"
//                               className="max-w-full max-h-full"
//                             />
//                           ) : (
//                             <FiImage className="text-gray-400 text-2xl" />
//                           )}
//                         </div>
//                         <div>
//                           <Label>About Image</Label>
//                           <div className="relative mt-2">
//                             <Button variant="outline" disabled={uploading}>
//                               {uploading ? "Uploading..." : "Upload Image"}
//                             </Button>
//                             <Input
//                               type="file"
//                               className="absolute inset-0 opacity-0 cursor-pointer"
//                               accept="image/*"
//                               onChange={(e) =>
//                                 handleFileUpload(e, "about.imageUrl")
//                               }
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>

//                 {/* Gallery Tab */}
//                 <TabsContent value="gallery">
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Gallery Management</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         {galleryFields.fields.map((item, index) => (
//                           <Card key={item.id}>
//                             <div className="border-2 border-dashed w-full h-40 flex items-center justify-center">
//                               {form.watch(`gallery.${index}.url`) ? (
//                                 <img
//                                   src={form.watch(`gallery.${index}.url`)}
//                                   alt="Gallery preview"
//                                   className="max-w-full max-h-full"
//                                 />
//                               ) : (
//                                 <FiImage className="text-gray-400 text-2xl" />
//                               )}
//                             </div>
//                             <CardContent className="p-3">
//                               <FormField
//                                 control={form.control}
//                                 name={`gallery.${index}.caption`}
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormLabel>Caption</FormLabel>
//                                     <FormControl>
//                                       <Input
//                                         {...field}
//                                         placeholder="Add caption"
//                                       />
//                                     </FormControl>
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />
//                               <div className="relative mt-3">
//                                 <Button
//                                   variant="outline"
//                                   className="w-full"
//                                   disabled={uploading}
//                                 >
//                                   {uploading ? "Uploading..." : "Upload Image"}
//                                 </Button>
//                                 <Input
//                                   type="file"
//                                   className="absolute inset-0 opacity-0 cursor-pointer"
//                                   accept="image/*"
//                                   onChange={(e) =>
//                                     handleFileUpload(
//                                       e,
//                                       `gallery.${index}.url`,
//                                       index
//                                     )
//                                   }
//                                 />
//                               </div>
//                               <div className="flex justify-between mt-3">
//                                 <Button
//                                   variant="destructive"
//                                   onClick={() => galleryFields.remove(index)}
//                                 >
//                                   Remove
//                                 </Button>
//                               </div>
//                             </CardContent>
//                           </Card>
//                         ))}
//                         <Button
//                           className="h-40 flex flex-col items-center justify-center border-2 border-dashed"
//                           onClick={() =>
//                             galleryFields.append({
//                               id: galleryFields.fields.length + 1,
//                               url: "",
//                               caption: "",
//                             })
//                           }
//                         >
//                           <FiPlus className="text-2xl mb-2" />
//                           <p>Add New Image</p>
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>

//                 {/* Founder Tab */}
//                 <TabsContent value="founder">
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Founder Section</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <FormField
//                         control={form.control}
//                         name="founder.name"
//                         render={({ field }) => (
//                           <FormItem className="mb-4">
//                             <FormLabel>Name</FormLabel>
//                             <FormControl>
//                               <Input {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="founder.title"
//                         render={({ field }) => (
//                           <FormItem className="mb-4">
//                             <FormLabel>Title</FormLabel>
//                             <FormControl>
//                               <Input {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="founder.bio"
//                         render={({ field }) => (
//                           <FormItem className="mb-4">
//                             <FormLabel>Bio</FormLabel>
//                             <FormControl>
//                               <Textarea {...field} rows={4} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="founder.quote"
//                         render={({ field }) => (
//                           <FormItem className="mb-4">
//                             <FormLabel>Quote</FormLabel>
//                             <FormControl>
//                               <Textarea {...field} rows={3} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <div className="flex items-center space-x-4 mb-4">
//                         <div className="w-32 h-32 border rounded-md flex items-center justify-center">
//                           {form.watch("founder.imageUrl") ? (
//                             <img
//                               src={form.watch("founder.imageUrl")}
//                               alt="Founder preview"
//                               className="max-w-full max-h-full"
//                             />
//                           ) : (
//                             <FiImage className="text-gray-400 text-2xl" />
//                           )}
//                         </div>
//                         <div>
//                           <Label>Founder Image</Label>
//                           <div className="relative mt-2">
//                             <Button variant="outline" disabled={uploading}>
//                               {uploading ? "Uploading..." : "Upload Image"}
//                             </Button>
//                             <Input
//                               type="file"
//                               className="absolute inset-0 opacity-0 cursor-pointer"
//                               accept="image/*"
//                               onChange={(e) =>
//                                 handleFileUpload(e, "founder.imageUrl")
//                               }
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>

//                 {/* Stats Tab */}
//                 <TabsContent value="stats">
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Statistics Section</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-4">
//                         {statsFields.fields.map((item, index) => (
//                           <Card key={item.id} className="p-4">
//                             <div className="flex justify-between items-center mb-4">
//                               <Badge variant="secondary">
//                                 Stat {index + 1}
//                               </Badge>
//                               <Button
//                                 variant="destructive"
//                                 size="sm"
//                                 onClick={() => statsFields.remove(index)}
//                               >
//                                 <FiMinus />
//                               </Button>
//                             </div>
//                             <FormField
//                               control={form.control}
//                               name={`stats.${index}.value`}
//                               render={({ field }) => (
//                                 <FormItem className="mb-4">
//                                   <FormLabel>Value</FormLabel>
//                                   <FormControl>
//                                     <Input {...field} />
//                                   </FormControl>
//                                   <FormMessage />
//                                 </FormItem>
//                               )}
//                             />
//                             <FormField
//                               control={form.control}
//                               name={`stats.${index}.label`}
//                               render={({ field }) => (
//                                 <FormItem>
//                                   <FormLabel>Label</FormLabel>
//                                   <FormControl>
//                                     <Input {...field} />
//                                   </FormControl>
//                                   <FormMessage />
//                                 </FormItem>
//                               )}
//                             />
//                           </Card>
//                         ))}

//                         <Button
//                           onClick={() =>
//                             statsFields.append({
//                               value: "",
//                               label: "",
//                             })
//                           }
//                           variant="ghost"
//                           className="mt-4"
//                         >
//                           <FiPlus className="mr-2" /> Add New Statistic
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>

//                 {/* Estimate Tab */}
//                 <TabsContent value="estimate">
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Estimate Cards</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         {estimateCardFields.fields.map((item, index) => (
//                           <Card key={item.id} className="p-4">
//                             <div className="flex justify-between items-center mb-4">
//                               <Badge variant="secondary">
//                                 Card {index + 1}
//                               </Badge>
//                               <Button
//                                 variant="destructive"
//                                 size="sm"
//                                 onClick={() => estimateCardFields.remove(index)}
//                               >
//                                 Remove
//                               </Button>
//                             </div>
//                             <FormField
//                               control={form.control}
//                               name={`estimateCards.${index}.title`}
//                               render={({ field }) => (
//                                 <FormItem className="mb-4">
//                                   <FormLabel>Title</FormLabel>
//                                   <FormControl>
//                                     <Input {...field} />
//                                   </FormControl>
//                                   <FormMessage />
//                                 </FormItem>
//                               )}
//                             />
//                             <FormField
//                               control={form.control}
//                               name={`estimateCards.${index}.description`}
//                               render={({ field }) => (
//                                 <FormItem className="mb-4">
//                                   <FormLabel>Description</FormLabel>
//                                   <FormControl>
//                                     <Textarea {...field} rows={3} />
//                                   </FormControl>
//                                   <FormMessage />
//                                 </FormItem>
//                               )}
//                             />
//                             <div className="grid grid-cols-2 gap-4 mb-4">
//                               <div>
//                                 <Label>Card Image</Label>
//                                 <div className="relative mt-2">
//                                   <Button
//                                     variant="outline"
//                                     className="w-full"
//                                     disabled={uploading}
//                                   >
//                                     {uploading
//                                       ? "Uploading..."
//                                       : "Upload Image"}
//                                   </Button>
//                                   <Input
//                                     type="file"
//                                     className="absolute inset-0 opacity-0 cursor-pointer"
//                                     accept="image/*"
//                                     onChange={(e) =>
//                                       handleFileUpload(
//                                         e,
//                                         `estimateCards.${index}.imageUrl`,
//                                         index
//                                       )
//                                     }
//                                   />
//                                 </div>
//                               </div>
//                               <div>
//                                 <Label>Icon Image</Label>
//                                 <div className="relative mt-2">
//                                   <Button
//                                     variant="outline"
//                                     className="w-full"
//                                     disabled={uploading}
//                                   >
//                                     {uploading ? "Uploading..." : "Upload Icon"}
//                                   </Button>
//                                   <Input
//                                     type="file"
//                                     className="absolute inset-0 opacity-0 cursor-pointer"
//                                     accept="image/*"
//                                     onChange={(e) =>
//                                       handleFileUpload(
//                                         e,
//                                         `estimateCards.${index}.iconUrl`,
//                                         index
//                                       )
//                                     }
//                                   />
//                                 </div>
//                               </div>
//                             </div>
//                           </Card>
//                         ))}
//                         <Button
//                           className="h-full flex flex-col items-center justify-center border-2 border-dashed p-8"
//                           onClick={() =>
//                             estimateCardFields.append({
//                               id: estimateCardFields.fields.length + 1,
//                               title: "",
//                               description: "",
//                               imageUrl: "",
//                               iconUrl: "",
//                             })
//                           }
//                         >
//                           <FiPlus className="text-2xl mb-2" />
//                           <p>Add New Card</p>
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>

//                 {/* Blog Tab */}
//                 <TabsContent value="blog">
//                   <Card>
//                     <CardHeader>
//                       <div className="flex justify-between items-center">
//                         <CardTitle>Blog Management</CardTitle>
//                         <Button
//                           onClick={() =>
//                             blogPostFields.append({
//                               id: blogPostFields.fields.length + 1,
//                               title: "New Blog Post",
//                               excerpt: "",
//                               date: new Date().toISOString().split("T")[0],
//                               imageUrl: "",
//                               link: "",
//                             })
//                           }
//                         >
//                           + Add New Post
//                         </Button>
//                       </div>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-4">
//                         {blogPostFields.fields.map((post, index) => (
//                           <Card key={post.id}>
//                             <div className="flex p-4">
//                               <div className="border-2 border-dashed rounded-xl w-16 h-16 mr-4 flex items-center justify-center">
//                                 {form.watch(`blogPosts.${index}.imageUrl`) ? (
//                                   <img
//                                     src={form.watch(
//                                       `blogPosts.${index}.imageUrl`
//                                     )}
//                                     alt="Blog preview"
//                                     className="max-w-full max-h-full"
//                                   />
//                                 ) : (
//                                   <FiImage className="text-gray-400" />
//                                 )}
//                               </div>
//                               <div className="flex-1">
//                                 <FormField
//                                   control={form.control}
//                                   name={`blogPosts.${index}.title`}
//                                   render={({ field }) => (
//                                     <FormItem className="mb-2">
//                                       <FormControl>
//                                         <Input
//                                           {...field}
//                                           className="text-lg font-semibold mb-2 border-none"
//                                         />
//                                       </FormControl>
//                                       <FormMessage />
//                                     </FormItem>
//                                   )}
//                                 />
//                                 <FormField
//                                   control={form.control}
//                                   name={`blogPosts.${index}.excerpt`}
//                                   render={({ field }) => (
//                                     <FormItem className="mb-2">
//                                       <FormControl>
//                                         <Textarea
//                                           {...field}
//                                           rows={2}
//                                           className="text-sm"
//                                         />
//                                       </FormControl>
//                                       <FormMessage />
//                                     </FormItem>
//                                   )}
//                                 />
//                                 <div className="flex items-center text-sm text-gray-500 mt-2">
//                                   <FormField
//                                     control={form.control}
//                                     name={`blogPosts.${index}.date`}
//                                     render={({ field }) => (
//                                       <FormItem>
//                                         <FormControl>
//                                           <Input
//                                             {...field}
//                                             type="date"
//                                             className="border-none p-0 w-32"
//                                           />
//                                         </FormControl>
//                                         <FormMessage />
//                                       </FormItem>
//                                     )}
//                                   />
//                                   <div className="ml-auto flex space-x-2">
//                                     <div className="relative">
//                                       <Button variant="outline" size="sm">
//                                         Upload Image
//                                       </Button>
//                                       <Input
//                                         type="file"
//                                         className="absolute inset-0 opacity-0 cursor-pointer"
//                                         accept="image/*"
//                                         onChange={(e) =>
//                                           handleFileUpload(
//                                             e,
//                                             `blogPosts.${index}.imageUrl`,
//                                             index
//                                           )
//                                         }
//                                       />
//                                     </div>
//                                     <Button
//                                       variant="destructive"
//                                       size="sm"
//                                       onClick={() =>
//                                         blogPostFields.remove(index)
//                                       }
//                                     >
//                                       Delete
//                                     </Button>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </Card>
//                         ))}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>

//                 {/* CTA Tab */}
//                 <TabsContent value="cta">
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Call to Action Section</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <FormField
//                         control={form.control}
//                         name="cta.title"
//                         render={({ field }) => (
//                           <FormItem className="mb-4">
//                             <FormLabel>Title</FormLabel>
//                             <FormControl>
//                               <Input {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="cta.description"
//                         render={({ field }) => (
//                           <FormItem className="mb-4">
//                             <FormLabel>Description</FormLabel>
//                             <FormControl>
//                               <Textarea {...field} rows={3} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </CardContent>
//                   </Card>
//                 </TabsContent>
//               </Tabs>
//             )}
//           </main>
//         </div>
//       </FormProvider>
//     </DashboardLayoutClient>
//   );
// };

// export default AdminDashboard;
