import React from "react";
import DashboardLayoutClient from "../../client_side_layout/ClientSideDashboardLayout";
import { redirect } from "next/navigation";
import { auth } from "@/app/auth";
import DashboardContent from "../../components/DashboardContent";

const ClientAdminPage: React.FC = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }
  return <DashboardContent role={session.user.role} />;
};

export default ClientAdminPage;
