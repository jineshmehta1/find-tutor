"use client";

import { useState, useEffect } from "react";
import {
    Users, Search, Mail, Phone, MapPin, User, Loader2,
    CheckCircle2, Clock, XCircle, Trash2, GraduationCap, Eye, X, Calendar, Award, Briefcase, BookOpen
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
            toast.success("Teacher approved successfully!");
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
            toast.success("Teacher approval revoked!");
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
            toast.success("User deleted successfully!");
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
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
                <p className="text-slate-500 mt-1">Manage teachers and students</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit">
                <button
                    onClick={() => { setActiveTab("TEACHER"); setApprovalFilter("ALL"); }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === "TEACHER"
                        ? "bg-white text-amber-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                        }`}
                >
                    <User className="w-5 h-5" />
                    Teachers
                </button>
                <button
                    onClick={() => { setActiveTab("STUDENT"); setApprovalFilter("ALL"); }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === "STUDENT"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                        }`}
                >
                    <GraduationCap className="w-5 h-5" />
                    Students
                </button>
            </div>

            {/* Stats for Teachers Tab */}
            {activeTab === "TEACHER" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-sm">Total Teachers</p>
                                <p className="text-3xl font-bold text-slate-900">{allTeachers.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                                <User className="w-6 h-6 text-amber-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-sm">Pending Approval</p>
                                <p className="text-3xl font-bold text-amber-600">{pendingTeachers.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                                <Clock className="w-6 h-6 text-amber-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-sm">Approved</p>
                                <p className="text-3xl font-bold text-green-600">{approvedTeachers.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats for Students Tab */}
            {activeTab === "STUDENT" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-sm">Total Students</p>
                                <p className="text-3xl font-bold text-blue-600">{users.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <GraduationCap className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-sm">Active This Month</p>
                                <p className="text-3xl font-bold text-green-600">{users.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className={`grid grid-cols-1 ${activeTab === "TEACHER" ? "md:grid-cols-2" : ""} gap-4`}>
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                            placeholder={`Search ${activeTab.toLowerCase()}s by name or email...`}
                        />
                    </div>

                    {/* Approval Filter - Only for Teachers */}
                    {activeTab === "TEACHER" && (
                        <select
                            value={approvalFilter}
                            onChange={(e) => setApprovalFilter(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none appearance-none bg-white"
                        >
                            <option value="ALL">All Status</option>
                            <option value="pending">Pending Approval</option>
                            <option value="approved">Approved</option>
                        </select>
                    )}
                </div>
            </div>

            {/* Users List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className={`w-8 h-8 animate-spin ${activeTab === "TEACHER" ? "text-amber-500" : "text-blue-500"}`} />
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                    <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No {activeTab === "TEACHER" ? "Teachers" : "Students"} Found</h3>
                    <p className="text-slate-500">No users match your current filters.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredUsers.map((user) => {
                        const isTeacher = user.role === "TEACHER";
                        const isApproved = !!user.teacher?.isApproved;
                        const subjects = parseJson(isTeacher ? user.teacher?.subjects || "[]" : user.student?.subjects || "[]");

                        return (
                            <div key={user.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden ${isTeacher ? "bg-gradient-to-br from-amber-500 to-amber-600" : "bg-gradient-to-br from-blue-500 to-blue-600"
                                            }`}>
                                            {user.profilePhoto ? (
                                                <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-7 h-7 text-white" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-slate-900 text-lg">{user.name}</h3>
                                                {isTeacher && (
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isApproved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                                        }`}>
                                                        {isApproved ? "Approved" : "Pending"}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                                                <Mail className="w-4 h-4" />
                                                {user.email}
                                            </p>
                                            <p className="text-slate-500 text-sm flex items-center gap-1">
                                                <Phone className="w-4 h-4" />
                                                {user.phone}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setSelectedUser(user)}
                                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                                        >
                                            <Eye className="w-4 h-4 inline mr-1" />
                                            View
                                        </button>
                                        {isTeacher && user.teacher && (
                                            <>
                                                {!isApproved ? (
                                                    <button
                                                        onClick={() => handleApprove(user.teacher!.id)}
                                                        disabled={processing === user.teacher.id}
                                                        className="px-4 py-2 bg-green-100 text-green-700 rounded-xl font-medium hover:bg-green-200 transition-colors disabled:opacity-50"
                                                    >
                                                        {processing === user.teacher.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <>
                                                                <CheckCircle2 className="w-4 h-4 inline mr-1" />
                                                                Approve
                                                            </>
                                                        )}
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleReject(user.teacher!.id)}
                                                        disabled={processing === user.teacher.id}
                                                        className="px-4 py-2 bg-amber-100 text-amber-700 rounded-xl font-medium hover:bg-amber-200 transition-colors disabled:opacity-50"
                                                    >
                                                        {processing === user.teacher.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <>
                                                                <XCircle className="w-4 h-4 inline mr-1" />
                                                                Revoke
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </>
                                        )}
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            disabled={processing === user.id}
                                            className="px-4 py-2 bg-red-100 text-red-700 rounded-xl font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
                                        >
                                            {processing === user.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Quick Info */}
                                <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {user.address.split(",")[0]}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        Joined {new Date(user.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                {/* Subjects */}
                                {subjects.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-1">
                                        {subjects.slice(0, 5).map((subject: string) => (
                                            <span key={subject} className={`px-2 py-1 rounded-lg text-xs ${isTeacher ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                                                }`}>
                                                {subject}
                                            </span>
                                        ))}
                                        {subjects.length > 5 && (
                                            <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs">
                                                +{subjects.length - 5} more
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Profile Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className={`p-6 rounded-t-3xl ${selectedUser.role === "TEACHER" ? "bg-gradient-to-r from-amber-500 to-amber-600" : "bg-gradient-to-r from-blue-500 to-blue-600"}`}>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center overflow-hidden">
                                    {selectedUser.profilePhoto ? (
                                        <img src={selectedUser.profilePhoto} alt={selectedUser.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-10 h-10 text-white" />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{selectedUser.name}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm font-medium">
                                            {selectedUser.role}
                                        </span>
                                        {selectedUser.role === "TEACHER" && (
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedUser.teacher?.isApproved
                                                ? "bg-green-500 text-white"
                                                : "bg-amber-500 text-white"
                                                }`}>
                                                {selectedUser.teacher?.isApproved ? "Approved" : "Pending"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Contact Information */}
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3">Contact Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                                        <Mail className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <p className="text-xs text-slate-400">Email</p>
                                            <p className="text-slate-900 font-medium">{selectedUser.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                                        <Phone className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <p className="text-xs text-slate-400">Phone</p>
                                            <p className="text-slate-900 font-medium">{selectedUser.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl md:col-span-2">
                                        <MapPin className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <p className="text-xs text-slate-400">Address</p>
                                            <p className="text-slate-900 font-medium">{selectedUser.address}</p>
                                        </div>
                                    </div>
                                    {selectedUser.dateOfBirth && (
                                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                                            <Calendar className="w-5 h-5 text-slate-400" />
                                            <div>
                                                <p className="text-xs text-slate-400">Date of Birth</p>
                                                <p className="text-slate-900 font-medium">{new Date(selectedUser.dateOfBirth).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                                        <Clock className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <p className="text-xs text-slate-400">Joined</p>
                                            <p className="text-slate-900 font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Teacher-specific info */}
                            {selectedUser.role === "TEACHER" && selectedUser.teacher && (
                                <>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-3">Qualifications</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl">
                                                <Award className="w-5 h-5 text-amber-500 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-amber-500">Education</p>
                                                    <p className="text-slate-900 font-medium">{selectedUser.teacher.education || "Not specified"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl">
                                                <Briefcase className="w-5 h-5 text-amber-500 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-amber-500">Experience</p>
                                                    <p className="text-slate-900 font-medium">{selectedUser.teacher.experience || "Not specified"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {selectedUser.teacher.certifications && (
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-3">Certifications</h3>
                                            <div className="space-y-3">
                                                {parseJson(selectedUser.teacher.certifications).map((cert: string | { text: string; image?: string }, idx: number) => {
                                                    const certText = typeof cert === "string" ? cert : cert.text;
                                                    const certImage = typeof cert === "string" ? null : cert.image;
                                                    return (
                                                        <div key={idx} className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                                                            {certImage && (
                                                                <a href={certImage} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                                                                    <img
                                                                        src={certImage}
                                                                        alt={certText}
                                                                        className="w-16 h-16 rounded-lg object-cover border border-amber-200 hover:opacity-80 transition-opacity"
                                                                    />
                                                                </a>
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-amber-800">{certText}</p>
                                                                {certImage && (
                                                                    <a href={certImage} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-600 hover:underline mt-1 inline-block">
                                                                        View Certificate →
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Subjects */}
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3">
                                    {selectedUser.role === "TEACHER" ? "Subjects Taught" : "Subjects of Interest"}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {parseJson(selectedUser.role === "TEACHER" ? selectedUser.teacher?.subjects || "[]" : selectedUser.student?.subjects || "[]").map((subject: string) => (
                                        <span
                                            key={subject}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium ${selectedUser.role === "TEACHER"
                                                ? "bg-amber-100 text-amber-700"
                                                : "bg-blue-100 text-blue-700"
                                                }`}
                                        >
                                            <BookOpen className="w-4 h-4 inline mr-1" />
                                            {subject}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-slate-100">
                                {selectedUser.role === "TEACHER" && selectedUser.teacher && (
                                    <>
                                        {!selectedUser.teacher.isApproved ? (
                                            <button
                                                onClick={() => {
                                                    handleApprove(selectedUser.teacher!.id);
                                                    setSelectedUser(null);
                                                }}
                                                className="flex-1 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors"
                                            >
                                                <CheckCircle2 className="w-5 h-5 inline mr-2" />
                                                Approve Teacher
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    handleReject(selectedUser.teacher!.id);
                                                    setSelectedUser(null);
                                                }}
                                                className="flex-1 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors"
                                            >
                                                <XCircle className="w-5 h-5 inline mr-2" />
                                                Revoke Approval
                                            </button>
                                        )}
                                    </>
                                )}
                                <button
                                    onClick={() => handleDelete(selectedUser.id)}
                                    className="px-6 py-3 bg-red-100 text-red-700 rounded-xl font-bold hover:bg-red-200 transition-colors"
                                >
                                    <Trash2 className="w-5 h-5 inline mr-2" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
