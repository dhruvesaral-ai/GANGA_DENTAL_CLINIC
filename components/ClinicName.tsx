"use client";

import { useSiteSettingsWithDefaults } from "@/contexts/SiteSettingsContext";

type ClinicNameProps = {
  variant?: "default" | "light";
};

function splitCompanyName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) {
    return { primary: "Ganga", secondary: "Dental Clinic" };
  }
  const space = trimmed.indexOf(" ");
  if (space === -1) {
    return { primary: trimmed, secondary: "" };
  }
  return {
    primary: trimmed.slice(0, space),
    secondary: trimmed.slice(space + 1).trim(),
  };
}

export default function ClinicName({ variant = "default" }: ClinicNameProps) {
  const { companyName } = useSiteSettingsWithDefaults();
  const { primary, secondary } = splitCompanyName(companyName);
  const isLight = variant === "light";

  return (
    <div className="flex flex-col leading-none select-none max-w-[12rem] sm:max-w-none">
      <span
        className={`font-display text-[1.65rem] font-bold tracking-tight truncate ${
          isLight
            ? "text-white"
            : "text-brand-700 dark:text-brand-400 group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors"
        }`}
      >
        {primary}
      </span>
      {secondary ? (
        <span
          className={`mt-0.5 text-[0.6rem] sm:text-[0.65rem] uppercase tracking-[0.25em] font-semibold line-clamp-2 ${
            isLight ? "text-brand-300" : "text-slate-600 dark:text-slate-400"
          }`}
        >
          {secondary}
        </span>
      ) : null}
    </div>
  );
}
