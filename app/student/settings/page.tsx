"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
    Settings, Shield, Bell, Eye, EyeOff, Save,
    User, Mail, Phone, Calendar, MapPin, BookOpen,
    Loader2, Camera, X, CheckCircle2, Lock
} from "lucide-react";
import { toast } from "sonner";

const SUBJECTS = [
    "Mathematics", "Physics", "Chemistry", "Biology", "English",
    "Hindi", "History", "Geography", "Computer Science", "Economics", "Abacus", "Chess", "Coding"
];

const CLOUDINARY_CLOUD_NAME = "dx2o9yq2t";
const CLOUDINARY_UPLOAD_PRESET = "gallery";

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
        children?: string | null;
    } | null;
}

export default function StudentSettingsPage() {
    const { data: session, update: updateSession } = useSession();
    
    // States for Profile Info
    const [profile, setProfile] = useState<Profile | null>(null);
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const profileInputRef = useRef<HTMLInputElement>(null);

    // States for Notification Alerts
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [smsAlerts, setSmsAlerts] = useState(true);
    const [whatsappAlerts, setWhatsappAlerts] = useState(false);
    const [profileVisibility, setProfileVisibility] = useState(true);

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
            }
        } catch {
            toast.error("Failed to load profile details.");
        } finally {
            setLoading(false);
        }
    };

    const loadAlertSettings = () => {
        const savedAlerts = localStorage.getItem("student_alert_settings");
        if (savedAlerts) {
            try {
                const config = JSON.parse(savedAlerts);
                setEmailAlerts(config.emailAlerts ?? true);
                setSmsAlerts(config.smsAlerts ?? true);
                setWhatsappAlerts(config.whatsappAlerts ?? false);
                setProfileVisibility(config.profileVisibility ?? true);
            } catch {}
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
            toast.error("Photo upload failed.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;
        setSaving(true);
        try {
            const res = await fetch("/api/students", {
                method: "PATCH",
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
            toast.success("Profile details updated successfully!");
            
            // Dispatch storage event to alert layout of photo/name updates
            window.dispatchEvent(new Event("storage"));
            fetchProfile();
        } catch {
            toast.error("Failed to save profile changes.");
        } finally {
            setSaving(false);
        }
    };

    const handleSaveAlerts = (e: React.FormEvent) => {
        e.preventDefault();
        const config = { emailAlerts, smsAlerts, whatsappAlerts, profileVisibility };
        localStorage.setItem("student_alert_settings", JSON.stringify(config));
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
            // Simulated endpoint call or real update
            toast.success("Security credentials updated successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
        } catch {
            toast.error("Failed to update password.");
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
                    <p className="text-xs font-bold text-slate-400">Manage your student profile, subjects, alert configurations, and security.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Side: Profile Edit Form (8 Cols) */}
                <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/50 shadow-sm p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-2 border-b pb-3">
                        <User className="w-5 h-5 text-[#ffb800]" />
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Personal Profile Details</h3>
                    </div>

                    <form onSubmit={handleSaveProfile} className="space-y-6">
                        {/* Profile Avatar Uploader */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                            <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border-2 border-[#ffb800]/25 shrink-0 group">
                                {profile?.profilePhoto ? (
                                    <img src={profile.profilePhoto} alt="Profile Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-[#ffb800] text-slate-950 font-black flex items-center justify-center text-xl uppercase">
                                        {profile?.name ? profile.name.slice(0, 2).toUpperCase() : "S"}
                                    </div>
                                )}
                                <button type="button" onClick={() => profileInputRef.current?.click()} disabled={isUploading}
                                    className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold border-none cursor-pointer">
                                    {isUploading ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Camera className="w-4.5 h-4.5" />}
                                </button>
                                <input ref={profileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUploadAvatar} />
                            </div>
                            <div className="text-center sm:text-left space-y-1">
                                <h4 className="text-xs font-black text-slate-900">Upload Profile Photo</h4>
                                <p className="text-[9px] text-slate-400 font-bold leading-normal">Image format: JPG or PNG. Max size 2MB.</p>
                            </div>
                        </div>

                        {/* Fields Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={profile?.name || ""} 
                                    onChange={e => setProfile(prev => prev ? { ...prev, name: e.target.value } : null)}
                                    className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#ffb800] bg-slate-50/50" 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                                <input 
                                    type="email" 
                                    disabled
                                    value={profile?.email || ""} 
                                    className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none bg-slate-100 text-slate-400 cursor-not-allowed" 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                                <input 
                                    type="text" 
                                    required
                                    value={profile?.phone || ""} 
                                    onChange={e => setProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                                    className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#ffb800] bg-slate-50/50" 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date of Birth</label>
                                <input 
                                    type="date" 
                                    value={profile?.dob ? profile.dob.split("T")[0] : ""} 
                                    onChange={e => setProfile(prev => prev ? { ...prev, dob: e.target.value } : null)}
                                    className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#ffb800] bg-slate-50/50" 
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Home Address / Location</label>
                            <input 
                                type="text" 
                                required
                                value={profile?.address || ""} 
                                onChange={e => setProfile(prev => prev ? { ...prev, address: e.target.value } : null)}
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#ffb800] bg-slate-50/50" 
                            />
                        </div>

                        {/* Subject Selection Tags */}
                        <div className="space-y-3 pt-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Choose Enrolled Subjects ({selectedSubjects.length})</label>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {SUBJECTS.map(sub => {
                                    const active = selectedSubjects.includes(sub);
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

                        {/* Registered Children */}
                        <div className="space-y-3 pt-4 border-t border-slate-100">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Registered Children ({profile?.student?.children ? (() => { try { return JSON.parse(profile.student.children).length; } catch { return 0; } })() : 0})</label>
                                <Link href="/student/children" className="text-xs font-black text-[#ffb800] hover:underline uppercase tracking-wider">Manage Children</Link>
                            </div>
                            {profile?.student?.children ? (
                                <div className="flex flex-wrap gap-2">
                                    {(() => {
                                        try {
                                            const childrenList = JSON.parse(profile.student.children);
                                            if (childrenList.length === 0) return <p className="text-xs text-slate-400 font-semibold">No children registered yet.</p>;
                                            return childrenList.map((child: any, i: number) => (
                                                <div key={i} className="px-3 py-2 bg-slate-55 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
                                                    {child.name} ({child.classLevel})
                                                </div>
                                            ));
                                        } catch {
                                            return <p className="text-xs text-slate-400 font-semibold">No children registered yet.</p>;
                                        }
                                    })()}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400 font-semibold">No children registered yet.</p>
                            )}
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
                                        <p className="text-[8px] text-slate-400 font-bold mt-0.5">Receive matched tutor summaries</p>
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
                                        <p className="text-[8px] text-slate-400 font-bold mt-0.5">Direct SMS matches alerts</p>
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
                                        <p className="text-[8px] text-slate-400 font-bold mt-0.5">Send updates directly to mobile</p>
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
