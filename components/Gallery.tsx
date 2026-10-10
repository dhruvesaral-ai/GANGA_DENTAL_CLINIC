import Image from "next/image";

const images = [
  {
    src: "/ganga_dental_care_outer_view.jpeg",
    alt: "Ganga Dental Care clinic exterior",
    className: "min-h-[280px] md:min-h-0 md:row-span-2",
    tag: "Ganga Dental Clinic",
    title: "Our Clinic Exterior",
  },
  {
    src: "/ganga_Dental_Care_reception_Desk.jpeg",
    alt: "Ganga Dental Care reception desk",
    className: "min-h-[220px] md:min-h-0",
    tag: "Welcome",
    title: "Reception Desk",
  },
  {
    src: "/ganga_Dental_Care_main_Desk_with_doctor_sitting.jpeg",
    alt: "Doctor at Ganga Dental Care main desk",
    className: "min-h-[220px] md:min-h-0",
    tag: "Expert Care",
    title: "Meet Our Dental Team",
  },
];

export default function Gallery() {
  return (
    <section id="gallery" className="py-16 md:py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-6 md:h-[620px]">
          {images.map((image) => (
            <div
              key={image.src}
              className={`relative h-full group overflow-hidden rounded-[2rem] shadow-lg border border-slate-100 dark:border-slate-800 ${image.className}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 md:p-8">
                <div>
                  <span className="text-[10px] md:text-xs uppercase font-bold tracking-wider text-brand-300">
                    {image.tag}
                  </span>
                  <h3 className="text-base md:text-xl font-bold text-white mt-0.5 md:mt-1">
                    {image.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
