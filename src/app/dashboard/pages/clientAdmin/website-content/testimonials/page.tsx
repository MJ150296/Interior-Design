// "use client";
// import React, { useState } from "react";
// import {
//   FiImage,
//   FiEdit,
//   FiUsers,
//   FiMessageSquare,
//   FiSettings,
//   FiPlus,
//   FiMinus,
//   FiStar,
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
// const testimonialSchema = z.object({
//   id: z.number(),
//   imageUrl: z.string().url("Invalid URL format").or(z.literal("")),
//   category: z.string().min(2, "Category must be at least 2 characters"),
//   quote: z.string().min(10, "Quote must be at least 10 characters"),
//   author: z.string().min(2, "Author name must be at least 2 characters"),
//   role: z.string().min(2, "Role must be at least 2 characters"),
//   rating: z.number().min(1).max(5),
// });

// const statSchema = z.object({
//   value: z.string().min(1, "Value is required"),
//   label: z.string().min(5, "Label must be at least 5 characters"),
// });

// const testimonialPageSchema = z.object({
//   hero: z.object({
//     backgroundImageUrl: z.string().url("Invalid URL format").or(z.literal("")),
//     preTitle: z.string().min(5, "Pre-title must be at least 5 characters"),
//     title: z.string().min(5, "Title must be at least 5 characters"),
//     subtitle: z.string().min(10, "Subtitle must be at least 10 characters"),
//   }),
//   categories: z.array(
//     z.object({
//       name: z.string().min(1, "Category cannot be empty"),
//     })
//   ),
//   testimonials: z.array(testimonialSchema),
//   stats: z.array(statSchema),
//   cta: z.object({
//     title: z.string().min(10, "Title must be at least 10 characters"),
//     description: z
//       .string()
//       .min(20, "Description must be at least 20 characters"),
//   }),
// });

// // Infer TypeScript type from Zod schema
// type TestimonialPageContent = z.infer<typeof testimonialPageSchema>;

// const defaultValues: TestimonialPageContent = {
//   hero: {
//     backgroundImageUrl: "/Riddhi Interior Design/Projects/cover.jpg",
//     preTitle: "CLIENT EXPERIENCES",
//     title: "Designed with Trust",
//     subtitle:
//       "Stories of Spaces Transformed, Lives Touched, and Dreams Designed.",
//   },
//   categories: [
//     { name: "All" },
//     { name: "Residential" },
//     { name: "Commercial" },
//     { name: "Luxury" },
//     { name: "Kitchen" },
//     { name: "Bedroom" },
//     { name: "Outdoor" },
//   ],
//   testimonials: [
//     {
//       id: 1,
//       imageUrl: "/Riddhi Interior Design/masonry-4.jpg",
//       category: "Residential",
//       quote:
//         "Riddhi Interior Design turned our empty flat into a warm and stylish home. Their attention to detail is unmatched!",
//       author: "Anita Sharma",
//       role: "Homeowner, Noida",
//       rating: 5,
//     },
//     {
//       id: 2,
//       imageUrl: "/Riddhi Interior Design/why-choose-us.jpg",
//       category: "Commercial",
//       quote:
//         "Our office space reflects professionalism and creativity now — exactly what we wanted. Highly recommend their team.",
//       author: "Rajeev Mehta",
//       role: "Founder, Mehta & Co.",
//       rating: 5,
//     },
//   ],
//   stats: [
//     { value: "250+", label: "Projects Completed" },
//     { value: "98%", label: "Client Satisfaction" },
//     { value: "15+", label: "Years Experience" },
//     { value: "50+", label: "Awards Received" },
//   ],
//   cta: {
//     title: "Ready to Transform Your Space?",
//     description:
//       "Join hundreds of satisfied clients who have experienced the Riddhi Interiors difference. Schedule your consultation today.",
//   },
// };

// const TestimonialAdminDashboard = () => {
//   const [previewMode, setPreviewMode] = useState(false);
//   const [activeTab, setActiveTab] = useState("hero");
//   const [uploading, setUploading] = useState(false);

//   const form = useForm<TestimonialPageContent>({
//     resolver: zodResolver(testimonialPageSchema),
//     defaultValues,
//     mode: "onChange",
//   });

//   // Field arrays for repeatable sections
//   const testimonialFields = useFieldArray({
//     control: form.control,
//     name: "testimonials",
//   });

//   const categoryFields = useFieldArray({
//     control: form.control,
//     name: "categories",
//   });

//   const statsFields = useFieldArray({
//     control: form.control,
//     name: "stats",
//   });

