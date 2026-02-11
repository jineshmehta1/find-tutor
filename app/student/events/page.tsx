"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
    Calendar, Clock, MapPin, Trophy, Loader2, Eye,
    CheckCircle, XCircle, AlertCircle, Ticket
} from "lucide-react";
import { toast } from "sonner";

interface Registration {
    id: number;
    eventId: number;
    status: string;
    amount: number;
    paymentId: string | null;
    createdAt: string;
    event: {
        id: number;
        slug: string;
        title: string;
        category: string;
        date: string;
        time: string;
        location: string;
        image: string;
        status: string;
        prize: string;
        registrationFeeDisplay: string;
    };
}

export default function StudentEventsPage() {
    const { data: session } = useSession();
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const res = await fetch("/api/events/register");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setRegistrations(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error("Failed to load registrations");
        } finally {
            setLoading(false);
        }
    };

    const filteredRegistrations = filter === "all"
        ? registrations
        : registrations.filter(r => r.status === filter);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "confirmed":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Confirmed
                    </span>
                );
            case "registered":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Registered
                    </span>
                );
            case "cancelled":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                        <XCircle className="w-3.5 h-3.5" />
                        Cancelled
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                        {status}
                    </span>
                );
        }
    };

    const getEventStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            upcoming: "bg-blue-100 text-blue-700",
            ongoing: "bg-green-100 text-green-700",
            completed: "bg-slate-100 text-slate-500",
        };
        return (
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${colors[status] || "bg-slate-100 text-slate-500"}`}>
                {status}
            </span>
        );
    };

    const stats = {
        total: registrations.length,
        confirmed: registrations.filter(r => r.status === "confirmed").length,
        registered: registrations.filter(r => r.status === "registered").length,
        upcoming: registrations.filter(r => r.event.status === "upcoming").length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">My Events</h1>
                    <p className="text-slate-500 mt-1">Track your event registrations and status</p>
                </div>
                <Link
                    href="/events"
                    className="px-5 py-2 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm"
                >
                    <Calendar className="w-5 h-5" />
                    Browse Events
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm">Total Registered</p>
                            <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Ticket className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm">Confirmed</p>
                            <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm">Pending</p>
                            <p className="text-3xl font-bold text-amber-600">{stats.registered}</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm">Upcoming Events</p>
                            <p className="text-3xl font-bold text-blue-600">{stats.upcoming}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 bg-white p-1.5 rounded-xl border border-slate-100 w-fit">
                {[
                    { value: "all", label: "All" },
                    { value: "confirmed", label: "Confirmed" },
                    { value: "registered", label: "Pending" },
                    { value: "cancelled", label: "Cancelled" },
                ].map(tab => (
                    <button
                        key={tab.value}
                        onClick={() => setFilter(tab.value)}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${filter === tab.value
                            ? "bg-blue-500 text-white shadow-sm"
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Registrations List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            ) : filteredRegistrations.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                    <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        {filter === "all" ? "No Registrations Yet" : `No ${filter} registrations`}
                    </h3>
                    <p className="text-slate-500 mb-6">
                        {filter === "all"
                            ? "Browse and register for exciting chess events."
                            : "Try a different filter."}
                    </p>
                    {filter === "all" && (
                        <Link
                            href="/events"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors"
                        >
                            <Calendar className="w-5 h-5" />
                            Browse Events
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredRegistrations.map((reg) => (
                        <div key={reg.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="flex items-stretch">
                                {/* Event Image */}
                                <div className="w-32 md:w-48 flex-shrink-0 relative">
                                    <img
                                        src={reg.event.image || "/placeholder.svg"}
                                        alt={reg.event.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10"></div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                <h3 className="font-bold text-slate-900 text-lg">{reg.event.title}</h3>
                                                {getEventStatusBadge(reg.event.status)}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getStatusBadge(reg.status)}
                                                {reg.paymentId && (
                                                    <span className="text-xs text-slate-400 font-mono">
                                                        Payment: {reg.paymentId}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <Link
                                            href={`/events/${reg.event.slug}`}
                                            className="px-3 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-blue-100 hover:text-blue-700 transition-colors flex-shrink-0"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4 text-blue-500" />
                                            {reg.event.date}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4 text-blue-500" />
                                            {reg.event.time}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4 text-blue-500" />
                                            {reg.event.location}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Trophy className="w-4 h-4 text-amber-500" />
                                            {reg.event.prize}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                                        <span className="text-xs text-slate-400">
                                            Registered on {new Date(reg.createdAt).toLocaleDateString("en-IN", {
                                                day: "numeric", month: "short", year: "numeric"
                                            })}
                                        </span>
                                        <span className="text-sm font-bold text-slate-900">
                                            Amount: {reg.event.registrationFeeDisplay}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
