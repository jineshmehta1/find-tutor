"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft, ShieldCheck, CheckCircle2, XCircle, Clock,
    User, Mail, Phone, MapPin, GraduationCap, Award, Briefcase,
    FileCheck, FileText, Eye, Edit3, Save, Trash2, Loader2,
    Calendar, Globe, DollarSign, Sparkles, AlertTriangle, ExternalLink
} from "lucide-react";
import { toast } from "sonner";

interface TeacherProfile {
    id: string;
    userId: string;
    education: string;
    experience: string;
    qualificationLevel: string | null;
    qualificationName: string | null;
    subjects: string;
    teachingMode: string | null;
    expectedFee: number | null;
    feeType: string | null;
    classesOrAgeGroup: string | null;
    achievements: string | null;
    certifications: string;
    qualificationCertificate: string | null;
    identityProof: string | null;
    achievementCertificate: string | null;
    isApproved: boolean;
    approvedAt: string | null;
    subscriptionStatus: string;
    subscriptionEnd: string | null;
    views: number;
    user: {
        id: string;
        name: string;
        email: string;
        phone: string;
        dob: string;
        gender: string | null;
        preferredLanguage: string | null;
        profilePhoto: string | null;
        address: string;
        latitude: number | null;
        longitude: number | null;
        role: string;
        createdAt: string;
        updatedAt: string;
    };
}

const SUBJECT_OPTIONS = [
    "Mathematics", "Physics", "Chemistry", "Biology", "English",
    "Hindi", "History", "Geography", "Computer Science", "Economics", "Abacus", "Chess", "Coding"
];

