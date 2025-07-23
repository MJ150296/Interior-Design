// src/app/dashboard/layout.tsx
"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../ui/AppSidebar";
import LoadingSpinner from "../components/Loading";

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/api/auth/signin");
    } else if (status === "authenticated") {
      setIsLoading(false);
    }
  }, [status]);

  if (status === "loading" || isLoading) {
    return <LoadingSpinner text="PLEASE WAIT" />;
  }

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-amber-50">
        <AppSidebar />
        <main className="flex-1 px-1 md:px-2 w-full overflow-auto">
          <SidebarTrigger />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
