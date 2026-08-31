import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export default function TechSection() {
  const technologies = [
    {
      title: "Digital X-Rays (Low Radiation)",
      desc: "Up to 90% less radiation exposure than traditional film X-rays, providing immediate, ultra-clear digital imaging.",
    },
    {
      title: "Intraoral Cameras",
      desc: "Pen-sized high-res cameras that allow patients to see their teeth structures in real-time on our treatment monitors.",
    },
    {
      title: "Painless Laser Treatments",
      desc: "Advanced laser systems for gentle gum therapies, dental fillings, and sterilization, reducing recovery times.",
    },
    {
      title: "In-House Digital Laboratory",
      desc: "Custom dental prosthetics, crowns, and diagnostic models fabricated with computer-guided accuracy.",
    },
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column (Modern Office Equipment Image) */}
          <div className="lg:col-span-6 relative flex justify-center">
            {/* Background shape */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[105%] h-[105%] bg-brand-500/10 rounded-[3rem] blur-xl" />
            
            <div className="relative w-full max-w-[500px] aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-850 hover:scale-[1.01] transition-transform duration-500">
              <Image
                src="/modern_dental_clinic_interior_high_tech_equipment_comfortable_patient_chair.png"
                alt="State of the art technology at Ganga Dental Clinic"
                fill
                sizes="(max-w-7xl) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Column (Technology description) */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-sm font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Modern Innovation
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              State-of-the-Art Technology
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-350 leading-relaxed">
              We invest in the latest dental advancements to provide accurate diagnoses and more comfortable treatments. 
              Our clinic utilizes precision equipment to perform minor to complex procedures with minimal discomfort and faster healing times.
            </p>

            {/* Checklist */}
            <div className="space-y-4 pt-4">
              {technologies.map((tech, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-850 dark:text-slate-100">
                      {tech.title}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {tech.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
