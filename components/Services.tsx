import { Shield, Smile, Sparkles, Layers, Baby, Grid } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: <Shield className="w-8 h-8 text-brand-600 dark:text-brand-400" />,
      title: "General Dentistry",
      description:
        "Comprehensive dental examinations, expert cleanings, fillings, root canals, and modern extractions for all ages.",
    },
    {
      icon: <Smile className="w-8 h-8 text-brand-600 dark:text-brand-400" />,
      title: "Cosmetic Dentistry",
      description:
        "Transform your smile with premium porcelain veneers, aesthetic bonding, and personalized cosmetic treatments.",
    },
    {
      icon: <Grid className="w-8 h-8 text-brand-600 dark:text-brand-400" />,
      title: "Orthodontics",
      description:
        "Straighten misaligned teeth using traditional metal braces or modern, invisible clear aligners (Invisalign).",
    },
    {
      icon: <Layers className="w-8 h-8 text-brand-600 dark:text-brand-400" />,
      title: "Dental Implants",
      description:
        "High-durability implant restorations to replace missing teeth and recover natural bite force and appearance.",
    },
    {
      icon: <Baby className="w-8 h-8 text-brand-600 dark:text-brand-400" />,
      title: "Pediatric Dentistry",
      description:
        "Gentle, stress-free dental care tailored to infants, children, and teens in a comfortable, fun environment.",
    },
    {
      icon: <Sparkles className="w-8 h-8 text-brand-600 dark:text-brand-400" />,
      title: "Teeth Whitening",
      description:
        "State-of-the-art office bleaching and laser whitening procedures to safely brighten your teeth in one hour.",
    },
  ];

  return (
    <section id="services" className="py-16 md:py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Our Expertise
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Comprehensive Care, Exceptional Results
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-500 dark:text-slate-400">
            We provide a complete range of dental treatments under one roof, using advanced methodologies for optimal patient safety and comfort.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="relative p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/5 dark:hover:shadow-brand-500/5 group"
            >
              {/* Icon container */}
              <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {service.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-350 leading-relaxed">
                {service.description}
              </p>

              {/* Accent Line */}
              <div className="absolute bottom-0 left-8 right-8 h-1 bg-brand-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
