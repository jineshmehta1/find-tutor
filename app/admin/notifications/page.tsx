"use client";

import { useState, useEffect } from "react";
import {
    Bell, Send, Users, GraduationCap, Megaphone,
    CheckCircle2, Clock, Loader2, Sparkles, ChevronDown
} from "lucide-react";
import { toast } from "sonner";

const AUDIENCE_OPTIONS = [
    { value: "ALL",      label: "Everyone",          icon: Users },
    { value: "TEACHER",  label: "Tutors Only",        icon: GraduationCap },
    { value: "STUDENT",  label: "Students Only",      icon: Users },
];

const CHANNEL_OPTIONS = [
    { value: "in-app",  label: "In-App Banner",  desc: "Shows on their dashboard" },
    { value: "email",   label: "Email",           desc: "Sent via Resend" },
];

interface SentNotification {
    id: string;
    title: string;
    body: string;
    audience: string;
    channel: string;
    sentAt: string;
    recipientCount: number;
}

export default function NotificationsPage() {
    const [title, setTitle]       = useState("");
    const [body, setBody]         = useState("");
    const [audience, setAudience] = useState("ALL");
    const [channel, setChannel]   = useState("in-app");
    const [sending, setSending]   = useState(false);
    const [sent, setSent]         = useState<SentNotification[]>([]);

    const charLimit = 300;

    const handleSend = async () => {
        if (!title.trim() || !body.trim()) {
            toast.error("Please fill in both the title and message.");
            return;
        }
        setSending(true);
        try {
            const res = await fetch("/api/admin/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, body, audience, channel }),
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            toast.success(`Notification sent to ${data.recipientCount} recipient(s)!`);
            setSent(prev => [{ ...data, id: Date.now().toString(), sentAt: new Date().toISOString() }, ...prev]);
            setTitle(""); setBody("");
        } catch {
            toast.error("Failed to send notification. Please try again.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-8 font-sans pb-12">
            {/* Header */}
            <div className="bg-[#ffb800] p-6 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-amber-300 text-xs font-bold rounded-full border border-white/15">
                        <Bell className="w-3.5 h-3.5" />
                        <span>Broadcast Center</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Notifications Center</h1>
                    <p className="text-xs sm:text-sm text-amber-100 font-medium max-w-xl">
                        Send targeted announcements, alerts, and platform updates to tutors and students instantly.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Compose Panel */}
                <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
                    <div>
                        <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Compose Notification</h2>
                        <p className="text-xs text-slate-400 font-medium mt-1">Target specific user groups with custom messages</p>
                    </div>

                    {/* Audience */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Audience</label>
                        <div className="grid grid-cols-3 gap-2">
                            {AUDIENCE_OPTIONS.map(opt => {
                                const Icon = opt.icon;
                                return (
                                    <button
                                        key={opt.value}
                                        onClick={() => setAudience(opt.value)}
                                        className={`flex flex-col items-center gap-2 py-3 px-2 rounded-2xl border text-xs font-bold transition-all ${
                                            audience === opt.value
                                                ? "bg-[#ffb800] text-white border-[#ffb800] shadow-md"
                                                : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300"
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="text-[10px] text-center leading-tight">{opt.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Channel */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery Channel</label>
                        <div className="grid grid-cols-2 gap-2">
                            {CHANNEL_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => setChannel(opt.value)}
                                    className={`flex flex-col items-start gap-1 py-3 px-4 rounded-2xl border text-xs font-bold transition-all text-left ${
                                        channel === opt.value
                                            ? "bg-amber-500 text-slate-950 border-amber-500 shadow-md"
                                            : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300"
                                    }`}
                                >
                                    <span className="font-black">{opt.label}</span>
                                    <span className={`text-[9px] font-medium ${channel === opt.value ? "text-slate-800" : "text-slate-400"}`}>{opt.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Notification Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="e.g. New event this weekend!"
                            maxLength={80}
                            className="w-full px-4 py-3 text-sm font-bold border border-slate-200 rounded-2xl outline-none focus:border-[#ffb800] bg-slate-50/50 placeholder:text-slate-300 placeholder:font-normal"
                        />
                        <div className="text-right text-[10px] text-slate-400 font-bold">{title.length}/80</div>
                    </div>

                    {/* Body */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Message Body</label>
                        <textarea
                            value={body}
                            onChange={e => setBody(e.target.value.slice(0, charLimit))}
                            placeholder="Write your announcement here..."
                            rows={4}
                            className="w-full px-4 py-3 text-sm font-medium border border-slate-200 rounded-2xl outline-none focus:border-[#ffb800] bg-slate-50/50 resize-none placeholder:text-slate-300"
                        />
                        <div className="text-right text-[10px] text-slate-400 font-bold">{body.length}/{charLimit}</div>
                    </div>

                    {/* Send Button */}
                    <button
                        onClick={handleSend}
                        disabled={sending || !title.trim() || !body.trim()}
                        className="w-full py-3.5 bg-[#ffb800] hover:bg-[#ffa000] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-md"
                    >
                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        {sending ? "Sending..." : "Send Notification"}
                    </button>
                </div>

                {/* Preview + Sent History */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Live Preview */}
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Preview</h3>
                        <div className="bg-slate-900 rounded-2xl p-4 space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center shrink-0">
                                    <Bell className="w-3.5 h-3.5 text-white" />
                                </div>
                                <div>
                                    <div className="text-white text-xs font-black">{title || "Your notification title"}</div>
                                    <div className="text-slate-400 text-[10px] font-medium">Aacharya Academy · Now</div>
                                </div>
                            </div>
                            <p className="text-slate-300 text-[11px] font-medium leading-relaxed pl-9">
                                {body || "Your message body will appear here..."}
                            </p>
                        </div>
                        <div className="flex gap-2 text-[10px] font-bold">
                            <span className="px-2 py-1 bg-amber-50 text-[#ffb800] rounded-lg border border-amber-100">
                                → {AUDIENCE_OPTIONS.find(o => o.value === audience)?.label}
                            </span>
                            <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-lg border border-amber-100">
                                via {CHANNEL_OPTIONS.find(o => o.value === channel)?.label}
                            </span>
                        </div>
                    </div>

                    {/* Sent History */}
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Sent</h3>
                        {sent.length === 0 ? (
                            <div className="text-center py-8 space-y-2">
                                <Megaphone className="w-8 h-8 text-slate-200 mx-auto" />
                                <p className="text-slate-400 text-xs font-bold">No notifications sent yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {sent.map(n => (
                                    <div key={n.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <span className="text-xs font-black text-slate-900 leading-tight">{n.title}</span>
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                        </div>
                                        <p className="text-[10px] text-slate-500 line-clamp-2">{n.body}</p>
                                        <div className="flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase">
                                            <Clock className="w-3 h-3" />
                                            <span>{new Date(n.sentAt).toLocaleTimeString()}</span>
                                            <span>·</span>
                                            <span>{n.recipientCount} sent</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