export default function AdminTutorReviewPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [previewDoc, setPreviewDoc] = useState<{ title: string; url: string } | null>(null);

    // Edit Form States
    const [editForm, setEditForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        dob: "",
        gender: "",
        preferredLanguage: "",
        education: "",
        experience: "",
        qualificationLevel: "",
        qualificationName: "",
        subjects: [] as string[],
        teachingMode: "",
        expectedFee: "",
        feeType: "/hr",
        classesOrAgeGroup: [] as string[],
        achievements: "",
    });

    useEffect(() => {
        if (id) fetchTeacherProfile();
    }, [id]);

    const fetchTeacherProfile = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/tutors/${id}`);
            if (!res.ok) throw new Error("Teacher profile not found");
            const data: TeacherProfile = await res.json();
            setTeacher(data);

            // Populate Edit Form
            setEditForm({
                name: data.user.name || "",
                email: data.user.email || "",
                phone: data.user.phone || "",
                address: data.user.address || "",
                dob: data.user.dob ? data.user.dob.split("T")[0] : "",
                gender: data.user.gender || "",
                preferredLanguage: data.user.preferredLanguage || "English",
                education: data.education || "",
                experience: data.experience || "",
                qualificationLevel: data.qualificationLevel || "",
                qualificationName: data.qualificationName || "",
                subjects: parseJsonArray(data.subjects),
                teachingMode: data.teachingMode || "Home Tuition",
                expectedFee: data.expectedFee ? String(data.expectedFee) : "",
                feeType: data.feeType || "/hr",
                classesOrAgeGroup: parseJsonArray(data.classesOrAgeGroup),
                achievements: data.achievements || "",
            });
        } catch {
            toast.error("Failed to load teacher profile");
        } finally {
            setLoading(false);
        }
    };

    const parseJsonArray = (str: string | null): string[] => {
        if (!str) return [];
        try {
            const parsed = JSON.parse(str);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    const parseCertifications = (str: string | null) => {
        if (!str) return [];
        try {
            const parsed = JSON.parse(str);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    const handleSaveProfile = async () => {
        if (!teacher) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/tutors/${teacher.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: editForm.name,
                    phone: editForm.phone,
                    address: editForm.address,
                    dob: editForm.dob,
                    gender: editForm.gender,
                    preferredLanguage: editForm.preferredLanguage,
                    education: editForm.education,
                    experience: editForm.experience,
                    qualificationLevel: editForm.qualificationLevel,
                    qualificationName: editForm.qualificationName,
                    subjects: editForm.subjects,
                    teachingMode: editForm.teachingMode,
                    expectedFee: editForm.expectedFee,
                    feeType: editForm.feeType,
                    classesOrAgeGroup: editForm.classesOrAgeGroup,
                    achievements: editForm.achievements,
                }),
            });

            if (!res.ok) throw new Error("Failed to update profile");
            toast.success("Teacher profile updated successfully!");
            setIsEditing(false);
            await fetchTeacherProfile();
        } catch {
            toast.error("Failed to save profile updates");
        } finally {
            setSaving(false);
        }
    };

    const handleApprovalToggle = async (approve: boolean) => {
        if (!teacher) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/tutors/${teacher.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isApproved: approve }),
            });

            if (!res.ok) throw new Error();
            toast.success(approve ? "✅ Tutor Verified & Approved!" : "⚠️ Tutor status set to Under Review");
            await fetchTeacherProfile();
        } catch {
            toast.error("Failed to update verification status");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!teacher) return;
        if (!confirm(`Are you sure you want to delete the account for ${teacher.user.name}? This action cannot be undone.`)) {
            return;
        }

        setSaving(true);
        try {
            const res = await fetch(`/api/admin/users?userId=${teacher.userId}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            toast.success("Account deleted successfully.");
            router.push("/admin/users");
        } catch {
            toast.error("Failed to delete user account");
            setSaving(false);
        }
    };

    const toggleSubject = (sub: string) => {
        setEditForm(prev => ({
            ...prev,
            subjects: prev.subjects.includes(sub)
                ? prev.subjects.filter(s => s !== sub)
                : [...prev.subjects, sub]
        }));
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-[#ffb800] animate-spin" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Full Teacher Profile...</p>
            </div>
        );
    }

    if (!teacher) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
                <AlertTriangle className="w-12 h-12 text-rose-500" />
                <p className="text-sm font-bold text-slate-700">Teacher Profile Not Found</p>
                <Link href="/admin/users" className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold">
                    Return to User List
                </Link>
            </div>
        );
    }

    const certsList = parseCertifications(teacher.certifications);
    const subjectsList = parseJsonArray(teacher.subjects);
    const classesList = parseJsonArray(teacher.classesOrAgeGroup);

    return (
        <div className="space-y-8 font-sans pb-16">
            {/* Top Navigation & Action Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tutor Verification Profile</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                                teacher.isApproved
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}>
                                {teacher.isApproved ? "VERIFIED & APPROVED" : "UNDER REVIEW"}
                            </span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{teacher.user.name}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                            isEditing
                                ? "bg-slate-900 text-white border-slate-900"
                                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                    >
                        <Edit3 className="w-4 h-4" />
                        <span>{isEditing ? "View Mode" : "Edit Profile"}</span>
                    </button>

                    {teacher.isApproved ? (
                        <button
                            onClick={() => handleApprovalToggle(false)}
                            disabled={saving}
                            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-2xl flex items-center gap-1.5 shadow-sm transition-all"
                        >
                            <Clock className="w-4 h-4" />
                            <span>Mark Under Review</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => handleApprovalToggle(true)}
                            disabled={saving}
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl flex items-center gap-1.5 shadow-md transition-all"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Verify & Approve Tutor</span>
                        </button>
                    )}

                    <button
                        onClick={handleDeleteAccount}
                        disabled={saving}
                        className="p-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200/60 rounded-2xl transition-colors"
                        title="Delete Teacher Account"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Document Lightbox Preview Modal */}
            {previewDoc && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
                    onClick={() => setPreviewDoc(null)}
                >
                    <div className="max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-wider">{previewDoc.title}</span>
                            <a
                                href={previewDoc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-amber-300 hover:underline flex items-center gap-1 font-bold"
                            >
                                Open Original <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </div>
                        <div className="p-4 flex-1 overflow-auto bg-slate-100 flex items-center justify-center">
                            <img src={previewDoc.url} alt={previewDoc.title} className="max-w-full max-h-[75vh] object-contain rounded-xl" />
                        </div>
                    </div>
                </div>
            )}

            {/* Under Review Notice Banner */}
            {!teacher.isApproved && (
                <div className="p-5 bg-amber-50 border border-amber-200 rounded-3xl flex items-center gap-4 text-amber-900 shadow-sm">
                    <div className="p-3 bg-amber-400/20 rounded-2xl text-amber-700 shrink-0">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-wider">Profile Currently Under Review</h4>
                        <p className="text-xs font-medium text-amber-800 leading-relaxed">
                            This instructor has updated their profile details or submitted new proof documents. Review their certificates below and click <strong>Verify & Approve Tutor</strong> to activate their profile on the public platform.
                        </p>
                    </div>
                </div>
            )}

            {/* EDIT MODE FORM */}
            {isEditing ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-8 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div>
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Edit Teacher Profile Information</h3>
                            <p className="text-xs text-slate-400 font-medium">As Admin, you can edit any detail submitted by the instructor.</p>
                        </div>
                        <button
                            onClick={handleSaveProfile}
                            disabled={saving}
                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            <span>Save All Changes</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Details */}
                        <div className="space-y-4 bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Personal & Contact Info</h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full px-4 py-2.5 text-xs font-bold border border-slate-200 rounded-xl bg-white outline-none focus:border-[#ffb800]"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</label>
                                    <input
                                        type="text"
                                        value={editForm.phone}
                                        onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                        className="w-full px-4 py-2.5 text-xs font-bold border border-slate-200 rounded-xl bg-white outline-none focus:border-[#ffb800]"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Date of Birth</label>
                                    <input
                                        type="date"
                                        value={editForm.dob}
                                        onChange={e => setEditForm({ ...editForm, dob: e.target.value })}
                                        className="w-full px-4 py-2.5 text-xs font-bold border border-slate-200 rounded-xl bg-white outline-none focus:border-[#ffb800]"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Gender</label>
                                    <select
                                        value={editForm.gender}
                                        onChange={e => setEditForm({ ...editForm, gender: e.target.value })}
                                        className="w-full px-4 py-2.5 text-xs font-bold border border-slate-200 rounded-xl bg-white outline-none focus:border-[#ffb800]"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Home Address / Location</label>
                                    <textarea
                                        value={editForm.address}
                                        onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                                        rows={2}
                                        className="w-full px-4 py-2.5 text-xs font-bold border border-slate-200 rounded-xl bg-white outline-none focus:border-[#ffb800] resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Academic Qualifications */}
                        <div className="space-y-4 bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Academic Qualifications</h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Highest Education Degree</label>
                                    <input
                                        type="text"
                                        value={editForm.education}
                                        onChange={e => setEditForm({ ...editForm, education: e.target.value })}
                                        placeholder="e.g. M.Tech, PhD in Computer Science"
                                        className="w-full px-4 py-2.5 text-xs font-bold border border-slate-200 rounded-xl bg-white outline-none focus:border-[#ffb800]"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Qualification Level</label>
                                    <input
                                        type="text"
                                        value={editForm.qualificationLevel}
                                        onChange={e => setEditForm({ ...editForm, qualificationLevel: e.target.value })}
                                        placeholder="Post Graduate / PhD / M.Phil"
                                        className="w-full px-4 py-2.5 text-xs font-bold border border-slate-200 rounded-xl bg-white outline-none focus:border-[#ffb800]"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Qualification Name</label>
                                    <input
                                        type="text"
                                        value={editForm.qualificationName}
                                        onChange={e => setEditForm({ ...editForm, qualificationName: e.target.value })}
                                        placeholder="B.Tech, M.Tech, MSc"
                                        className="w-full px-4 py-2.5 text-xs font-bold border border-slate-200 rounded-xl bg-white outline-none focus:border-[#ffb800]"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Teaching Experience (Years)</label>
                                    <input
                                        type="text"
                                        value={editForm.experience}
                                        onChange={e => setEditForm({ ...editForm, experience: e.target.value })}
                                        placeholder="e.g. 8 Years"
                                        className="w-full px-4 py-2.5 text-xs font-bold border border-slate-200 rounded-xl bg-white outline-none focus:border-[#ffb800]"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Teaching Mode</label>
                                    <select
                                        value={editForm.teachingMode}
                                        onChange={e => setEditForm({ ...editForm, teachingMode: e.target.value })}
                                        className="w-full px-4 py-2.5 text-xs font-bold border border-slate-200 rounded-xl bg-white outline-none focus:border-[#ffb800]"
                                    >
                                        <option value="Home Tuition">Home Tuition</option>
                                        <option value="Online Tuition">Online Tuition</option>
                                        <option value="Both (Home & Online)">Both (Home & Online)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subjects Selection */}
                    <div className="space-y-3 bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">Enrolled Subjects</label>
                        <div className="flex flex-wrap gap-2">
                            {SUBJECT_OPTIONS.map(sub => {
                                const selected = editForm.subjects.includes(sub);
                                return (
                                    <button
                                        key={sub}
                                        type="button"
                                        onClick={() => toggleSubject(sub)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                                            selected
                                                ? "bg-[#ffb800] text-slate-950 border-transparent shadow-sm"
                                                : "bg-white text-slate-600 border-slate-200 hover:border-slate-350"
                                        }`}
                                    >
                                        {sub}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bio / Achievements */}
                    <div className="space-y-2 bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">Achievements & Bio</label>
                        <textarea
                            value={editForm.achievements}
                            onChange={e => setEditForm({ ...editForm, achievements: e.target.value })}
                            rows={3}
                            placeholder="Awards, achievements, special training details..."
                            className="w-full px-4 py-2.5 text-xs font-bold border border-slate-200 rounded-xl bg-white outline-none focus:border-[#ffb800] resize-none"
                        />
                    </div>
                </div>
            ) : (
                /* VIEW MODE PROFILE DISPLAY */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: User Card & Basic Details */}
                    <div className="space-y-6">
                        {/* Profile Summary Card */}
                        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm text-center space-y-4">
                            <div className="relative w-24 h-24 mx-auto rounded-3xl overflow-hidden bg-amber-50 border-2 border-amber-200 shadow-md">
                                {teacher.user.profilePhoto ? (
                                    <img src={teacher.user.profilePhoto} alt={teacher.user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center font-black text-3xl text-amber-500">
                                        {teacher.user.name[0]}
                                    </div>
                                )}
                            </div>

                            <div>
                                <h2 className="text-lg font-black text-slate-900">{teacher.user.name}</h2>
                                <p className="text-xs text-slate-400 font-medium">{teacher.user.email}</p>
                                <span className="inline-block mt-2 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200/60 text-[10px] font-black rounded-full uppercase">
                                    {teacher.user.role}
                                </span>
                            </div>

                            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-left text-xs font-bold text-slate-600">
                                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="text-[9px] font-black text-slate-400 uppercase block">Phone</span>
                                    <span className="truncate block font-extrabold">{teacher.user.phone || "N/A"}</span>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="text-[9px] font-black text-slate-400 uppercase block">Experience</span>
                                    <span className="truncate block font-extrabold">{teacher.experience || "N/A"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Location & Personal Details Card */}
                        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Personal & Location Info</h3>
                            <div className="space-y-3 text-xs font-bold text-slate-700">
                                <div className="flex items-start gap-2.5">
                                    <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="text-[10px] text-slate-400 block uppercase">Address</span>
                                        <span className="leading-snug">{teacher.user.address || "Not provided"}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                                    <div>
                                        <span className="text-[10px] text-slate-400 block uppercase">Date of Birth</span>
                                        <span>{teacher.user.dob ? new Date(teacher.user.dob).toLocaleDateString("en-IN") : "N/A"}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <User className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <div>
                                        <span className="text-[10px] text-slate-400 block uppercase">Gender & Language</span>
                                        <span>{teacher.user.gender || "N/A"} ({teacher.user.preferredLanguage || "English"})</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Columns: Qualifications, Subjects, and Uploaded Documents */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Qualifications & Teaching Info */}
                        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-5">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Academic Qualifications & Teaching Profile</h3>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="text-[9px] font-black text-slate-400 uppercase block">Education</span>
                                    <span className="text-xs font-extrabold text-slate-900 block">{teacher.education || "N/A"}</span>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="text-[9px] font-black text-slate-400 uppercase block">Qual. Level</span>
                                    <span className="text-xs font-extrabold text-slate-900 block">{teacher.qualificationLevel || "N/A"}</span>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="text-[9px] font-black text-slate-400 uppercase block">Qual. Name</span>
                                    <span className="text-xs font-extrabold text-slate-900 block">{teacher.qualificationName || "N/A"}</span>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="text-[9px] font-black text-slate-400 uppercase block">Teaching Mode</span>
                                    <span className="text-xs font-extrabold text-slate-900 block">{teacher.teachingMode || "Home Tuition"}</span>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="text-[9px] font-black text-slate-400 uppercase block">Expected Fee</span>
                                    <span className="text-xs font-extrabold text-slate-900 block">
                                        {teacher.expectedFee ? `₹${teacher.expectedFee}${teacher.feeType || ""}` : "Flexible"}
                                    </span>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="text-[9px] font-black text-slate-400 uppercase block">Profile Views</span>
                                    <span className="text-xs font-extrabold text-slate-900 block">{teacher.views} views</span>
                                </div>
                            </div>

                            {/* Subjects Tags */}
                            <div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Subjects Taught</span>
                                <div className="flex flex-wrap gap-2">
                                    {subjectsList.length > 0 ? (
                                        subjectsList.map(s => (
                                            <span key={s} className="px-3 py-1 bg-amber-50 text-[#ffb800] border border-amber-200/80 rounded-xl text-xs font-extrabold">
                                                {s}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">No subjects specified</span>
                                    )}
                                </div>
                            </div>

                            {/* Achievements */}
                            {teacher.achievements && (
                                <div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Achievements & Bio</span>
                                    <p className="text-xs font-medium text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        {teacher.achievements}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* UPLOADED PROOF DOCUMENTS & CERTIFICATES SECTION */}
                        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div>
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Uploaded Proof Documents & Certificates</h3>
                                    <p className="text-[11px] text-slate-400 font-medium">Verify official government IDs, academic degrees, and achievements.</p>
                                </div>
                                <ShieldCheck className="w-5 h-5 text-amber-500" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* 1. Identity Proof */}
                                <div className="p-4 rounded-2xl border bg-slate-50/70 border-slate-200/80 flex flex-col justify-between space-y-3">
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-black text-slate-900">Identity Proof (Aadhaar/PAN)</span>
                                            {teacher.identityProof ? (
                                                <span className="text-[9px] px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md font-bold border border-emerald-200">Attached ✓</span>
                                            ) : (
                                                <span className="text-[9px] px-2 py-0.5 bg-slate-100 text-slate-400 rounded-md font-bold">Not Uploaded</span>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-slate-400">Government identity & residential proof</p>
                                    </div>

                                    {teacher.identityProof ? (
                                        <div className="space-y-2">
                                            <div
                                                className="h-32 rounded-xl overflow-hidden bg-slate-200 relative group cursor-pointer border border-slate-200"
                                                onClick={() => setPreviewDoc({ title: "Identity Proof Document", url: teacher.identityProof! })}
                                            >
                                                <img src={teacher.identityProof} alt="Identity Proof" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                                                    <Eye className="w-4 h-4" /> View Document
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setPreviewDoc({ title: "Identity Proof Document", url: teacher.identityProof! })}
                                                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors"
                                            >
                                                <Eye className="w-3.5 h-3.5 text-amber-600" /> View Full Resolution
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="h-32 bg-slate-100/50 rounded-xl flex flex-col items-center justify-center text-slate-300 text-xs font-bold border border-dashed border-slate-200">
                                            <span>No Document Uploaded</span>
                                        </div>
                                    )}
                                </div>

                                {/* 2. Qualification Certificate */}
                                <div className="p-4 rounded-2xl border bg-slate-50/70 border-slate-200/80 flex flex-col justify-between space-y-3">
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-black text-slate-900">Highest Qualification Certificate</span>
                                            {teacher.qualificationCertificate ? (
                                                <span className="text-[9px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-bold border border-blue-200">Attached ✓</span>
                                            ) : (
                                                <span className="text-[9px] px-2 py-0.5 bg-slate-100 text-slate-400 rounded-md font-bold">Not Uploaded</span>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-slate-400">Degree, Diploma or Marksheet certificate</p>
                                    </div>

                                    {teacher.qualificationCertificate ? (
                                        <div className="space-y-2">
                                            <div
                                                className="h-32 rounded-xl overflow-hidden bg-slate-200 relative group cursor-pointer border border-slate-200"
                                                onClick={() => setPreviewDoc({ title: "Qualification Certificate", url: teacher.qualificationCertificate! })}
                                            >
                                                <img src={teacher.qualificationCertificate} alt="Qualification Certificate" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                                                    <Eye className="w-4 h-4" /> View Certificate
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setPreviewDoc({ title: "Qualification Certificate", url: teacher.qualificationCertificate! })}
                                                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors"
                                            >
                                                <Eye className="w-3.5 h-3.5 text-blue-600" /> View Full Resolution
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="h-32 bg-slate-100/50 rounded-xl flex flex-col items-center justify-center text-slate-300 text-xs font-bold border border-dashed border-slate-200">
                                            <span>No Document Uploaded</span>
                                        </div>
                                    )}
                                </div>

                                {/* 3. Achievement Certificate */}
                                <div className="p-4 rounded-2xl border bg-slate-50/70 border-slate-200/80 flex flex-col justify-between space-y-3 sm:col-span-2">
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-black text-slate-900">Achievement & Award Proof</span>
                                            {teacher.achievementCertificate ? (
                                                <span className="text-[9px] px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md font-bold border border-purple-200">Attached ✓</span>
                                            ) : (
                                                <span className="text-[9px] px-2 py-0.5 bg-slate-100 text-slate-400 rounded-md font-bold">Not Uploaded</span>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-slate-400">Award certificates, experience proof, or commendations</p>
                                    </div>

                                    {teacher.achievementCertificate ? (
                                        <div className="flex flex-col sm:flex-row items-center gap-4">
                                            <div
                                                className="w-full sm:w-48 h-32 rounded-xl overflow-hidden bg-slate-200 relative group cursor-pointer border border-slate-200 shrink-0"
                                                onClick={() => setPreviewDoc({ title: "Achievement Proof Document", url: teacher.achievementCertificate! })}
                                            >
                                                <img src={teacher.achievementCertificate} alt="Achievement Certificate" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                                                    <Eye className="w-4 h-4" /> View Proof
                                                </div>
                                            </div>
                                            <div className="flex-1 space-y-2 text-xs font-medium text-slate-600">
                                                <p>Document proof verified for instructor achievements and commendations.</p>
                                                <button
                                                    onClick={() => setPreviewDoc({ title: "Achievement Proof Document", url: teacher.achievementCertificate! })}
                                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 transition-colors"
                                                >
                                                    <Eye className="w-3.5 h-3.5 text-purple-600" /> Open Full Proof Document
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-slate-100/50 rounded-xl text-center text-slate-400 text-xs font-bold border border-dashed border-slate-200">
                                            No additional achievement proof uploaded.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
