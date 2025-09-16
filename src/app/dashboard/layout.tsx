import { ReactNode } from "react";
import { auth } from "../auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { ReduxProvider } from "../redux/providers";
import DashboardLayoutClient from "./client_side_layout/ClientSideDashboardLayout";

// src/app/dashboard/layout.tsx
export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  // Extract role (assuming your session has user.role)
  const role = session?.user?.role;

  // Role-based rendering
  const getLayout = () => {
    switch (role) {
      case "SuperAdmin":
        return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
      case "clientAdmin":
        return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
      case "Designer":
        return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
      case "Client":
        return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
      default:
        return <div>Unauthorized</div>;
    }
  };

  // If no session, send user to login
  if (!session) {
    redirect("/api/auth/signin"); // or "/auth/signin"
  }
  return (
    <>
      <SessionProvider session={session}>
        <ReduxProvider>{getLayout()}</ReduxProvider>
      </SessionProvider>
    </>
  );
}
