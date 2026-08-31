"use client";

/** Hides the dashboard sidebar on the sign-in screen, shows it everywhere else. */

import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

export default function AdminSidebarGate() {
  const pathname = usePathname() || "";
  if (pathname.startsWith("/admin/login")) return null;
  return <AdminSidebar />;
}
