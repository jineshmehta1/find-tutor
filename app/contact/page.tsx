import ContactBanner from "@/components/ui/ContactBanner";
import ContactSection from "@/components/ui/ContactSection";
import FaqSection from "@/components/stats-section";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-0 font-sans">
      <ContactBanner />
      <ContactSection />
      <FaqSection />
    </div>
  );
}
