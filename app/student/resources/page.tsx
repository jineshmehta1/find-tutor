"use client";

import { useState } from "react";
import {
    BookOpen, Download, Search, FileText, CheckCircle2,
    Clock, ExternalLink, GraduationCap, Eye
} from "lucide-react";
import { toast } from "sonner";

interface Resource {
    id: string;
    title: string;
    description: string;
    category: string;
    fileSize: string;
    downloadUrl: string;
    uploadedBy: string;
}

const RESOURCES_DATA: Resource[] = [];

export default function StudentResourcesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const handleDownload = (title: string) => {
        toast.success(`Downloading: ${title}`);
    };

    const categories = ["All", "Mathematics", "Physics", "Chemistry"];

    const filtered = RESOURCES_DATA.filter(r => {
        const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = selectedCategory === "All" || r.category === selectedCategory;
        return matchesSearch && matchesCat;
    });

    return (
        <div className="space-y-8 pb-12 font-sans">
            {/* Header */}
            <div className="bg-[#1f5961] p-6 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-amber-300 text-xs font-bold rounded-full border border-white/15">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Resource Vault</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Study Materials & Notes</h1>
                    <p className="text-xs sm:text-sm text-teal-100 font-medium max-w-xl">
                        Access shared syllabus worksheets, revisions cheat sheets, and files uploaded by your teachers.
                    </p>
                </div>
            </div>

            {/* Filter and Search */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative flex items-center w-full md:max-w-md">
                        <Search className="absolute left-4 w-4 h-4 text-slate-400" />
                        <input type="text" placeholder="Search by resource title or topic..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50" />
                    </div>

                    <div className="flex gap-2 self-start md:self-auto overflow-x-auto pb-1 md:pb-0">
                        {categories.map(c => (
                            <button key={c} onClick={() => setSelectedCategory(c)}
                                className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
                                    selectedCategory === c
                                        ? "bg-[#1f5961] text-white border-transparent shadow-sm"
                                        : "bg-slate-50 text-slate-500 border-slate-200"
                                }`}>
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* List */}
            {filtered.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center space-y-2 shadow-sm">
                    <div className="text-4xl">📂</div>
                    <h3 className="text-sm font-black text-slate-800">No study files found</h3>
                    <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">No study sheets or notes have been uploaded to this category yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filtered.map(res => (
                    <div key={res.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] px-2 py-0.5 bg-teal-50 text-[#1f5961] font-black rounded-md border border-teal-100">
                                    {res.category}
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold">{res.fileSize}</span>
                            </div>
                            <h3 className="text-sm font-black text-slate-900 leading-snug">{res.title}</h3>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">{res.description}</p>
                        </div>

                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                            <div className="text-[10px] text-slate-400 font-bold">Uploaded by: {res.uploadedBy}</div>
                            <button onClick={() => handleDownload(res.title)}
                                className="px-3.5 py-2 bg-[#1f5961] hover:bg-[#163e44] text-white text-xs font-black rounded-xl flex items-center gap-1.5 transition-all">
                                <Download className="w-3.5 h-3.5 text-amber-300" /> Download
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            )}
        </div>
    );
}
