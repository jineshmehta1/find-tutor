"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
    User, Mail, Phone, Calendar, MapPin, BookOpen,
    Loader2, Save, Camera, CheckCircle2, Upload, X
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
    student: {
        subjects: string;
    } | null;
}
const CLOUDINARY_CLOUD_NAME = "dx2o9yq2t";
const CLOUDINARY_UPLOAD_PRESET = "gallery"; // or create "profiles"
export default function StudentProfilePage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(null);
    const profileInputRef = useRef<HTMLInputElement>(null);
    const [isUploadingProfile, setIsUploadingProfile] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        profilePhoto: "",
        subjects: [] as string[],
    });

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
                subjects: data.student ? JSON.parse(data.student.subjects || "[]") : [],
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

    

    // Handle profile photo upload
    const handleProfilePhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
    }

    if (file.size > 4 * 1024 * 1024) {
        toast.error("Image must be less than 4MB");
        return;
    }

    setIsUploadingProfile(true);

    try {
        const form = new FormData();
        form.append("file", file);
        form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        form.append("folder", "profiles");

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: form,
            }
        );

        if (!res.ok) throw new Error("Upload failed");

        const data = await res.json();

        setFormData((prev) => ({
            ...prev,
            profilePhoto: data.secure_url,
        }));

        toast.success("Profile photo uploaded!");
    } catch {
        toast.error("Upload failed. Please try again.");
    } finally {
        setIsUploadingProfile(false);
    }
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
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
                <p className="text-slate-500 mt-1">Manage your personal information</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 text-white">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div
                                className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center overflow-hidden cursor-pointer hover:bg-white/30 transition-colors"
                                onClick={() => profileInputRef.current?.click()}
                            >
                                {isUploadingProfile ? (
                                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                                ) : formData.profilePhoto ? (
                                    <img src={formData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-12 h-12 text-white" />
                                )}
                            </div>
                            {/* Camera overlay */}
                            <button
                                type="button"
                                onClick={() => profileInputRef.current?.click()}
                                disabled={isUploadingProfile}
                                className="absolute -bottom-1 -left-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                <Camera className="w-4 h-4 text-white" />
                            </button>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{formData.name || "Your Name"}</h2>
                            <p className="text-blue-100 flex items-center gap-2 mt-1">
                                <Mail className="w-4 h-4" />
                                {profile?.email}
                            </p>
                        </div>
                    </div>
                    <input
                        ref={profileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePhotoUpload}
                        className="hidden"
                    />
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
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Profile Photo Upload */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Profile Photo</label>
                        <div className="flex items-center gap-4">
                            <div
                                className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all overflow-hidden"
                                onClick={() => profileInputRef.current?.click()}
                            >
                                {isUploadingProfile ? (
                                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                                ) : formData.profilePhoto ? (
                                    <img src={formData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <Camera className="w-6 h-6 text-slate-400" />
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => profileInputRef.current?.click()}
                                disabled={isUploadingProfile}
                                className="px-4 py-2.5 bg-blue-50 text-blue-700 font-medium rounded-xl hover:bg-blue-100 transition-colors border border-blue-200 disabled:opacity-50 flex items-center gap-2 text-sm"
                            >
                                {isUploadingProfile ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                                ) : (
                                    <><Upload className="w-4 h-4" /> {formData.profilePhoto ? "Change Photo" : "Upload Photo"}</>
                                )}
                            </button>
                            {formData.profilePhoto && (
                                <button
                                    type="button"
                                    onClick={() => setFormData((prev) => ({ ...prev, profilePhoto: "" }))}
                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
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
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                            />
                        </div>
                    </div>

                    {/* Subjects */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">
                            <BookOpen className="w-4 h-4 inline mr-2" />
                            Subjects of Interest
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
                                            ? "border-blue-500 bg-blue-50 text-blue-700"
                                            : "border-slate-200 hover:border-slate-300 text-slate-600"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-blue-500 bg-blue-500" : "border-slate-300"
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
                        className="w-full py-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
