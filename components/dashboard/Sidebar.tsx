import React from "react";
import { sidebarItems } from "@/data/dashboardSidebarMenu";
import { checkRole } from "@/utils/roles";
import { Roles } from "@/types/globals";
import SidebarItem from "./SidebarItem";

export default async function Sidebar() {
  // Check for user role directly (server-side)
  let userRole: Roles = "student"; // Default to student

  if (await checkRole("admin")) {
    userRole = "admin";
  } else if (await checkRole("instructor")) {
    userRole = "instructor";
  }

  // Filter sidebar items based on user role
  const filteredItems = sidebarItems.filter((item) =>
    item.roles?.includes(userRole)
  );

  return (
    <div className="sidebar -dashboard">
      {filteredItems.map((elm, i) => (
        <SidebarItem key={i} item={elm} />
      ))}
    </div>
  );
}
