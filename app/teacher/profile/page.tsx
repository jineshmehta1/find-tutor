"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
    User, Mail, Phone, Calendar, MapPin, BookOpen,
    Loader2, Save, Camera, CheckCircle2, GraduationCap, Briefcase, Award, Plus, X,
    Upload, ImageIcon, Sparkles
} from "lucide-react";
import { toast } from "sonner";
import MapLocationPicker from "@/components/ui/DynamicMapPicker";

const SUBJECTS = [
    "Mathematics", "Physics", "Chemistry", "Biology", "English",
    "Hindi", "History", "Geography", "Computer Science", "Economics",
    "Accountancy", "Business Studies", "Political Science", "Psychology",
    "Sociology", "Sanskrit", "French", "German", "Music", "Art"
];

const CLOUDINARY_CLOUD_NAME = "dx2o9yq2t";
const CLOUDINARY_UPLOAD_PRESET = "gallery";

interface Certification {
    text: string;
    image?: string;
}

interface Profile {
    id: string;
    name: string;
    email: string;
    phone: string;
    dob: string;
    address: string;
    profilePhoto: string | null;
    teacher: {
        education: string;
        experience: string;
        certifications: string;
        subjects: string;
        teachingMode: string | null;
        classesOrAgeGroup: string | null;
        qualificationLevel: string | null;
        qualificationName: string | null;
        achievements: string | null;
        isApproved: boolean;
    } | null;
}

