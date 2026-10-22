"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Stethoscope } from "lucide-react";
import ApiMethod from "@/services/api-method";

type Treatment = {
  _id: string;
  name: string;
  imageUrl?: string | null;
};

export default function TreatmentMarquee() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);

  useEffect(() => {
    ApiMethod.get("/api/treatments")
      .then((result) => {
        if (result.success) {
          setTreatments(result.data ?? []);
        }
      })
      .catch(() => {});
  }, []);

  if (treatments.length === 0) return null;

  // Repeat the list so a single group is wide enough to scroll seamlessly.
  const repeatCount = Math.max(2, Math.ceil(6 / treatments.length));
  const group = Array.from({ length: repeatCount }, () => treatments).flat();
  const duration = Math.max(group.length * 6, 24);

  const renderGroup = (hidden: boolean) => (
    <div className="marquee-group" aria-hidden={hidden}>
      {group.map((treatment, index) => (
        <article
          key={`${treatment._id}-${index}`}
          className="w-64 sm:w-72 shrink-0 overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-md"
        >
          <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800">
            {treatment.imageUrl ? (
              <Image
                src={treatment.imageUrl}
                alt={treatment.name}
                fill
                sizes="(max-width: 640px) 16rem, 18rem"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-950/40 dark:to-slate-900 text-brand-500 dark:text-brand-400">
                <Stethoscope className="w-10 h-10" />
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
              {treatment.name}
            </h3>
            <p className="mt-1 text-xs font-semibold text-brand-600 dark:text-brand-400">
              Expert dental care
            </p>
          </div>
        </article>
      ))}
    </div>
  );

  return (
    <section id="services" className="py-16 md:py-24 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-sm font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Our Treatments
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Comprehensive Dental Services
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-500 dark:text-slate-400">
            From routine checkups to advanced restorative care, our specialists cover every
            treatment your smile needs.
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-24 bg-gradient-to-r from-white dark:from-slate-950 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-24 bg-gradient-to-l from-white dark:from-slate-950 to-transparent" />

        <div className="marquee-viewport">
          <div
            className="marquee-track"
            style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
          >
            {renderGroup(false)}
            {renderGroup(true)}
          </div>
        </div>
      </div>
    </section>
  );
}
