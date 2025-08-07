"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface SignupForm {
  email: string;
  password: string;
  confirmPassword: string;
}

const SuperAdminSignup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkSuperAdmin = async () => {
      try {
        const res = await fetch("/api/auth/checkSuperAdmin");
        const data = await res.json();

        if (data.superAdminExists) {
          router.push("/api/auth/signin");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error checking superAdmin status:", error.message);
          setError(error.message || "An unexpected error occurred");
        } else {
          console.error("An unexpected error occurred");
        }
      }
    };

    checkSuperAdmin();
  }, [router]);

  const onSubmit = async (data: SignupForm) => {
    setLoading(true);
    setError("");

    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/superAdmin/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || "Something went wrong");
      }

      router.push("/iamadmin");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        console.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-lime-50 p-4">
      <div className="w-full max-w-md p-6 bg-white border border-lime-200 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-lime-800 text-center mb-4">
          SuperAdmin Signup
        </h2>

        {error && (
          <div className="mb-4 p-3 border-l-4 border-lime-500 bg-lime-100 text-lime-700 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-3 py-2 border border-lime-300 rounded focus:border-lime-500 focus:ring focus:ring-lime-200 text-lime-800 placeholder:text-lime-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              className="w-full px-3 py-2 border border-lime-300 rounded focus:border-lime-500 focus:ring focus:ring-lime-200 text-lime-800 placeholder:text-lime-400"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Confirm Password is required",
              })}
              className="w-full px-3 py-2 border border-lime-300 rounded focus:border-lime-500 focus:ring focus:ring-lime-200 text-lime-800 placeholder:text-lime-400"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-lime-600 text-white py-2 rounded hover:bg-lime-700 transition disabled:bg-gray-400"
          >
            {loading ? "Creating..." : "Create SuperAdmin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SuperAdminSignup;
