"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { X } from "lucide-react";
import AppointmentEnquiryForm from "@/components/AppointmentEnquiryForm";

type AppointmentModalContextValue = {
  openAppointmentModal: () => void;
  closeAppointmentModal: () => void;
};

const AppointmentModalContext = createContext<AppointmentModalContextValue | null>(null);

export function AppointmentModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const openAppointmentModal = useCallback(() => setOpen(true), []);
  const closeAppointmentModal = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAppointmentModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeAppointmentModal]);

  return (
    <AppointmentModalContext.Provider
      value={{ openAppointmentModal, closeAppointmentModal }}
    >
      {children}

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="appointment-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            aria-label="Close appointment form"
            onClick={closeAppointmentModal}
          />
          <div className="relative z-10 w-full max-w-lg max-h-[92dvh] overflow-y-auto bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4 mb-4">
              <p id="appointment-modal-title" className="text-sm font-bold uppercase tracking-wider text-brand-600">
                Book Visit
              </p>
              <button
                type="button"
                onClick={closeAppointmentModal}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <AppointmentEnquiryForm idPrefix="modal" compact />
          </div>
        </div>
      )}
    </AppointmentModalContext.Provider>
  );
}

export function useAppointmentModal() {
  const ctx = useContext(AppointmentModalContext);
  if (!ctx) {
    throw new Error("useAppointmentModal must be used within AppointmentModalProvider");
  }
  return ctx;
}

/** Opens modal on small screens; scrolls to contact on md+. */
export function useBookAppointmentAction() {
  const { openAppointmentModal } = useAppointmentModal();

  return useCallback(() => {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
      openAppointmentModal();
      return;
    }
    const element = document.getElementById("contact");
    if (element) {
      const offset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, [openAppointmentModal]);
}
