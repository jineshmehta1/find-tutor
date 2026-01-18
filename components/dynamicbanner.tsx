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
        "h-[160px] sm:h-[400px] md:h-auto md:aspect-[1920/800]",
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
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
      </motion.div>

    </section>
  );
}