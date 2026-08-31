"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What are the clinic's operating hours?",
      answer:
        "Ganga Dental Clinic is open from Monday to Saturday, 10:00 AM to 8:30 PM, and on Sundays from 10:00 AM to 2:00 PM. We recommend calling in advance for Sunday consultations.",
    },
    {
      question: "How can I book or reschedule an appointment?",
      answer:
        "You can easily book or reschedule an appointment online by filling out the form in our Contact section, or by calling/WhatsApping our front desk at +91 9525989736.",
    },
    {
      question: "Do you offer emergency dental services?",
      answer:
        "Yes, we provide same-day emergency dental care for acute toothaches, severe dental infections, broken crowns, or dental trauma. Please call our emergency helpline immediately if you need urgent care.",
    },
    {
      question: "Is there parking available at the clinic?",
      answer:
        "Yes, we have dedicated parking space for both two-wheelers and cars directly in front of the clinic located in Hanuman Nagar, Kankarbagh.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We support cash payments, all major UPI wallets (PhonePe, Google Pay, Paytm), debit/credit cards, and net banking transactions for your convenience.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-white dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="text-sm font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Common Questions
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-500 dark:text-slate-400">
            Got questions? We've compiled list of answers to help you prepare for your upcoming dental visit.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-150 dark:border-slate-800 rounded-2xl overflow-hidden transition-colors duration-250 bg-slate-50/50 dark:bg-slate-900/10 hover:bg-slate-50 dark:hover:bg-slate-900/35"
              >
                {/* FAQ Question Tab */}
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-850 dark:text-white focus:outline-none cursor-pointer"
                >
                  <div className="flex items-center space-x-3.5 pr-4">
                    <HelpCircle className="w-5 h-5 text-brand-500 shrink-0" />
                    <span className="text-base sm:text-lg leading-snug">{faq.question}</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-brand-600" : ""
                    }`}
                  />
                </button>

                {/* FAQ Answer Content */}
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-[300px] border-t border-slate-150 dark:border-slate-850" : "max-h-0"
                  } overflow-hidden`}
                >
                  <p className="p-5 text-sm sm:text-base text-slate-600 dark:text-slate-350 leading-relaxed bg-white dark:bg-slate-900/60">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
