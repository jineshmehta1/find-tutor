"use client";

import React, { useState, useEffect } from "react";
import {
    Bell, Clock, CheckCircle2, AlertCircle, Info,
    X, Loader2, Sparkles, MessageSquare, Trash2
} from "lucide-react";
import { toast } from "sonner";

interface InAppNotification {
    id: string;
    title: string;
    body: string;
    sentAt: string;
    read: boolean;
    type: "match" | "info" | "alert";
}

const INITIAL_NOTIFICATIONS: InAppNotification[] = [
    { id: "1", title: "New Tutor Matched", body: "We found a verified Physics tutor matching your weekend schedule. Go to tutor requests board to view details.", sentAt: new Date(Date.now() - 3600000).toISOString(), read: false, type: "match" },
    { id: "2", title: "Welcome to Aacharya Academy", body: "Complete your profile information and choose your study topics to get better matching results.", sentAt: new Date(Date.now() - 86400000).toISOString(), read: true, type: "info" },
];

export default function StudentNotificationsPage() {
    const [list, setList] = useState<InAppNotification[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem("student_notifications");
        if (saved) {
            try {
                const arr = JSON.parse(saved);
                if (Array.isArray(arr)) setList(arr);
            } catch {}
        } else {
            setList(INITIAL_NOTIFICATIONS);
            localStorage.setItem("student_notifications", JSON.stringify(INITIAL_NOTIFICATIONS));
        }
    }, []);

    const markAllRead = () => {
        const updated = list.map(n => ({ ...n, read: true }));
        setList(updated);
        localStorage.setItem("student_notifications", JSON.stringify(updated));
        toast.success("All notifications marked as read");
        // Trigger event to notify header layout
        window.dispatchEvent(new Event("storage"));
    };

    const deleteOne = (id: string) => {
        const updated = list.filter(n => n.id !== id);
        setList(updated);
        localStorage.setItem("student_notifications", JSON.stringify(updated));
        toast.success("Notification cleared");
        // Trigger event to notify header layout
        window.dispatchEvent(new Event("storage"));
    };

    const unreadCount = list.filter(n => !n.read).length;

    return (
        <div className="space-y-8 pb-12 p-6 sm:p-8 bg-slate-50 min-h-[calc(100vh-70px)] font-sans">
            {/* Header banner */}
            <div className="bg-[#ffb800] p-6 sm:p-10 rounded-3xl text-slate-950 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950/10 text-slate-900 text-xs font-bold rounded-full border border-slate-950/10">
                            <Bell className="w-3.5 h-3.5 animate-pulse" />
                            <span>Inbox</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Notifications</h1>
                        <p className="text-xs sm:text-sm text-slate-900/85 font-medium max-w-xl">
                            Stay up-to-date with tutor matches, event registrations, and announcements.
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button onClick={markAllRead}
                            className="px-5 py-3 bg-slate-950/10 hover:bg-slate-950/20 text-slate-950 text-xs font-black uppercase tracking-wider rounded-2xl border border-slate-950/10 transition-all shrink-0">
                            Mark all as read
                        </button>
                    )}
                </div>
            </div>

            {list.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center space-y-4 shadow-sm">
                    <div className="text-5xl">🔔</div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-black text-slate-800">Inbox is clean</h3>
                        <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">No new updates or alerts at the moment.</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    {list.map(notif => (
                        <div key={notif.id} className={`bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex gap-4 items-start ${!notif.read ? "border-l-4 border-l-[#ffb800]" : ""}`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                notif.type === "match" ? "bg-emerald-50 text-emerald-600" :
                                notif.type === "info"  ? "bg-blue-50 text-blue-600" :
                                "bg-amber-50 text-amber-600"
                            }`}>
                                <Bell className="w-4.5 h-4.5" />
                            </div>
                            <div className="flex-1 space-y-1 min-w-0">
                                <div className="flex items-center justify-between gap-4">
                                    <h3 className={`text-xs font-black text-slate-900 truncate ${!notif.read ? "font-black" : "font-extrabold"}`}>{notif.title}</h3>
                                    <span className="text-[9px] font-bold text-slate-400 shrink-0">
                                        {new Date(notif.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">{notif.body}</p>
                            </div>
                            <button onClick={() => deleteOne(notif.id)}
                                className="p-1.5 text-slate-350 hover:text-rose-500 transition-colors shrink-0">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
