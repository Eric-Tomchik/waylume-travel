"use client";

/**
 * Persistent left-hand navigation for the advisor dashboard.
 * Rendered by app/admin/layout.tsx for every /admin route except the sign-in
 * screen, so each feature is one click away from anywhere in the dashboard.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavItem = { href: string; label: string; icon: string };
type NavGroup = { heading: string; items: NavItem[] };

const NAV: NavGroup[] = [
  {
    heading: "Pipeline",
    items: [
      { href: "/admin/overview", label: "Overview", icon: "◎" },
      { href: "/admin", label: "Trip inquiries", icon: "✈" },
      { href: "/admin/quotes", label: "Quotes", icon: "$" },
      { href: "/admin/itineraries", label: "Itineraries", icon: "▤" },
    ],
  },
  {
    heading: "Content",
    items: [
      { href: "/admin/fora-deals", label: "Fora deals", icon: "★" },
      { href: "/admin/promotions", label: "Promotions", icon: "◆" },
      { href: "/admin/suppliers", label: "Suppliers", icon: "⛨" },
      { href: "/admin/policies", label: "Fora policies", icon: "§" },
    ],
  },
  {
    heading: "Travelers",
    items: [
      { href: "/admin/portal-access", label: "Portal access", icon: "⚿" },
      { href: "/admin/notifications", label: "Notifications", icon: "◔" },
      { href: "/admin/analytics", label: "Analytics", icon: "◑" },
    ],
  },
  {
    heading: "Account",
    items: [{ href: "/admin/settings", label: "Settings", icon: "⚙" }],
  },
];

const COLLAPSE_KEY = "waylume-admin-sidebar-collapsed";

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminSidebar() {
  const pathname = usePathname() || "";
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {
      /* private mode */
    }
  }, []);

  // Navigating on a phone should always close the slide-over.
  useEffect(() => setMobileOpen(false), [pathname]);

  function toggleCollapsed() {
    setCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  return (
    <>
      <button
        className="admin-sidebar-trigger"
        type="button"
        aria-label="Open dashboard menu"
        onClick={() => setMobileOpen(true)}
      >
        ☰
      </button>
      {mobileOpen && <div className="admin-sidebar-scrim" onClick={() => setMobileOpen(false)} />}
      <aside
        className={`admin-sidebar${collapsed ? " is-collapsed" : ""}${mobileOpen ? " is-open" : ""}`}
        aria-label="Dashboard navigation"
      >
        <div className="admin-sidebar-brand">
          <Link href="/admin/overview" aria-label="Waylume dashboard home">
            <span className="admin-sidebar-mark">W</span>
            <span className="admin-sidebar-wordmark">
              <b>Waylume</b>
              <small>Advisor dashboard</small>
            </span>
          </Link>
          <button
            type="button"
            className="admin-sidebar-collapse"
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
            title={collapsed ? "Expand navigation" : "Collapse navigation"}
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          {NAV.map(group => (
            <div className="admin-sidebar-group" key={group.heading}>
              <span className="admin-sidebar-heading">{group.heading}</span>
              {group.items.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={isActive(pathname, item.href) ? "is-active" : undefined}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                >
                  <span className="admin-sidebar-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="admin-sidebar-label">{item.label}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link href="/" className="admin-sidebar-exit">
            <span className="admin-sidebar-icon" aria-hidden="true">
              ↗
            </span>
            <span className="admin-sidebar-label">View public site</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
