"use client";

import { useState, useEffect } from "react";
import {
    Search, MapPin, BookOpen, Filter, Star, Phone, Mail,
    User, GraduationCap, Briefcase, Award, X, Loader2, MessageCircle
} from "lucide-react";
import { toast } from "sonner";
import MapLocationPicker from "@/components/ui/DynamicMapPicker";

interface Teacher {
    id: string;
    userId: string;
    name: string;
    email: string;
    phone: string;
    profilePhoto: string | null;
    address: string;
    education: string;
    experience: string;
    certifications: string[];
    subjects: string[];
}

const SUBJECTS = [
    "All Subjects", "Mathematics", "Physics", "Chemistry", "Biology", "English",
    "Hindi", "History", "Geography", "Computer Science", "Economics"
];

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("All Subjects");
    const [areaFilter, setAreaFilter] = useState("");
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [contactModalOpen, setContactModalOpen] = useState(false);
    const [contactMessage, setContactMessage] = useState("");
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const res = await fetch("/api/teachers");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setTeachers(data);
        } catch (error) {
            toast.error("Failed to load teachers");
        } finally {
            setLoading(false);
        }
    };

    const filteredTeachers = teachers.filter((teacher) => {
        const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.subjects.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesSubject = selectedSubject === "All Subjects" ||
            teacher.subjects.includes(selectedSubject);

        const matchesArea = !areaFilter || (() => {
            const filterParts = areaFilter.toLowerCase().split(",").map(p => p.trim()).filter(p => p.length > 1 && !/^\d+$/.test(p));
            const teacherAddr = teacher.address.toLowerCase();
            return filterParts.some(part => teacherAddr.includes(part));
        })();

        return matchesSearch && matchesSubject && matchesArea;
    });

    const handleContact = async () => {
        if (!selectedTeacher || !contactMessage.trim()) {
            toast.error("Please enter a message");
            return;
        }

        setSending(true);
        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    teacherId: selectedTeacher.id,
                    message: contactMessage,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to send");
            }

            toast.success("Message sent successfully!");
            setContactModalOpen(false);
            setContactMessage("");
            setSelectedTeacher(null);
        } catch (error: any) {
            toast.error(error.message || "Failed to send message");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Find Teachers</h1>
                <p className="text-slate-500 mt-1">Browse qualified teachers in your area</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Search by name or subject..."
                        />
                    </div>

                    {/* Subject Filter */}
                    <div className="relative">
                        <BookOpen className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
                        >
                            {SUBJECTS.map((subject) => (
                                <option key={subject} value={subject}>{subject}</option>
                            ))}
                        </select>
                    </div>

                    {/* Area Filter - Map */}
                    <div className="md:col-span-3">
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">📍 Filter by Area</label>
                        <MapLocationPicker
                            onLocationSelect={(loc) => {
                                setAreaFilter(loc.address);
                            }}
                            initialAddress={areaFilter}
                            accentColor="blue"
                            height="200px"
                            compact={true}
                        />
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-slate-500">
                    Showing <span className="font-semibold text-slate-900">{filteredTeachers.length}</span> teachers
                </p>
            </div>

            {/* Teachers Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            ) : filteredTeachers.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                    <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No Teachers Found</h3>
                    <p className="text-slate-500">Try adjusting your filters or search term</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTeachers.map((teacher) => (
                        <div
                            key={teacher.id}
                            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                        >
                            {/* Profile Header */}
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white relative">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center overflow-hidden">
                                        {teacher.profilePhoto ? (
                                            <img src={teacher.profilePhoto} alt={teacher.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-8 h-8 text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{teacher.name}</h3>
                                        <p className="text-blue-100 text-sm flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {teacher.address.split(",")[0]}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                {/* Subjects */}
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Subjects</p>
                                    <div className="flex flex-wrap gap-1">
                                        {teacher.subjects.slice(0, 3).map((subject) => (
                                            <span key={subject} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium">
                                                {subject}
                                            </span>
                                        ))}
                                        {teacher.subjects.length > 3 && (
                                            <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs">
                                                +{teacher.subjects.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Info */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <GraduationCap className="w-4 h-4 text-slate-400" />
                                        <span className="truncate">{teacher.education}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Briefcase className="w-4 h-4 text-slate-400" />
                                        <span className="truncate">{teacher.experience}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={() => setSelectedTeacher(teacher)}
                                        className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
                                    >
                                        View Profile
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedTeacher(teacher);
                                            setContactModalOpen(true);
                                        }}
                                        className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        Contact
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Teacher Profile Modal */}
            {selectedTeacher && !contactModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 text-white relative">
                            <button
                                onClick={() => setSelectedTeacher(null)}
                                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-xl transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center overflow-hidden">
                                    {selectedTeacher.profilePhoto ? (
                                        <img src={selectedTeacher.profilePhoto} alt={selectedTeacher.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-12 h-12 text-white" />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold">{selectedTeacher.name}</h2>
                                    <p className="text-blue-100 flex items-center gap-2 mt-1">
                                        <MapPin className="w-4 h-4" />
                                        {selectedTeacher.address}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 space-y-6">
                            {/* Contact Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                                    <Mail className="w-5 h-5 text-blue-500" />
                                    <div>
                                        <p className="text-xs text-slate-400">Email</p>
                                        <p className="font-medium text-slate-900">{selectedTeacher.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                                    <Phone className="w-5 h-5 text-blue-500" />
                                    <div>
                                        <p className="text-xs text-slate-400">Phone</p>
                                        <p className="font-medium text-slate-900">{selectedTeacher.phone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Education & Experience */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-2">
                                        <GraduationCap className="w-5 h-5 text-blue-500" />
                                        Education
                                    </h3>
                                    <p className="text-slate-600">{selectedTeacher.education}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-2">
                                        <Briefcase className="w-5 h-5 text-blue-500" />
                                        Experience
                                    </h3>
                                    <p className="text-slate-600">{selectedTeacher.experience}</p>
                                </div>
                            </div>

                            {/* Certifications */}
                            <div>
                                <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
                                    <Award className="w-5 h-5 text-blue-500" />
                                    Certifications
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedTeacher.certifications.map((cert) => (
                                        <span key={cert} className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                                            {cert}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Subjects */}
                            <div>
                                <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
                                    <BookOpen className="w-5 h-5 text-blue-500" />
                                    Subjects
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedTeacher.subjects.map((subject) => (
                                        <span key={subject} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                            {subject}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Contact Button */}
                            <button
                                onClick={() => setContactModalOpen(true)}
                                className="w-full py-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Contact Teacher
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Contact Modal */}
            {contactModalOpen && selectedTeacher && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Contact {selectedTeacher.name}</h2>
                            <button
                                onClick={() => {
                                    setContactModalOpen(false);
                                    setContactMessage("");
                                }}
                                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Your Message</label>
                                <textarea
                                    value={contactMessage}
                                    onChange={(e) => setContactMessage(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                                    placeholder="Introduce yourself and describe what you'd like to learn..."
                                />
                            </div>

                            <button
                                onClick={handleContact}
                                disabled={sending}
                                className="w-full py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {sending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <MessageCircle className="w-5 h-5" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
