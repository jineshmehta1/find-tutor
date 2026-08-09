"use client";

import { useState, useEffect } from "react";
import { Clock, Plus, Trash2, Loader2, Save, Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface TimeSlot {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function TeacherAvailabilityPage() {
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form states
    const [selectedDay, setSelectedDay] = useState(1); // Monday default
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("17:00");

    useEffect(() => {
        fetchAvailability();
    }, []);

    const fetchAvailability = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/teacher/availability");
            if (res.ok) {
                const data = await res.json();
                setSlots(data);
            }
        } catch {
            toast.error("Failed to load availability settings");
        } finally {
            setLoading(false);
        }
    };

    const handleAddSlot = () => {
        const start = parseInt(startTime.replace(":", ""));
        const end = parseInt(endTime.replace(":", ""));
        if (start >= end) {
            toast.error("Start time must be before end time");
            return;
        }

        // Check duplicate
        const isDuplicate = slots.some(
            s => s.dayOfWeek === selectedDay && s.startTime === startTime && s.endTime === endTime
        );

        if (isDuplicate) {
            toast.error("This time slot already exists!");
            return;
        }

        setSlots([...slots, { dayOfWeek: selectedDay, startTime, endTime }]);
    };

    const handleRemoveSlot = (index: number) => {
        setSlots(slots.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/teacher/availability", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slots })
            });
            if (res.ok) {
                toast.success("Availability settings saved!");
                fetchAvailability();
            } else {
                throw new Error();
            }
        } catch {
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8 pb-12 font-sans">
            {/* Header */}
            <div className="bg-[#1f5961] p-6 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-amber-300 text-xs font-bold rounded-full border border-white/15">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Availability Configuration</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Active Hours Manager</h1>
                        <p className="text-xs sm:text-sm text-teal-100 font-medium max-w-xl">
                            Configure the days and times you are available to teach, so students can plan accordingly.
                        </p>
                    </div>
                    <button onClick={handleSave} disabled={saving}
                        className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black uppercase tracking-wider rounded-2xl transition-all shadow-md shrink-0 flex items-center gap-2 self-start sm:self-auto">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Schedule
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Form to Add Slot */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4 self-start">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Add Availability Slot</h3>
                    
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Day</label>
                            <select value={selectedDay} onChange={e => setSelectedDay(parseInt(e.target.value))}
                                className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50 appearance-none cursor-pointer">
                                {DAYS.map((day, idx) => <option key={idx} value={idx}>{day}</option>)}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">From</label>
                                <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)}
                                    className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">To</label>
                                <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)}
                                    className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#1f5961] bg-slate-50/50" />
                            </div>
                        </div>

                        <button onClick={handleAddSlot}
                            className="w-full py-3.5 bg-[#1f5961] hover:bg-[#163e44] text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md">
                            <Plus className="w-4 h-4" /> Add Slot
                        </button>
                    </div>
                </div>

                {/* Slots List */}
                <div className="lg:col-span-3 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Your Weekly Schedule</h3>
                        <button onClick={fetchAvailability} className="text-slate-400 hover:text-slate-900 transition-colors">
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 text-[#1f5961] animate-spin" />
                        </div>
                    ) : slots.length === 0 ? (
                        <div className="text-center py-12 text-xs text-slate-400 font-bold uppercase tracking-wider">
                            No availability hours configured. Add slots and save your schedule.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {slots.map((slot, idx) => (
                                <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#1f5961] flex items-center justify-center font-bold text-xs">
                                            {DAYS[slot.dayOfWeek].substring(0,3)}
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black text-slate-900">{DAYS[slot.dayOfWeek]}</h4>
                                            <p className="text-[10px] text-slate-500 font-bold">{slot.startTime} - {slot.endTime}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleRemoveSlot(idx)}
                                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
