"use client";

import { useState, useEffect } from "react";
import {
    Users, Search, Loader2, Calendar, Clock, MapPin, Mail, Phone,
    CheckCircle, XCircle, AlertCircle, Ticket, Filter, Eye
} from "lucide-react";
import { toast } from "sonner";

interface RegistrationData {
    id: number;
    eventId: number;
    name: string;
    email: string;
    phone: string;
    age: string | null;
    status: string;
    paymentId: string | null;
    amount: number;
    createdAt: string;
    event: {
        id: number;
        slug: string;
        title: string;
        category: string;
        date: string;
        status: string;
        registrationFeeDisplay: string;
    };
    student: {
        id: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
            address: string;
            profilePhoto: string | null;
        };
    };
}

export default function AdminRegistrationsPage() {
    const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [eventFilter, setEventFilter] = useState("all");
    const [processing, setProcessing] = useState<number | null>(null);

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const res = await fetch("/api/admin/registrations");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setRegistrations(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error("Failed to load registrations");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: number, status: string) => {
        setProcessing(id);
        try {
            const res = await fetch("/api/admin/registrations", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status }),
            });
            if (!res.ok) throw new Error("Failed to update");
            toast.success(`Registration ${status}!`);
            await fetchRegistrations();
        } catch (error) {
            toast.error("Failed to update registration");
        } finally {
            setProcessing(null);
        }
    };

    // Get unique events for filter
    const uniqueEvents = Array.from(
        new Map(registrations.map(r => [r.event.id, r.event])).values()
    );

    const filteredRegistrations = registrations.filter((r) => {
        const matchesSearch =
            r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.student.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.event.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || r.status === statusFilter;
        const matchesEvent = eventFilter === "all" || r.eventId.toString() === eventFilter;
        return matchesSearch && matchesStatus && matchesEvent;
    });

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
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">{status}</span>;
        }
    };

    const stats = {
        total: registrations.length,
        confirmed: registrations.filter(r => r.status === "confirmed").length,
        registered: registrations.filter(r => r.status === "registered").length,
        totalRevenue: registrations.filter(r => r.status !== "cancelled").reduce((sum, r) => sum + r.amount, 0),
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Event Registrations</h1>
                <p className="text-slate-500 mt-1">View all users registered for events</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm">Total Registrations</p>
                            <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Ticket className="w-6 h-6 text-amber-600" />
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
                            <p className="text-slate-500 text-sm">Total Revenue</p>
                            <p className="text-3xl font-bold text-slate-900">₹{stats.totalRevenue.toLocaleString("en-IN")}</p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <span className="text-emerald-600 font-bold text-lg">₹</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                        placeholder="Search by name, email, or event..."
                    />
                </div>
                <div className="flex flex-wrap gap-3">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                    >
                        <option value="all">All Statuses</option>
                        <option value="registered">Registered</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <select
                        value={eventFilter}
                        onChange={(e) => setEventFilter(e.target.value)}
                        className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                    >
                        <option value="all">All Events</option>
                        {uniqueEvents.map(event => (
                            <option key={event.id} value={event.id}>{event.title}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Registrations Table */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                </div>
            ) : filteredRegistrations.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                    <Ticket className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No Registrations Found</h3>
                    <p className="text-slate-500">No users have registered for events yet.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Event</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredRegistrations.map((reg) => (
                                    <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                                        {/* Student */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                    {reg.student.user.profilePhoto ? (
                                                        <img src={reg.student.user.profilePhoto} alt="" className="w-full h-full rounded-full object-cover" />
                                                    ) : (
                                                        reg.name.charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 text-sm">{reg.name}</p>
                                                    <p className="text-xs text-slate-400">{reg.student.user.address || "—"}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Event */}
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-slate-900 text-sm max-w-[200px] truncate">{reg.event.title}</p>
                                            <p className="text-xs text-slate-400">{reg.event.date} • {reg.event.category}</p>
                                        </td>

                                        {/* Contact */}
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <p className="text-sm text-slate-700 flex items-center gap-1.5">
                                                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                    {reg.email}
                                                </p>
                                                <p className="text-sm text-slate-700 flex items-center gap-1.5">
                                                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                                                    {reg.phone}
                                                </p>
                                            </div>
                                        </td>

                                        {/* Amount */}
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900">₹{reg.amount.toLocaleString("en-IN")}</p>
                                            {reg.paymentId && (
                                                <p className="text-xs text-slate-400 font-mono truncate max-w-[100px]">{reg.paymentId}</p>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            {getStatusBadge(reg.status)}
                                        </td>

                                        {/* Date */}
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-500">
                                                {new Date(reg.createdAt).toLocaleDateString("en-IN", {
                                                    day: "numeric", month: "short", year: "numeric"
                                                })}
                                            </p>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                {reg.status !== "confirmed" && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(reg.id, "confirmed")}
                                                        disabled={processing === reg.id}
                                                        className="px-2.5 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold hover:bg-green-200 transition-colors disabled:opacity-50"
                                                    >
                                                        {processing === reg.id ? "..." : "Confirm"}
                                                    </button>
                                                )}
                                                {reg.status !== "cancelled" && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(reg.id, "cancelled")}
                                                        disabled={processing === reg.id}
                                                        className="px-2.5 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors disabled:opacity-50"
                                                    >
                                                        {processing === reg.id ? "..." : "Cancel"}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
