"use client";

import React, { useState } from 'react';
import { 
  Camera, 
  Trophy, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2,
  GraduationCap,
  BrainCircuit,
  Gamepad2,
  Filter
} from 'lucide-react';

// --- Demo Data ---
// Using varying aspect ratios for Masonry effect
const galleryData = [
  {
    id: 1,
    src: "/pic15.webp",
    category: "Academics",
    title: "Classroom Focus",
    description: "Students engaged in interactive learning session.",
    aspect: "aspect-[4/3]"
  },
  {
    id: 2,
    src: "pic16.webp",
    category: "Chess",
    title: "National Championship",
    description: "Our U-12 team securing the gold medal.",
    aspect: "aspect-[3/4]"
  },
  {
    id: 3,
    src: "pic14.webp",
    category: "Robotics",
    title: "Bot Building",
    description: "Final touches on the line-follower robot.",
    aspect: "aspect-square"
  },
  {
    id: 4,
    src: "pic17.webp",
    category: "Events",
    title: "Annual Day",
    description: "Cultural performances by primary students.",
    aspect: "aspect-[3/4]"
  },
  {
    id: 5,
    src: "/gallery15.jpg",
    category: "Academics",
    title: "Science Fair",
    description: "Demonstrating physics experiments.",
    aspect: "aspect-[4/3]"
  },
  {
    id: 6,
    src: "pic18.webp",
    category: "Chess",
    title: "Grandmaster Visit",
    description: "Guest lecture on opening strategies.",
    aspect: "aspect-square"
  },
  {
    id: 7,
    src: "central.jpg",
    category: "Robotics",
    title: "Tech Expo Winner",
    description: "Receiving the innovation award.",
    aspect: "aspect-[3/4]"
  },
  {
    id: 8,
    src: "champion.webp",
    category: "Events",
    title: "Graduation Day",
    description: "Celebrating our outgoing batch.",
    aspect: "aspect-[4/3]"
  },
];

const categories = [
  { id: "All", label: "All Moments", icon: Camera },
  { id: "Academics", label: "Academics", icon: GraduationCap },
  { id: "Chess", label: "Chess Arena", icon: Gamepad2 },
  { id: "Robotics", label: "Robotics Lab", icon: BrainCircuit },
  { id: "Events", label: "Celebrations", icon: Trophy },
];

export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxImage, setLightboxImage] = useState<typeof galleryData[0] | null>(null);

  // Filter Logic
  const filteredImages = activeCategory === "All" 
    ? galleryData 
    : galleryData.filter(img => img.category === activeCategory);

  // Lightbox Navigation
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!lightboxImage) return;
    const currentIndex = filteredImages.findIndex(img => img.id === lightboxImage.id);
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setLightboxImage(filteredImages[nextIndex]);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!lightboxImage) return;
    const currentIndex = filteredImages.findIndex(img => img.id === lightboxImage.id);
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setLightboxImage(filteredImages[prevIndex]);
  };

  return (
    <section className="relative py-20 bg-slate-50 min-h-screen font-sans" id="gallery">
      
      {/* --- Background Decor --- */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-amber-50 rounded-bl-full opacity-50 pointer-events-none"></div>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#d97706 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        
        {/* --- Header --- */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-white border border-slate-200 shadow-sm">
            <Filter className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
              Gallery
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Our Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Life</span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
            From intense chess battles to breakthrough robotics projects—explore the vibrant moments that define Aacharya.
          </p>
        </div>

        {/* --- Filter Tabs --- */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 border
                ${activeCategory === cat.id 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20 transform scale-105' 
                  : 'bg-white text-slate-500 border-slate-200 hover:border-amber-400 hover:text-amber-600'
                }
              `}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* --- Masonry Grid --- */}
        {/* 'columns-1 sm:columns-2 lg:columns-3' creates the masonry effect using CSS columns */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredImages.map((image) => (
            <div 
              key={image.id}
              className="group relative break-inside-avoid rounded-2xl overflow-hidden cursor-zoom-in bg-slate-200 shadow-md hover:shadow-xl transition-all duration-500"
              onClick={() => setLightboxImage(image)}
            >
              {/* Image */}
              <img 
                src={image.src} 
                alt={image.title} 
                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${image.aspect}`}
              />

              {/* Overlay (Appears on Hover) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="inline-block px-2 py-1 bg-amber-500 text-slate-900 text-[10px] font-bold uppercase tracking-wider rounded-md mb-2">
                    {image.category}
                  </span>
                  <h3 className="text-white text-lg font-bold leading-tight mb-1">{image.title}</h3>
                  <p className="text-slate-300 text-sm opacity-90">{image.description}</p>
                </div>
                
                {/* Expand Icon */}
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                  <Maximize2 className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <Camera className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No photos found in this category.</p>
          </div>
        )}

      </div>

      {/* --- Lightbox Modal --- */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
            onClick={() => setLightboxImage(null)}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Nav Buttons */}
          <button 
            className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all hidden md:block"
            onClick={handlePrev}
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all hidden md:block"
            onClick={handleNext}
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          {/* Modal Content */}
          <div 
            className="bg-white rounded-2xl overflow-hidden max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Area */}
            <div className="w-full md:w-3/4 bg-black flex items-center justify-center relative">
               <img 
                 src={lightboxImage.src} 
                 alt={lightboxImage.title} 
                 className="max-w-full max-h-[50vh] md:max-h-[90vh] object-contain"
               />
            </div>

            {/* Details Sidebar */}
            <div className="w-full md:w-1/4 p-8 bg-white flex flex-col justify-center border-l border-slate-100">
              <div className="mb-auto">
                <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-xs font-bold uppercase tracking-wide mb-4">
                  {lightboxImage.category}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{lightboxImage.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{lightboxImage.description}</p>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-6">
                 <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Captured At</p>
                 <p className="text-sm font-semibold text-slate-700">Aacharya Campus</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}