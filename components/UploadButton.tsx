"use client";

import { generateUploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

const UploadButton = generateUploadButton<OurFileRouter>();

export function ImageUpload({ onUploadComplete }: { onUploadComplete: (url: string) => void }) {
  return (
    <UploadButton
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        onUploadComplete(res[0].url);
      }}
      onUploadError={(error) => {
        alert(error.message);
      }}
    />
  );
}