export default function TeacherProfilePage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(null);
    const profileInputRef = useRef<HTMLInputElement>(null);
    const certImageInputRef = useRef<HTMLInputElement>(null);
    const [isUploadingProfile, setIsUploadingProfile] = useState(false);
    const [isUploadingCertImage, setIsUploadingCertImage] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        profilePhoto: "",
        education: "",
        experience: "",
        certifications: [] as Certification[],
        subjects: [] as string[],
        teachingMode: "",
        classesOrAgeGroup: [] as string[],
        qualificationLevel: "",
        qualificationName: "",
        achievements: "",
    });

    const [certInput, setCertInput] = useState("");
    const [certImagePreview, setCertImagePreview] = useState<string | null>(null);
    const [pendingCertImage, setPendingCertImage] = useState<string>("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/students");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setProfile(data);

            let parsedCerts: Certification[] = [];
            if (data.teacher?.certifications) {
                try {
                    const raw = JSON.parse(data.teacher.certifications);
                    if (Array.isArray(raw)) {
                        parsedCerts = raw.map((item: string | Certification) =>
                            typeof item === "string" ? { text: item } : item
                        );
                    }
                } catch { parsedCerts = []; }
            }

            let parsedClasses: string[] = [];
            if (data.teacher?.classesOrAgeGroup) {
                try { parsedClasses = JSON.parse(data.teacher.classesOrAgeGroup); } catch { parsedClasses = []; }
            }

            setFormData({
                name: data.name || "",
                phone: data.phone || "",
                address: data.address || "",
                profilePhoto: data.profilePhoto || "",
                education: data.teacher?.education || "",
                experience: data.teacher?.experience || "",
                certifications: parsedCerts,
                subjects: data.teacher ? JSON.parse(data.teacher.subjects || "[]") : [],
                teachingMode: data.teacher?.teachingMode || "",
                classesOrAgeGroup: parsedClasses,
                qualificationLevel: data.teacher?.qualificationLevel || "",
                qualificationName: data.teacher?.qualificationName || "",
                achievements: data.teacher?.achievements || "",
            });
        } catch (error) {
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploadingProfile(true);
        try {
            const form = new FormData();
            form.append("file", file);
            form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
            form.append("folder", "profiles");
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: form });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setFormData(prev => ({ ...prev, profilePhoto: data.secure_url }));
            toast.success("Profile photo uploaded!");
        } catch { toast.error("Upload failed."); } finally { setIsUploadingProfile(false); }
    };

    const handleCertImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploadingCertImage(true);
        const reader = new FileReader();
        reader.onload = (ev) => setCertImagePreview(ev.target?.result as string);
        reader.readAsDataURL(file);
        try {
            const form = new FormData();
            form.append("file", file);
            form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
            form.append("folder", "certificates");
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: form });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setPendingCertImage(data.secure_url);
            toast.success("Certificate image uploaded!");
        } catch { toast.error("Upload failed."); setCertImagePreview(null); } finally { setIsUploadingCertImage(false); }
    };

    const addCertification = () => {
        if (certInput.trim()) {
            const newCert: Certification = { text: certInput.trim(), image: pendingCertImage || undefined };
            if (!formData.certifications.some((c) => c.text === newCert.text)) {
                setFormData(prev => ({ ...prev, certifications: [...prev.certifications, newCert] }));
            }
            setCertInput(""); setPendingCertImage(""); setCertImagePreview(null);
            if (certImageInputRef.current) certImageInputRef.current.value = "";
        }
    };

    const removeCertification = (text: string) => setFormData(prev => ({ ...prev, certifications: prev.certifications.filter(c => c.text !== text) }));
    const toggleSubject = (subject: string) => setFormData(prev => ({ ...prev, subjects: prev.subjects.includes(subject) ? prev.subjects.filter(s => s !== subject) : [...prev.subjects, subject] }));

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/students", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error();
            toast.success("Profile updated successfully!");
            fetchProfile();
        } catch { toast.error("Failed to update profile"); } finally { setSaving(false); }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-[#1f5961] animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 font-sans pb-12 max-w-4xl mx-auto">
            {/* Header Banner */}
            <div className="bg-[#1f5961] p-6 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-amber-300 text-xs font-bold rounded-full border border-white/15">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Teacher Credentials</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Instructor Profile & Qualifications</h1>
                    <p className="text-xs sm:text-sm text-teal-100 font-medium max-w-xl">
                        Manage your teaching qualifications, certifications, subject selection, center map pin, and achievements.
                    </p>
                </div>
            </div>

            {/* Profile Form Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-slate-100 pb-6">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-3xl bg-teal-50 border-2 border-teal-200 flex items-center justify-center overflow-hidden shadow-md">
                            {formData.profilePhoto ? (
                                <img src={formData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-10 h-10 text-[#1f5961]" />
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => profileInputRef.current?.click()}
                            disabled={isUploadingProfile}
                            className="absolute -bottom-2 -right-2 p-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-2xl shadow-lg transition-transform hover:scale-105"
                        >
                            {isUploadingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4 stroke-[3]" />}
                        </button>
                        <input ref={profileInputRef} type="file" accept="image/*" onChange={handleProfilePhotoUpload} className="hidden" />
                    </div>
                    <div className="text-center sm:text-left space-y-1">
                        <h2 className="text-lg font-black text-slate-900">{formData.name || "Instructor"}</h2>
                        <p className="text-xs font-bold text-slate-400">{profile?.email}</p>
                        <span className="inline-block px-3 py-1 bg-teal-50 text-[#1f5961] border border-teal-200/60 rounded-full text-[10px] font-black uppercase tracking-wider mt-1">
                            Verified Instructor Profile
                        </span>
                    </div>
                </div>

                {/* Basic Details */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">1. Basic Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Full Name</label>
                            <input type="text" value={formData.name} onChange={(e) => updateField("name", e.target.value)} className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-xl focus:border-[#1f5961] outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Phone Number</label>
                            <input type="tel" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-xl focus:border-[#1f5961] outline-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">📍 Center / Home Location (Map Pin)</label>
                        <MapLocationPicker
                            onLocationSelect={(loc) => updateField("address", loc.address)}
                            initialAddress={formData.address}
                            accentColor="blue"
                            height="180px"
                            compact={true}
                        />
                    </div>
                </div>

                {/* Education & Experience */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">2. Education & Experience</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Highest Qualification</label>
                            <input type="text" value={formData.education} onChange={(e) => updateField("education", e.target.value)} className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-xl focus:border-[#1f5961] outline-none" placeholder="M.Sc Physics / B.Tech" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Experience Years</label>
                            <input type="text" value={formData.experience} onChange={(e) => updateField("experience", e.target.value)} className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-xl focus:border-[#1f5961] outline-none" placeholder="5 Years Experience" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Qualification Level</label>
                            <select
                                value={formData.qualificationLevel}
                                onChange={(e) => updateField("qualificationLevel", e.target.value)}
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-xl focus:border-[#1f5961] outline-none bg-slate-50/50 cursor-pointer"
                            >
                                <option value="">Select Level</option>
                                <option value="Degree">Degree</option>
                                <option value="PG">PG</option>
                                <option value="M.Phil">M.Phil</option>
                                <option value="PhD">PhD</option>
                                <option value="PostDoc">PostDoc</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Qualification Name</label>
                            <input type="text" value={formData.qualificationName} onChange={(e) => updateField("qualificationName", e.target.value)} className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-xl focus:border-[#1f5961] outline-none" placeholder="e.g. BSc, B.Tech, MSc" />
                        </div>
                    </div>
                </div>

                {/* Certifications Uploader */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">3. Certifications & Proof Documents</h3>
                    <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                value={certInput}
                                onChange={(e) => setCertInput(e.target.value)}
                                className="flex-1 px-4 py-3 text-xs font-bold border border-slate-200 rounded-xl focus:border-[#1f5961] outline-none"
                                placeholder="Certificate Title (e.g. B.Ed Certified, CBSE Board Evaluator)"
                            />
                            <button
                                type="button"
                                onClick={() => certImageInputRef.current?.click()}
                                disabled={isUploadingCertImage}
                                className="px-4 py-3 bg-teal-50 border border-teal-200/80 text-[#1f5961] font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-teal-100 transition-colors"
                            >
                                {isUploadingCertImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                <span>{pendingCertImage ? "Photo Attached ✓" : "Upload Photo"}</span>
                            </button>
                            <button
                                type="button"
                                onClick={addCertification}
                                className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shrink-0 shadow-md"
                            >
                                Add Certificate
                            </button>
                        </div>
                        <input ref={certImageInputRef} type="file" accept="image/*" onChange={handleCertImageUpload} className="hidden" />

                        {formData.certifications.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                                {formData.certifications.map((cert) => (
                                    <div key={cert.text} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
                                        <div className="flex items-center gap-3 min-w-0">
                                            {cert.image && (
                                                <img src={cert.image} alt={cert.text} className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" />
                                            )}
                                            <span className="text-xs font-bold text-slate-800 truncate">{cert.text}</span>
                                        </div>
                                        <button type="button" onClick={() => removeCertification(cert.text)} className="p-1 text-slate-400 hover:text-rose-600 transition-colors">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Subjects Offered */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">4. Teaching Subjects</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {SUBJECTS.map((sub) => {
                            const isSel = formData.subjects.includes(sub);
                            return (
                                <button
                                    key={sub}
                                    type="button"
                                    onClick={() => toggleSubject(sub)}
                                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all flex items-center justify-between ${isSel ? "border-[#1f5961] bg-teal-50 text-[#1f5961]" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                                >
                                    <span>{sub}</span>
                                    {isSel && <CheckCircle2 className="w-4 h-4 text-[#1f5961]" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Teaching Mode, Classes & Achievements */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">5. Mode, Classes & Awards</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Teaching Mode</label>
                            <select
                                value={formData.teachingMode}
                                onChange={(e) => updateField("teachingMode", e.target.value)}
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-xl focus:border-[#1f5961] outline-none bg-slate-50/50 cursor-pointer"
                            >
                                <option value="">Select Teaching Mode</option>
                                <option value="Home Tutor">Home Tutor</option>
                                <option value="Online Tutor">Online Tutor</option>
                                <option value="At Centre">At Centre</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Achievements / Awards</label>
                            <input
                                type="text"
                                value={formData.achievements}
                                onChange={(e) => updateField("achievements", e.target.value)}
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-xl focus:border-[#1f5961] outline-none"
                                placeholder="e.g. Best Physics Teacher Award 2024"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Classes & Age Group Taught</label>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                            {["Nursery", "LKG", "UKG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "Age 3-5", "Age 5-8", "Age 8-12", "Age 12-16", "Age 16+"].map((c) => {
                                const isSel = formData.classesOrAgeGroup.includes(c);
                                return (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setFormData(prev => ({
                                            ...prev,
                                            classesOrAgeGroup: prev.classesOrAgeGroup.includes(c)
                                                ? prev.classesOrAgeGroup.filter(x => x !== c)
                                                : [...prev.classesOrAgeGroup, c]
                                        }))}
                                        className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${isSel ? "border-[#1f5961] bg-teal-50 text-[#1f5961]" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                                    >
                                        {c}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full py-4 bg-[#1f5961] hover:bg-[#1a4a51] text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all mt-6"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Save Profile Changes</span>
                </button>
            </div>
        </div>
    );
}
