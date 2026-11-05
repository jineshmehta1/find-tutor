import Link from "next/link";
import { HelpCircle, ArrowRight } from "lucide-react";
import ContactBanner from "@/components/ui/ContactBanner";
import ContactSection from "@/components/ui/ContactSection";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-0 font-sans">
      <ContactBanner />
      <ContactSection />

      {/* Short FAQ link banner as recommended for Contact Us page */}
      <section className="pb-16 pt-4 px-4 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                Have questions before reaching out?
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Explore our comprehensive FAQ section covering tutor matching, curricula, fees, and educator registration.
              </p>
            </div>
          </div>
          <Link
            href="/faqs"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-sm group"
          >
            <span>View All FAQs</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
