"use client";

import { useState } from "react";
import {
    Bell, Trash2, Clock, CheckCircle2,
    Info, AlertCircle, Loader2, RefreshCw
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
    { id: "1", title: "New Tuition Request Match", body: "A new student inquiry for 'Class 10 Mathematics' nearby Patamata has been matched to your profile.", sentAt: new Date(Date.now() - 1800000).toISOString(), read: false, type: "match" },
    { id: "2", title: "Subscription Active", body: "Your tutor matching subscription status is verified. You will receive active student leads.", sentAt: new Date(Date.now() - 48 * 3600000).toISOString(), read: true, type: "info" },
];

export default function TeacherNotificationsPage() {
    const [list, setList] = useState<InAppNotification[]>(INITIAL_NOTIFICATIONS);

    const markAllRead = () => {
        setList(prev => prev.map(n => ({ ...n, read: true })));
        toast.success("All notifications marked as read");
    };

    const deleteOne = (id: string) => {
        setList(prev => prev.filter(n => n.id !== id));
        toast.success("Notification cleared");
    };

    const unreadCount = list.filter(n => !n.read).length;

    return (
        <div className="space-y-8 pb-12 font-sans">
            {/* Header */}
            <div className="bg-[#1f5961] p-6 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-amber-300 text-xs font-bold rounded-full border border-white/15">
                            <Bell className="w-3.5 h-3.5" />
                            <span>Inbox</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Notifications</h1>
                        <p className="text-xs sm:text-sm text-teal-100 font-medium max-w-xl">
                            Stay updated with student match requests, reviews alerts, and subscription warnings.
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button onClick={markAllRead}
                            className="px-5 py-3 bg-white/15 hover:bg-white/25 text-white text-xs font-black uppercase tracking-wider rounded-2xl border border-white/20 transition-all shrink-0">
                            Mark all read
                        </button>
                    )}
                </div>
            </div>

            {list.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center space-y-4 shadow-sm">
                    <div className="text-5xl">🔔</div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-black text-slate-800">Inbox is empty</h3>
                        <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">No new updates or matching alerts at this time.</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    {list.map(notif => (
                        <div key={notif.id} className={`bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex gap-4 items-start ${!notif.read ? "border-l-4 border-l-[#1f5961]" : ""}`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                notif.type === "match" ? "bg-emerald-50 text-emerald-600" :
                                notif.type === "info"  ? "bg-blue-50 text-blue-600" :
                                "bg-amber-50 text-amber-600"
                            }`}>
                                <Bell className="w-4.5 h-4.5" />
                            </div>
                            <div className="flex-1 space-y-1 min-w-0">
                                <div className="flex items-center justify-between gap-4">
                                    <h3 className="text-xs font-black text-slate-900 truncate">{notif.title}</h3>
                                    <span className="text-[9px] font-bold text-slate-400 shrink-0">
                                        {new Date(notif.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-505 font-medium leading-relaxed">{notif.body}</p>
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
