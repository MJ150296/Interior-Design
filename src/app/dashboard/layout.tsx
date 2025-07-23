import { ReactNode } from "react";
import { auth } from "../auth";
import { redirect } from "next/navigation";

// src/app/dashboard/layout.tsx
export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  // If no session, send user to login
  if (!session) {
    redirect("/api/auth/signin"); // or "/auth/signin"
  }
  return <>{children}</>;
}
