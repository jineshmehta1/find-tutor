"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    User, Mail, Phone, Calendar, MapPin, BookOpen,
    Loader2, Save, Camera, CheckCircle2, GraduationCap, Briefcase, Award, Plus, X
} from "lucide-react";
import { toast } from "sonner";

const SUBJECTS = [
    "Mathematics", "Physics", "Chemistry", "Biology", "English",
    "Hindi", "History", "Geography", "Computer Science", "Economics",
    "Accountancy", "Business Studies", "Political Science", "Psychology",
    "Sociology", "Sanskrit", "French", "German", "Music", "Art"
];

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
        isApproved: boolean;
    } | null;
}

export default function TeacherProfilePage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        profilePhoto: "",
        education: "",
        experience: "",
        certifications: [] as string[],
        subjects: [] as string[],
    });

    const [certInput, setCertInput] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/students");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setProfile(data);
            setFormData({
                name: data.name || "",
                phone: data.phone || "",
                address: data.address || "",
                profilePhoto: data.profilePhoto || "",
                education: data.teacher?.education || "",
                experience: data.teacher?.experience || "",
                certifications: data.teacher ? JSON.parse(data.teacher.certifications || "[]") : [],
                subjects: data.teacher ? JSON.parse(data.teacher.subjects || "[]") : [],
            });
        } catch (error) {
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const addCertification = () => {
        if (certInput.trim() && !formData.certifications.includes(certInput.trim())) {
            setFormData((prev) => ({
                ...prev,
                certifications: [...prev.certifications, certInput.trim()],
            }));
            setCertInput("");
        }
    };

    const removeCertification = (cert: string) => {
        setFormData((prev) => ({
            ...prev,
            certifications: prev.certifications.filter((c) => c !== cert),
        }));
    };

    const toggleSubject = (subject: string) => {
        setFormData((prev) => ({
            ...prev,
            subjects: prev.subjects.includes(subject)
                ? prev.subjects.filter((s) => s !== subject)
                : [...prev.subjects, subject],
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/students", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to save");

            toast.success("Profile updated successfully!");
            await fetchProfile();
        } catch (error) {
            toast.error("Failed to save profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
                <p className="text-slate-500 mt-1">Manage your teacher profile</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-white">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center overflow-hidden">
                                {formData.profilePhoto ? (
                                    <img src={formData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-12 h-12 text-white" />
                                )}
                            </div>
                            {profile?.teacher?.isApproved ? (
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
                                    <CheckCircle2 className="w-5 h-5 text-white" />
                                </div>
                            ) : null}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{formData.name || "Your Name"}</h2>
                            <p className="text-slate-300 flex items-center gap-2 mt-1">
                                <Mail className="w-4 h-4" />
                                {profile?.email}
                            </p>
                            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${profile?.teacher?.isApproved
                                    ? "bg-green-500/20 text-green-300"
                                    : "bg-amber-500/20 text-amber-300"
                                }`}>
                                {profile?.teacher?.isApproved ? "Approved" : "Pending Approval"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="p-8 space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => updateField("name", e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => updateField("phone", e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Profile Photo URL</label>
                        <div className="relative">
                            <Camera className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                            <input
                                type="url"
                                value={formData.profilePhoto}
                                onChange={(e) => updateField("profilePhoto", e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                                placeholder="https://example.com/photo.jpg"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                            <textarea
                                value={formData.address}
                                onChange={(e) => updateField("address", e.target.value)}
                                rows={2}
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none"
                            />
                        </div>
                    </div>

                    {/* Qualifications */}
                    <div className="border-t border-slate-200 pt-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Qualifications</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    <GraduationCap className="w-4 h-4 inline mr-1" />
                                    Education
                                </label>
                                <input
                                    type="text"
                                    value={formData.education}
                                    onChange={(e) => updateField("education", e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                                    placeholder="e.g., M.Sc. Mathematics, B.Ed."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    <Briefcase className="w-4 h-4 inline mr-1" />
                                    Experience
                                </label>
                                <input
                                    type="text"
                                    value={formData.experience}
                                    onChange={(e) => updateField("experience", e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                                    placeholder="e.g., 5 years teaching in schools"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    <Award className="w-4 h-4 inline mr-1" />
                                    Certifications
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={certInput}
                                        onChange={(e) => setCertInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCertification())}
                                        className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                                        placeholder="Add a certification"
                                    />
                                    <button
                                        type="button"
                                        onClick={addCertification}
                                        className="px-4 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.certifications.map((cert) => (
                                        <span
                                            key={cert}
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm"
                                        >
                                            {cert}
                                            <button type="button" onClick={() => removeCertification(cert)}>
                                                <X className="w-4 h-4" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subjects */}
                    <div className="border-t border-slate-200 pt-6">
                        <label className="block text-sm font-medium text-slate-700 mb-3">
                            <BookOpen className="w-4 h-4 inline mr-2" />
                            Subjects You Teach
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {SUBJECTS.map((subject) => {
                                const isSelected = formData.subjects.includes(subject);
                                return (
                                    <button
                                        key={subject}
                                        type="button"
                                        onClick={() => toggleSubject(subject)}
                                        className={`p-3 rounded-xl border-2 text-left transition-all ${isSelected
                                                ? "border-amber-500 bg-amber-50 text-amber-700"
                                                : "border-slate-200 hover:border-slate-300 text-slate-600"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-amber-500 bg-amber-500" : "border-slate-300"
                                                }`}>
                                                {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                                            </div>
                                            <span className="text-sm font-medium">{subject}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-4 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
