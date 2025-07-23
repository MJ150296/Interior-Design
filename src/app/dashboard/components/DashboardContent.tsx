"use client";
import React from "react";

function DashboardContent({ role }: { role: string }) {
  switch (role) {
    case "SuperAdmin":
      return <div>SuperAdmin Dashboard Content</div>;

    case "Client":
      return <div>Client Dashboard Content</div>;

    case "Designer":
      return <div>Designer Dashboard Content</div>;

    case "clientAdmin":
      return <div>Client Admin Dashboard Content</div>;

    default:
      return <div>Unknown role</div>;
  }
}

export default DashboardContent;
