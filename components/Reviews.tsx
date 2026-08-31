import { Star, Quote } from "lucide-react";

export default function Reviews() {
  const reviews = [
    {
      name: "Amit Sharma",
      role: "Root Canal Treatment",
      stars: 5,
      comment:
        "I was very scared of root canals, but the dentist at Ganga Dental Clinic made it completely painless. The equipment is very advanced, and the clinic is clean and hygienic.",
      date: "2 weeks ago",
    },
    {
      name: "Priyanka Kumari",
      role: "Orthodontics / Braces",
      stars: 5,
      comment:
        "The doctors here are very friendly and took the time to explain my braces treatment options. Excellent service, clean rooms, and very polite support staff.",
      date: "1 month ago",
    },
    {
      name: "Rajesh Kumar",
      role: "Dental Implants",
      stars: 5,
      comment:
        "Got my implants done here. Highly professional treatment, extremely precise, and the cost was very reasonable compared to other clinics in Patna. Highly recommended!",
      date: "3 months ago",
    },
  ];

  return (
    <section id="reviews" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Testimonials
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            What Our Patients Say
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-500 dark:text-slate-400">
            Read stories of transformed smiles and comfortable dental experiences from our patients in Patna.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-md relative hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Quote Icon Overlay */}
                <Quote className="absolute top-6 right-6 w-10 h-10 text-slate-100 dark:text-slate-800/80 -z-0" />
                
                {/* Star rating */}
                <div className="flex items-center space-x-1 mb-4 relative z-10">
                  {[...Array(review.stars)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-base text-slate-600 dark:text-slate-350 leading-relaxed italic relative z-10 mb-6">
                  "{review.comment}"
                </p>
              </div>

              {/* Author Info */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-between items-center relative z-10">
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-100">
                    {review.name}
                  </h4>
                  <span className="text-xs text-brand-600 dark:text-brand-400 font-semibold">
                    {review.role}
                  </span>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {review.date}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
