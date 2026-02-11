"use client";

import { useState, useEffect } from "react";
import {
    Crown, Plus, Search, Edit, Trash2, Loader2, X, CheckCircle, XCircle,
    Clock, IndianRupee
} from "lucide-react";
import { toast } from "sonner";

interface PlanData {
    id: number;
    name: string;
    price: number;
    duration: number;
    description: string;
    features: string;
    isActive: boolean;
    createdAt: string;
}

const emptyForm = {
    name: "",
    price: "",
    duration: "30",
    description: "",
    features: "",
    isActive: true,
};

export default function AdminPlansPage() {
    const [plans, setPlans] = useState<PlanData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingPlan, setEditingPlan] = useState<PlanData | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await fetch("/api/admin/plans");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setPlans(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error("Failed to load plans");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!form.name || !form.price || !form.duration || !form.description) {
            toast.error("All fields are required");
            return;
        }

        setProcessing(true);
        try {
            const payload = {
                ...form,
                features: form.features.split("\n").map(f => f.trim()).filter(Boolean),
            };

            if (editingPlan) {
                const res = await fetch("/api/admin/plans", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: editingPlan.id, ...payload }),
                });
                if (!res.ok) throw new Error("Failed to update");
                toast.success("Plan updated!");
            } else {
                const res = await fetch("/api/admin/plans", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (!res.ok) throw new Error("Failed to create");
                toast.success("Plan created!");
            }

            setShowForm(false);
            setEditingPlan(null);
            setForm(emptyForm);
            await fetchPlans();
        } catch (error) {
            toast.error("Failed to save plan");
        } finally {
            setProcessing(false);
        }
    };

    const handleEdit = (plan: PlanData) => {
        let features = "";
        try {
            features = JSON.parse(plan.features).join("\n");
        } catch {
            features = plan.features;
        }

        setEditingPlan(plan);
        setForm({
            name: plan.name,
            price: plan.price.toString(),
            duration: plan.duration.toString(),
            description: plan.description,
            features,
            isActive: plan.isActive,
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this plan?")) return;
        try {
            const res = await fetch(`/api/admin/plans?id=${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            toast.success("Plan deleted!");
            await fetchPlans();
        } catch (error) {
            toast.error("Failed to delete plan");
        }
    };

    const toggleActive = async (plan: PlanData) => {
        try {
            const res = await fetch("/api/admin/plans", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: plan.id, isActive: !plan.isActive }),
            });
            if (!res.ok) throw new Error("Failed to update");
            toast.success(plan.isActive ? "Plan deactivated" : "Plan activated");
            await fetchPlans();
        } catch (error) {
            toast.error("Failed to update plan");
        }
    };

    const parseFeatures = (features: string): string[] => {
        try {
            return JSON.parse(features);
        } catch {
            return features.split(",").map(f => f.trim()).filter(Boolean);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Subscription Plans</h1>
                    <p className="text-slate-500 mt-1">Manage teacher subscription plans</p>
                </div>
                <button
                    onClick={() => {
                        setEditingPlan(null);
                        setForm(emptyForm);
                        setShowForm(true);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/25"
                >
                    <Plus className="w-5 h-5" />
                    Add Plan
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingPlan ? "Edit Plan" : "Create New Plan"}
                            </h2>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Plan Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                    placeholder="e.g. Monthly Premium"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Price (₹)</label>
                                    <input
                                        type="number"
                                        value={form.price}
                                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                        placeholder="999"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Duration (Days)</label>
                                    <input
                                        type="number"
                                        value={form.duration}
                                        onChange={(e) => setForm({ ...form, duration: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                        placeholder="30"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                                <input
                                    type="text"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                    placeholder="Full access for one month"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Features (one per line)</label>
                                <textarea
                                    value={form.features}
                                    onChange={(e) => setForm({ ...form, features: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                                    placeholder="Browse student leads&#10;View contact details&#10;Priority listing"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={form.isActive}
                                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                                    className="w-4 h-4 text-amber-500 rounded"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-slate-700">Active (visible to teachers)</label>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={handleSubmit}
                                    disabled={processing}
                                    className="flex-1 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                                    {editingPlan ? "Update Plan" : "Create Plan"}
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

            {/* Plans List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                </div>
            ) : plans.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                    <Crown className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No Plans Yet</h3>
                    <p className="text-slate-500">Create your first subscription plan for teachers.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <div key={plan.id} className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${plan.isActive ? "border-slate-100" : "border-red-200 opacity-75"}`}>
                            <div className={`p-5 ${plan.isActive ? "bg-gradient-to-r from-amber-500 to-amber-600" : "bg-slate-400"} text-white`}>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold">{plan.name}</h3>
                                    {!plan.isActive && (
                                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Inactive</span>
                                    )}
                                </div>
                                <div className="flex items-baseline gap-1 mt-2">
                                    <span className="text-3xl font-bold">₹{plan.price.toLocaleString("en-IN")}</span>
                                    <span className="text-white/80">/ {plan.duration} days</span>
                                </div>
                            </div>

                            <div className="p-5">
                                <p className="text-slate-500 text-sm mb-4">{plan.description}</p>

                                <div className="space-y-2 mb-5">
                                    {parseFeatures(plan.features).map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm">
                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                            <span className="text-slate-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(plan)}
                                        className="flex-1 py-2 px-3 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => toggleActive(plan)}
                                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 ${plan.isActive
                                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                                : "bg-green-100 text-green-700 hover:bg-green-200"
                                            }`}
                                    >
                                        {plan.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                        {plan.isActive ? "Deactivate" : "Activate"}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(plan.id)}
                                        className="py-2 px-3 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
