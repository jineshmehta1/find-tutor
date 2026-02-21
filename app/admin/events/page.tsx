"use client";

import { useState, useEffect } from "react";
import {
    Calendar, Plus, Search, Edit, Trash2, Loader2, X, Clock, MapPin,
    Users, Trophy, Eye, Sparkles, BookOpen, Star, ChevronDown, Upload, ImageIcon
} from "lucide-react";
import { toast } from "sonner";

interface EventData {
    id: number;
    slug: string;
    title: string;
    category: string;
    date: string;
    time: string;
    endDate: string;
    location: string;
    address: string;
    participants: string;
    prize: string;
    description: string;
    longDescription: string;
    image: string;
    status: string;
    registrationFee: number;
    registrationFeeDisplay: string;
    features: string;
    organizer: string;
    contact: string;
}

const categories = [
    { value: "tournament", label: "Tournament" },
    { value: "workshop", label: "Workshop" },
    { value: "seminar", label: "Seminar" },
    { value: "exhibition", label: "Exhibition" },
    { value: "special", label: "Special Event" },
];

const emptyForm = {
    title: "",
    category: "tournament",
    date: "",
    time: "",
    endDate: "",
    location: "",
    address: "",
    participants: "",
    prize: "",
    description: "",
    longDescription: "",
    image: "",
    status: "upcoming",
    registrationFee: "",
    registrationFeeDisplay: "",
    features: "",
    organizer: "Aacharya Academy",
    contact: "+91 98646 46481",
};
const CLOUDINARY_CLOUD_NAME = "dx2o9yq2t";
const CLOUDINARY_UPLOAD_PRESET = "gallery"; // or create "events" preset

