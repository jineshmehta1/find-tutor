"use client";

import { useState } from "react";
import {
    Upload, Search, FileText, CheckCircle2,
    Trash2, Loader2, Plus, Send, BookOpen
} from "lucide-react";
import { toast } from "sonner";

interface Resource {
    id: string;
    title: string;
    description: string;
    category: string;
    fileSize: string;
    uploadedBy: string;
}

const INITIAL_RESOURCES: Resource[] = [];

export default function TeacherResourcesPage() {
    const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
    const [showAdd, setShowAdd] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Mathematics");
    const [fileSize, setFileSize] = useState("1.5 MB");
    const [saving, setSaving] = useState(false);

    const handleUploadResource = async () => {
        if (!title.trim() || !description.trim()) {
            toast.error("Please fill in the file title and description.");
            return;
        }
        setSaving(true);
        await new Promise(r => setTimeout(r, 600));

        const newRes: Resource = {
            id: Date.now().toString(),
            title,
            description,
            category,
            fileSize,
            uploadedBy: "You"
        };

        setResources(prev => [newRes, ...prev]);
        toast.success("Study material uploaded successfully!");
        setShowAdd(false);
        setTitle(""); setDescription("");
        setSaving(false);
    };

    const handleDelete = (id: string) => {
        setResources(prev => prev.filter(r => r.id !== id));
        toast.info("Study file removed");
    };

    return (
        <div className="space-y-8 pb-12 font-sans">
            {/* Header */}
            <div className="bg-[#1f5961] p-6 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-amber-300 text-xs font-bold rounded-full border border-white/15">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Resource Vault</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Upload Study Files</h1>
                        <p className="text-xs sm:text-sm text-teal-100 font-medium max-w-xl">
                            Upload worksheets, homework files, and revisions cheat sheets for students to download.
                        </p>
                    </div>
                    <button onClick={() => setShowAdd(!showAdd)}
                        className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black uppercase tracking-wider rounded-2xl transition-all shadow-md shrink-0 flex items-center gap-2">
                        <Plus className="w-4 h-4" /> {showAdd ? "View Vault" : "Upload File"}
                    </button>
                </div>
            </div>

            {showAdd ? (
                /* Form Block */
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm max-w-2xl mx-auto space-y-6">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Publish Study Material</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">File Title</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Binomial Theorems Formula Sheet"
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category / Subject</label>
                            <select value={category} onChange={e => setCategory(e.target.value)}
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50 appearance-none cursor-pointer">
                                <option value="Mathematics">Mathematics</option>
                                <option value="Physics">Physics</option>
                                <option value="Chemistry">Chemistry</option>
                                <option value="Biology">Biology</option>
                                <option value="Coding">Coding</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">File Size Estimate</label>
                        <input type="text" value={fileSize} onChange={e => setFileSize(e.target.value)} placeholder="e.g. 1.5 MB"
                            className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50" />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Briefly describe what formulas, exercises, or homework problems this sheet covers..." rows={3}
                            className="w-full px-4 py-3 text-xs font-medium border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50 resize-none" />
                    </div>

                    <button onClick={handleUploadResource} disabled={saving}
                        className="w-full py-3.5 bg-[#1f5961] hover:bg-[#163e44] disabled:opacity-50 text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-md">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Upload Study File
                    </button>
                </div>
            ) : (
                /* List Block */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {resources.length === 0 ? (
                        <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center space-y-2 shadow-sm col-span-2">
                            <div className="text-4xl">📂</div>
                            <h3 className="text-sm font-black text-slate-800">Your vault is empty</h3>
                            <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">Upload notes or sheets to share with student accounts.</p>
                        </div>
                    ) : (
                        resources.map(res => (
                            <div key={res.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] px-2 py-0.5 bg-teal-50 text-[#1f5961] font-black rounded-md border border-teal-100">
                                            {res.category}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-bold">{res.fileSize}</span>
                                    </div>
                                    <h3 className="text-sm font-black text-slate-900 leading-snug">{res.title}</h3>
                                    <p className="text-xs text-slate-505 font-medium leading-relaxed">{res.description}</p>
                                </div>

                                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                    <span className="text-[10px] text-slate-400 font-bold">Access: Shared with students</span>
                                    <button onClick={() => handleDelete(res.id)}
                                        className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-rose-100 flex items-center justify-center">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
