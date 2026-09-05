"use client";

import { useState, useEffect } from "react";
import {
    Users, Search, Mail, Phone, MapPin, User, Loader2,
    CheckCircle2, Clock, XCircle, Trash2, GraduationCap, Eye, X, Calendar, Award, Briefcase, BookOpen, Sparkles, ShieldCheck
} from "lucide-react";
import { toast } from "sonner";

interface UserData {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    profilePhoto: string | null;
    role: string;
    createdAt: string;
    teacher?: {
        id: string;
        isApproved: boolean;
        education: string;
        experience: string;
        subjects: string;
        certifications: string;
        qualificationCertificate?: string;
        identityProof?: string;
        achievementCertificate?: string;
    };
    student?: {
        id: string;
        subjects: string;
    };
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<"TEACHER" | "STUDENT">("TEACHER");
    const [approvalFilter, setApprovalFilter] = useState("ALL");
    const [processing, setProcessing] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

    // Edit states
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [editPhone, setEditPhone] = useState("");
    const [editAddress, setEditAddress] = useState("");
    const [editEducation, setEditEducation] = useState("");
    const [editExperience, setEditExperience] = useState("");
    const [editSubjects, setEditSubjects] = useState<string[]>([]);
    const [newSubjectInput, setNewSubjectInput] = useState("");

    const handleInspect = (user: UserData) => {
        setSelectedUser(user);
        setIsEditing(false);
        setEditName(user.name);
        setEditPhone(user.phone || "");
        setEditAddress(user.address || "");
        if (user.teacher) {
            setEditEducation(user.teacher.education || "");
            setEditExperience(user.teacher.experience || "");
            setEditSubjects(parseJson(user.teacher.subjects));
        }
    };

