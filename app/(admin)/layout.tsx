import Link from "next/link";
import { LayoutDashboard, Stethoscope } from "lucide-react";
import ClinicName from "@/components/ClinicName";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/treatments", label: "Treatments", icon: Stethoscope },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <div className="flex min-h-screen">
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

          <div className="p-4 border-t border-slate-800">
            <Link
              href="/"
              className="block text-center text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors"
            >
              ← Back to Website
            </Link>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between">
            <ClinicName variant="light" />
            <Link href="/" className="text-sm text-brand-400 font-semibold">
              Website
            </Link>
          </header>

          <nav className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex gap-2 overflow-x-auto">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-slate-600 bg-slate-100 whitespace-nowrap"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
