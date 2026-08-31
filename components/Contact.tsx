"use client";

import React, { useEffect, useState } from "react";
import { Phone, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import ApiMethod from "@/services/api-method";

type Treatment = {
  _id: string;
  name: string;
};

export default function Contact() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [formData, setFormData] = useState({
    name: "",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date || !formData.preferredTreatment) {
      setStatus("error");
      setErrorMessage("Please fill out all required fields marked with *");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const result = await ApiMethod.post("/api/book-appointment", {
        name: formData.name,
        phone: formData.phone,
        message: formData.message,
        preferredTreatment: formData.preferredTreatment,
        preferredDate: formData.date,
      });

      if (!result.success) {
        setStatus("error");
        setErrorMessage(result.message || "Failed to book appointment");
        return;
      }

      setStatus("success");
      setFormData({
        name: "",
        phone: "",
        preferredTreatment: treatments[0]?._id ?? "",
        date: "",
        message: "",
      });
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Book Visit
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Get In Touch & Schedule Today
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-500 dark:text-slate-400">
            Have questions or want to secure your spot? Fill out our form, visit our clinic, or call us directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Info & Map (Spans 5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            
            {/* Info Cards */}
            <div className="space-y-6">
              
              {/* Address */}
              <div className="flex items-start space-x-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-3 bg-brand-50 dark:bg-brand-950/40 rounded-xl text-brand-600 dark:text-brand-400 shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-100">Clinic Location</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-450 mt-1 leading-relaxed">
                    Road No:- 2, Dwarika Puri, House no:- 281, Hanuman Nagar, Kankarbagh, Patna, Bihar 800020
                  </p>
                </div>
              </div>

              {/* Call */}
              <a
                href="tel:+919525989736"
                className="flex items-start space-x-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="p-3 bg-brand-50 dark:bg-brand-950/40 rounded-xl text-brand-600 dark:text-brand-400 shrink-0 group-hover:scale-105 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-100">Contact Number</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-450 mt-1 font-semibold group-hover:text-brand-600 transition-colors">
                    +91 952598 9736
                  </p>
                </div>
              </a>

              {/* Hours */}
              <div className="flex items-start space-x-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-3 bg-brand-50 dark:bg-brand-950/40 rounded-xl text-brand-600 dark:text-brand-400 shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-100">Clinic Timings</h4>
                  <div className="text-sm text-slate-500 dark:text-slate-450 mt-1 space-y-1">
                    <p><span className="font-semibold text-slate-700 dark:text-slate-300">Mon - Sat:</span> 10:00 AM - 08:30 PM</p>
                    <p><span className="font-semibold text-slate-700 dark:text-slate-300">Sunday:</span> 10:00 AM - 02:00 PM</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Map Frame */}
            <div className="w-full h-[240px] rounded-[2rem] overflow-hidden border-2 border-white dark:border-slate-800 shadow-md">
              <iframe
                title="Ganga Dental Clinic Location Map"
                src="https://maps.google.com/maps?q=Hanuman%20Nagar%20Kankarbagh%20Patna%20Bihar&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>

          {/* Right Column: Appointment Form (Spans 7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2.5rem] p-6 sm:p-10 shadow-lg flex flex-col justify-center">
            {status === "success" ? (
              <div className="text-center py-12 space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400 rounded-full animate-bounce">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Appointment Requested!</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Thank you for scheduling your visit at Ganga Dental Clinic. Our clinic manager will call you shortly on your phone to confirm your exact appointment slot.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 px-6 rounded-full transition-colors cursor-pointer"
                >
                  Schedule Another Appointment
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Schedule an Appointment
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-slate-350">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="e.g. Amit Kumar"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 dark:text-slate-350">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      placeholder="e.g. +91 95259 89736"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Service */}
                  <div className="space-y-2">
                    <label htmlFor="preferredTreatment" className="block text-sm font-semibold text-slate-700 dark:text-slate-350">
                      Preferred Treatment
                    </label>
                    <select
                      id="preferredTreatment"
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

                  {/* Date */}
                  <div className="space-y-2">
                    <label htmlFor="date" className="block text-sm font-semibold text-slate-700 dark:text-slate-350">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-semibold text-slate-700 dark:text-slate-350">
                    Additional Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Describe any symptoms or details you would like to share..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"
                  />
                </div>

                {status === "error" && (
                  <p className="text-red-500 text-sm font-bold">
                    {errorMessage}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full flex items-center justify-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white py-3.5 px-6 rounded-full text-base font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                  <span>{status === "submitting" ? "Requesting..." : "Submit Booking Request"}</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
