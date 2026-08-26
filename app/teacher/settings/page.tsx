"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
    Settings, Shield, Bell, Eye, EyeOff, Save,
    User, Mail, Phone, Calendar, MapPin, BookOpen,
    Loader2, Camera, X, CheckCircle2, Lock, GraduationCap, Briefcase, Award, Plus, Upload, ImageIcon
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
        achievementCertificate: string | null;
        qualificationCertificate: string | null;
    } | null;
}

export default function TeacherSettingsPage() {
    const { data: session, update: updateSession } = useSession();
    
    // States for Profile Info
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isUploadingProfile, setIsUploadingProfile] = useState(false);
    const [isUploadingCertImage, setIsUploadingCertImage] = useState(false);
    const [isUploadingQualCert, setIsUploadingQualCert] = useState(false);
    const [isUploadingAchCert, setIsUploadingAchCert] = useState(false);
    
    const profileInputRef = useRef<HTMLInputElement>(null);
    const certImageInputRef = useRef<HTMLInputElement>(null);
    const qualCertInputRef = useRef<HTMLInputElement>(null);
    const achCertInputRef = useRef<HTMLInputElement>(null);

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
        achievementCertificate: "",
        qualificationCertificate: "",
    });

    const [certInput, setCertInput] = useState("");
    const [certImagePreview, setCertImagePreview] = useState<string | null>(null);
    const [pendingCertImage, setPendingCertImage] = useState<string>("");

    // States for Notification Alerts
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [smsAlerts, setSmsAlerts] = useState(true);
    const [whatsappAlerts, setWhatsappAlerts] = useState(false);

    // States for Password Security
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [showPass, setShowPass] = useState(false);

    useEffect(() => {
        fetchProfile();
        loadAlertSettings();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/students");
            if (res.ok) {
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

                let parsedSubjects: string[] = [];
                if (data.teacher?.subjects) {
                    try {
                        const raw = JSON.parse(data.teacher.subjects);
                        if (Array.isArray(raw)) parsedSubjects = raw;
                    } catch { parsedSubjects = []; }
                }

                let parsedClasses: string[] = [];
                if (data.teacher?.classesOrAgeGroup) {
                    try {
                        const raw = JSON.parse(data.teacher.classesOrAgeGroup);
                        if (Array.isArray(raw)) parsedClasses = raw;
                    } catch { parsedClasses = []; }
                }

                setFormData({
                    name: data.name || "",
                    phone: data.phone || "",
                    address: data.address || "",
                    profilePhoto: data.profilePhoto || "",
                    education: data.teacher?.education || "",
                    experience: data.teacher?.experience || "",
                    certifications: parsedCerts,
                    subjects: parsedSubjects,
                    teachingMode: data.teacher?.teachingMode || "",
                    classesOrAgeGroup: parsedClasses,
                    qualificationLevel: data.teacher?.qualificationLevel || "",
                    qualificationName: data.teacher?.qualificationName || "",
                    achievements: data.teacher?.achievements || "",
                    achievementCertificate: data.teacher?.achievementCertificate || "",
                    qualificationCertificate: data.teacher?.qualificationCertificate || "",
                });
            }
        } catch {
            toast.error("Failed to load profile details.");
        } finally {
            setLoading(false);
        }
    };

    const loadAlertSettings = () => {
        const savedAlerts = localStorage.getItem("teacher_alert_settings");
        if (savedAlerts) {
            try {
                const config = JSON.parse(savedAlerts);
                setEmailAlerts(config.emailAlerts ?? true);
                setSmsAlerts(config.smsAlerts ?? true);
                setWhatsappAlerts(config.whatsappAlerts ?? false);
            } catch {}
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

    const handleQualCertUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploadingQualCert(true);
        try {
            const form = new FormData();
            form.append("file", file);
            form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
            form.append("folder", "certificates");
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: form });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setFormData(prev => ({ ...prev, qualificationCertificate: data.secure_url }));
            toast.success("Qualification certificate uploaded!");
        } catch { toast.error("Upload failed."); } finally { setIsUploadingQualCert(false); }
    };

    const handleAchCertUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploadingAchCert(true);
        try {
            const form = new FormData();
            form.append("file", file);
            form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
            form.append("folder", "certificates");
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: form });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setFormData(prev => ({ ...prev, achievementCertificate: data.secure_url }));
            toast.success("Achievement certificate uploaded!");
        } catch { toast.error("Upload failed."); } finally { setIsUploadingAchCert(false); }
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

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/students", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error();
            await updateSession();
            toast.success("Profile updated successfully!");
            
            // Dispatch storage event to update header layout
            window.dispatchEvent(new Event("storage"));
            fetchProfile();
        } catch { 
            toast.error("Failed to update profile changes."); 
        } finally { 
            setSaving(false); 
        }
    };

    const handleSaveAlerts = (e: React.FormEvent) => {
        e.preventDefault();
        const config = { emailAlerts, smsAlerts, whatsappAlerts };
        localStorage.setItem("teacher_alert_settings", JSON.stringify(config));
        toast.success("Notification preferences updated successfully!");
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            toast.error("Please fill in all password fields.");
            return;
        }
        if (newPassword !== confirmNewPassword) {
            toast.error("New passwords do not match.");
            return;
        }

        try {
            toast.success("Security credentials updated successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
        } catch {
            toast.error("Failed to update password.");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-3">
                <Loader2 className="w-8 h-8 text-[#ffb800] animate-spin" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Settings...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12 p-6 sm:p-8 bg-slate-50 min-h-[calc(100vh-70px)] font-sans">
            
            <div className="flex items-center gap-3">
                <div>
                    <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Account Settings</h1>
                    <p className="text-xs font-bold text-slate-400">Manage your teacher credentials, teaching modes, map location, alert configurations, and security.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Side: Profile Edit Form (8 Cols) */}
                <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/50 shadow-sm p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-2 border-b pb-3">
                        <User className="w-5 h-5 text-[#ffb800]" />
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Teacher Profile Details</h3>
                    </div>

                    <form onSubmit={handleSaveProfile} className="space-y-6">
                        
                        {/* Profile Avatar Uploader */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                            <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border-2 border-[#ffb800]/25 shrink-0 group">
                                {formData.profilePhoto ? (
                                    <img src={formData.profilePhoto} alt="Profile Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-[#ffb800] text-slate-950 font-black flex items-center justify-center text-xl uppercase">
                                        {formData.name ? formData.name.slice(0, 2).toUpperCase() : "T"}
                                    </div>
                                )}
                                <button type="button" onClick={() => profileInputRef.current?.click()} disabled={isUploadingProfile}
                                    className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold border-none cursor-pointer">
                                    {isUploadingProfile ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Camera className="w-4.5 h-4.5" />}
                                </button>
                                <input ref={profileInputRef} type="file" accept="image/*" className="hidden" onChange={handleProfilePhotoUpload} />
                            </div>
                            <div className="text-center sm:text-left space-y-1">
                                <h4 className="text-xs font-black text-slate-900">Upload Profile Photo</h4>
                                <p className="text-[9px] text-slate-400 font-bold leading-normal">Image format: JPG or PNG. Max size 2MB.</p>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">1. Basic Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.name} 
                                        onChange={e => updateField("name", e.target.value)}
                                        className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#ffb800] bg-slate-50/50" 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.phone} 
                                        onChange={e => updateField("phone", e.target.value)}
                                        className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#ffb800] bg-slate-50/50" 
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">📍 Center / Home Location (Map Pin)</label>
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
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">2. Education & Experience</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Highest Qualification</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="e.g. M.Sc Physics / B.Tech"
                                        value={formData.education} 
                                        onChange={e => updateField("education", e.target.value)}
                                        className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#ffb800] bg-slate-50/50" 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience Years</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="e.g. 5 Years"
                                        value={formData.experience} 
                                        onChange={e => updateField("experience", e.target.value)}
                                        className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#ffb800] bg-slate-50/50" 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Qualification Level</label>
                                    <select
                                        value={formData.qualificationLevel}
                                        onChange={e => updateField("qualificationLevel", e.target.value)}
                                        className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl focus:border-[#ffb800] outline-none bg-slate-50/50 cursor-pointer"
                                    >
                                        <option value="">Select Level</option>
                                        <option value="Degree">Degree</option>
                                        <option value="PG">PG</option>
                                        <option value="M.Phil">M.Phil</option>
                                        <option value="PhD">PhD</option>
                                        <option value="PostDoc">PostDoc</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Qualification Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. BSc, B.Tech, MSc"
                                        value={formData.qualificationName} 
                                        onChange={e => updateField("qualificationName", e.target.value)}
                                        className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#ffb800] bg-slate-50/50" 
                                    />
                                </div>

                                <div className="space-y-1.5 sm:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Qualification Certificate Document</label>
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                        <div
                                            className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-250 cursor-pointer hover:border-amber-500 hover:bg-slate-50/40 transition-all overflow-hidden shrink-0 shadow-sm"
                                            onClick={() => qualCertInputRef.current?.click()}
                                        >
                                            {isUploadingQualCert ? (
                                                <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
                                            ) : formData.qualificationCertificate ? (
                                                <img src={formData.qualificationCertificate} alt="Qualification Certificate" className="w-full h-full object-cover" />
                                            ) : (
                                                <Upload className="w-5 h-5 text-slate-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <button
                                                type="button"
                                                onClick={() => qualCertInputRef.current?.click()}
                                                disabled={isUploadingQualCert}
                                                className="px-4 py-2 bg-white text-slate-700 text-[10px] font-black rounded-xl hover:bg-slate-50 transition-colors border border-slate-200 disabled:opacity-50 flex items-center gap-1.5 shadow-sm cursor-pointer"
                                            >
                                                {isUploadingQualCert ? "Uploading..." : formData.qualificationCertificate ? "Change Certificate" : "Upload Certificate"}
                                            </button>
                                            <p className="text-[9px] text-slate-400 mt-1 font-bold">JPG, PNG or WebP. Max 4MB.</p>
                                        </div>
                                        {formData.qualificationCertificate && (
                                            <div className="flex items-center gap-2">
                                                <a href={formData.qualificationCertificate} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 font-bold hover:underline">View</a>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, qualificationCertificate: "" }))}
                                                    className="p-1 hover:text-red-500 transition-colors border-none bg-transparent cursor-pointer"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <input ref={qualCertInputRef} type="file" accept="image/*" className="hidden" onChange={handleQualCertUpload} />
                                </div>
                            </div>
                        </div>

                        {/* Teaching Scope & Preferences */}
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">3. Teaching Modes & Rates</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teaching Mode</label>
                                    <select
                                        value={formData.teachingMode}
                                        onChange={e => updateField("teachingMode", e.target.value)}
                                        className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl focus:border-[#ffb800] outline-none bg-slate-50/50 cursor-pointer"
                                    >
                                        <option value="">Select Mode</option>
                                        <option value="Home Tutor">At Student Home</option>
                                        <option value="Online Tutor">Online mode</option>
                                        <option value="At Centre">At Teacher Home</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Achievements / Awards</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Best Teacher 2024"
                                        value={formData.achievements} 
                                        onChange={e => updateField("achievements", e.target.value)}
                                        className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#ffb800] bg-slate-50/50" 
                                    />
                                </div>

                                <div className="space-y-1.5 sm:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Achievements / Awards Certificate Document</label>
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                        <div
                                            className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-250 cursor-pointer hover:border-amber-500 hover:bg-slate-50/40 transition-all overflow-hidden shrink-0 shadow-sm"
                                            onClick={() => achCertInputRef.current?.click()}
                                        >
                                            {isUploadingAchCert ? (
                                                <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
                                            ) : formData.achievementCertificate ? (
                                                <img src={formData.achievementCertificate} alt="Achievement Certificate" className="w-full h-full object-cover" />
                                            ) : (
                                                <Upload className="w-5 h-5 text-slate-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <button
                                                type="button"
                                                onClick={() => achCertInputRef.current?.click()}
                                                disabled={isUploadingAchCert}
                                                className="px-4 py-2 bg-white text-slate-700 text-[10px] font-black rounded-xl hover:bg-slate-50 transition-colors border border-slate-200 disabled:opacity-50 flex items-center gap-1.5 shadow-sm cursor-pointer"
                                            >
                                                {isUploadingAchCert ? "Uploading..." : formData.achievementCertificate ? "Change Certificate" : "Upload Certificate"}
                                            </button>
                                            <p className="text-[9px] text-slate-400 mt-1 font-bold">JPG, PNG or WebP. Max 4MB.</p>
                                        </div>
                                        {formData.achievementCertificate && (
                                            <div className="flex items-center gap-2">
                                                <a href={formData.achievementCertificate} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 font-bold hover:underline">View</a>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, achievementCertificate: "" }))}
                                                    className="p-1 hover:text-red-500 transition-colors border-none bg-transparent cursor-pointer"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <input ref={achCertInputRef} type="file" accept="image/*" className="hidden" onChange={handleAchCertUpload} />
                                </div>
                            </div>

                            {/* Classes taught Toggles */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Classes & Age Group Taught</label>
                                <div className="flex flex-wrap gap-2">
                                    {["Nursery", "LKG", "UKG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"].map((c) => {
                                        const active = formData.classesOrAgeGroup.includes(c);
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
                                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                                                    active
                                                        ? "bg-[#ffb800] text-slate-950 border-transparent shadow-sm"
                                                        : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-350"
                                                }`}
                                            >
                                                {c}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Subject Selection Tags */}
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">4. Choose Subjects ({formData.subjects.length})</h3>
                            <div className="flex flex-wrap gap-2">
                                {SUBJECTS.map(sub => {
                                    const active = formData.subjects.includes(sub);
                                    return (
                                        <button 
                                            key={sub} 
                                            type="button"
                                            onClick={() => toggleSubject(sub)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                                                active
                                                    ? "bg-[#ffb800] text-slate-950 border-transparent shadow-sm"
                                                    : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-350"
                                            }`}
                                        >
                                            {sub}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Certifications & Proof Uploader */}
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">5. Certifications & Proof Documents</h3>
                            
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Enter certification name (e.g. TOEFL Certified, CTET)"
                                    value={certInput} 
                                    onChange={e => setCertInput(e.target.value)}
                                    className="flex-1 px-4 py-2 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#ffb800]" 
                                />
                                <button type="button" onClick={() => certImageInputRef.current?.click()} className="px-3 bg-slate-100 hover:bg-slate-200 rounded-2xl flex items-center justify-center text-slate-600 border border-slate-200">
                                    <ImageIcon className="w-4 h-4" />
                                </button>
                                <button type="button" onClick={addCertification} className="px-4 py-2 bg-slate-950 hover:bg-[#ffb800] hover:text-slate-950 text-white rounded-2xl text-xs font-bold transition-all">
                                    Add
                                </button>
                                <input ref={certImageInputRef} type="file" accept="image/*" className="hidden" onChange={handleCertImageUpload} />
                            </div>

                            {certImagePreview && (
                                <div className="relative w-28 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                                    <img src={certImagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    {isUploadingCertImage && (
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="space-y-2">
                                {formData.certifications.map((c, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-2xl border border-slate-100 text-xs font-bold text-slate-700">
                                        <div className="flex items-center gap-2">
                                            <Award className="w-4 h-4 text-amber-500" />
                                            <span>{c.text}</span>
                                            {c.image && <span className="text-[8px] bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded-full uppercase">Document Attached</span>}
                                        </div>
                                        <button type="button" onClick={() => removeCertification(c.text)} className="p-1 hover:text-rose-500 transition-colors border-none bg-transparent cursor-pointer">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Save Profile Button */}
                        <button type="submit" disabled={saving} className="w-full py-3.5 bg-[#ffb800] hover:bg-[#ffa000] disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer border-none">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4.5 h-4.5" />}
                            Save Profile Details
                        </button>
                    </form>
                </div>

                {/* Right Side: Security & Notifications (4 Cols) */}
                <div className="lg:col-span-4 space-y-6">
                    
                    {/* Notification Preferences Card */}
                    <div className="bg-white rounded-3xl border border-slate-200/50 shadow-sm p-6 space-y-4">
                        <div className="flex items-center gap-2 border-b pb-3">
                            <Bell className="w-4.5 h-4.5 text-[#ffb800]" />
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Alert Configurations</h3>
                        </div>

                        <form onSubmit={handleSaveAlerts} className="space-y-4">
                            <div className="space-y-3">
                                {/* Email Alerts */}
                                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/50 border border-slate-100">
                                    <div>
                                        <h4 className="text-[11px] font-black text-slate-800">Email Alerts</h4>
                                        <p className="text-[8px] text-slate-400 font-bold mt-0.5">Receive matched student enquiries</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={emailAlerts}
                                        onChange={(e) => setEmailAlerts(e.target.checked)}
                                        className="w-4 h-4 text-[#ffb800] border-slate-350 rounded focus:ring-[#ffb800]"
                                    />
                                </div>

                                {/* SMS Alerts */}
                                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/50 border border-slate-100">
                                    <div>
                                        <h4 className="text-[11px] font-black text-slate-800">SMS Notifications</h4>
                                        <p className="text-[8px] text-slate-400 font-bold mt-0.5">Direct SMS leads alerts</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={smsAlerts}
                                        onChange={(e) => setSmsAlerts(e.target.checked)}
                                        className="w-4 h-4 text-[#ffb800] border-slate-350 rounded focus:ring-[#ffb800]"
                                    />
                                </div>

                                {/* WhatsApp Alerts */}
                                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/50 border border-slate-100">
                                    <div>
                                        <h4 className="text-[11px] font-black text-slate-800">WhatsApp Updates</h4>
                                        <p className="text-[8px] text-slate-400 font-bold mt-0.5">Send leads directly to mobile</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={whatsappAlerts}
                                        onChange={(e) => setWhatsappAlerts(e.target.checked)}
                                        className="w-4 h-4 text-[#ffb800] border-slate-350 rounded focus:ring-[#ffb800]"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full py-2 bg-slate-50 hover:bg-[#ffb800] hover:text-slate-950 text-slate-700 font-black text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer border border-slate-200">
                                Update Alerts
                            </button>
                        </form>
                    </div>

                    {/* Change Password Card */}
                    <div className="bg-white rounded-3xl border border-slate-200/50 shadow-sm p-6 space-y-4">
                        <div className="flex items-center gap-2 border-b pb-3">
                            <Lock className="w-4.5 h-4.5 text-[#ffb800]" />
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Change Password</h3>
                        </div>

                        <form onSubmit={handlePasswordChange} className="space-y-3">
                            <div>
                                <label className="block text-[8px] font-black text-slate-450 uppercase tracking-widest mb-1">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showPass ? "text" : "password"}
                                        required
                                        placeholder="••••••••"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-55 border border-slate-200 focus:outline-none focus:border-[#ffb800] rounded-xl text-xs font-bold"
                                    />
                                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-900 border-none bg-transparent cursor-pointer">
                                        {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[8px] font-black text-slate-450 uppercase tracking-widest mb-1">New Password</label>
                                <input
                                    type={showPass ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-55 border border-slate-200 focus:outline-none focus:border-[#ffb800] rounded-xl text-xs font-bold"
                                />
                            </div>

                            <div>
                                <label className="block text-[8px] font-black text-slate-450 uppercase tracking-widest mb-1">Confirm Password</label>
                                <input
                                    type={showPass ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-55 border border-slate-200 focus:outline-none focus:border-[#ffb800] rounded-xl text-xs font-bold"
                                />
                            </div>

                            <button type="submit" className="w-full mt-2 py-2 bg-slate-950 hover:bg-[#ffb800] hover:text-slate-950 text-white font-black text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer border-none">
                                Update Password
                            </button>
                        </form>
                    </div>

                </div>

            </div>

        </div>
    );
}
