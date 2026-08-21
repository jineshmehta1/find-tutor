"use client";

import React, { useState, useEffect } from "react";
import { FileText, Settings, ShieldCheck, CheckCircle2, AlertCircle, Award } from "lucide-react";
import Link from "next/link";

interface DocItem {
    name: string;
    type: string;
    url: string | null;
    status: "VERIFIED" | "PENDING" | "NOT_UPLOADED";
}

export default function TeacherDocumentsPage() {
    const [docs, setDocs] = useState<DocItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocData = async () => {
            try {
                const res = await fetch("/api/students");
                if (res.ok) {
                    const data = await res.json();
                    if (data.teacher) {
                        const list: DocItem[] = [
                            {
                                name: "Highest Educational Qualification Certificate",
                                type: "Degree / Diploma Certificate",
                                url: data.teacher.qualificationCertificate,
                                status: data.teacher.qualificationCertificate ? "VERIFIED" : "NOT_UPLOADED"
                            },
                            {
                                name: "Additional Certifications & Credentials Documents",
                                type: "Teaching Certifications",
                                url: data.teacher.achievementCertificate,
                                status: data.teacher.achievementCertificate ? "VERIFIED" : "NOT_UPLOADED"
                            }
                        ];
                        setDocs(list);
                    }
                }
            } catch {}
            setLoading(false);
        };
        fetchDocData();
    }, []);

    return (
        <div className="pb-12 p-6 sm:p-8 bg-slate-50 min-h-[calc(100vh-70px)] font-sans">
            {/* Header Banner */}
            <div className="bg-[#ffb800] p-6 sm:p-8 rounded-3xl text-slate-950 shadow-md relative overflow-hidden mb-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950/10 text-slate-900 text-xs font-black rounded-full border border-slate-950/10">
                        <FileText className="w-3.5 h-3.5 text-slate-950" />
                        <span>Credentials Desk</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Documents & Verification</h1>
                    <p className="text-xs sm:text-sm text-slate-800 font-medium max-w-xl">
                        Manage your qualification degrees and teaching awards to earn the Aacharya Verified Badge.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="py-20 text-center">
                    <span className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#ffb800] border-t-transparent" />
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-200/50 shadow-sm p-6 space-y-6">
                    <div className="flex justify-between items-center border-b pb-3">
                        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Verification Credentials</h3>
                        <Link href="/teacher/settings" className="text-xs font-black text-blue-600 hover:underline flex items-center gap-0.5">
                            <Settings className="w-3.5 h-3.5" /> Upload Settings
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {docs.map((doc, idx) => (
                            <div key={idx} className="p-4 rounded-2xl border border-slate-200/60 bg-slate-50/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex gap-3 items-start">
                                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border">
                                        <Award className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-slate-900">{doc.name}</h4>
                                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">{doc.type}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0 justify-end w-full sm:w-auto">
                                    {doc.url ? (
                                        <a href={doc.url} target="_blank" rel="noreferrer" className="text-xs font-black text-blue-600 hover:underline">
                                            View Uploaded File
                                        </a>
                                    ) : (
                                        <span className="text-xs text-slate-400 font-bold">No file uploaded</span>
                                    )}
                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border leading-none ${
                                        doc.status === "VERIFIED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                        doc.status === "PENDING" ? "bg-amber-50 text-amber-600 border-amber-100" :
                                        "bg-slate-100 text-slate-500 border-slate-200"
                                    }`}>
                                        {doc.status.replace("_", " ")}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
