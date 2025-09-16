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
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiGlobe,
  FiAward,
  FiHome,
  FiCalendar,
} from "react-icons/fi";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardLayoutClient from "@/app/dashboard/client_side_layout/ClientSideDashboardLayout";
import { useAppDispatch, useAppSelector } from "@/app/redux/store/hooks";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Import TypeScript interfaces and Redux actions
import {
  ContactContent,
  selectContactContent,
  selectContactLoading,
  selectContactError,
  updateContactContent,
  fetchContactContent,
} from "../../../../../redux/slices/contactPageSlice";

import {
  selectAppointmentForm,
  selectAppointmentFormLoading,
  selectAppointmentFormError,
  updateAppointmentForm,
  fetchAppointmentForm,
  AppointmentFormData,
} from "@/app/redux/slices/appointmentFormSlice";

// Import our new components and utilities
import { iconOptions, getStaticIcon } from "@/app/utils/staticIcons";
import AppointmentFormTab from "@/app/dashboard/components/clientAdmin/WebsiteContent/AppointmentForm/AppointmentFormTab";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const defaultContactValues: ContactContent = {
  hero: {
    title: "Design Your Dream Space",
    subtitle:
      "Schedule a consultation with our expert interior designers to transform your home or office",
    buttonText: "Book Free Consultation",
  },
  whyChooseUs: {
    title: "Why Choose Riddhi Interiors?",
    description:
      "We combine creativity, expertise and attention to detail to deliver exceptional interior solutions",
    tabs: [
      {
        title: "Consultation",
        icon: "phone",
        contentTitle: "Expert Consultation Process",
        description:
          "Our process begins with understanding your vision, preferences, and requirements through an in-depth consultation.",
      },
      {
        title: "Design Process",
        icon: "settings",
        contentTitle: "Innovative Design Approach",
        description:
          "We create detailed design concepts and 3D visualizations to bring your vision to life before implementation.",
      },
      {
        title: "Materials",
        icon: "award",
        contentTitle: "Premium Material Selection",
        description:
          "We source only the finest materials to ensure your interiors are both beautiful and durable.",
      },
      {
        title: "Execution",
        icon: "calendar",
        contentTitle: "Flawless Project Execution",
        description:
          "Our skilled craftsmen and project managers ensure flawless execution of your design vision.",
      },
    ],
    features: [
      {
        icon: "palette",
        title: "Expert Design Consultation",
        description:
          "Our experienced designers will work with you to create spaces that reflect your personality and lifestyle.",
      },
      {
        icon: "award",
        title: "Premium Quality Materials",
        description:
          "We source only the finest materials to ensure your interiors are both beautiful and durable.",
      },
      {
        icon: "house",
        title: "End-to-End Project Management",
        description:
          "From concept to completion, we handle every detail so you can relax and enjoy the transformation.",
      },
      {
        icon: "calendar",
        title: "Personalized Solutions",
        description:
          "Every space is unique - we create custom solutions tailored to your specific needs and preferences.",
      },
    ],
  },
  contactInfo: {
    items: [
      {
        icon: "phone",
        title: "Call Us",
        details: "+91 78959 27366",
      },
      {
        icon: "map-pin",
        title: "Visit Us",
        details: "Tilak Road, Dehradun",
      },
      {
        icon: "clock",
        title: "Working Hours",
        details: "Mon-Sat: 10AM - 7PM",
      },
    ],
  },
};

const defaultAppointmentValues: AppointmentFormData = {
  title: "Schedule Your Free Consultation",
  description: "Fill out the form below and our team will contact you shortly",
  fields: {
    name: {
      label: "Full Name",
      placeholder: "Enter your full name",
    },
    email: {
      label: "Email Address",
      placeholder: "Enter your email address",
    },
    contactNumber: {
      label: "Contact Number",
      placeholder: "Enter your phone number",
    },
    message: {
      label: "Message",
      placeholder: "Tell us about your project",
    },
  },
  buttonText: "Schedule Consultation",
};

const ContactAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("hero");
  const [contactFormData, setContactFormData] =
    useState<ContactContent>(defaultContactValues);
  const [appointmentFormData, setAppointmentFormData] =
    useState<AppointmentFormData>(defaultAppointmentValues);
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [isSavingAppointment, setIsSavingAppointment] = useState(false);
  const [changedContactFields, setChangedContactFields] = useState<Set<string>>(
    new Set()
  );
  const [changedAppointmentFields, setChangedAppointmentFields] = useState<
    Set<string>
  >(new Set());

  const dispatch = useAppDispatch();
  const contactData = useAppSelector(selectContactContent);
  const contactLoading = useAppSelector(selectContactLoading);
  const contactError = useAppSelector(selectContactError);

  const appointmentData = useAppSelector(selectAppointmentForm);
  const appointmentLoading = useAppSelector(selectAppointmentFormLoading);
  const appointmentError = useAppSelector(selectAppointmentFormError);

  // Save contact data to backend
  const saveContactData = useCallback(
    async (dataToSave?: ContactContent) => {
      setIsSavingContact(true);
      try {
        await dispatch(
          updateContactContent(dataToSave || contactFormData)
        ).unwrap();
        setChangedContactFields(new Set());
        return true;
      } catch (error) {
        console.error("Save failed:", error);
        alert("Failed to save contact changes. Please try again.");
        return false;
      } finally {
        setIsSavingContact(false);
      }
    },
    [contactFormData, dispatch]
  );

  // Save appointment form data to backend
  const saveAppointmentFormData = useCallback(
    async (dataToSave?: AppointmentFormData) => {
      setIsSavingAppointment(true);
      try {
        await dispatch(
          updateAppointmentForm(dataToSave || appointmentFormData)
        ).unwrap();
        setChangedAppointmentFields(new Set());
        return true;
      } catch (error) {
        console.error("Save failed:", error);
        alert("Failed to save appointment form.");
        return false;
      } finally {
        setIsSavingAppointment(false);
      }
    },
    [appointmentFormData, dispatch]
  );

  // Manual save for text changes
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (changedContactFields.size > 0) {
      await saveContactData();
    }

    if (changedAppointmentFields.size > 0) {
      await saveAppointmentFormData();
    }
  };

  // Handle contact input changes
  const handleContactInputChange = (path: string, value: string | number) => {
    setContactFormData((prev: ContactContent) => {
      const newData: ContactContent = JSON.parse(JSON.stringify(prev));
      const parts = path.split(".");

      setChangedContactFields((prevFields) => new Set(prevFields.add(path)));

      const lastPart = parts.pop()!;
      let current: any = newData;

      for (const part of parts) {
        if (Array.isArray(current) && /^\d+$/.test(part)) {
          current = current[parseInt(part)];
        } else if (typeof current === "object" && current !== null) {
          current = current[part];
        } else {
          console.error("Invalid path encountered");
          return newData;
        }
      }

      if (typeof current === "object" && current !== null) {
        current[lastPart] = value;
      }

      return newData;
    });
  };

  // Handle appointment form input changes
  const handleAppointmentInputChange = (path: string, value: string) => {
    setAppointmentFormData((prev: AppointmentFormData) => {
      const newData: AppointmentFormData = JSON.parse(JSON.stringify(prev));
      const parts = path.split(".");

      setChangedAppointmentFields(
        (prevFields) => new Set(prevFields.add(path))
      );

      const lastPart = parts.pop()!;
      let current: any = newData;

      for (const part of parts) {
        if (typeof current === "object" && current !== null) {
          current = current[part];
        } else {
          console.error("Invalid path encountered");
          return newData;
        }
      }

      if (typeof current === "object" && current !== null) {
        current[lastPart] = value;
      }

      return newData;
    });
  };

  // Add new item to contact array
  const addContactArrayItem = <T,>(arrayPath: string, newItem: T) => {
    setContactFormData((prev: ContactContent) => {
      const newData: ContactContent = JSON.parse(JSON.stringify(prev));
      const parts = arrayPath.split(".");

      setChangedContactFields(
        (prevFields) => new Set(prevFields.add(arrayPath))
      );

      let current: any = newData;
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (
          typeof current === "object" &&
          current !== null &&
          part in current
        ) {
          current = current[part];
        }
      }

      const lastPart = parts[parts.length - 1];
      if (
        typeof current === "object" &&
        current !== null &&
        Array.isArray(current[lastPart])
      ) {
        current[lastPart] = [...current[lastPart], newItem];
      }

      return newData;
    });
  };

  // Remove item from contact array
  const removeContactArrayItem = (arrayPath: string, index: number) => {
    setContactFormData((prev: ContactContent) => {
      const newData: ContactContent = JSON.parse(JSON.stringify(prev));
      const parts = arrayPath.split(".");

      setChangedContactFields(
        (prevFields) => new Set(prevFields.add(arrayPath))
      );

      let current: any = newData;
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (Array.isArray(current) && /^\d+$/.test(part)) {
          current = current[parseInt(part)];
        } else if (typeof current === "object" && current !== null) {
          current = current[part];
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

      const array = current[lastPart];
      if (!Array.isArray(array)) {
        console.error("Invalid path: expected an array");
        return newData;
      }

      array.splice(index, 1);
      return newData;
    });
  };

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchContactContent());
    dispatch(fetchAppointmentForm());
  }, [dispatch]);

  // Update contact form when Redux data changes
  useEffect(() => {
    if (contactData) {
      console.log("Loaded contact data:", contactData);
      setContactFormData(contactData);
      setChangedContactFields(new Set());
    }
  }, [contactData]);

  // Update appointment form when Redux data changes
  useEffect(() => {    
    if (appointmentData) {
      console.log("Loaded appointment data:", appointmentData);
      setAppointmentFormData(appointmentData);
      setChangedAppointmentFields(new Set());
    }
  }, [appointmentData]);

  // Handle API errors
  useEffect(() => {
    if (contactError) {
      console.log("contactError", contactError);
      
      alert(contactError);
    }
    if (appointmentError) {
      console.log("appointmentError", appointmentError);
      
      alert(appointmentError);
    }
  }, [contactError, appointmentError]);

  // Tab navigation items
  const tabItems = [
    { value: "hero", icon: <FiImage />, label: "Hero" },
    { value: "whyChooseUs", icon: <FiStar />, label: "Why Choose Us" },
    {
      value: "appointmentForm",
      icon: <FiMessageSquare />,
      label: "Appointment Form",
    },
    { value: "contactInfo", icon: <FiPhone />, label: "Contact Info" },
  ];

  if (!contactFormData || !appointmentFormData) {
    return (
      <DashboardLayoutClient>
        <div className="flex justify-center items-center h-screen">
          <p>Loading content...</p>
        </div>
      </DashboardLayoutClient>
    );
  }

  const hasChanges =
    changedContactFields.size > 0 || changedAppointmentFields.size > 0;
  const isSaving = isSavingContact || isSavingAppointment;

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
                Contact Page Content Management
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage your contact page content and information
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                type="submit"
                variant="default"
                disabled={contactLoading || isSaving}
                className={cn(
                  "flex items-center gap-2 transition-all",
                  hasChanges && "ring-2 ring-lime-500"
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
                    {hasChanges ? "Publish Changes*" : "Publish Changes"}
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
          {contactError && (
            <motion.div
              className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <FiX className="mr-2" /> {contactError}
            </motion.div>
          )}

          {appointmentError && (
            <motion.div
              className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <FiX className="mr-2" /> {appointmentError}
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
                    <div className="space-y-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={contactFormData.hero?.title || ""}
                          onChange={(e) =>
                            handleContactInputChange(
                              "hero.title",
                              e.target.value
                            )
                          }
                          className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                        />
                      </div>

                      <div>
                        <Label>Subtitle</Label>
                        <Textarea
                          value={contactFormData.hero?.subtitle || ""}
                          onChange={(e) =>
                            handleContactInputChange(
                              "hero.subtitle",
                              e.target.value
                            )
                          }
                          rows={3}
                          className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                        />
                      </div>

                      <div>
                        <Label>Button Text</Label>
                        <Input
                          value={contactFormData.hero?.buttonText || ""}
                          onChange={(e) =>
                            handleContactInputChange(
                              "hero.buttonText",
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
            {/* Why Choose Us Tab */}
            <TabsContent value="whyChooseUs" className="mt-4">
              <motion.div variants={fadeIn} initial="hidden" animate="visible">
                <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 overflow-hidden">
                  <CardHeader className="bg-lime-50 dark:bg-slate-700">
                    <CardTitle className="text-lime-900 dark:text-lime-100">
                      Why Choose Us Section
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <Label>Section Title</Label>
                        <Input
                          value={contactFormData.whyChooseUs?.title || ""}
                          onChange={(e) =>
                            handleContactInputChange(
                              "whyChooseUs.title",
                              e.target.value
                            )
                          }
                          className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                        />
                      </div>

                      <div>
                        <Label>Section Description</Label>
                        <Textarea
                          value={contactFormData.whyChooseUs?.description || ""}
                          onChange={(e) =>
                            handleContactInputChange(
                              "whyChooseUs.description",
                              e.target.value
                            )
                          }
                          rows={3}
                          className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <Label className="text-lg">Tabs Content</Label>
                          <Button
                            onClick={() =>
                              addContactArrayItem("whyChooseUs.tabs", {
                                title: "New Tab",
                                icon: "star",
                                contentTitle: "Content Title",
                                description: "Tab description goes here",
                              })
                            }
                            type="button"
                            className="bg-lime-500 hover:bg-lime-600 text-white flex items-center gap-2"
                          >
                            <FiPlus className="w-4 h-4" /> Add Tab
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {(contactFormData.whyChooseUs?.tabs || []).map(
                            (tab, index: number) => (
                              <Card
                                key={index}
                                className="p-4 bg-lime-50 dark:bg-slate-700"
                              >
                                <div className="flex justify-between items-center mb-3">
                                  <Badge className="bg-lime-500 text-white">
                                    Tab {index + 1}
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      removeContactArrayItem(
                                        "whyChooseUs.tabs",
                                        index
                                      )
                                    }
                                    type="button"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <FiX className="w-4 h-4" />
                                  </Button>
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <Label>Tab Title</Label>
                                    <Input
                                      value={tab.title}
                                      onChange={(e) =>
                                        handleContactInputChange(
                                          `whyChooseUs.tabs.${index}.title`,
                                          e.target.value
                                        )
                                      }
                                      className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                    />
                                  </div>
                                  <div>
                                    <Label>Tab Icon</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Select
                                        value={tab.icon}
                                        onValueChange={(value) =>
                                          handleContactInputChange(
                                            `whyChooseUs.tabs.${index}.icon`,
                                            value
                                          )
                                        }
                                      >
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder="Select an icon" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {iconOptions.map((option) => (
                                            <SelectItem
                                              key={option.value}
                                              value={option.value}
                                            >
                                              <div className="flex items-center gap-2">
                                                {getStaticIcon(option.value)}
                                                {option.label}
                                              </div>
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Content Title</Label>
                                    <Input
                                      value={tab.contentTitle}
                                      onChange={(e) =>
                                        handleContactInputChange(
                                          `whyChooseUs.tabs.${index}.contentTitle`,
                                          e.target.value
                                        )
                                      }
                                      className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                    />
                                  </div>
                                  <div>
                                    <Label>Content Description</Label>
                                    <Textarea
                                      value={tab.description}
                                      onChange={(e) =>
                                        handleContactInputChange(
                                          `whyChooseUs.tabs.${index}.description`,
                                          e.target.value
                                        )
                                      }
                                      rows={3}
                                      className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                    />
                                  </div>
                                </div>
                              </Card>
                            )
                          )}
                        </div>
                      </div>

                      {/* Features section remains the same */}
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <Label className="text-lg">Feature Cards</Label>
                          <Button
                            onClick={() =>
                              addContactArrayItem("whyChooseUs.features", {
                                icon: "star",
                                title: "New Feature",
                                description: "Feature description goes here",
                              })
                            }
                            type="button"
                            className="bg-lime-500 hover:bg-lime-600 text-white flex items-center gap-2"
                          >
                            <FiPlus className="w-4 h-4" /> Add Feature
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(contactFormData.whyChooseUs?.features || []).map(
                            (feature, index: number) => (
                              <Card
                                key={index}
                                className="p-4 bg-lime-50 dark:bg-slate-700"
                              >
                                <div className="flex justify-between items-center mb-3">
                                  <Badge className="bg-lime-500 text-white">
                                    Feature {index + 1}
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      removeContactArrayItem(
                                        "whyChooseUs.features",
                                        index
                                      )
                                    }
                                    type="button"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <FiX className="w-4 h-4" />
                                  </Button>
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <Label>Icon</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Select
                                        value={feature.icon}
                                        onValueChange={(value) =>
                                          handleContactInputChange(
                                            `whyChooseUs.features.${index}.icon`,
                                            value
                                          )
                                        }
                                      >
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder="Select an icon" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {iconOptions.map((option) => (
                                            <SelectItem
                                              key={option.value}
                                              value={option.value}
                                            >
                                              <div className="flex items-center gap-2">
                                                {getStaticIcon(option.value)}
                                                {option.label}
                                              </div>
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Feature Title</Label>
                                    <Input
                                      value={feature.title}
                                      onChange={(e) =>
                                        handleContactInputChange(
                                          `whyChooseUs.features.${index}.title`,
                                          e.target.value
                                        )
                                      }
                                      className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                    />
                                  </div>
                                  <div>
                                    <Label>Feature Description</Label>
                                    <Textarea
                                      value={feature.description}
                                      onChange={(e) =>
                                        handleContactInputChange(
                                          `whyChooseUs.features.${index}.description`,
                                          e.target.value
                                        )
                                      }
                                      rows={3}
                                      className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                    />
                                  </div>
                                </div>
                              </Card>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            {/* Appointment Form Tab */}
            <TabsContent value="appointmentForm" className="mt-4">
              <AppointmentFormTab
                appointmentFormData={appointmentFormData}
                handleAppointmentInputChange={handleAppointmentInputChange}
              />
            </TabsContent>
            {/* Contact Info Tab */}
            <TabsContent value="contactInfo" className="mt-4">
              <motion.div variants={fadeIn} initial="hidden" animate="visible">
                <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 overflow-hidden">
                  <CardHeader className="bg-lime-50 dark:bg-slate-700">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lime-900 dark:text-lime-100">
                        Contact Information
                      </CardTitle>
                      <Button
                        onClick={() =>
                          addContactArrayItem("contactInfo.items", {
                            icon: "phone",
                            title: "New Contact",
                            details: "Contact details here",
                          })
                        }
                        type="button"
                        className="bg-lime-500 hover:bg-lime-600 text-white flex items-center gap-2"
                      >
                        <FiPlus className="w-4 h-4" /> Add Contact Info
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(contactFormData.contactInfo?.items || []).map(
                        (item, index: number) => (
                          <Card
                            key={index}
                            className="p-4 bg-lime-50 dark:bg-slate-700"
                          >
                            <div className="flex justify-between items-center mb-3">
                              <Badge className="bg-lime-500 text-white">
                                Item {index + 1}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  removeContactArrayItem(
                                    "contactInfo.items",
                                    index
                                  )
                                }
                                type="button"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <FiX className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <Label>Icon</Label>
                                <div className="flex items-center gap-2 mt-1">
                                  <Select
                                    value={item.icon}
                                    onValueChange={(value) =>
                                      handleContactInputChange(
                                        `contactInfo.items.${index}.icon`,
                                        value
                                      )
                                    }
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select an icon" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {iconOptions.map((option) => (
                                        <SelectItem
                                          key={option.value}
                                          value={option.value}
                                        >
                                          <div className="flex items-center gap-2">
                                            {getStaticIcon(option.value)}
                                            {option.label}
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div>
                                <Label>Title</Label>
                                <Input
                                  value={item.title}
                                  onChange={(e) =>
                                    handleContactInputChange(
                                      `contactInfo.items.${index}.title`,
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                />
                              </div>
                              <div>
                                <Label>Details</Label>
                                <Input
                                  value={item.details}
                                  onChange={(e) =>
                                    handleContactInputChange(
                                      `contactInfo.items.${index}.details`,
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 focus:ring-lime-500 focus:border-lime-500"
                                />
                              </div>
                            </div>
                          </Card>
                        )
                      )}
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

export default ContactAdminDashboard;
