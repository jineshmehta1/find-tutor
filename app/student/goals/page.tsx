"use client";

import { useState } from "react";
import {
    Target, Plus, CheckCircle2, Circle, Trophy,
    Zap, Flame, Calendar, BookOpen, Trash2
} from "lucide-react";
import { toast } from "sonner";

interface Goal {
    id: string;
    text: string;
    completed: boolean;
    category: string;
}

export default function StudentGoalsPage() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [newGoal, setNewGoal] = useState("");
    const [category, setCategory] = useState("General");
    const [streak, setStreak] = useState(0); // study streak

    const handleAddGoal = () => {
        if (!newGoal.trim()) return;
        const goal: Goal = {
            id: Date.now().toString(),
            text: newGoal,
            completed: false,
            category,
        };
        setGoals(prev => [...prev, goal]);
        setNewGoal("");
        toast.success("Learning goal added!");
    };

    const toggleGoal = (id: string) => {
        setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
    };

    const deleteGoal = (id: string) => {
        setGoals(prev => prev.filter(g => g.id !== id));
        toast.info("Goal removed");
    };

    const completedCount = goals.filter(g => g.completed).length;

    return (
        <div className="space-y-8 pb-12 font-sans">
            {/* Header */}
            <div className="bg-[#1f5961] p-6 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-amber-300 text-xs font-bold rounded-full border border-white/15">
                            <Target className="w-3.5 h-3.5" />
                            <span>Milestones</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Goals & Streaks</h1>
                        <p className="text-xs sm:text-sm text-teal-100 font-medium max-w-xl">
                            Gamify your learning targets. Mark items as completed to maintain your study streak.
                        </p>
                    </div>
                    {/* Streak badge */}
                    <div className="bg-amber-500 text-slate-950 px-5 py-3 rounded-2xl flex items-center gap-2.5 shadow-lg border border-amber-400 shrink-0">
                        <Flame className="w-6 h-6 fill-current text-red-650 animate-bounce" />
                        <div>
                            <div className="text-xl font-black leading-none">{streak} Days</div>
                            <div className="text-[9px] font-black uppercase tracking-wider text-slate-800">Study Streak</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Add Goal Form */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5 self-start">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">New Learning Goal</h3>
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Goal / Target</label>
                            <input type="text" value={newGoal} onChange={e => setNewGoal(e.target.value)} placeholder="e.g. Revise 15 organic naming formulas"
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                            <select value={category} onChange={e => setCategory(e.target.value)}
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50 appearance-none cursor-pointer">
                                <option value="General">General</option>
                                <option value="Math">Mathematics</option>
                                <option value="Physics">Physics</option>
                                <option value="Chemistry">Chemistry</option>
                            </select>
                        </div>
                        <button onClick={handleAddGoal}
                            className="w-full py-3.5 bg-[#1f5961] hover:bg-[#163e44] text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-md">
                            <Plus className="w-4 h-4" /> Add Goal
                        </button>
                    </div>
                </div>

                {/* Goals list */}
                <div className="lg:col-span-3 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Goal Targets List</h3>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                            {completedCount} of {goals.length} completed
                        </span>
                    </div>

                    <div className="space-y-3.5">
                        {goals.map(g => (
                            <div key={g.id} className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                                g.completed ? "bg-emerald-50/30 border-emerald-100 text-slate-400" : "bg-slate-50 border-slate-100 text-slate-700"
                            }`}>
                                <div className="flex items-center gap-3.5">
                                    <button onClick={() => toggleGoal(g.id)} className="shrink-0 text-[#1f5961] hover:scale-105 transition-transform">
                                        {g.completed ? <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" /> : <Circle className="w-5 h-5 text-slate-400" />}
                                    </button>
                                    <div>
                                        <p className={`text-xs font-bold ${g.completed ? "line-through" : ""}`}>{g.text}</p>
                                        <span className="text-[9px] px-1.5 py-0.5 bg-slate-200/60 rounded-md font-black uppercase text-slate-500 tracking-wider inline-block mt-1">
                                            {g.category}
                                        </span>
                                    </div>
                                </div>
                                <button onClick={() => deleteGoal(g.id)} className="text-slate-400 hover:text-rose-500 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}

                        {goals.length === 0 && (
                            <div className="text-center py-12 text-xs text-slate-400 font-bold uppercase tracking-wider">
                                No learning goals defined
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
