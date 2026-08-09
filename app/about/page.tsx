import AboutBanner from "@/components/ui/AboutBanner";
import AboutSection from "@/components/ui/AboutSection";
import FounderSection from "@/components/ui/founder";
import { ComparisonSection } from "@/components/ComparisonSection";
import { TutorSpotlight } from "@/components/TutorSpotlight";
import TestimonialsSection from "@/components/testimonials-section";
import DemoBookingCTA from "@/components/demo-booking-cta";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-0 font-sans">
      <AboutBanner />
      <AboutSection />
      
      <section className="py-16 max-w-7xl mx-auto px-4 md:px-8">
        <ComparisonSection />
      </section>

      <FounderSection />

      <section className="py-16 max-w-7xl mx-auto px-4 md:px-8">
        <TutorSpotlight />
      </section>

      <TestimonialsSection />
      <DemoBookingCTA />
    </div>
  );
}
