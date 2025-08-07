// src/app/auth/redirect/page.tsx
// "use client";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

export default async function AuthRedirectPage() {

  const session = await auth();
  // If user is logged in, redirect based on role
  if (session?.user?.role) {
    redirect(`/dashboard/pages/${session.user.role}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Signing you in...</h1>
        <p>Redirecting to your dashboard</p>
        <div className="mt-6">
          <button
            className="text-blue-600 underline"
            onClick={() => redirect("/iamadmin")}
          >
            Click here if not redirected automatically
          </button>
        </div>
      </div>
    </div>
  );
}
