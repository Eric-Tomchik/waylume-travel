import type { ReactNode } from "react";
import "./admin.css";
import AdminSidebarGate from "@/components/AdminSidebarGate";

/**
 * Applies the saved appearance before first paint so the dashboard never
 * flashes light theme on the way to dark.
 */
const bootstrap = `(function(){try{
var t=localStorage.getItem("waylume-admin-theme")||"system";
var r=t==="system"?(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):t;
document.documentElement.setAttribute("data-admin-theme",r);
document.documentElement.setAttribute("data-admin-density",localStorage.getItem("waylume-admin-density")||"comfortable");
var a=localStorage.getItem("waylume-admin-accent");
if(a)document.documentElement.style.setProperty("--admin-accent",a);
}catch(e){}})();`;

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: bootstrap }} />
      <AdminSidebarGate />
      {children}
    </>
  );
}
