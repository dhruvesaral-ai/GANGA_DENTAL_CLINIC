import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import TechSection from "@/components/TechSection";
import Gallery from "@/components/Gallery";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import PageVisitTracker from "@/components/PageVisitTracker";
import FloatingContactButtons from "@/components/FloatingContactButtons";
import { SiteSettingsProvider } from "@/contexts/SiteSettingsContext";
import { getSiteSettings } from "@/lib/site-settings-server";

export default async function Home() {
  const siteSettings = await getSiteSettings();

  return (
    <SiteSettingsProvider settings={siteSettings}>
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 font-sans">
        <PageVisitTracker />
        <Header />

        <main className="flex-1">
          <Hero />
          <Stats />
          <Services />
          <TechSection />
          <Gallery />
          <Reviews />
          <FAQ />
          <Contact />
        </main>

        <Footer />
        <FloatingContactButtons />
      </div>
    </SiteSettingsProvider>
  );
}
