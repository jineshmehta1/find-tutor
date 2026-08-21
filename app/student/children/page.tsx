"use client";

import React, { useState, useEffect } from "react";
import { User, Plus, Trash2, Edit3, Award, Sparkles, BookOpen } from "lucide-react";
import { toast } from "sonner";

interface Child {
    name: string;
    classLevel: string;
    interests?: string;
}

export default function StudentChildrenPage() {
    const [children, setChildren] = useState<Child[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editIdx, setEditIdx] = useState<number | null>(null);
    const [name, setName] = useState("");
    const [classLevel, setClassLevel] = useState("Class 6");
    const [interests, setInterests] = useState("");

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const res = await fetch("/api/students");
                if (res.ok) {
                    const data = await res.json();
                    if (data.student?.children) {
                        try {
                            const arr = JSON.parse(data.student.children);
                            if (Array.isArray(arr)) {
                                setChildren(arr);
                                localStorage.setItem("student_children", JSON.stringify(arr));
                                return;
                            }
                        } catch {}
                    }
                }
            } catch (err) {
                console.error(err);
            }

            // Fallback to localStorage if database fails or is empty
            const saved = localStorage.getItem("student_children");
            if (saved) {
                try {
                    const arr = JSON.parse(saved);
                    if (Array.isArray(arr)) setChildren(arr);
                } catch {}
            } else {
                const defaultList = [
                    { name: "Aarav Sharma", classLevel: "Class 6", interests: "Chess, Mathematics" },
                    { name: "Ananya Sharma", classLevel: "Class 3", interests: "Robotics, Abacus" }
                ];
                setChildren(defaultList);
                localStorage.setItem("student_children", JSON.stringify(defaultList));
                saveChildrenToDb(defaultList);
            }
        };
        fetchChildren();
    }, []);

    const saveChildrenToDb = async (updatedList: Child[]) => {
        try {
            const res = await fetch("/api/students", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ children: updatedList })
            });
            if (!res.ok) throw new Error("Failed to save to database");
            // Dispatch storage event to alert sidebar layouts of update
            window.dispatchEvent(new Event("storage"));
        } catch (err) {
            console.error(err);
            toast.error("Failed to sync child changes with the database.");
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Name is required");
            return;
        }

        let updated = [...children];
        const newChild = { name, classLevel, interests };

        if (editIdx !== null) {
            updated[editIdx] = newChild;
            toast.success("Child profile updated.");
        } else {
            updated.push(newChild);
            toast.success("Child profile created.");
        }

        setChildren(updated);
        localStorage.setItem("student_children", JSON.stringify(updated));
        saveChildrenToDb(updated);
        setShowModal(false);
        resetForm();
    };

    const handleEdit = (idx: number) => {
        const c = children[idx];
        setEditIdx(idx);
        setName(c.name);
        setClassLevel(c.classLevel);
        setInterests(c.interests || "");
        setShowModal(true);
    };

    const handleDelete = (idx: number) => {
        if (confirm("Are you sure you want to delete this child profile?")) {
            const updated = children.filter((_, i) => i !== idx);
            setChildren(updated);
            localStorage.setItem("student_children", JSON.stringify(updated));
            saveChildrenToDb(updated);
            toast.success("Child profile deleted.");
        }
    };

    const resetForm = () => {
        setEditIdx(null);
        setName("");
        setClassLevel("Class 6");
        setInterests("");
    };

    return (
        <div className="space-y-6 pb-12 p-6 sm:p-8 bg-slate-50 min-h-[calc(100vh-70px)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">My Children</h1>
                    <p className="text-xs font-bold text-slate-400">Manage learning requirements and profiles for your children</p>
                </div>
                <button 
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="px-5 py-2.5 bg-[#0a1829] hover:bg-amber-500 hover:text-slate-950 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border-none"
                >
                    <Plus className="w-4 h-4" /> Add Child Profile
                </button>
            </div>

            {children.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/50 p-12 text-center text-slate-400 font-semibold text-xs space-y-4 max-w-lg mx-auto">
                    <User className="w-12 h-12 text-slate-300 mx-auto" />
                    <h3 className="font-extrabold text-slate-950 text-sm">No Children Registered</h3>
                    <p>Register children profiles to customize tutoring match search categories easily.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {children.map((child, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200/50 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                            
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-base font-black shrink-0 ${
                                    idx % 2 === 0 ? "bg-blue-50 text-blue-600" : "bg-rose-50 text-rose-600"
                                }`}>
                                    {child.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div className="space-y-1 flex-1 min-w-0">
                                    <h3 className="text-sm font-black text-slate-900 truncate">{child.name}</h3>
                                    <span className="inline-block px-2.5 py-0.5 bg-slate-50 text-slate-500 border border-slate-100 rounded-full text-[9px] font-black uppercase">
                                        {child.classLevel}
                                    </span>
                                    {child.interests && (
                                        <div className="flex items-start gap-1.5 text-[11px] text-slate-500 font-bold mt-3 leading-relaxed">
                                            <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                            <p className="truncate w-full">Interests: <span className="text-slate-800">{child.interests}</span></p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2.5 justify-end mt-6 pt-4 border-t border-slate-55 w-full">
                                <button 
                                    onClick={() => handleEdit(idx)}
                                    className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl transition-colors cursor-pointer border-none shadow-sm flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider"
                                >
                                    <Edit3 className="w-3.5 h-3.5" /> Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(idx)}
                                    className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors cursor-pointer border-none shadow-sm flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider"
                                >
                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            )}

            {/* Child Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md p-6 relative">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">
                            {editIdx !== null ? "Edit Child Profile" : "Add Child Profile"}
                        </h4>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest mb-1.5">Child Full Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-55 border border-slate-200 focus:outline-none focus:border-[#ffb800] rounded-xl text-xs font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest mb-1.5">Class / Level</label>
                                <select
                                    value={classLevel}
                                    onChange={(e) => setClassLevel(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-55 border border-slate-200 focus:outline-none focus:border-[#ffb800] rounded-xl text-xs font-bold appearance-none cursor-pointer"
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                                        <option key={n} value={`Class ${n}`}>Class {n}</option>
                                    ))}
                                    <option value="Pre-Primary">Pre-Primary</option>
                                    <option value="College">College / Professional</option>
                                    <option value="Hobby / Activity">Hobby / Activity</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest mb-1.5">Subjects Interests (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Chess, Robotics, English"
                                    value={interests}
                                    onChange={(e) => setInterests(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-55 border border-slate-200 focus:outline-none focus:border-[#ffb800] rounded-xl text-xs font-bold"
                                />
                            </div>
                            <div className="flex gap-3 justify-end pt-2 border-t mt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-[10px] font-black text-slate-500 uppercase tracking-wider hover:bg-slate-50 rounded-lg">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 text-[10px] font-black text-white bg-[#0a1829] hover:bg-amber-500 hover:text-slate-900 rounded-xl uppercase tracking-wider">Save Profile</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