    const handleSaveChanges = async () => {
        if (!selectedUser) return;
        setProcessing(selectedUser.id);
        try {
            const body = {
                action: "update_profile",
                userId: selectedUser.id,
                name: editName,
                phone: editPhone,
                address: editAddress,
                teacher: selectedUser.teacher ? {
                    education: editEducation,
                    experience: editExperience,
                    subjects: editSubjects,
                    certifications: parseJson(selectedUser.teacher.certifications)
                } : undefined
            };

            const res = await fetch("/api/admin/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            if (!res.ok) throw new Error("Failed to save changes");
            toast.success("Profile updated successfully!");
            setIsEditing(false);
            
            // Local update of selection
            const updatedUser = {
                ...selectedUser,
                name: editName,
                phone: editPhone,
                address: editAddress,
                teacher: selectedUser.teacher ? {
                    ...selectedUser.teacher,
                    education: editEducation,
                    experience: editExperience,
                    subjects: JSON.stringify(editSubjects)
                } : undefined
            };
            setSelectedUser(updatedUser);
            setUsers(prev => prev.map(u => u.id === selectedUser.id ? updatedUser : u));
        } catch (error) {
            toast.error("Failed to update user profile");
        } finally {
            setProcessing(null);
        }
    };

    const handleToggleCert = async (teacherId: string, certIndex: number, currentlyApproved: boolean) => {
        const action = currentlyApproved ? "reject_certificate" : "approve_certificate";
        try {
            const res = await fetch("/api/admin/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ teacherId, certIndex, action }),
            });
            if (!res.ok) throw new Error("Failed to update certificate");
            toast.success(currentlyApproved ? "Certificate approval revoked" : "Certificate approved!");
            
            if (selectedUser && selectedUser.teacher) {
                let parsedCerts = parseJson(selectedUser.teacher.certifications);
                if (parsedCerts[certIndex]) {
                    if (typeof parsedCerts[certIndex] === "string") {
                        parsedCerts[certIndex] = { text: parsedCerts[certIndex], isApproved: !currentlyApproved };
                    } else {
                        parsedCerts[certIndex].isApproved = !currentlyApproved;
                    }
                }
                const updatedUser = {
                    ...selectedUser,
                    teacher: {
                        ...selectedUser.teacher,
                        certifications: JSON.stringify(parsedCerts)
                    }
                };
                setSelectedUser(updatedUser);
                setUsers(prev => prev.map(u => u.id === selectedUser.id ? updatedUser : u));
            }
        } catch (e) {
            toast.error("Failed to update certificate status");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [activeTab]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/users?role=${activeTab}`);
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (teacherId: string) => {
        setProcessing(teacherId);
        try {
            const res = await fetch("/api/admin/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ teacherId, action: "approve" }),
            });
            if (!res.ok) throw new Error("Failed to approve");
            toast.success("Teacher account verified and approved!");
            await fetchUsers();
        } catch (error) {
            toast.error("Failed to approve teacher");
        } finally {
            setProcessing(null);
        }
    };

    const handleReject = async (teacherId: string) => {
        setProcessing(teacherId);
        try {
            const res = await fetch("/api/admin/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ teacherId, action: "reject" }),
            });
            if (!res.ok) throw new Error("Failed to reject");
            toast.success("Teacher approval status revoked.");
            await fetchUsers();
        } catch (error) {
            toast.error("Failed to update teacher");
        } finally {
            setProcessing(null);
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            return;
        }
        setProcessing(userId);
        try {
            const res = await fetch(`/api/admin/users?userId=${userId}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            toast.success("User account deleted.");
            setSelectedUser(null);
            await fetchUsers();
        } catch (error) {
            toast.error("Failed to delete user");
        } finally {
            setProcessing(null);
        }
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesApproval = true;
        if (activeTab === "TEACHER" && approvalFilter !== "ALL") {
            if (approvalFilter === "pending") {
                matchesApproval = !!user.teacher && !user.teacher.isApproved;
            } else if (approvalFilter === "approved") {
                matchesApproval = !!user.teacher && !!user.teacher.isApproved;
            }
        }
        return matchesSearch && matchesApproval;
    });

    const allTeachers = users.filter(u => u.role === "TEACHER");
    const pendingTeachers = allTeachers.filter(u => u.teacher && !u.teacher.isApproved);
    const approvedTeachers = allTeachers.filter(u => u.teacher && u.teacher.isApproved);

    const parseJson = (str: string) => {
        try { return JSON.parse(str); } catch { return []; }
    };

    return (
        <div className="space-y-8 font-sans pb-12">
            {/* Header Banner */}
            <div className="bg-[#ffb800] p-6 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-amber-300 text-xs font-bold rounded-full border border-white/15">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Platform User Approvals</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Users & Instructor Approvals</h1>
                    <p className="text-xs sm:text-sm text-amber-100 font-medium max-w-xl">
                        Verify teacher credentials, approve home tuition accounts, and manage student learning profiles across Vijayawada.
                    </p>
                </div>
            </div>

            {/* Role Tabs & Filters */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl">
                        <button
                            onClick={() => { setActiveTab("TEACHER"); setApprovalFilter("ALL"); }}
                            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === "TEACHER" ? "bg-[#ffb800] text-white shadow-md" : "text-slate-600 hover:text-slate-900"}`}
                        >
                            <User className="w-4 h-4" />
                            <span>Tutors / Instructors</span>
                        </button>
                        <button
                            onClick={() => { setActiveTab("STUDENT"); setApprovalFilter("ALL"); }}
                            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === "STUDENT" ? "bg-[#ffb800] text-white shadow-md" : "text-slate-600 hover:text-slate-900"}`}
                        >
                            <GraduationCap className="w-4 h-4" />
                            <span>Students</span>
                        </button>
                    </div>

                    {activeTab === "TEACHER" && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status:</span>
                            <select
                                value={approvalFilter}
                                onChange={(e) => setApprovalFilter(e.target.value)}
                                className="px-3.5 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:border-[#ffb800] outline-none bg-slate-50/50 cursor-pointer"
                            >
                                <option value="ALL">All Approvals</option>
                                <option value="pending">Pending Approval</option>
                                <option value="approved">Approved</option>
                            </select>
                        </div>
                    )}
                </div>

                <div className="relative">
                    <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 text-xs font-bold border border-slate-200 rounded-xl focus:border-[#ffb800] outline-none bg-slate-50/50"
                        placeholder={`Search ${activeTab.toLowerCase()}s by name or email address...`}
                    />
                </div>
            </div>

            {/* Metrics Row */}
            {activeTab === "TEACHER" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-black text-slate-900">{allTeachers.length}</div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Tutors</div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#ffb800] flex items-center justify-center font-bold">
                            <User className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-black text-amber-600">{pendingTeachers.length}</div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Review</div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                            <Clock className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-black text-emerald-600">{approvedTeachers.length}</div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Approved Tutors</div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            )}

            {/* Users List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-28 bg-slate-200/60 rounded-3xl animate-pulse" />
                    ))}
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
                    <Users className="w-12 h-12 text-slate-300 mx-auto" />
                    <h3 className="text-lg font-extrabold text-slate-900">No {activeTab === "TEACHER" ? "Teachers" : "Students"} Found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">No user records match your current search and filter settings.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredUsers.map((user) => {
                        const isTeacher = user.role === "TEACHER";
                        const isApproved = !!user.teacher?.isApproved;
                        const subjects = parseJson(isTeacher ? user.teacher?.subjects || "[]" : user.student?.subjects || "[]");

                        return (
                            <div key={user.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#ffb800] flex items-center justify-center font-bold shrink-0 overflow-hidden border border-amber-200/60">
                                            {user.profilePhoto ? (
                                                <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-6 h-6 text-[#ffb800]" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-extrabold text-base text-slate-900">{user.name}</h3>
                                                {isTeacher && (
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${isApproved ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" : "bg-amber-50 text-amber-700 border border-amber-200/60"}`}>
                                                        {isApproved ? "Approved ✓" : "Pending Review"}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium mt-0.5">{user.email} • {user.phone || "No Phone"}</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 self-end sm:self-auto">
                                        <button
                                            onClick={() => handleInspect(user)}
                                            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            <span>Inspect Profile</span>
                                        </button>

                                        {isTeacher && user.teacher && (
                                            isApproved ? (
                                                <button
                                                    onClick={() => handleReject(user.teacher!.id)}
                                                    disabled={processing === user.teacher.id}
                                                    className="px-3.5 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/60 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                                                >
                                                    {processing === user.teacher.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Revoke Approval"}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleApprove(user.teacher!.id)}
                                                    disabled={processing === user.teacher.id}
                                                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                                                >
                                                    {processing === user.teacher.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                                    <span>Approve Tutor</span>
                                                </button>
                                            )
                                        )}

                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            disabled={processing === user.id}
                                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-50"
                                            title="Delete User"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Subjects & Info */}
                                <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-600">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        <span className="text-slate-400 mr-1">Subjects:</span>
                                        {subjects.length > 0 ? (
                                            subjects.slice(0, 4).map((sub: string) => (
                                                <span key={sub} className="px-2.5 py-0.5 bg-slate-100 rounded-md text-[11px]">
                                                    {sub}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-slate-400 font-normal">None Listed</span>
                                        )}
                                    </div>
                                    <span className="text-[11px] text-slate-400">Joined {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Inspect User Profile Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl my-8">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#ffb800] flex items-center justify-center font-bold overflow-hidden border border-amber-200/60">
                                    {selectedUser.profilePhoto ? (
                                        <img src={selectedUser.profilePhoto} alt={selectedUser.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-6 h-6 text-[#ffb800]" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-slate-900">{isEditing ? "Edit User Profile" : selectedUser.name}</h3>
                                    <p className="text-xs text-slate-500 font-medium">{selectedUser.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${isEditing ? "bg-amber-100 text-amber-700 font-bold" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                                >
                                    {isEditing ? "Cancel Edit" : "Edit Profile"}
                                </button>
                                <button onClick={() => setSelectedUser(null)} className="p-1.5 hover:bg-slate-100 rounded-xl">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>
                        </div>

                        {isEditing ? (
                            /* EDIT MODE FORM */
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-slate-400">Full Name</label>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-slate-50/50 outline-none focus:border-[#ffb800]"
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-slate-400">Phone</label>
                                    <input
                                        type="text"
                                        value={editPhone}
                                        onChange={(e) => setEditPhone(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-slate-50/50 outline-none focus:border-[#ffb800]"
                                        placeholder="Phone Number"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-slate-400">Address</label>
                                    <textarea
                                        value={editAddress}
                                        onChange={(e) => setEditAddress(e.target.value)}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-slate-50/50 outline-none focus:border-[#ffb800] resize-none"
                                        placeholder="Address"
                                    />
                                </div>

                                {selectedUser.teacher && (
                                    <>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-slate-400">Education / Qualification</label>
                                            <input
                                                type="text"
                                                value={editEducation}
                                                onChange={(e) => setEditEducation(e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-slate-50/50 outline-none focus:border-[#ffb800]"
                                                placeholder="Degree, College"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-slate-400">Experience</label>
                                            <input
                                                type="text"
                                                value={editExperience}
                                                onChange={(e) => setEditExperience(e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-slate-50/50 outline-none focus:border-[#ffb800]"
                                                placeholder="e.g. 5+ Years Exp"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-slate-400">Subjects</label>
                                            <div className="flex flex-wrap gap-1.5 mb-2">
                                                {editSubjects.map(sub => (
                                                    <span key={sub} className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-slate-200">
                                                        {sub}
                                                        <X 
                                                            className="w-3 h-3 cursor-pointer text-slate-400 hover:text-rose-500" 
                                                            onClick={() => setEditSubjects(prev => prev.filter(s => s !== sub))} 
                                                        />
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <input 
                                                    type="text" 
                                                    value={newSubjectInput} 
                                                    onChange={(e) => setNewSubjectInput(e.target.value)} 
                                                    placeholder="Add subject..." 
                                                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-white outline-none flex-grow"
                                                />
                                                <button 
                                                    type="button" 
                                                    onClick={() => { if (newSubjectInput.trim() && !editSubjects.includes(newSubjectInput.trim())) { setEditSubjects(prev => [...prev, newSubjectInput.trim()]); setNewSubjectInput(""); } }}
                                                    className="px-4 py-2 bg-[#ffb800] hover:bg-[#ffa000] text-white text-xs font-bold rounded-xl transition-colors"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            /* VIEW MODE */
                            <>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs font-bold text-slate-700">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Role:</span>
                                        <span>{selectedUser.role}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Phone:</span>
                                        <span>{selectedUser.phone || "Not provided"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Address:</span>
                                        <span className="truncate max-w-[200px]">{selectedUser.address}</span>
                                    </div>
                                    {selectedUser.teacher && (
                                        <>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Education:</span>
                                                <span>{selectedUser.teacher.education || "Not provided"}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Experience:</span>
                                                <span>{selectedUser.teacher.experience || "Not provided"}</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Tutor Qualifications & Uploaded Certificates */}
                                {selectedUser.teacher && (
                                    <div className="space-y-3 pt-2">
                                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Uploaded Proof Documents & Certificates</h4>
                                        {(() => {
                                            const certs = parseJson(selectedUser.teacher.certifications);
                                            const qualCert = selectedUser.teacher.qualificationCertificate;
                                            const identityProof = selectedUser.teacher.identityProof;
                                            const achCert = selectedUser.teacher.achievementCertificate;
                                            
                                            const hasPrimaryDocs = qualCert || identityProof || achCert;
                                            if ((!Array.isArray(certs) || certs.length === 0) && !hasPrimaryDocs) {
                                                return <p className="text-xs text-slate-400 font-medium italic">No documents uploaded by this instructor.</p>;
                                            }
                                            
                                            return (
                                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                                    {qualCert && (
                                                        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                            <div className="flex items-center gap-3 min-w-0">
                                                                <img src={qualCert} alt="Qualification Certificate" className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" />
                                                                <div className="min-w-0">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <p className="text-xs font-black text-slate-900 truncate">Highest Qualification</p>
                                                                    </div>
                                                                    <p className="text-[10px] text-slate-400 font-medium">Primary Document Attached ✓</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                                                                <a href={qualCert} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg border border-slate-200">View</a>
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    {identityProof && (
                                                        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                            <div className="flex items-center gap-3 min-w-0">
                                                                <img src={identityProof} alt="Identity Proof" className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" />
                                                                <div className="min-w-0">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <p className="text-xs font-black text-slate-900 truncate">Identity Proof (Address)</p>
                                                                    </div>
                                                                    <p className="text-[10px] text-slate-400 font-medium">Primary Document Attached ✓</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                                                                <a href={identityProof} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg border border-slate-200">View</a>
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    {achCert && (
                                                        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                            <div className="flex items-center gap-3 min-w-0">
                                                                <img src={achCert} alt="Achievement Certificate" className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" />
                                                                <div className="min-w-0">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <p className="text-xs font-black text-slate-900 truncate">Achievement Certificate</p>
                                                                    </div>
                                                                    <p className="text-[10px] text-slate-400 font-medium">Additional Document Attached ✓</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                                                                <a href={achCert} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg border border-slate-200">View</a>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {Array.isArray(certs) && certs.map((c: any, index: number) => {
                                                        const title = typeof c === "string" ? c : c.text;
                                                        const img = typeof c === "object" ? c.image : null;
                                                        const isApproved = typeof c === "object" ? !!c.isApproved : false;
                                                        return (
                                                            <div key={index} className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                                <div className="flex items-center gap-3 min-w-0">
                                                                    {img ? (
                                                                        <img src={img} alt={title} className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" />
                                                                    ) : (
                                                                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs shrink-0">
                                                                            <Award className="w-5 h-5" />
                                                                        </div>
                                                                    )}
                                                                    <div className="min-w-0">
                                                                        <div className="flex items-center gap-1.5">
                                                                            <p className="text-xs font-black text-slate-900 truncate">{title}</p>
                                                                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${isApproved ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" : "bg-amber-50 text-amber-700 border border-amber-200/60"}`}>
                                                                                {isApproved ? "Approved" : "Pending"}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-[10px] text-slate-400 font-medium">{img ? "Document Proof Attached ✓" : "Text Certification"}</p>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                                                                    {img && (
                                                                        <a
                                                                            href={img}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg border border-slate-200"
                                                                        >
                                                                            View
                                                                        </a>
                                                                    )}
                                                                    <button
                                                                        onClick={() => handleToggleCert(selectedUser.teacher!.id, index, isApproved)}
                                                                        className={`px-2.5 py-1.5 text-[10px] font-bold rounded-lg transition-colors border ${isApproved ? "bg-amber-50 text-amber-700 border-amber-200/60 hover:bg-amber-100" : "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"}`}
                                                                    >
                                                                        {isApproved ? "Revoke" : "Approve"}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}
                            </>
                        )}

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                            {isEditing ? (
                                <button
                                    onClick={handleSaveChanges}
                                    disabled={processing === selectedUser.id}
                                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center gap-1.5 disabled:opacity-50"
                                >
                                    {processing === selectedUser.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                    <span>Save Changes</span>
                                </button>
                            ) : (
                                selectedUser.teacher && (
                                    selectedUser.teacher.isApproved ? (
                                        <button
                                            onClick={() => { handleReject(selectedUser.teacher!.id); setSelectedUser(null); }}
                                            className="px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200/60 rounded-xl text-xs font-bold hover:bg-amber-100 transition-colors"
                                        >
                                            Revoke Approval
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => { handleApprove(selectedUser.teacher!.id); setSelectedUser(null); }}
                                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>Verify & Approve Tutor</span>
                                        </button>
                                    )
                                )
                            )}
                            <button onClick={() => setSelectedUser(null)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold">
                                Close Window
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
