"use client";

import React, { useEffect, useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import ApiMethod from "@/services/api-method";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

type Treatment = {
  _id: string;
  name: string;
};

type AppointmentEnquiryFormProps = {
  idPrefix?: string;
  onSuccess?: () => void;
  compact?: boolean;
};

export default function AppointmentEnquiryForm({
  idPrefix = "",
  onSuccess,
  compact = false,
}: AppointmentEnquiryFormProps) {
  const { companyName } = useSiteSettings();
  const fieldId = (name: string) => (idPrefix ? `${idPrefix}-${name}` : name);

  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredTreatment: "",
    date: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    ApiMethod.get("/api/treatments")
      .then((result) => {
        if (result.success && result.data.length > 0) {
          setTreatments(result.data);
          setFormData((prev) => ({
            ...prev,
            preferredTreatment: result.data[0]._id,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.date ||
      !formData.preferredTreatment
    ) {
      setStatus("error");
      setErrorMessage("Please fill out all required fields marked with *");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const result = await ApiMethod.post("/api/book-appointment", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        preferredTreatment: formData.preferredTreatment,
        preferredDate: formData.date,
      });

      if (!result.success) {
        setStatus("error");
        const detail = typeof result.error === "string" ? result.error : undefined;
        setErrorMessage(
          detail
            ? `${result.message || "Failed to book appointment"}: ${detail}`
            : result.message || "Failed to book appointment"
        );
        return;
      }

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        preferredTreatment: treatments[0]?._id ?? "",
        date: "",
        message: "",
      });
      onSuccess?.();
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const titleClass = compact
    ? "text-lg font-bold text-slate-900 dark:text-white"
    : "text-xl sm:text-2xl font-bold text-slate-900 dark:text-white";

  if (status === "success") {
    return (
      <div className="text-center py-8 sm:py-12 space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400 rounded-full">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Appointment Requested!
        </h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-sm sm:text-base">
          Thank you for scheduling your visit at {companyName}. A confirmation was sent to your
          email. Our clinic manager will call you shortly to confirm your appointment slot.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 px-6 rounded-full transition-colors cursor-pointer"
        >
          Schedule Another Appointment
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className={titleClass}>Schedule an Appointment</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label
            htmlFor={fieldId("name")}
            className="block text-sm font-semibold text-slate-700 dark:text-slate-350"
          >
            Your Name *
          </label>
          <input
            type="text"
            id={fieldId("name")}
            name="name"
            required
            placeholder="e.g. Amit Kumar"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor={fieldId("email")}
            className="block text-sm font-semibold text-slate-700 dark:text-slate-350"
          >
            Email Address *
          </label>
          <input
            type="email"
            id={fieldId("email")}
            name="email"
            required
            autoComplete="email"
            placeholder="e.g. you@example.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label
            htmlFor={fieldId("phone")}
            className="block text-sm font-semibold text-slate-700 dark:text-slate-350"
          >
            Phone Number *
          </label>
          <input
            type="tel"
            id={fieldId("phone")}
            name="phone"
            required
            placeholder="e.g. +91 95259 89736"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"
          />
        </div>

        <div className="space-y-2 sm:col-span-1">
          <label
            htmlFor={fieldId("date")}
            className="block text-sm font-semibold text-slate-700 dark:text-slate-350"
          >
            Preferred Date *
          </label>
          <input
            type="date"
            id={fieldId("date")}
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label
            htmlFor={fieldId("preferredTreatment")}
            className="block text-sm font-semibold text-slate-700 dark:text-slate-350"
          >
            Preferred Treatment
          </label>
          <select
            id={fieldId("preferredTreatment")}
            name="preferredTreatment"
            value={formData.preferredTreatment}
            onChange={handleChange}
            required
            className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"
          >
            {treatments.length === 0 ? (
              <option value="">Loading treatments...</option>
            ) : (
              treatments.map((treatment) => (
                <option key={treatment._id} value={treatment._id}>
                  {treatment.name}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor={fieldId("message")}
          className="block text-sm font-semibold text-slate-700 dark:text-slate-350"
        >
          Additional Message (Optional)
        </label>
        <textarea
          id={fieldId("message")}
          name="message"
          rows={compact ? 3 : 4}
          placeholder="Describe any symptoms or details you would like to share..."
          value={formData.message}
          onChange={handleChange}
          className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"
        />
      </div>

      {status === "error" && (
        <p className="text-red-500 text-sm font-bold">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full flex items-center justify-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white py-3.5 px-6 rounded-full text-base font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="w-5 h-5" />
        <span>{status === "submitting" ? "Requesting..." : "Submit Booking Request"}</span>
      </button>
    </form>
  );
}
