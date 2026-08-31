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

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 font-sans">
      <PageVisitTracker />
      {/* Sticky Navigation Navbar */}
      <Header />
      
      {/* Page Sections */}
      <main className="flex-1">
        {/* Banner with Dentist Image overlay */}
        <Hero />
        
        {/* Quick Credentials / Achievements */}
        <Stats />
        
        {/* Services Listings */}
        <Services />
        
        {/* State of the art Technology Details */}
        <TechSection />
        
        {/* Grid Collage Gallery */}
        <Gallery />
        
        {/* Testimonials and Ratings */}
        <Reviews />
        
        {/* Interactive Accordion FAQs */}
        <FAQ />
        
        {/* Detailed Booking & Contact Panel with Map */}
        <Contact />
      </main>

      {/* Footer Details */}
      <Footer />
    </div>
  );
}