//   const onSubmit = (data: TestimonialPageContent) => {
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
//     { value: "hero", icon: <FiImage />, label: "Hero" },
//     { value: "categories", icon: <FiSettings />, label: "Categories" },
//     { value: "testimonials", icon: <FiUsers />, label: "Testimonials" },
//     { value: "stats", icon: <FiSettings />, label: "Stats" },
//     { value: "cta", icon: <FiMessageSquare />, label: "CTA" },
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
//                   Testimonials Page Content Management
//                 </h1>
//                 <p className="text-sm text-gray-600 dark:text-gray-400 px-4">
//                   Manage your testimonials page content and client feedback
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
//                   <TabsList className="grid grid-cols-5 bg-lime-100 gap-1">
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
//                       <FiPlus className="text-4xl mx-auto mb-3" />
//                       <p>Testimonials page preview will appear here</p>
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
//                 {/* Hero Tab */}
//                 <TabsContent value="hero">
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Hero Section</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="flex items-center space-x-4 mb-6">
//                         <div className="w-32 h-32 border rounded-md flex items-center justify-center">
//                           {form.watch("hero.backgroundImageUrl") ? (
//                             <img
//                               src={form.watch("hero.backgroundImageUrl")}
//                               alt="Hero background preview"
//                               className="max-w-full max-h-full"
//                             />
//                           ) : (
//                             <FiImage className="text-gray-400 text-2xl" />
//                           )}
//                         </div>
//                         <div>
//                           <Label>Background Image</Label>
//                           <div className="relative mt-2">
//                             <Button variant="outline" disabled={uploading}>
//                               {uploading ? "Uploading..." : "Upload Image"}
//                             </Button>
//                             <Input
//                               type="file"
//                               className="absolute inset-0 opacity-0 cursor-pointer"
//                               accept="image/*"
//                               onChange={(e) =>
//                                 handleFileUpload(e, "hero.backgroundImageUrl")
//                               }
//                             />
//                           </div>
//                         </div>
//                       </div>

//                       <FormField
//                         control={form.control}
//                         name="hero.preTitle"
//                         render={({ field }) => (
//                           <FormItem className="mb-4">
//                             <FormLabel>Pre-Title</FormLabel>
//                             <FormControl>
//                               <Input {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="hero.title"
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
//                         name="hero.subtitle"
//                         render={({ field }) => (
//                           <FormItem className="mb-4">
//                             <FormLabel>Subtitle</FormLabel>
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

//                 {/* Categories Tab */}
//                 <TabsContent value="categories">
//                   <Card>
//                     <CardHeader>
//                       <div className="flex justify-between items-center">
//                         <CardTitle>Testimonial Categories</CardTitle>
//                         <Button
//                           onClick={() =>
//                             categoryFields.append({ name: "New Category" })
//                           }
//                         >
//                           + Add Category
//                         </Button>
//                       </div>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-4">
//                         {categoryFields.fields.map((category, index) => (
//                           <Card key={category.id} className="p-4">
//                             <div className="flex justify-between items-center mb-4">
//                               <Badge variant="secondary">
//                                 Category {index + 1}
//                               </Badge>
//                               <Button
//                                 variant="destructive"
//                                 size="sm"
//                                 onClick={() => categoryFields.remove(index)}
//                               >
//                                 Remove
//                               </Button>
//                             </div>
//                             <FormField
//                               control={form.control}
//                               name={`categories.${index}.name`}
//                               render={({ field }) => (
//                                 <FormItem>
//                                   <FormLabel>Category Name</FormLabel>
//                                   <FormControl>
//                                     <Input {...field} />
//                                   </FormControl>
//                                   <FormMessage />
//                                 </FormItem>
//                               )}
//                             />
//                           </Card>
//                         ))}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>

