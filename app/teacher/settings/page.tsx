"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
    Settings, Shield, Bell, Eye, EyeOff, Save,
    User, Mail, Phone, Calendar, MapPin, BookOpen,
    Loader2, Camera, X, CheckCircle2, Lock, GraduationCap, Briefcase, Award, Plus, Upload, ImageIcon, AlertTriangle, Check
} from "lucide-react";
import { toast } from "sonner";
import MapLocationPicker from "@/components/ui/DynamicMapPicker";
import StructuredAddressForm from "@/components/ui/DynamicStructuredAddressForm";
import { cn } from "@/lib/utils";

const ALL_SUBJECTS = [
    "Mathematics", "Physics", "Chemistry", "Biology", "English",
    "Hindi", "History", "Geography", "Computer Science", "Economics",
    "Accountancy", "Business Studies", "Political Science", "Psychology",
    "Sociology", "Sanskrit", "French", "German", "Music", "Art", "Chess",
    "Abacus", "Drawing", "Dance", "Yoga", "Robotics"
];

const TEACHING_LEVELS_OPTIONS = [
    "Primary (Class 1-5)",
    "Middle (Class 6-8)",
    "High School (Class 9-10)",
    "Intermediate (Class 11-12)",
    "Degree / College",
    "Competitive Exams"
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
    latitude: number | null;
    longitude: number | null;
    profilePhoto: string | null;
    gender: string | null;
    preferredLanguage: string | null;
    securityQuestion: string | null;
    securityAnswer: string | null;
    teacher: {
        id: string;
        education: string;
        experience: string;
        certifications: string;
        subjects: string;
        teachingMode: string | null;
        classesOrAgeGroup: string | null;
        qualificationLevel: string | null;
        qualificationName: string | null;
        achievements: string | null;
        expectedFee: number | null;
        feeType: string | null;
        isApproved: boolean;
        achievementCertificate: string | null;
        qualificationCertificate: string | null;
        identityProof: string | null;
    } | null;
}

