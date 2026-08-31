"use client";

import Image from "next/image";
import { Phone, Calendar, Star, Award, ShieldCheck, HeartPulse } from "lucide-react";

export default function Hero() {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
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
    <section className="relative overflow-hidden bg-slate-50/60 dark:bg-slate-950 pt-8 pb-16 md:pb-24">
      {/* Background decorative circles */}
      <div className="absolute top-0 right-0 -z-10 w-[400px] h-[400px] bg-accent-100/40 dark:bg-accent-950/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 w-[300px] h-[300px] bg-brand-100/40 dark:bg-brand-950/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            
            {/* Rating Badge */}
            <div className="inline-flex items-center space-x-2 bg-brand-100/60 dark:bg-brand-950/40 px-4 py-1.5 rounded-full text-brand-700 dark:text-brand-300 font-semibold text-xs sm:text-sm animate-pulse border border-brand-200/50 dark:border-brand-900/50">
              <Star className="w-4 h-4 fill-brand-500 text-brand-500" />
              <span>4.9/5 Rating from 10k+ Patients</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Expert Care for a{" "}
              <span className="text-brand-600 dark:text-brand-400">
                Brighter, Healthier
              </span>{" "}
              Smile
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-350 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Experience world-class dental care with our team of specialists at **Ganga Dental Clinic**. 
              We combine advanced dentistry technology with a gentle, patient-first approach to ensure 
              maximum comfort and a perfect smile.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={scrollToContact}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white px-8 py-3.5 rounded-full text-base font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Appointment</span>
              </button>
              <a
                href="tel:+919525989736"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-8 py-3.5 rounded-full text-base font-bold border border-slate-200/50 dark:border-slate-700/50 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <Phone className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <span>Call Now</span>
              </a>
            </div>

            {/* Feature Bullets */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-y-3 gap-x-6 pt-4 text-slate-600 dark:text-slate-400 font-semibold text-sm">
              <div className="flex items-center space-x-1.5">
                <Award className="w-5 h-5 text-brand-500" />
                <span>ADA Certified</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-5 h-5 text-brand-500" />
                <span>FDA Approved Tech</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <HeartPulse className="w-5 h-5 text-brand-500 animate-bounce" />
                <span>24/7 Emergency Care</span>
              </div>
            </div>
          </div>

          {/* Right Column (Dentist Image & Satisfaction Badge) */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Main Image Wrapper */}
            <div className="relative w-full max-w-[450px] aspect-[4/5] rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-slate-850 shadow-2xl transition-all duration-500 hover:scale-[1.02]">
              <Image
                src="/professional_dentist_in_a_modern_clean_dental_clinic_smiling_at_the_camera_high.png"
                alt="Expert Dentist Ganga Dental Clinic"
                fill
                sizes="(max-w-7xl) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Satisfaction Overlay Badge */}
            <div className="absolute bottom-8 left-[-10px] sm:left-[-20px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl p-4 flex items-center space-x-3.5 max-w-[220px] animate-bounce-slow">
              <div className="w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-md">
                <Star className="w-6 h-6 fill-white text-white" />
              </div>
              <div>
                <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Patient Satisfaction
                </span>
                <span className="block text-xl font-extrabold text-slate-850 dark:text-white leading-none">
                  99.8%
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
