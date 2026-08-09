"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
    User, Mail, Phone, Calendar, MapPin, BookOpen,
    Loader2, Save, Camera, CheckCircle2, Upload, X, Sparkles
} from "lucide-react";
import { toast } from "sonner";

const SUBJECTS = [
    "Mathematics", "Physics", "Chemistry", "Biology", "English",
    "Hindi", "History", "Geography", "Computer Science", "Economics", "Abacus", "Chess", "Coding"
];

const CLOUDINARY_CLOUD_NAME = "dx2o9yq2t";
const CLOUDINARY_UPLOAD_PRESET = "gallery";

interface Profile {
    id: string; name: string; email: string; phone: string;
    dob: string; address: string; profilePhoto: string | null;
    student: { subjects: string; } | null;
}

export default function StudentProfilePage() {
    const { data: session, update: updateSession } = useSession();
    const [loading, setLoading]             = useState(true);
    const [saving, setSaving]               = useState(false);
    const [profile, setProfile]             = useState<Profile | null>(null);
    const profileInputRef                   = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading]     = useState(false);
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/students");
            if (!res.ok) throw new Error();
            const data = await res.json();
            setProfile(data);
            if (data.student?.subjects) {
                try {
                    const parsed = typeof data.student.subjects === "string"
                        ? JSON.parse(data.student.subjects)
                        : data.student.subjects;
                    if (Array.isArray(parsed)) {
                        setSelectedSubjects(parsed);
                    }
                } catch {}
            }
        } catch {
            toast.error("Failed to load profile details");
        } finally {
            setLoading(false);
        }
    };

    const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.secure_url) {
                setProfile(prev => prev ? { ...prev, profilePhoto: data.secure_url } : null);
                toast.success("Profile photo uploaded!");
            }
        } catch {
            toast.error("Photo upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        if (!profile) return;
        setSaving(true);
        try {
            const res = await fetch("/api/students", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: profile.name,
                    phone: profile.phone,
                    dob: profile.dob,
                    address: profile.address,
                    profilePhoto: profile.profilePhoto,
                    subjects: selectedSubjects,
                }),
            });
            if (!res.ok) throw new Error();
            await updateSession();
            toast.success("Profile updated successfully!");
            fetchProfile();
        } catch {
            toast.error("Failed to save profile changes");
        } finally {
            setSaving(false);
        }
    };

    const toggleSubject = (sub: string) => {
        setSelectedSubjects(prev =>
            prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
        );
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-3">
                <Loader2 className="w-8 h-8 text-[#1f5961] animate-spin" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12 font-sans max-w-4xl mx-auto">
            {/* Header banner */}
            <div className="bg-[#1f5961] p-6 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-amber-300 text-xs font-bold rounded-full border border-white/15">
                        <User className="w-3.5 h-3.5" />
                        <span>Settings</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Student Profile</h1>
                    <p className="text-xs sm:text-sm text-teal-100 font-medium max-w-xl">
                        Update your contact info, select subjects, and manage your student profile card.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Photo & Subjects */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm text-center space-y-4">
                        <div className="relative w-24 h-24 mx-auto rounded-3xl overflow-hidden bg-slate-100 border-2 border-[#1f5961]/20 group">
                            {profile?.profilePhoto ? (
                                <img src={profile.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl">👤</div>
                            )}
                            <button onClick={() => profileInputRef.current?.click()} disabled={isUploading}
                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                            </button>
                            <input ref={profileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUploadAvatar} />
                        </div>
                        <div>
                            <h3 className="font-black text-sm text-slate-800">{profile?.name}</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Enrolled Student</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrolled Subjects ({selectedSubjects.length})</h4>
                        <div className="flex flex-wrap gap-1.5">
                            {selectedSubjects.map(s => (
                                <span key={s} className="px-2.5 py-1 bg-teal-50 text-[#1f5961] border border-teal-150 rounded-xl text-xs font-bold flex items-center gap-1">
                                    {s} <X className="w-3 h-3 cursor-pointer text-slate-400 hover:text-slate-800" onClick={() => toggleSubject(s)} />
                                </span>
                            ))}
                            {selectedSubjects.length === 0 && <p className="text-xs text-slate-400 font-medium">Select subjects on the right side panel.</p>}
                        </div>
                    </div>
                </div>

                {/* Form fields */}
                <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Account Details</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                            <input type="text" value={profile?.name || ""} onChange={e => setProfile(prev => prev ? { ...prev, name: e.target.value } : null)}
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                            <input type="email" value={profile?.email || ""} disabled
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none bg-slate-100 text-slate-400 cursor-not-allowed" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                            <input type="text" value={profile?.phone || ""} onChange={e => setProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date of Birth</label>
                            <input type="date" value={profile?.dob ? profile.dob.split("T")[0] : ""} onChange={e => setProfile(prev => prev ? { ...prev, dob: e.target.value } : null)}
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Home Address / Location</label>
                        <input type="text" value={profile?.address || ""} onChange={e => setProfile(prev => prev ? { ...prev, address: e.target.value } : null)}
                            className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50" />
                    </div>

                    {/* Subject selection panel */}
                    <div className="space-y-3 pt-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Choose Subjects</label>
                        <div className="flex flex-wrap gap-2">
                            {SUBJECTS.map(sub => {
                                const active = selectedSubjects.includes(sub);
                                return (
                                    <button key={sub} onClick={() => toggleSubject(sub)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                                            active
                                                ? "bg-[#1f5961] text-white border-transparent shadow-sm"
                                                : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-350"
                                        }`}>
                                        {sub}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Save Button */}
                    <button onClick={handleSave} disabled={saving}
                        className="w-full py-3.5 bg-[#1f5961] hover:bg-[#163e44] disabled:opacity-50 text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
}
