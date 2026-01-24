"use client";

import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2,
  Sparkles,
  Instagram,
  Play,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

// --- Types based on your Admin/API ---
export interface GalleryItem {
  id: number;
  pageKey: string;
  category: string;
  type: string; 
  src: string;
  title: string;
  location: string;
}

// These match your GalleryAdmin PAGES constant
const FILTERS = [
  { id: "promaty", label: "Pre Primary School" },
  { id: "chess", label: "Chess" },
  { id: "robotics", label: "Robotics" },
  { id: "abacus", label: "Abacus" },
  { id: "coaching", label: "Tution Point" },
];

export default function GallerySection() {
  const [activePageKey, setActivePageKey] = useState("chess");
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);

  // --- Fetch Logic ---
  const fetchGallery = async (key: string) => {
    setLoading(true);
    try {
      // Fetching from your specific API route
      const res = await fetch(`/api/gallery?pageKey=${key}`, { cache: "no-store" });
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data whenever activePageKey changes
  useEffect(() => {
    fetchGallery(activePageKey);
  }, [activePageKey]);

  // --- Lightbox Navigation ---
  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!lightboxImage) return;
    const currentIndex = items.findIndex(img => img.id === lightboxImage.id);
    const nextIndex = (currentIndex + 1) % items.length;
    setLightboxImage(items[nextIndex]);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!lightboxImage) return;
    const currentIndex = items.findIndex(img => img.id === lightboxImage.id);
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    setLightboxImage(items[prevIndex]);
  };

  return (
    <section className="relative py-20 bg-slate-50 min-h-screen" id="gallery">
      
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-white to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        
        {/* --- Header --- */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-bold tracking-widest uppercase"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Our Gallery</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Capturing the Moments
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Explore our journey through training sessions, tournaments, and events across all our programs.
          </p>
        </div>

        {/* --- PAGE KEY FILTERS --- */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActivePageKey(filter.id)}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-full text-xs md:text-sm font-bold transition-all duration-300 border
                ${activePageKey === filter.id 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20 transform scale-105' 
                  : 'bg-white text-slate-500 border-slate-200 hover:border-amber-400 hover:text-amber-600'
                }
              `}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* --- Masonry Grid Area --- */}
        <div className="relative min-h-[400px]">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
               <Loader2 className="w-10 h-10 animate-spin mb-4 text-amber-500" />
               <p className="font-medium animate-pulse">Fetching {activePageKey} gallery...</p>
            </div>
          ) : (
            <motion.div 
              layout
              className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
            >
              <AnimatePresence mode="popLayout">
                {items.map((image) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={image.id}
                    className="group relative break-inside-avoid rounded-2xl overflow-hidden cursor-zoom-in bg-slate-200 shadow-md hover:shadow-xl transition-all duration-500"
                    onClick={() => setLightboxImage(image)}
                  >
                    <img 
                      src={image.src} 
                      alt={image.title} 
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="inline-block px-2 py-1 bg-amber-500 text-slate-900 text-[10px] font-bold uppercase tracking-wider rounded-md mb-2">
                          {image.category}
                        </span>
                        <h3 className="text-white text-lg font-bold leading-tight mb-1">{image.title}</h3>
                        <p className="text-slate-300 text-xs opacity-90">{image.location}</p>
                      </div>
                      
                      {image.type === "video" && (
                        <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                          <Play className="w-4 h-4 text-white fill-current" />
                        </div>
                      )}

                      <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-2 rounded-full text-white">
                        <Maximize2 className="w-5 h-5" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!loading && items.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <Camera className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No photos found for {activePageKey}.</p>
            </div>
          )}
        </div>

        {/* Footer Branding */}
        <div className="mt-16 flex flex-col items-center gap-4">
          <a 
            href="https://www.instagram.com/aacharya_bhavanipuram?igsh=MWdoM3Yzeno4OHE3eA==" 
            target="_blank"
            className="flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors bg-white px-6 py-3 rounded-full shadow-sm border border-slate-100"
          >
            <Instagram className="w-4 h-4" />
            View more on Instagram
          </a>
        </div>
      </div>

      {/* --- Lightbox Modal --- */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightboxImage(null)}
          >
            <button className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white z-50">
              <X className="w-6 h-6" />
            </button>

            <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white rounded-full hidden md:block z-50">
              <ChevronLeft className="w-10 h-10" />
            </button>
            <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white rounded-full hidden md:block z-50">
              <ChevronRight className="w-10 h-10" />
            </button>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl overflow-hidden max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full md:w-3/4 bg-black flex items-center justify-center relative min-h-[300px]">
                 <img 
                   src={lightboxImage.src} 
                   alt={lightboxImage.title} 
                   className="max-w-full max-h-[50vh] md:max-h-[90vh] object-contain"
                 />
              </div>

              <div className="w-full md:w-1/4 p-8 bg-white flex flex-col justify-center border-l border-slate-100">
                <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-[10px] font-bold uppercase tracking-wide mb-4 w-fit">
                  {lightboxImage.category}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{lightboxImage.title}</h3>
                <p className="text-slate-500 text-sm mb-6">{lightboxImage.location}</p>
                
                <div className="pt-6 border-t border-slate-100 mt-auto">
                   <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Captured At</p>
                   <p className="text-sm font-semibold text-slate-700">Aacharya Campus</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}