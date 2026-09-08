import { connectDB } from "@/lib/db";
import { SettingModel } from "@/models/SettingModel";

export const SETTING_KEYS = {
  META_TITLE: "meta_title",
  META_DESCRIPTION: "meta_description",
} as const;

export const DEFAULT_SETTINGS: Record<string, string> = {
  [SETTING_KEYS.META_TITLE]:
    "Ganga Dental Clinic & Lab | Best Dentist in Kankarbagh, Patna",
  [SETTING_KEYS.META_DESCRIPTION]:
    "Ganga Dental Clinic in Kankarbagh, Patna offers expert dental services, root canal treatments, implants, braces, and pediatric care. Book an appointment today at +91 9525989736.",
};

export async function getSetting(key: string): Promise<string> {
  await connectDB();

  const setting = await SettingModel.findOne({ key }).select("value").lean();
  return setting?.value ?? DEFAULT_SETTINGS[key] ?? "";
}

export async function getSettings(keys: string[]): Promise<Record<string, string>> {
  await connectDB();

  const settings = await SettingModel.find({ key: { $in: keys } })
    .select("key value")
    .lean();

  const result: Record<string, string> = {};
  for (const key of keys) {
    const found = settings.find((s) => s.key === key);
    result[key] = found?.value ?? DEFAULT_SETTINGS[key] ?? "";
  }

  return result;
}

export async function setSettings(data: Record<string, string>) {
  await connectDB();

  const updates = Object.entries(data).map(([key, value]) =>
    SettingModel.findOneAndUpdate(
      { key },
      { value },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    )
  );

  await Promise.all(updates);
}

export async function getSeoSettings() {
  const settings = await getSettings([
    SETTING_KEYS.META_TITLE,
    SETTING_KEYS.META_DESCRIPTION,
  ]);

  return {
    metaTitle: settings[SETTING_KEYS.META_TITLE],
    metaDescription: settings[SETTING_KEYS.META_DESCRIPTION],
  };
}
