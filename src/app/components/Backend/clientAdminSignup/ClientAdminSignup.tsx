"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

// Zod validation schema
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  fullName: z.string().min(2, { message: "Full name is required" }),
  contactNumber: z
    .string()
    .min(10, { message: "Contact number must be at least 10 digits" }),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

const ClientAdminSignup = () => {
  const router = useRouter();
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      contactNumber: "",
      address: {
        street: "",
        city: "",
        state: "",
        postalCode: "",
      },
    },
  });

  useEffect(() => {
    const checkClientAdmin = async () => {
      try {
        const res = await fetch("/api/auth/checkClientAdmin");
        const data = await res.json();

        if (data.clientAdminExists) {
          router.push("/api/auth/signin");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error checking clientAdmin status:", error.message);
          setError(error.message || "An unexpected error occurred");
        } else {
          console.error("An unexpected error occurred");
        }
      }
    };

    checkClientAdmin();
  }, [router]);

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/clientAdmin/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      if (response.status === 201) {
        router.push("/api/auth/signin");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Signup failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-5 bg-lime-50 min-h-screen">
      <Card className="max-w-2xl mx-auto p-5 shadow-lg border border-lime-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-lime-800">
            Create Client Admin
          </CardTitle>
        </CardHeader>
        <Separator className="bg-lime-200" />
        <CardContent className="pt-6">
          {error && (
            <Alert
              variant="destructive"
              className="mb-6 border-l-4 border-lime-500"
            >
              <ExclamationTriangleIcon className="h-4 w-4 text-lime-700" />
              <AlertTitle className="text-lime-700">Error</AlertTitle>
              <AlertDescription className="text-lime-600">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lime-800">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="admin@company.com"
                          type="email"
                          className="focus:border-lime-500 focus:ring-lime-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lime-800">Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="At least 6 characters"
                          type="password"
                          className="focus:border-lime-500 focus:ring-lime-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lime-800">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          className="focus:border-lime-500 focus:ring-lime-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contact Number */}
                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lime-800">
                        Contact Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="(123) 456-7890"
                          className="focus:border-lime-500 focus:ring-lime-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Address Fields */}
              <div className="border border-lime-200 rounded-lg p-4 space-y-4 bg-lime-50">
                <h3 className="font-medium text-lime-700">
                  Address (Optional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="address.street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lime-800">Street</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123 Main St"
                            className="focus:border-lime-500 focus:ring-lime-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lime-800">City</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="New York"
                            className="focus:border-lime-500 focus:ring-lime-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lime-800">State</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="NY"
                            className="focus:border-lime-500 focus:ring-lime-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lime-800">
                          Postal Code
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="10001"
                            className="focus:border-lime-500 focus:ring-lime-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-lime-600 hover:bg-lime-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Client Admin"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientAdminSignup;
