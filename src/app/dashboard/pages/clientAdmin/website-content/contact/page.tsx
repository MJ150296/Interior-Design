import DashboardLayoutClient from "@/app/dashboard/client_side_layout/ClientSideDashboardLayout";
import React from "react";

("use client");

const ContactPage: React.FC = () => {
  return (
    <DashboardLayoutClient>
      <div>
        <h1>Contact Page</h1>
        <p>This is the contact page for the client admin website content.</p>
      </div>
    </DashboardLayoutClient>
  );
};

export default ContactPage;
