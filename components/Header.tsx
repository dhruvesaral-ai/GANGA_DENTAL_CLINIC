"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Phone, Calendar, LayoutDashboard, LogIn } from "lucide-react";
import ClinicName from "@/components/ClinicName";
import ApiMethod from "@/services/api-method";
import { useBookAppointmentAction } from "@/contexts/AppointmentModalContext";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const bookAppointment = useBookAppointmentAction();

  useEffect(() => {
    ApiMethod.get("/api/auth/me")
      .then((res) => {
        if (res.success && res.data?.user) {
          setAuthUser(res.data.user);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
      return;
    }
    // Section lives on the home page; navigate there from other routes.
    router.push(`/#${id}`);
  };

  const handleBookAppointment = () => {
    setIsOpen(false);
    bookAppointment();
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div
              onClick={() => {
                if (pathname === "/") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                  router.push("/");
                }
              }}
              className="flex items-center cursor-pointer group"
            >
              <ClinicName />
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              {["Services", "About", "Reviews", "FAQ", "Contact"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-200 cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              {authUser?.role === "admin" && (
                <Link
                  href="/admin"
                  className="flex items-center space-x-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-200"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}
              {!authUser && (
                <Link
                  href="/login"
                  className="flex items-center space-x-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}
              <a
                href="tel:+919525989736"
                className="flex items-center space-x-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors duration-200"
              >
                <Phone className="w-4 h-4" />
                <span>+91 952598 9736</span>
              </a>
              <button
                type="button"
                onClick={handleBookAppointment}
                className="inline-flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </button>
            </div>

            <div className="md:hidden flex items-center space-x-3">
              <a
                href="tel:+919525989736"
                className="p-2 rounded-full bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400 hover:scale-105 transition-transform duration-200"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <button
        type="button"
        aria-label="Close menu"
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-[60] bg-slate-900/50 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`fixed top-0 left-0 z-[70] h-full w-[min(100%,18rem)] flex flex-col bg-white dark:bg-slate-900 shadow-xl transition-transform duration-300 ease-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <ClinicName />
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col space-y-1">
          {["Services", "About", "Reviews", "FAQ", "Contact"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => scrollToSection(item.toLowerCase())}
              className="text-left py-3 px-3 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-600 transition-colors"
            >
              {item}
            </button>
          ))}

          <hr className="border-slate-200 dark:border-slate-800 my-3" />

          {authUser?.role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 py-3 px-3 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <LayoutDashboard className="w-5 h-5" />
              Admin Dashboard
            </Link>
          )}
          {!authUser && (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 py-3 px-3 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <LogIn className="w-5 h-5" />
              Login
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={handleBookAppointment}
            className="w-full flex items-center justify-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-full text-base font-semibold shadow-md transition-all"
          >
            <Calendar className="w-5 h-5" />
            <span>Book Appointment</span>
          </button>
        </div>
      </aside>
    </>
  );
}
