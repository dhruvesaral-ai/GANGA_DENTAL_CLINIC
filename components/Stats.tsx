export default function Stats() {
  const stats = [
    { value: "10k+", label: "Happy Patients" },
    { value: "15+", label: "Years Experience" },
    { value: "4.9", label: "Average Rating" },
    { value: "24", label: "Certified Dentists" },
  ];

  return (
    <section className="bg-slate-50 dark:bg-slate-900/50 py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`flex flex-col justify-center items-center p-4 transition-transform duration-300 hover:scale-105 ${
                idx > 1 ? "pt-8 md:pt-4" : ""
              }`}
            >
              <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-600 dark:text-brand-400">
                {stat.value}
              </span>
              <span className="mt-2 text-sm sm:text-base font-semibold text-slate-500 dark:text-slate-400">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