export default function AdminEventsPage() {
    const [events, setEvents] = useState<EventData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [processing, setProcessing] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploading(true);

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "events"); // 👈 keeps Cloudinary organized

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();

    setForm((prev) => ({
      ...prev,
      image: data.secure_url,
    }));

    toast.success("Image uploaded successfully!");
  } catch (error) {
    toast.error("Failed to upload image");
  } finally {
    setUploading(false);
  }
};


    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await fetch("/api/events");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setEvents(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error("Failed to load events");
        } finally {
            setLoading(false);
        }
    };



    const handleSubmit = async () => {
        if (!form.title || !form.date || !form.location) {
            toast.error("Title, date, and location are required");
            return;
        }

        setProcessing(true);
        try {
            const payload = {
                ...form,
                features: form.features.split(",").map(f => f.trim()).filter(Boolean),
                registrationFee: parseInt(form.registrationFee) || 0,
            };

            if (editingEvent) {
                const res = await fetch("/api/events", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: editingEvent.id, ...payload }),
                });
                if (!res.ok) throw new Error("Failed to update");
                toast.success("Event updated successfully!");
            } else {
                const res = await fetch("/api/events", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || "Failed to create");
                }
                toast.success("Event created successfully!");
            }

            setShowForm(false);
            setEditingEvent(null);
            setForm(emptyForm);
            await fetchEvents();
        } catch (error: any) {
            toast.error(error.message || "Failed to save event");
        } finally {
            setProcessing(false);
        }
    };

    const handleEdit = (event: EventData) => {
        let features = "";
        try { features = JSON.parse(event.features).join(", "); } catch { features = event.features; }

        setEditingEvent(event);
        setForm({
            title: event.title,
            category: event.category,
            date: event.date,
            time: event.time,
            endDate: event.endDate,
            location: event.location,
            address: event.address,
            participants: event.participants,
            prize: event.prize,
            description: event.description,
            longDescription: event.longDescription,
            image: event.image,
            status: event.status,
            registrationFee: event.registrationFee.toString(),
            registrationFeeDisplay: event.registrationFeeDisplay,
            features,
            organizer: event.organizer,
            contact: event.contact,
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        try {
            const res = await fetch(`/api/events?id=${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            toast.success("Event deleted!");
            await fetchEvents();
        } catch (error) {
            toast.error("Failed to delete event");
        }
    };

    const filteredEvents = events.filter((e) =>
        e.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            tournament: "bg-amber-100 text-amber-700",
            workshop: "bg-blue-100 text-blue-700",
            seminar: "bg-purple-100 text-purple-700",
            exhibition: "bg-green-100 text-green-700",
            special: "bg-pink-100 text-pink-700",
        };
        return colors[category] || "bg-slate-100 text-slate-700";
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            upcoming: "bg-green-100 text-green-700",
            ongoing: "bg-blue-100 text-blue-700",
            completed: "bg-slate-100 text-slate-500",
        };
        return colors[status] || "bg-slate-100 text-slate-700";
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Event Management</h1>
                    <p className="text-slate-500 mt-1">Create and manage events</p>
                </div>
                <button
                    onClick={() => { setShowForm(true); setEditingEvent(null); setForm(emptyForm); }}
                    className="px-5 py-2 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors flex items-center gap-2 shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    Add Event
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm">Total Events</p>
                            <p className="text-3xl font-bold text-slate-900">{events.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm">Upcoming</p>
                            <p className="text-3xl font-bold text-green-600">{events.filter(e => e.status === "upcoming").length}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <Clock className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm">Tournaments</p>
                            <p className="text-3xl font-bold text-amber-600">{events.filter(e => e.category === "tournament").length}</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm">Workshops</p>
                            <p className="text-3xl font-bold text-blue-600">{events.filter(e => e.category === "workshop").length}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                        placeholder="Search events by title..."
                    />
                </div>
            </div>

            {/* Events List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                </div>
            ) : filteredEvents.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                    <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No Events Found</h3>
                    <p className="text-slate-500 mb-4">Add your first event to get started.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredEvents.map((event) => (
                        <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                                        <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-bold text-slate-900 text-lg">{event.title}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                                                {event.category}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                                                {event.status}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-sm mt-1 line-clamp-1">{event.description}</p>
                                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {event.date}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {event.time}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {event.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Trophy className="w-4 h-4" />
                                                {event.prize}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 ml-4">
                                    <a
                                        href={`/events/${event.slug}`}
                                        target="_blank"
                                        className="px-3 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </a>
                                    <button
                                        onClick={() => handleEdit(event)}
                                        className="px-3 py-2 bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(event.id)}
                                        className="px-3 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Event Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10">
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingEvent ? "Edit Event" : "Add New Event"}
                            </h2>
                            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-full">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Title *</label>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                                        placeholder="Event title"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Category *</label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                                    <select
                                        value={form.status}
                                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                                    >
                                        <option value="upcoming">Upcoming</option>
                                        <option value="ongoing">Ongoing</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                            </div>

                            {/* Date & Time */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Start Date *</label>
                                    <input
                                        type="date"
                                        value={form.date}
                                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        value={form.endDate}
                                        onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Time</label>
                                    <input
                                        type="text"
                                        value={form.time}
                                        onChange={(e) => setForm({ ...form, time: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                        placeholder="09:00 AM"
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Location *</label>
                                    <input
                                        type="text"
                                        value={form.location}
                                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                        placeholder="Venue name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Address</label>
                                    <input
                                        type="text"
                                        value={form.address}
                                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                        placeholder="Full address"
                                    />
                                </div>
                            </div>

                            {/* Event Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Participants</label>
                                    <input
                                        type="text"
                                        value={form.participants}
                                        onChange={(e) => setForm({ ...form, participants: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                        placeholder="200+"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Prize</label>
                                    <input
                                        type="text"
                                        value={form.prize}
                                        onChange={(e) => setForm({ ...form, prize: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                        placeholder="₹1,00,000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Registration Fee</label>
                                    <input
                                        type="number"
                                        value={form.registrationFee}
                                        onChange={(e) => setForm({ ...form, registrationFee: e.target.value, registrationFeeDisplay: `₹${e.target.value}` })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                        placeholder="500"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Short Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                                    rows={2}
                                    placeholder="Brief event description"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Full Description</label>
                                <textarea
                                    value={form.longDescription}
                                    onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                                    rows={5}
                                    placeholder="Detailed event description with schedule, rules, etc."
                                />
                            </div>

                            {/* Features & Image */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Features (comma-separated)</label>
                                <input
                                    type="text"
                                    value={form.features}
                                    onChange={(e) => setForm({ ...form, features: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                    placeholder="FIDE Rated, Cash Prizes, Certificates"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Event Image</label>
                                    {form.image ? (
                                        <div className="relative group">
                                            <img src={form.image} alt="Event" className="w-full h-40 object-cover rounded-xl border border-slate-200" />
                                            <button
                                                type="button"
                                                onClick={() => setForm({ ...form, image: "" })}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${uploading ? "border-amber-400 bg-amber-50" : "border-slate-300 hover:border-amber-500 hover:bg-amber-50"
                                            }`}>
                                            {uploading ? (
                                                <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                                            ) : (
                                                <>
                                                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                                    <span className="text-sm font-semibold text-slate-500">Click to upload image</span>
                                                    <span className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</span>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageUpload}
                                                disabled={uploading}
                                            />
                                        </label>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Contact</label>
                                    <input
                                        type="text"
                                        value={form.contact}
                                        onChange={(e) => setForm({ ...form, contact: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                        placeholder="+91 98646 46481"
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="flex gap-3 pt-4 border-t border-slate-100">
                                <button
                                    onClick={handleSubmit}
                                    disabled={processing}
                                    className="flex-1 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : editingEvent ? (
                                        "Update Event"
                                    ) : (
                                        "Create Event"
                                    )}
                                </button>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
