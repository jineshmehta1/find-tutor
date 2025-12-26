"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Image as ImageIcon, Layout, Loader2, RefreshCw } from "lucide-react";

const CLOUDINARY_CLOUD_NAME = "dx2o9yq2t";
const CLOUDINARY_UPLOAD_PRESET = "gallery";

const PAGES = [
  { id: "chess", label: "Chess Page" },
  { id: "robotics", label: "Robotics Page" },
  { id: "abacus", label: "Abacus Page" },
  { id: "coaching", label: "Coaching Page" },
  { id: "promaty", label: "Promaty School" },
  { id: "home", label: "Home Page" },
];

export default function BannerAdminPage() {
  const router = useRouter();
  const [pageKey, setPageKey] = useState("chess");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchBanner = async () => {
      setLoading(true);
      const res = await fetch(`/api/banners?pageKey=${pageKey}`);
      const data = await res.json();
      setImageUrl(data.imageUrl || "");
      setLoading(false);
    };
    fetchBanner();
  }, [pageKey]);

  const uploadToCloudinary = async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: form,
    });
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return alert("Please upload an image first");
    
    setIsSubmitting(true);
    await fetch("/api/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl, pageKey }),
    });
    setIsSubmitting(false);
    alert("Banner Image Updated!");
    router.refresh();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Visual Banner Manager</h1>
          <p className="text-slate-500 font-medium">Manage background visuals for each page</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border shadow-sm">
          <Layout className="w-5 h-5 text-amber-500" />
          <select 
            value={pageKey} 
            onChange={(e) => setPageKey(e.target.value)}
            className="font-bold text-slate-700 outline-none bg-transparent cursor-pointer"
          >
            {PAGES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-2 rounded-3xl border shadow-sm overflow-hidden">
          <div className="relative aspect-[21/9] bg-slate-100 group transition-all">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="animate-spin text-amber-500" />
              </div>
            ) : imageUrl ? (
              <>
                <img src={imageUrl} className="w-full h-full object-cover" alt="Preview" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white font-bold flex items-center gap-2">
                    <RefreshCw size={20} /> Change Image
                  </p>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <ImageIcon size={48} strokeWidth={1} />
                <p className="font-medium mt-2">Upload High-Res Banner (1920x800)</p>
              </div>
            )}
            
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={async e => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploading(true);
                const url = await uploadToCloudinary(file);
                setImageUrl(url);
                setUploading(false);
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-slate-500 italic">
            {uploading ? "Uploading to Cloudinary..." : "Click image to upload new background"}
          </div>
          <button
            type="submit"
            disabled={isSubmitting || loading || uploading}
            className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : <Save size={20} />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}