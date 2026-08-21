"use client";

import React, { useState } from "react";
import { Upload, Image as ImageIcon, Video, Trash2, Plus, Sparkles, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface MediaItem {
    id: string;
    type: "image" | "video";
    title: string;
    url: string;
}

export default function TeacherGalleryPage() {
    const [mediaList, setMediaList] = useState<MediaItem[]>([]);
    const [uploading, setUploading] = useState(false);

    const handleUploadDummy = () => {
        setUploading(true);
        setTimeout(() => {
            const newItem: MediaItem = {
                id: `media_${Date.now()}`,
                type: "image",
                title: "Uploaded Demo Material",
                url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=300"
            };
            setMediaList([newItem, ...mediaList]);
            setUploading(false);
            toast.success("Media uploaded successfully to Gallery!");
        }, 1200);
    };

    const handleDelete = (id: string) => {
        setMediaList(mediaList.filter(item => item.id !== id));
        toast.info("Media item deleted");
    };

    return (
        <div className="pb-12 p-6 sm:p-8 bg-slate-50 min-h-[calc(100vh-70px)] font-sans">
            {/* Header Banner */}
            <div className="bg-[#ffb800] p-6 sm:p-8 rounded-3xl text-slate-950 shadow-md relative overflow-hidden mb-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950/10 text-slate-900 text-xs font-black rounded-full border border-slate-950/10">
                        <Upload className="w-3.5 h-3.5 text-slate-950" />
                        <span>Media Gallery</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Gallery & Videos</h1>
                    <p className="text-xs sm:text-sm text-slate-800 font-medium max-w-xl">
                        Upload demo lectures, whiteboard notes, and worksheets to showcase on your public tutor profile.
                    </p>
                </div>
            </div>

            {/* Uploader Card */}
            <div className="bg-white rounded-3xl border border-slate-200/50 shadow-sm p-6 mb-6 space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b pb-3">Upload New Media</h3>
                
                <div className="border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-2xl p-8 text-center cursor-pointer transition-all bg-slate-50/50 space-y-3" onClick={handleUploadDummy}>
                    <div className="w-12 h-12 rounded-full bg-amber-50 text-[#ffb800] flex items-center justify-center mx-auto">
                        <Upload className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-extrabold text-slate-900">{uploading ? "Uploading media files..." : "Click to select and upload images or video links"}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1">Supports PNG, JPG, MP4 or YouTube links up to 10MB</p>
                    </div>
                </div>
            </div>

            {/* Grid list */}
            {mediaList.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/50 p-12 text-center text-slate-450 font-black text-xs space-y-4 max-w-lg mx-auto">
                    <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
                    <h3 className="font-extrabold text-slate-950 text-sm">No Media Uploaded</h3>
                    <p>Use the uploader tool above to upload lecture demo photos or notes.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {mediaList.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl border border-slate-200/50 overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative">
                            <div className="aspect-video w-full bg-slate-100 relative">
                                <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                                <div className="absolute top-2 right-2 bg-slate-950/60 p-1.5 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-500 cursor-pointer border-none bg-transparent">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-3.5 space-y-1">
                                <h4 className="text-xs font-black text-slate-900 truncate">{item.title}</h4>
                                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                                    <span className="flex items-center gap-1">
                                        {item.type === "image" ? <ImageIcon className="w-3.5 h-3.5 text-slate-450" /> : <Video className="w-3.5 h-3.5 text-slate-450" />}
                                        {item.type.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
