"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Stethoscope,
  CalendarDays,
  Search,
  Settings,
  Menu,
  X,
  Images,
} from "lucide-react";
import ClinicName from "@/components/ClinicName";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/admin/treatments", label: "Treatments", icon: Stethoscope },
  { href: "/admin/gallery", label: "Gallery & Media", icon: Images },
  { href: "/admin/seo", label: "Manage SEO", icon: Search },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  return (
    <div className="h-screen bg-slate-100 font-sans overflow-hidden">
      <div className="flex h-screen overflow-hidden">
        <aside className="hidden md:flex w-64 flex-col bg-slate-900 text-white shrink-0">
          <div className="p-6 border-b border-slate-800">
            <ClinicName variant="light" />
            <p className="mt-3 text-xs uppercase tracking-wider text-slate-400">Admin Panel</p>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-800 space-y-3">
            <AdminLogoutButton />
            <Link
              href="/"
              className="block text-center text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors"
            >
              ← Back to Website
            </Link>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-slate-300 hover:bg-slate-800"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <ClinicName variant="light" />
            <Link href="/" className="text-sm text-brand-400 font-semibold shrink-0">
              Website
            </Link>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
        </div>
      </div>

      <button
        type="button"
        aria-label="Close menu"
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 z-40 bg-slate-900/50 transition-opacity duration-300 md:hidden ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[min(100%,17rem)] flex flex-col bg-slate-900 text-white shadow-xl transition-transform duration-300 ease-out md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!sidebarOpen}
      >
        <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-3">
          <div>
            <ClinicName variant="light" />
            <p className="mt-2 text-xs uppercase tracking-wider text-slate-400">Admin Panel</p>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  active
                    ? "bg-slate-800 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-3">
          <AdminLogoutButton />
          <Link
            href="/"
            onClick={() => setSidebarOpen(false)}
            className="block text-center text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors"
          >
            ← Back to Website
          </Link>
        </div>
      </aside>
    </div>
  );
}
