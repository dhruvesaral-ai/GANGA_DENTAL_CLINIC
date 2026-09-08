import { connectDB } from "@/lib/db";
import { SeoSettingsModel } from "@/models/SeoSettingsModel";

export const SEO_KEY = "global";

export const DEFAULT_SEO = {
  metaTitle: "Ganga Dental Clinic & Lab | Best Dentist in Kankarbagh, Patna",
  metaDescription:
    "Ganga Dental Clinic in Kankarbagh, Patna offers expert dental services, root canal treatments, implants, braces, and pediatric care. Book an appointment today at +91 9525989736.",
};

export async function getSeoSettings() {
  await connectDB();

  const settings = await SeoSettingsModel.findOne({ key: SEO_KEY })
    .select("metaTitle metaDescription")
    .lean();

  return {
    metaTitle: settings?.metaTitle ?? DEFAULT_SEO.metaTitle,
    metaDescription: settings?.metaDescription ?? DEFAULT_SEO.metaDescription,
  };
}