//                 {/* Testimonials Tab */}
//                 <TabsContent value="testimonials">
//                   <Card>
//                     <CardHeader>
//                       <div className="flex justify-between items-center">
//                         <CardTitle>Client Testimonials</CardTitle>
//                         <Button
//                           onClick={() =>
//                             testimonialFields.append({
//                               id: testimonialFields.fields.length + 1,
//                               imageUrl: "",
//                               category: form.watch("categories")[0]?.name || "",
//                               quote: "",
//                               author: "",
//                               role: "",
//                               rating: 5,
//                             })
//                           }
//                         >
//                           + Add Testimonial
//                         </Button>
//                       </div>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-6">
//                         {testimonialFields.fields.map((testimonial, index) => (
//                           <Card key={testimonial.id} className="p-5">
//                             <CardHeader className="flex flex-row items-center justify-between">
//                               <div className="flex items-center">
//                                 <Badge variant="secondary">
//                                   Testimonial {index + 1}
//                                 </Badge>
//                               </div>
//                               <Button
//                                 variant="destructive"
//                                 size="sm"
//                                 onClick={() => testimonialFields.remove(index)}
//                               >
//                                 Remove
//                               </Button>
//                             </CardHeader>
//                             <CardContent>
//                               <div className="flex items-center space-x-4 mb-6">
//                                 <div className="w-24 h-24 border rounded-md flex items-center justify-center">
//                                   {form.watch(
//                                     `testimonials.${index}.imageUrl`
//                                   ) ? (
//                                     <img
//                                       src={form.watch(
//                                         `testimonials.${index}.imageUrl`
//                                       )}
//                                       alt="Testimonial preview"
//                                       className="max-w-full max-h-full"
//                                     />
//                                   ) : (
//                                     <FiImage className="text-gray-400 text-2xl" />
//                                   )}
//                                 </div>
//                                 <div>
//                                   <Label>Client Photo</Label>
//                                   <div className="relative mt-2">
//                                     <Button
//                                       variant="outline"
//                                       disabled={uploading}
//                                     >
//                                       {uploading
//                                         ? "Uploading..."
//                                         : "Upload Photo"}
//                                     </Button>
//                                     <Input
//                                       type="file"
//                                       className="absolute inset-0 opacity-0 cursor-pointer"
//                                       accept="image/*"
//                                       onChange={(e) =>
//                                         handleFileUpload(
//                                           e,
//                                           `testimonials.${index}.imageUrl`,
//                                           index
//                                         )
//                                       }
//                                     />
//                                   </div>
//                                 </div>
//                               </div>

//                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <FormField
//                                   control={form.control}
//                                   name={`testimonials.${index}.author`}
//                                   render={({ field }) => (
//                                     <FormItem>
//                                       <FormLabel>Client Name</FormLabel>
//                                       <FormControl>
//                                         <Input {...field} />
//                                       </FormControl>
//                                       <FormMessage />
//                                     </FormItem>
//                                   )}
//                                 />
//                                 <FormField
//                                   control={form.control}
//                                   name={`testimonials.${index}.role`}
//                                   render={({ field }) => (
//                                     <FormItem>
//                                       <FormLabel>Client Role</FormLabel>
//                                       <FormControl>
//                                         <Input {...field} />
//                                       </FormControl>
//                                       <FormMessage />
//                                     </FormItem>
//                                   )}
//                                 />
//                                 <FormField
//                                   control={form.control}
//                                   name={`testimonials.${index}.category`}
//                                   render={({ field }) => (
//                                     <FormItem>
//                                       <FormLabel>Category</FormLabel>
//                                       <FormControl>
//                                         <select
//                                           {...field}
//                                           className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//                                         >
//                                           {form
//                                             .watch("categories")
//                                             .map((cat) => (
//                                               <option
//                                                 key={cat.name}
//                                                 value={cat.name}
//                                               >
//                                                 {cat.name}
//                                               </option>
//                                             ))}
//                                         </select>
//                                       </FormControl>
//                                       <FormMessage />
//                                     </FormItem>
//                                   )}
//                                 />
//                                 <FormField
//                                   control={form.control}
//                                   name={`testimonials.${index}.rating`}
//                                   render={({ field }) => (
//                                     <FormItem>
//                                       <FormLabel>Rating (1-5)</FormLabel>
//                                       <FormControl>
//                                         <select
//                                           {...field}
//                                           value={field.value}
//                                           onChange={(e) =>
//                                             field.onChange(
//                                               Number(e.target.value)
//                                             )
//                                           }
//                                           className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//                                         >
//                                           {[1, 2, 3, 4, 5].map((num) => (
//                                             <option key={num} value={num}>
//                                               {num}{" "}
//                                               {num === 1 ? "Star" : "Stars"}
//                                             </option>
//                                           ))}
//                                         </select>
//                                       </FormControl>
//                                       <FormMessage />
//                                     </FormItem>
//                                   )}
//                                 />
//                               </div>

//                               <FormField
//                                 control={form.control}
//                                 name={`testimonials.${index}.quote`}
//                                 render={({ field }) => (
//                                   <FormItem className="mt-4">
//                                     <FormLabel>Testimonial Quote</FormLabel>
//                                     <FormControl>
//                                       <Textarea {...field} rows={3} />
//                                     </FormControl>
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />
//                             </CardContent>
//                           </Card>
//                         ))}
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
//                           <FormItem>
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

// export default TestimonialAdminDashboard;
