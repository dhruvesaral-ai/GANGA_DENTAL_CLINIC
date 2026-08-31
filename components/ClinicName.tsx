type ClinicNameProps = {
  variant?: "default" | "light";
};

export default function ClinicName({ variant = "default" }: ClinicNameProps) {
  const isLight = variant === "light";

  return (
    <div className="flex flex-col leading-none select-none">
      <span
        className={`font-display text-[1.65rem] font-bold tracking-tight ${
          isLight
            ? "text-white"
            : "text-brand-700 dark:text-brand-400 group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors"
        }`}
      >
        Ganga
      </span>
      <span
        className={`mt-0.5 text-[0.6rem] sm:text-[0.65rem] uppercase tracking-[0.25em] font-semibold ${
          isLight ? "text-brand-300" : "text-slate-600 dark:text-slate-400"
        }`}
      >
        Dental Clinic
      </span>
    </div>
  );
}