export default function TeacherSettingsPage() {
    const { data: session, update: updateSession } = useSession();
    
    // States for Profile Info
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [tutorType, setTutorType] = useState<"teacher" | "coach">("teacher");
    const [subjectLevels, setSubjectLevels] = useState<Record<string, string[]>>({});

    const [isUploadingProfile, setIsUploadingProfile] = useState(false);
    const [isUploadingCertImage, setIsUploadingCertImage] = useState(false);
    const [isUploadingQualCert, setIsUploadingQualCert] = useState(false);
    const [isUploadingIdentityProof, setIsUploadingIdentityProof] = useState(false);
    const [isUploadingAchCert, setIsUploadingAchCert] = useState(false);
    
    const profileInputRef = useRef<HTMLInputElement>(null);
    const certImageInputRef = useRef<HTMLInputElement>(null);
    const qualCertInputRef = useRef<HTMLInputElement>(null);
    const identityProofInputRef = useRef<HTMLInputElement>(null);
    const achCertInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        gender: "male",
        preferredLanguage: "English",
        dob: "",
        address: "",
        latitude: null as number | null,
        longitude: null as number | null,
        profilePhoto: "",
        education: "",
        experience: "",
        certifications: [] as Certification[],
        subjects: [] as string[],
        teachingMode: "Home Tutor",
        expectedFee: 0,
        feeType: "/hr",
        classesOrAgeGroup: [] as string[],
        qualificationLevel: "",
        qualificationName: "",
        achievements: "",
        achievementCertificate: "",
        qualificationCertificate: "",
        identityProof: "",
        securityQuestion: "",
        securityAnswer: "",
    });

    const [certInput, setCertInput] = useState("");
    const [pendingCertImage, setPendingCertImage] = useState<string>("");

    // States for Password Security
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/students");
            if (res.ok) {
                const data: Profile = await res.json();
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
                const extractedSubjectLevels: Record<string, string[]> = {};
                if (data.teacher?.subjects) {
                    try {
                        const raw = JSON.parse(data.teacher.subjects);
                        if (Array.isArray(raw)) {
                            raw.forEach((s: string) => {
                                // Extract levels if saved in format "Mathematics (Class 1-5, Class 6-8)"
                                const match = s.match(/^(.*?)\s*\((.*?)\)$/);
                                if (match) {
                                    const baseSubj = match[1].trim();
                                    parsedSubjects.push(baseSubj);
                                    extractedSubjectLevels[baseSubj] = match[2].split(",").map(x => x.trim());
                                } else {
                                    parsedSubjects.push(s);
                                }
                            });
                        }
                    } catch { parsedSubjects = []; }
                }

                let parsedClasses: string[] = [];
                if (data.teacher?.classesOrAgeGroup) {
                    try {
                        const raw = JSON.parse(data.teacher.classesOrAgeGroup);
                        if (Array.isArray(raw)) parsedClasses = raw;
                    } catch { parsedClasses = []; }
                }

                // Check tutor type based on subjects
                const hasCoachingSubjects = parsedSubjects.some(s => 
                    ["Chess", "Yoga", "Abacus", "Music", "Art", "Drawing", "Dance", "Robotics"].includes(s)
                );
                if (hasCoachingSubjects && parsedSubjects.every(s => ["Chess", "Yoga", "Abacus", "Music", "Art", "Drawing", "Dance", "Robotics"].includes(s))) {
                    setTutorType("coach");
                } else {
                    setTutorType("teacher");
                }
                setSubjectLevels(extractedSubjectLevels);

                const formattedDob = data.dob ? new Date(data.dob).toISOString().split("T")[0] : "";

                setFormData({
                    name: data.name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    gender: data.gender || "male",
                    preferredLanguage: data.preferredLanguage || "English",
                    dob: formattedDob,
                    address: data.address || "",
                    latitude: data.latitude || null,
                    longitude: data.longitude || null,
                    profilePhoto: data.profilePhoto || "",
                    education: data.teacher?.education || "",
                    experience: data.teacher?.experience || "",
                    certifications: parsedCerts,
                    subjects: parsedSubjects,
                    teachingMode: data.teacher?.teachingMode || "Home Tutor",
                    expectedFee: data.teacher?.expectedFee || 0,
                    feeType: data.teacher?.feeType || "/hr",
                    classesOrAgeGroup: parsedClasses,
                    qualificationLevel: data.teacher?.qualificationLevel || "",
                    qualificationName: data.teacher?.qualificationName || "",
                    achievements: data.teacher?.achievements || "",
                    achievementCertificate: data.teacher?.achievementCertificate || "",
                    qualificationCertificate: data.teacher?.qualificationCertificate || "",
                    identityProof: data.teacher?.identityProof || "",
                    securityQuestion: data.securityQuestion || "",
                    securityAnswer: data.securityAnswer || "",
                });
            }
        } catch {
            toast.error("Failed to load profile details.");
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
        try {
            const form = new FormData();
            form.append("file", file);
            form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
            form.append("folder", "certificates");
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: form });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setPendingCertImage(data.secure_url);
            toast.success("Achievement proof uploaded!");
        } catch { toast.error("Upload failed."); } finally { setIsUploadingCertImage(false); }
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
            toast.success("Highest qualification certificate uploaded!");
        } catch { toast.error("Upload failed."); } finally { setIsUploadingQualCert(false); }
    };

    const handleIdentityProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploadingIdentityProof(true);
        try {
            const form = new FormData();
            form.append("file", file);
            form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
            form.append("folder", "identity_proofs");
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: form });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setFormData(prev => ({ ...prev, identityProof: data.secure_url }));
            toast.success("Identity proof document uploaded!");
        } catch { toast.error("Upload failed."); } finally { setIsUploadingIdentityProof(false); }
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
            if (!pendingCertImage) {
                toast.error("Proof / certificate upload is mandatory for every entered achievement.");
                return;
            }
            const newCert: Certification = { text: certInput.trim(), image: pendingCertImage };
            if (!formData.certifications.some((c) => c.text === newCert.text)) {
                setFormData(prev => ({ ...prev, certifications: [...prev.certifications, newCert] }));
            }
            setCertInput(""); 
            setPendingCertImage("");
            if (certImageInputRef.current) certImageInputRef.current.value = "";
            toast.success("Achievement & proof added!");
        }
    };

    const removeCertification = (text: string) => {
        setFormData(prev => ({ ...prev, certifications: prev.certifications.filter(c => c.text !== text) }));
    };

    const toggleSubject = (subject: string) => {
        setFormData(prev => {
            const exists = prev.subjects.includes(subject);
            return {
                ...prev,
                subjects: exists ? prev.subjects.filter(s => s !== subject) : [...prev.subjects, subject]
            };
        });
        setSubjectLevels(prev => {
            const copy = { ...prev };
            delete copy[subject];
            return copy;
        });
    };

    const toggleSubjectLevel = (subject: string, level: string) => {
        setSubjectLevels(prev => {
            const current = prev[subject] || [];
            const exists = current.includes(level);
            return {
                ...prev,
                [subject]: exists ? current.filter(l => l !== level) : [...current, level]
            };
        });
    };

    const validateForm = (): boolean => {
        if (!formData.name.trim()) {
            toast.error("Full Name is required.");
            return false;
        }
        if (!formData.phone.trim()) {
            toast.error("Phone Number is required.");
            return false;
        }
        if (!formData.dob) {
            toast.error("Date of Birth is required.");
            return false;
        }
        if (!formData.address.trim()) {
            toast.error("Center / Home Address is required.");
            return false;
        }
        if (!formData.education.trim()) {
            toast.error("Highest Qualification is required.");
            return false;
        }
        if (!formData.experience.trim()) {
            toast.error("Teaching Experience is required.");
            return false;
        }
        if (!formData.qualificationCertificate) {
            toast.error("Highest Qualification Certificate Document is required.");
            return false;
        }
        if (!formData.identityProof) {
            toast.error("Identity Proof Document is required.");
            return false;
        }

        // Achievement Proof Validation
        if (certInput.trim().length > 0 && !pendingCertImage) {
            toast.error(`Please upload proof for "${certInput.trim()}" before saving, or clear the achievement input.`);
            return false;
        }
        if (formData.certifications.some(c => !c.image)) {
            toast.error("Every entered achievement must have an uploaded proof document.");
            return false;
        }
        if (formData.achievements.trim().length > 0 && !formData.achievementCertificate) {
            toast.error("Please upload proof document for your entered achievement award.");
            return false;
        }

        if (formData.subjects.length === 0) {
            toast.error("Please select at least one subject you offer.");
            return false;
        }

        return true;
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSaving(true);
        try {
            // Build payload subjects with levels
            const payloadSubjects = tutorType === "teacher"
                ? formData.subjects.map(subj => {
                    const levels = subjectLevels[subj] || [];
                    return levels.length > 0 ? `${subj} (${levels.join(", ")})` : subj;
                  })
                : formData.subjects;

            const res = await fetch("/api/students", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    subjects: payloadSubjects,
                }),
            });

            if (!res.ok) throw new Error("Failed to save changes");
            
            await updateSession();
            toast.success("Profile updated! Changes have been submitted for Admin re-verification.");
            
            // Dispatch storage event to update header layout
            window.dispatchEvent(new Event("storage"));
            await fetchProfile();
        } catch { 
            toast.error("Failed to update profile changes."); 
        } finally { 
            setSaving(false); 
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-3">
                <Loader2 className="w-8 h-8 text-[#ffb800] animate-spin" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Profile...</p>
            </div>
        );
    }

    const isCurrentlyApproved = profile?.teacher?.isApproved ?? false;

    return (
        <div className="space-y-6 pb-16 p-4 sm:p-8 bg-slate-50 min-h-[calc(100vh-70px)] font-sans antialiased text-slate-800">
            
            {/* Header Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                        <Settings className="w-6 h-6 text-amber-500" />
                        Edit Teacher Profile
                    </h1>
                    <p className="text-xs font-bold text-slate-400 mt-1">
                        Modify your credentials, verification certificates, teaching subjects, address, and preferences.
                    </p>
                </div>

                {/* Verification Status Badge */}
                <div>
                    {isCurrentlyApproved ? (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-black shadow-sm">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Verified & Live</span>
                        </div>
                    ) : (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-900 border border-amber-200 rounded-2xl text-xs font-black shadow-sm">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            <span>Under Admin Review</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Verification Notice Banner */}
            <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start gap-3.5 text-amber-900 shadow-sm">
                <div className="p-2.5 bg-amber-400/20 rounded-xl text-amber-800 shrink-0 mt-0.5">
                    <Shield className="w-5 h-5" />
                </div>
                <div className="text-xs font-medium leading-relaxed">
                    <span className="font-extrabold uppercase text-[11px] block text-amber-900">Verification & Approval Policy</span>
                    Whenever you update your profile details, qualifications, or documents, your profile status is automatically placed <strong className="font-black text-amber-950">Under Review</strong> for Admin verification before changes become publicly visible to parents and students.
                </div>
            </div>

            {/* Profile Edit Form */}
            <form onSubmit={handleSaveProfile} className="space-y-6">
                
                {/* SECTION 1: ACCOUNT & PERSONAL DETAILS */}
                <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                        <User className="w-5 h-5 text-amber-500" />
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">1. Account & Personal Details</h3>
                    </div>

                    {/* Tutor Type Selection */}
                    <div className="space-y-2 text-left">
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider">Tutor Account Type *</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setTutorType("teacher")}
                                className={cn(
                                    "p-4 border rounded-2xl font-bold text-xs transition-all flex flex-col items-start gap-1 cursor-pointer text-left shadow-sm bg-white",
                                    tutorType === "teacher" 
                                        ? "border-amber-400 bg-amber-50/20 text-slate-900 ring-2 ring-amber-400/20" 
                                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                )}
                            >
                                <span className="font-black text-xs text-slate-900">Academic Teacher</span>
                                <span className="text-[10px] text-slate-400">Classes 1 to 12 School & College Curriculums</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setTutorType("coach")}
                                className={cn(
                                    "p-4 border rounded-2xl font-bold text-xs transition-all flex flex-col items-start gap-1 cursor-pointer text-left shadow-sm bg-white",
                                    tutorType === "coach" 
                                        ? "border-amber-400 bg-amber-50/20 text-slate-900 ring-2 ring-amber-400/20" 
                                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                )}
                            >
                                <span className="font-black text-xs text-slate-900">Co-curricular Activity Coach</span>
                                <span className="text-[10px] text-slate-400">Chess, Abacus, Music, Yoga, Drawing, Dance, etc.</span>
                            </button>
                        </div>
                    </div>

                    {/* Profile Photo Uploader */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border-2 border-amber-400/30 shrink-0 group shadow-sm">
                            {formData.profilePhoto ? (
                                <img src={formData.profilePhoto} alt="Profile Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-2xl uppercase">
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
                            <h4 className="text-xs font-black text-slate-900">Profile Photo</h4>
                            <p className="text-[10px] text-slate-400 font-bold leading-normal">Square photo. Formats: JPG, PNG, WebP. Max 4MB.</p>
                            <button
                                type="button"
                                onClick={() => profileInputRef.current?.click()}
                                className="mt-1 px-3 py-1 bg-white text-slate-700 text-[10px] font-bold rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                            >
                                {isUploadingProfile ? "Uploading..." : formData.profilePhoto ? "Change Photo" : "Upload Photo"}
                            </button>
                        </div>
                    </div>

                    {/* Name, Email, Phone, Gender */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Full Name *</label>
                            <input 
                                type="text" 
                                required
                                value={formData.name} 
                                onChange={e => updateField("name", e.target.value)}
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-amber-400 bg-slate-50/50" 
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Email Address</label>
                            <input 
                                type="email" 
                                disabled
                                value={formData.email} 
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none bg-slate-100 text-slate-500 cursor-not-allowed" 
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Phone Number *</label>
                            <input 
                                type="text" 
                                required
                                value={formData.phone} 
                                onChange={e => updateField("phone", e.target.value)}
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-amber-400 bg-slate-50/50" 
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Gender *</label>
                            <select
                                value={formData.gender}
                                onChange={e => updateField("gender", e.target.value)}
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-amber-400 bg-slate-50/50 cursor-pointer"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* SECTION 2: LOCATION & DATE OF BIRTH */}
                <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                        <MapPin className="w-5 h-5 text-amber-500" />
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">2. Location & Date of Birth</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Date of Birth *</label>
                            <input 
                                type="date" 
                                required
                                value={formData.dob} 
                                onChange={e => updateField("dob", e.target.value)}
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-amber-400 bg-slate-50/50" 
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Preferred Teaching Language</label>
                            <select
                                value={formData.preferredLanguage}
                                onChange={e => updateField("preferredLanguage", e.target.value)}
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-amber-400 bg-slate-50/50 cursor-pointer"
                            >
                                <option value="English">English</option>
                                <option value="Telugu">Telugu</option>
                                <option value="Hindi">Hindi</option>
                                <option value="Tamil">Tamil</option>
                                <option value="Kannada">Kannada</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">📍 Center / Home Address & Map Coordinates *</label>
                        <StructuredAddressForm
                            onAddressChange={(data) => {
                                updateField("address", data.fullAddress);
                                if (data.latitude) updateField("latitude", data.latitude);
                                if (data.longitude) updateField("longitude", data.longitude);
                            }}
                            initialAddress={formData.address}
                            accentColor="amber"
                            height="220px"
                        />
                    </div>
                </div>

                {/* SECTION 3: QUALIFICATIONS & VERIFICATION DOCUMENTS */}
                <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                        <GraduationCap className="w-5 h-5 text-amber-500" />
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">3. Qualifications & Verification Documents</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Highest Qualification *</label>
                            <input 
                                type="text" 
                                required
                                placeholder="e.g. M.Sc Physics / B.Tech / B.Ed"
                                value={formData.education} 
                                onChange={e => updateField("education", e.target.value)}
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-amber-400 bg-slate-50/50" 
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Teaching Experience *</label>
                            <input 
                                type="text" 
                                required
                                placeholder="e.g. 5 Years Experience"
                                value={formData.experience} 
                                onChange={e => updateField("experience", e.target.value)}
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-amber-400 bg-slate-50/50" 
                            />
                        </div>
                    </div>

                    {/* Qualification Certificate Document Upload */}
                    <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                            Highest Qualification Certificate Document * <span className="text-amber-700">(Required for verification)</span>
                        </label>
                        <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                            <div
                                className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-250 cursor-pointer hover:border-amber-500 transition-all overflow-hidden shrink-0 shadow-sm"
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
                                <p className="text-[9px] text-slate-400 mt-1 font-bold">Degree / Diploma document. JPG, PNG or WebP. Max 4MB.</p>
                            </div>
                            {formData.qualificationCertificate && (
                                <div className="flex items-center gap-2">
                                    <a href={formData.qualificationCertificate} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 font-bold hover:underline">View</a>
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
                        <input ref={qualCertInputRef} type="file" accept="image/*" onChange={handleQualCertUpload} className="hidden" />
                    </div>

                    {/* Identity Proof Document Upload */}
                    <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                            Identity Proof Document (Aadhaar / ID) * <span className="text-amber-700">(Required for verification)</span>
                        </label>
                        <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                            <div
                                className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-250 cursor-pointer hover:border-amber-500 transition-all overflow-hidden shrink-0 shadow-sm"
                                onClick={() => identityProofInputRef.current?.click()}
                            >
                                {isUploadingIdentityProof ? (
                                    <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
                                ) : formData.identityProof ? (
                                    <img src={formData.identityProof} alt="Identity Proof" className="w-full h-full object-cover" />
                                ) : (
                                    <Upload className="w-5 h-5 text-slate-400" />
                                )}
                            </div>
                            <div className="flex-1">
                                <button
                                    type="button"
                                    onClick={() => identityProofInputRef.current?.click()}
                                    disabled={isUploadingIdentityProof}
                                    className="px-4 py-2 bg-white text-slate-700 text-[10px] font-black rounded-xl hover:bg-slate-50 transition-colors border border-slate-200 disabled:opacity-50 flex items-center gap-1.5 shadow-sm cursor-pointer"
                                >
                                    {isUploadingIdentityProof ? "Uploading..." : formData.identityProof ? "Change Proof" : "Upload Proof"}
                                </button>
                                <p className="text-[9px] text-slate-400 mt-1 font-bold">Government ID or Address proof. Max 4MB.</p>
                            </div>
                            {formData.identityProof && (
                                <div className="flex items-center gap-2">
                                    <a href={formData.identityProof} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 font-bold hover:underline">View</a>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, identityProof: "" }))}
                                        className="p-1 hover:text-red-500 transition-colors border-none bg-transparent cursor-pointer"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                        <input ref={identityProofInputRef} type="file" accept="image/*" onChange={handleIdentityProofUpload} className="hidden" />
                    </div>

                    {/* Certifications & Achievements Widget */}
                    <div className="space-y-2.5 text-left">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                            Certifications & Achievements <span className="text-slate-400 font-normal lowercase">(optional — but if entered, proof upload is mandatory)</span>
                        </label>
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
                            
                            {/* Input row */}
                            <div className="space-y-3">
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        type="text"
                                        value={certInput}
                                        onChange={(e) => setCertInput(e.target.value)}
                                        placeholder="e.g. Best Teacher Award / State Level Champion"
                                        className="flex-1 px-3.5 py-2.5 text-xs font-bold border border-slate-200 rounded-xl outline-none bg-white focus:border-amber-400"
                                    />
                                    
                                    <button
                                        type="button"
                                        onClick={() => certImageInputRef.current?.click()}
                                        disabled={isUploadingCertImage}
                                        className={cn(
                                            "px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0",
                                            pendingCertImage 
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                                : certInput.trim().length > 0 
                                                    ? "bg-amber-50 text-amber-800 border-amber-300 ring-2 ring-amber-400/30" 
                                                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                                        )}
                                        title="Upload Proof Document / Certificate"
                                    >
                                        {isUploadingCertImage ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                                                <span className="text-[11px]">Uploading...</span>
                                            </>
                                        ) : pendingCertImage ? (
                                            <>
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                <span className="text-[11px]">Proof Attached ✓</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4 text-amber-600" />
                                                <span className="text-[11px]">Upload Proof *</span>
                                            </>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={addCertification}
                                        className="px-4 py-2.5 bg-[#0a1829] hover:bg-amber-500 hover:text-slate-900 text-white text-[11px] font-black rounded-xl uppercase tracking-wider cursor-pointer border-none shrink-0 transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>

                                {certInput.trim().length > 0 && !pendingCertImage && (
                                    <p className="text-[10px] text-amber-700 font-bold flex items-center gap-1">
                                        ⚠️ Please click &ldquo;Upload Proof *&rdquo; to attach a certificate/proof document for &ldquo;{certInput.trim()}&rdquo; before adding.
                                    </p>
                                )}
                            </div>
                            
                            <input ref={certImageInputRef} type="file" accept="image/*" onChange={handleCertImageUpload} className="hidden" />

                            {/* Certifications Added Grid */}
                            {formData.certifications.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    {formData.certifications.map((cert, cIdx) => (
                                        <div key={cIdx} className="flex items-center justify-between p-3 bg-white border border-slate-150 rounded-xl shadow-sm text-xs font-bold text-slate-700">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                                                <div className="min-w-0 truncate">
                                                    <span className="truncate block">{cert.text}</span>
                                                    {cert.image && (
                                                        <span className="text-[9px] text-emerald-600 font-extrabold flex items-center gap-1">
                                                            ✓ Verified Proof Attached
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0 ml-2">
                                                {cert.image && (
                                                    <a href={cert.image} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 font-bold hover:underline">
                                                        View
                                                    </a>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => removeCertification(cert.text)}
                                                    className="text-slate-350 hover:text-red-500 border-none bg-transparent cursor-pointer p-0.5"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[10px] text-slate-400 font-bold italic text-center py-1">No achievements added yet. Leave empty if none.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* SECTION 4: SUBJECTS OFFERED & TEACHING PREFERENCES */}
                <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                        <BookOpen className="w-5 h-5 text-amber-500" />
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">4. Subjects Offered & Teaching Preferences</h3>
                    </div>

                    {/* Mode & Expected Fee Rate */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Teaching Mode *</label>
                            <select
                                value={formData.teachingMode}
                                onChange={e => updateField("teachingMode", e.target.value)}
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl focus:border-amber-400 outline-none bg-slate-50/50 cursor-pointer"
                            >
                                <option value="Home Tutor">At Student Home</option>
                                <option value="Online Tutor">Online mode</option>
                                <option value="At Centre">At Teacher Home / Centre</option>
                            </select>
                        </div>
                        
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Expected Fee Rate</label>
                            <div className="flex gap-2">
                                <input 
                                    type="number" 
                                    placeholder="e.g. 500"
                                    value={formData.expectedFee || ""} 
                                    onChange={e => updateField("expectedFee", parseInt(e.target.value) || 0)}
                                    className="flex-1 px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-amber-400 bg-slate-50/50" 
                                />
                                <select
                                    value={formData.feeType}
                                    onChange={e => updateField("feeType", e.target.value)}
                                    className="w-28 px-3 py-3 text-xs font-bold border border-slate-200 rounded-2xl focus:border-amber-400 outline-none bg-slate-50/50 cursor-pointer shrink-0"
                                >
                                    <option value="/hr">/ Hour</option>
                                    <option value="/month">/ Month</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Subjects Selection */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                            Subjects Offered ({formData.subjects.length} selected) *
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-100">
                            {ALL_SUBJECTS.map((subject) => {
                                const isSelected = formData.subjects.includes(subject);
                                return (
                                    <button
                                        key={subject}
                                        type="button"
                                        onClick={() => toggleSubject(subject)}
                                        className={cn(
                                            "p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between",
                                            isSelected 
                                                ? "border-amber-400 bg-amber-50/40 text-slate-900 ring-1 ring-amber-400/30" 
                                                : "border-slate-200 bg-white text-slate-650 hover:bg-slate-50"
                                        )}
                                    >
                                        <span className="text-xs font-bold truncate">{subject}</span>
                                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 ml-1" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Levels per Subject if Academic Teacher */}
                    {tutorType === "teacher" && formData.subjects.length > 0 && (
                        <div className="space-y-3 pt-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                                Teaching Levels for Selected Subjects
                            </label>
                            <div className="space-y-3">
                                {formData.subjects.map((subj) => (
                                    <div key={subj} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                                        <div className="text-xs font-black text-slate-900">{subj}</div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {TEACHING_LEVELS_OPTIONS.map((lvl) => {
                                                const hasLvl = (subjectLevels[subj] || []).includes(lvl);
                                                return (
                                                    <button
                                                        key={lvl}
                                                        type="button"
                                                        onClick={() => toggleSubjectLevel(subj, lvl)}
                                                        className={cn(
                                                            "px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer",
                                                            hasLvl 
                                                                ? "bg-amber-400 text-slate-950 border-amber-400 shadow-sm" 
                                                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                                        )}
                                                    >
                                                        {lvl}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Save Profile Button */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full sm:w-auto px-8 py-4 bg-[#ffb800] hover:bg-amber-500 text-slate-950 font-black rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer uppercase text-xs tracking-wider"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                                <span>Submitting for Verification...</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                <span>Save Changes & Submit for Review</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
