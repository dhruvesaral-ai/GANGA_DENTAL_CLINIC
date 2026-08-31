import Image from "next/image";

export default function Gallery() {
  const images = [
    {
      src: "/modern_dental_clinic_interior_high_tech_equipment_comfortable_patient_chair.png",
      alt: "State-of-the-art dental treatment room",
      className: "md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto",
      label: "Modern Treatment Room",
    },
    {
      src: "/dentist_treating_patient.jpg",
      alt: "Expert dentist treating a patient",
      className: "aspect-[3/2]",
      label: "Precise Procedures",
    },
    {
      src: "/clinic_waiting_room.jpg",
      alt: "Inviting clinic lobby and reception desk",
      className: "aspect-[3/2]",
      label: "Welcoming Reception Lobby",
    },
    {
      src: "/dentist_consultation.jpg",
      alt: "Doctor discussing dental scans with patient",
      className: "md:col-span-2 aspect-[3/2] md:aspect-auto",
      label: "Detailed Consultation",
    },
  ];

  return (
    <section id="gallery" className="py-16 md:py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-sm font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Our Facility
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Modern Facilities, Compassionate Care
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-500 dark:text-slate-400">
            Step into a clinical space designed entirely for your relaxation and safety. We maintain absolute sterilization and clean aesthetics.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px] md:auto-rows-[300px]">
          
          {/* Card 1: Large Treatment Chair (Spans 2 columns, 2 rows) */}
          <div className="relative group overflow-hidden rounded-[2rem] shadow-lg border border-slate-100 dark:border-slate-800 md:col-span-2 md:row-span-2">
            <Image
              src="/modern_dental_clinic_interior_high_tech_equipment_comfortable_patient_chair.png"
              alt="Treatment Room"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-brand-300">Ganga Dental Clinic</span>
                <h3 className="text-xl font-bold text-white mt-1">State-of-the-Art Treatment Room</h3>
              </div>
            </div>
          </div>

          {/* Card 2: Treatment image (Spans 1 col, 1 row) */}
          <div className="relative group overflow-hidden rounded-[2rem] shadow-lg border border-slate-100 dark:border-slate-800">
            <Image
              src="/dentist_treating_patient.jpg"
              alt="Precise Treatment"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-brand-300">Advanced Tech</span>
                <h3 className="text-base font-bold text-white mt-0.5">Compassionate Care</h3>
              </div>
            </div>
          </div>

          {/* Card 3: Lobby (Spans 1 col, 1 row) */}
          <div className="relative group overflow-hidden rounded-[2rem] shadow-lg border border-slate-100 dark:border-slate-800">
            <Image
              src="/clinic_waiting_room.jpg"
              alt="Clinic Lobby"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-brand-300">Comfort</span>
                <h3 className="text-base font-bold text-white mt-0.5">Inviting Waiting Lounge</h3>
              </div>
            </div>
          </div>

          {/* Card 4: Consultation (Spans 3 cols, 1 row on large screen, or spans 3 columns) */}
          <div className="relative group overflow-hidden rounded-[2rem] shadow-lg border border-slate-100 dark:border-slate-800 md:col-span-3">
            <Image
              src="/dentist_consultation.jpg"
              alt="Consultation Desk"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-brand-300">Patient Relations</span>
                <h3 className="text-xl font-bold text-white mt-1">Detailed Dental Scan Consultations</h3>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
