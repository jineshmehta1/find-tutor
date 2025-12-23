import GalleryBanner from "@/components/ui/GalleryBanner";
import GallerySection from "@/components/ui/GallerySection";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-0">
      <GalleryBanner />
      <GallerySection/>
    </div>
  );
}
