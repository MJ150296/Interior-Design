// src/app/dashboard/pages/[role]/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/app/auth";
import DashboardContent from "../../components/DashboardContent";
import DashboardLayoutClient from "../../client_side_layout/ClientSideDashboardLayout";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return <DashboardContent role={session.user.role} />;
}
