"use client";
import React from "react";
import ComingSoonDashboard from "./ComingSoon";

function DashboardContent({ role }: { role: string }) {
  switch (role) {
    case "SuperAdmin":
      return <div>SuperAdmin Dashboard Content</div>;

    case "Client":
      return <div>Client Dashboard Content</div>;

    case "Designer":
      return <div>Designer Dashboard Content</div>;

    case "clientAdmin":
      return (
        <div>
          <ComingSoonDashboard />
        </div>
      );

    default:
      return <div>Unknown role</div>;
  }
}

export default DashboardContent;
