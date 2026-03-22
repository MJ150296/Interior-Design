import { ReactNode } from "react";
import type { Metadata } from "next";
import { auth } from "../auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import StoreProvider from "../redux/providers";
import DashboardLayoutClient from "./client_side_layout/ClientSideDashboardLayout";
import { buildPublicMetadata } from "@/lib/seo";

// src/app/dashboard/layout.tsx
export const metadata: Metadata = buildPublicMetadata({
  title: "Dashboard",
  description: "Private dashboard.",
  path: "/dashboard",
  noIndex: true,
});

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  // Extract role (assuming your session has user.role)
  const role = session?.user?.role;

  // If no session, send user to login
  if (!session) {
    redirect("/api/auth/signin");
  }

  // All authenticated roles use the same dashboard layout
  // Role-specific content is handled by individual pages
  const validRoles = ["SuperAdmin", "clientAdmin", "Designer", "Client"];
  if (!role || !validRoles.includes(role)) {
    return <div>Unauthorized</div>;
  }

  return (
    <SessionProvider session={session}>
      <StoreProvider>
        <DashboardLayoutClient>{children}</DashboardLayoutClient>
      </StoreProvider>
    </SessionProvider>
  );
}
