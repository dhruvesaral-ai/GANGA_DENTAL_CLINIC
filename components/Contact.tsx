"use client";

import { Phone, MapPin, Clock } from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { formatPhoneDisplay, toTelLink } from "@/lib/site";
import AppointmentEnquiryForm from "@/components/AppointmentEnquiryForm";

export default function Contact() {
  const { companyName, phoneNumber, address } = useSiteSettings();
  const phoneDisplay = formatPhoneDisplay(phoneNumber);
  const telLink = toTelLink(phoneNumber);
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <section id="contact" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-3 bg-brand-50 dark:bg-brand-950/40 rounded-xl text-brand-600 dark:text-brand-400 shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-100">Clinic Location</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-450 mt-1 leading-relaxed">
                    {address}
                  </p>
                </div>
              </div>

              <a
                href={telLink}
                className="flex items-start space-x-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="p-3 bg-brand-50 dark:bg-brand-950/40 rounded-xl text-brand-600 dark:text-brand-400 shrink-0 group-hover:scale-105 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-100">Contact Number</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-450 mt-1 font-semibold group-hover:text-brand-600 transition-colors">
                    {phoneDisplay}
                  </p>
                </div>
              </a>

              <div className="flex items-start space-x-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-3 bg-brand-50 dark:bg-brand-950/40 rounded-xl text-brand-600 dark:text-brand-400 shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-100">Clinic Timings</h4>
                  <div className="text-sm text-slate-500 dark:text-slate-450 mt-1 space-y-1">
                    <p>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Mon - Sat:</span>{" "}
                      10:00 AM - 08:30 PM
                    </p>
                    <p>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Sunday:</span>{" "}
                      10:00 AM - 02:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-[240px] rounded-[2rem] overflow-hidden border-2 border-white dark:border-slate-800 shadow-md">
              <iframe
                title={`${companyName} Location Map`}
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2.5rem] p-6 sm:p-10 shadow-lg flex flex-col justify-center">
            <AppointmentEnquiryForm idPrefix="contact" />
          </div>
        </div>
      </div>
    </section>
  );
}
