import { connectDB } from "@/lib/db";
import { SettingModel } from "@/models/SettingModel";

export const SETTING_KEYS = {
  META_TITLE: "meta_title",
  META_DESCRIPTION: "meta_description",
  META_KEYWORDS: "meta_keywords",
} as const;

export const RESERVED_SEO_KEYS: string[] = Object.values(SETTING_KEYS);

export function isReservedSeoKey(key: string): boolean {
  return RESERVED_SEO_KEYS.includes(key);
}

export const DEFAULT_SETTINGS: Record<string, unknown> = {
  [SETTING_KEYS.META_TITLE]:
    "Ganga Dental Clinic & Lab | Best Dentist in Kankarbagh, Patna",
  [SETTING_KEYS.META_DESCRIPTION]:
    "Ganga Dental Clinic in Kankarbagh, Patna — root canal, implants, braces & pediatric care. Book today: +91 9525989736.",
  [SETTING_KEYS.META_KEYWORDS]: [],
};

function asString(value: unknown, fallback: string): string {
  if (typeof value === "string") return value;
  if (value == null) return fallback;
  return String(value);
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim() !== "");
}

export async function getSetting(key: string): Promise<unknown> {
  await connectDB();

  const setting = await SettingModel.findOne({ key }).select("value").lean();
  return setting?.value ?? DEFAULT_SETTINGS[key] ?? null;
}

export async function getSettings(keys: string[]): Promise<Record<string, unknown>> {
  await connectDB();

  const settings = await SettingModel.find({ key: { $in: keys } })
    .select("key value")
    .lean();

  const result: Record<string, unknown> = {};
  for (const key of keys) {
    const found = settings.find((s) => s.key === key);
    result[key] = found?.value ?? DEFAULT_SETTINGS[key] ?? null;
  }

  return result;
}

export async function listSettings(excludeKeys: string[] = RESERVED_SEO_KEYS) {
  await connectDB();

  const settings = await SettingModel.find({ key: { $nin: excludeKeys } })
    .select("key value createdAt updatedAt")
    .sort({ key: 1 })
    .lean();

  return settings;
}

export async function setSetting(key: string, value: unknown) {
  await connectDB();

  return SettingModel.findOneAndUpdate(
    { key },
    { value },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  ).lean();
}

export async function setSettings(data: Record<string, unknown>) {
  await connectDB();

  const updates = Object.entries(data).map(([key, value]) => setSetting(key, value));
  await Promise.all(updates);
}

export async function deleteSetting(key: string) {
  await connectDB();
  return SettingModel.findOneAndDelete({ key }).lean();
}

export async function getSeoSettings() {
  const settings = await getSettings([
    SETTING_KEYS.META_TITLE,
    SETTING_KEYS.META_DESCRIPTION,
    SETTING_KEYS.META_KEYWORDS,
  ]);

  return {
    metaTitle: asString(settings[SETTING_KEYS.META_TITLE], DEFAULT_SETTINGS[SETTING_KEYS.META_TITLE] as string),
    metaDescription: asString(
      settings[SETTING_KEYS.META_DESCRIPTION],
      DEFAULT_SETTINGS[SETTING_KEYS.META_DESCRIPTION] as string
    ),
    metaKeywords: asStringArray(settings[SETTING_KEYS.META_KEYWORDS]),
  };
}
