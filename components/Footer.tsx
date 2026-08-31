"use client";

import ClinicName from "@/components/ClinicName";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Footer Top */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center">
              <ClinicName variant="light" />
            </div>
            <p className="text-sm leading-relaxed max-w-sm text-slate-400">
              Delivering clinical excellence with a gentle, patient-first approach. Your smile is our number one priority.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {["Services", "About", "Reviews", "FAQ"].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="hover:text-brand-400 transition-colors cursor-pointer text-left"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="hover:text-brand-400 transition-colors cursor-pointer block">Privacy Policy</span>
              </li>
              <li>
                <span className="hover:text-brand-400 transition-colors cursor-pointer block">Terms of Service</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contact Us</h4>
            <div className="text-sm space-y-2 text-slate-400 leading-relaxed">
              <p>
                Road No:- 2, Dwarika Puri, House no:- 281, Hanuman Nagar, Kankarbagh, Patna, Bihar 800020
              </p>
              <p className="pt-1">
                <a href="tel:+919525989736" className="text-brand-400 hover:underline font-semibold">
                  +91 952598 9736
                </a>
              </p>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {currentYear} Ganga Dental Clinic. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Designed for dental care excellence.</p>
        </div>

      </div>
    </footer>
  );
}
