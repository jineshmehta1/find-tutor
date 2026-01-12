import DemoBookingCTA from "@/components/demo-booking-cta";
import FaqSection from "@/components/stats-section";
import ContactBanner from "@/components/ui/ContactBanner";
import ContactSection from "@/components/ui/ContactSection";
import VisitCampusCTA from "@/components/ui/cta";
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-0">
      <ContactBanner />
      <ContactSection />
      <FaqSection />
      <VisitCampusCTA/>
    </div>
  );
}


