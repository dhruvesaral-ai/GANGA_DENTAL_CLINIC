"use client";

import { createContext, useContext } from "react";
import type { SiteSettings } from "@/lib/site";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site";

const SiteSettingsContext = createContext<SiteSettings | null>(null);

export function SiteSettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
}) {
  return (
    <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>
  );
}

export function useSiteSettings(): SiteSettings {
  const settings = useContext(SiteSettingsContext);

  if (!settings) {
    throw new Error("useSiteSettings must be used within SiteSettingsProvider");
  }

  return settings;
}

/** Use on pages without SiteSettingsProvider (e.g. login); falls back to defaults. */
export function useSiteSettingsWithDefaults(): SiteSettings {
  const settings = useContext(SiteSettingsContext);
  return settings ?? DEFAULT_SITE_SETTINGS;
}
