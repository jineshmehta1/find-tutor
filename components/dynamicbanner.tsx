"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface BannerData {
  imageUrl: string;
}

interface VisualOnlyBannerProps {
  data: BannerData | null;
  className?: string;
}

export default function VisualOnlyBanner({
  data,
  className,
}: VisualOnlyBannerProps) {
  if (!data?.imageUrl) return null;

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden bg-white",
        // RESPONSIVE SIZING:
        // Mobile: Fixed height to keep the graphic visible/readable
        // Desktop: Switch to the exact 1920x800 aspect ratio
        "h-[280px] sm:h-[400px] md:h-auto md:aspect-[1920/800]",
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full h-full"
      >
        <img
          src={data.imageUrl}
          alt="Banner"
          // object-cover ensures it fills the area
          // object-center ensures the middle of your 1920x800 graphic stays visible
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
      </motion.div>

      {/* Subtle Bottom Fade: Makes the transition to the white page content look "Proper" */}
      <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white/30 to-transparent pointer-events-none" />
    </section>
  );
}