"use client";

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export function ImageUpload({ onUploadComplete }: { onUploadComplete: (url: string) => void }) {
  return (
    <UploadButton<OurFileRouter>
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
