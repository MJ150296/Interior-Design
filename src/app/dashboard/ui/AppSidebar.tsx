"use client";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Home,
  User,
  FileEdit,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { SignOut } from "@/app/components/auth/signout-button";

// Define all menu items for interior design business
const allMenuItems = [
  {
    name: "Dashboard",
    icon: <Home size={20} />,
    path: (role: string) => `/dashboard/pages/${role}`,
    roles: ["SuperAdmin", "Client", "Designer", "clientAdmin"], // Removed Admin, added Client + clientAdmin
  },
  {
    name: "Website Content",
    icon: <FileEdit size={20} />,
    path: (role: string) => `/dashboard/pages/${role}/website-content`,
    roles: ["SuperAdmin", "Client", "clientAdmin"], // Removed Admin, added Client + clientAdmin
    subItems: [
      {
        name: "Home Page",
        path: (role: string) => `/dashboard/pages/${role}/website-content/home`,
      },
      {
        name: "About Us",
        path: (role: string) =>
          `/dashboard/pages/${role}/website-content/about-us`,
      },
      {
        name: "Portfolio",
        path: (role: string) =>
          `/dashboard/pages/${role}/website-content/portfolio`,
      },
      {
        name: "Services",
        path: (role: string) =>
          `/dashboard/pages/${role}/website-content/services`,
      },
      {
        name: "Testimonials",
        path: (role: string) =>
          `/dashboard/pages/${role}/website-content/testimonials`,
      },
      {
        name: "Blogs",
        path: (role: string) =>
          `/dashboard/pages/${role}/website-content/blogs`,
      },
      {
        name: "Contact Us",
        path: (role: string) =>
          `/dashboard/pages/${role}/website-content/contact`,
      },
    ],
  },
  // {
  //   name: "Projects",
  //   icon: <LayoutGrid size={20} />,
  //   path: (role: string) => `/dashboard/pages/${role}/projects`,
  //   roles: ["SuperAdmin", "Client", "Designer", "clientAdmin"], // Updated roles
  // },
  // {
  //   name: "Design Portfolio",
  //   icon: <Palette size={20} />,
  //   path: (role: string) => `/dashboard/pages/${role}/portfolio`,
  //   roles: ["SuperAdmin", "Client", "Designer"], // Updated roles
  // },
  // {
  //   name: "Clients",
  //   icon: <Users size={20} />,
  //   path: (role: string) => `/dashboard/pages/${role}/clients`,
  //   roles: ["SuperAdmin", "Client", "Designer"], // Updated roles
  // },
  // {
  //   name: "Appointments",
  //   icon: <Calendar size={20} />,
  //   path: (role: string) => `/dashboard/pages/${role}/appointments`,
  //   roles: ["SuperAdmin", "Client", "Designer"], // Updated roles
  // },
  // {
  //   name: "Testimonials",
  //   icon: <MessageSquare size={20} />,
  //   path: (role: string) => `/dashboard/pages/${role}/testimonials`,
  //   roles: ["SuperAdmin", "Client", "clientAdmin"], // Updated roles
  // },
  // {
  //   name: "Blog Management",
  //   icon: <BookOpen size={20} />,
  //   path: (role: string) => `/dashboard/pages/${role}/blog`,
  //   roles: ["SuperAdmin", "Client", "Designer"], // Updated roles
  // },
  // {
  //   name: "Vendors",
  //   icon: <Building size={20} />,
  //   path: (role: string) => `/dashboard/pages/${role}/vendors`,
  //   roles: ["SuperAdmin", "Client", "clientAdmin"], // Updated roles
  // },
  // {
  //   name: "Gallery",
  //   icon: <GalleryVerticalEnd size={20} />,
  //   path: (role: string) => `/dashboard/pages/${role}/gallery`,
  //   roles: ["SuperAdmin", "Client", "Designer"], // Updated roles
  // },
  {
    name: "Profile Settings",
    icon: <User size={20} />,
    path: (role: string) => `/dashboard/pages/${role}/profile-settings`,
    roles: ["SuperAdmin", "Client", "Designer", "clientAdmin"], // Removed Admin, added Client
  },
  // {
  //   name: "Business Settings",
  //   icon: <Settings size={20} />,
  //   path: (role: string) => `/dashboard/pages/${role}/settings`,
  //   roles: ["SuperAdmin", "Client", "clientAdmin"], // Updated roles
  // },
];

export function AppSidebar() {
  const { data: session, status } = useSession();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );

  if (status === "loading" || !session) {
    return null;
  }

  const userRole = session?.user?.role || "clientAdmin";

  // Toggle expansion state for menu items
  const toggleExpand = (itemName: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  // Filter menu items based on user role
  const filteredMenuItems = allMenuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <>
      <Sidebar className="min-h-screen border-r border-lime-600 shadow-lg shadow-lime-800">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="border-2 border-dashed rounded-xl w-16 h-16" />
            <div>
              <h2 className="text-sm font-semibold text-gray-700">
                RIDDHI INTERIORS
              </h2>
              <h3 className="text-xl font-semibold text-gray-900">
                {session?.user?.name || "Guest"}
              </h3>
            </div>
          </div>
          <div className="text-xs px-2 py-1 bg-lime-100 text-lime-800 rounded-full inline-block capitalize">
            {userRole}
          </div>
        </SidebarHeader>

        <SidebarContent className="p-2">
          {filteredMenuItems.map((item, index) => {
            const path =
              typeof item.path === "function" ? item.path(userRole) : item.path;
            const isExpanded = expandedItems[item.name];

            return (
              <SidebarGroup key={index} className="mb-1">
                <div className="flex flex-col">
                  {/* Main menu item - either link or dropdown toggle */}
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.subItems ? "#" : path}
                      className={`flex items-center gap-3 p-2 text-gray-700 hover:bg-lime-50 hover:text-lime-800 rounded transition-colors flex-1 ${
                        item.subItems ? "cursor-pointer" : ""
                      }`}
                      onClick={(e) => {
                        if (item.subItems) {
                          e.preventDefault();
                          toggleExpand(item.name);
                        }
                      }}
                    >
                      <span className="text-lime-600">{item.icon}</span>
                      <span className="flex-1 text-left">{item.name}</span>
                    </Link>

                    {/* Dropdown toggle icon */}
                    {item.subItems && (
                      <button
                        onClick={() => toggleExpand(item.name)}
                        className="p-2 text-gray-500 hover:text-lime-700"
                      >
                        {isExpanded ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Sub-items dropdown */}
                  {item.subItems && isExpanded && (
                    <div className="pl-8 mt-1 animate-fadeIn">
                      {item.subItems.map((subItem, subIndex) => {
                        const subPath =
                          typeof subItem.path === "function"
                            ? subItem.path(userRole)
                            : subItem.path;

                        return (
                          <Link
                            key={subIndex}
                            href={subPath}
                            className="flex items-center gap-2 p-2 text-sm text-gray-600 hover:bg-lime-50 hover:text-lime-700 rounded transition-colors"
                          >
                            <span className="w-2 h-2 bg-lime-400 rounded-full"></span>
                            {subItem.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </SidebarGroup>
            );
          })}
        </SidebarContent>

        <SidebarFooter className="p-4 border-t border-gray-200">
          <SignOut />
        </SidebarFooter>
      </Sidebar>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </>
  );
}
