import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { ArrowLeft, Images } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingContactButtons from "@/components/FloatingContactButtons";
import GalleryGrid, { type GalleryPhoto } from "@/components/GalleryGrid";
import { SiteSettingsProvider } from "@/contexts/SiteSettingsContext";
import { AppointmentModalProvider } from "@/contexts/AppointmentModalContext";
import { getSiteSettings } from "@/lib/site-settings-server";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site";
import { FACILITY_PHOTOS } from "@/lib/facility-gallery";
import { connectDB } from "@/lib/db";
import { GalleryModel } from "@/models/GalleryModel";

export async function generateMetadata(): Promise<Metadata> {
  let companyName = DEFAULT_SITE_SETTINGS.companyName;

  try {
    companyName = (await getSiteSettings()).companyName;
  } catch (error) {
    console.error("Failed to load site settings for gallery metadata:", error);
  }

  return {
    title: `Clinic Gallery | ${companyName}`,
    description: `Take a closer look at ${companyName} — our clinic exterior, reception, treatment areas, and dental care team.`,
  };
}

async function getUploadedPhotos(companyName: string): Promise<GalleryPhoto[]> {
  try {
    await connectDB();

    const items = await GalleryModel.find({ position: "gallery", is_active: true })
      .sort({ createdAt: -1 })
      .lean();

    return items.map((item) => ({
      src: item.img_url,
      alt: `Clinic photo from ${companyName}`,
      tag: "Our Facility",
    }));
  } catch (error) {
    console.error("Failed to load gallery images:", error);
    return [];
  }
}

export default async function GalleryPage() {
  await connection();

  let siteSettings = DEFAULT_SITE_SETTINGS;

  try {
    siteSettings = await getSiteSettings();
  } catch (error) {
    console.error("Failed to load site settings, using defaults:", error);
  }

  const uploadedPhotos = await getUploadedPhotos(siteSettings.companyName);
  const photos: GalleryPhoto[] = [
    ...FACILITY_PHOTOS.map(({ src, alt, tag, title }) => ({ src, alt, tag, title })),
    ...uploadedPhotos,
  ];

  return (
    <SiteSettingsProvider settings={siteSettings}>
      <AppointmentModalProvider>
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 font-sans">
          <Header />

          <main className="flex-1">
            <section className="relative overflow-hidden bg-slate-50/60 dark:bg-slate-950 pt-12 pb-12 md:pt-16 md:pb-16">
              <div className="absolute top-0 right-0 -z-10 w-[400px] h-[400px] bg-accent-100/40 dark:bg-accent-950/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 -z-10 w-[300px] h-[300px] bg-brand-100/40 dark:bg-brand-950/10 rounded-full blur-3xl" />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link
                  href="/#gallery"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Our Facility
                </Link>

                <div className="mt-6 max-w-3xl">
                  <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                    <Images className="w-4 h-4" />
                    Our Facility
                  </span>
                  <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Clinic Gallery
                  </h1>
                  <p className="mt-4 text-base sm:text-lg text-slate-500 dark:text-slate-400">
                    Explore every corner of {siteSettings.companyName} — from our welcoming reception
                    to our treatment rooms. Click any photo to view it in full size.
                  </p>
                </div>
              </div>
            </section>

            <section className="py-12 md:py-16 bg-white dark:bg-slate-950">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {photos.length > 0 ? (
                  <GalleryGrid photos={photos} />
                ) : (
                  <div className="text-center py-16">
                    <Images className="w-10 h-10 mx-auto text-slate-300" />
                    <p className="mt-3 text-slate-500">
                      No photos available yet. Please check back soon.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </main>

          <Footer />
          <FloatingContactButtons />
        </div>
      </AppointmentModalProvider>
    </SiteSettingsProvider>
  );
}
