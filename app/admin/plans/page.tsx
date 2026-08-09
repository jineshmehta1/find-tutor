"use client";

import { useState, useEffect } from "react";
import {
    Crown, Plus, Search, Edit, Trash2, Loader2, X, CheckCircle, XCircle,
    Clock, IndianRupee, Sparkles, Check, ArrowRight
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
                toast.success("Plan updated successfully!");
            } else {
                const res = await fetch("/api/admin/plans", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (!res.ok) throw new Error("Failed to create");
                toast.success("Plan created successfully!");
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
        <div className="space-y-8 font-sans pb-12">
            {/* Header Banner */}
            <div className="bg-[#1f5961] p-6 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-amber-300 text-xs font-bold rounded-full border border-white/15">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Pricing & Tiers</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Subscription Plan Tier Manager</h1>
                    <p className="text-xs sm:text-sm text-teal-100 font-medium max-w-xl">
                        Create, modify pricing, and configure active membership tiers for instructors looking for student leads.
                    </p>
                </div>

                <button
                    onClick={() => { setEditingPlan(null); setForm(emptyForm); setShowForm(true); }}
                    className="relative z-10 px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 shrink-0 transition-transform hover:scale-105"
                >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Create New Plan</span>
                </button>
            </div>

            {/* Plans List Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 bg-slate-200/60 rounded-3xl animate-pulse" />
                    ))}
                </div>
            ) : plans.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
                    <Crown className="w-12 h-12 text-slate-300 mx-auto" />
                    <h3 className="text-lg font-extrabold text-slate-900">No Subscription Plans Created</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">Click above to add your first instructor subscription plan tier.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan) => {
                        const features = parseFeatures(plan.features);
                        return (
                            <div
                                key={plan.id}
                                className={`bg-white rounded-3xl p-6 shadow-sm border transition-all flex flex-col justify-between ${plan.isActive ? "border-slate-200/80" : "border-rose-200 bg-rose-50/20"}`}
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${plan.isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" : "bg-rose-50 text-rose-700 border border-rose-200/60"}`}>
                                            {plan.isActive ? "Active Tier ✓" : "Deactivated"}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => handleEdit(plan)} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(plan.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-black text-slate-900">{plan.name}</h3>
                                        <p className="text-xs text-slate-500 font-medium mt-0.5">{plan.description}</p>
                                    </div>

                                    <div className="flex items-baseline gap-1 border-y border-slate-100 py-3">
                                        <span className="text-3xl font-black text-[#1f5961]">₹{plan.price}</span>
                                        <span className="text-xs text-slate-500 font-bold">/ {plan.duration} Days</span>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Configured Features:</p>
                                        {features.map((feat, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                <span className="truncate">{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => toggleActive(plan)}
                                    className={`w-full mt-6 py-2.5 rounded-xl font-bold text-xs transition-colors border ${plan.isActive ? "border-rose-200 text-rose-700 hover:bg-rose-50" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"}`}
                                >
                                    {plan.isActive ? "Deactivate Plan Tier" : "Activate Plan Tier"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create/Edit Modal Form */}
            {showForm && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-5 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-lg font-black text-slate-900">{editingPlan ? "Edit Subscription Plan Tier" : "Create Subscription Plan Tier"}</h3>
                            <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-slate-100 rounded-xl">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        <div className="space-y-4 text-xs font-bold">
                            <div>
                                <label className="block text-slate-500 uppercase mb-1">Plan Name</label>
                                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-[#1f5961]" placeholder="e.g. Premium Monthly" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-500 uppercase mb-1">Price (₹ INR)</label>
                                    <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-[#1f5961]" placeholder="999" />
                                </div>
                                <div>
                                    <label className="block text-slate-500 uppercase mb-1">Duration (Days)</label>
                                    <input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-[#1f5961]" placeholder="30" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-500 uppercase mb-1">Description Summary</label>
                                <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-[#1f5961]" placeholder="Full access to student lead contact numbers" />
                            </div>

                            <div>
                                <label className="block text-slate-500 uppercase mb-1">Features (One feature per line)</label>
                                <textarea rows={4} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-[#1f5961]" placeholder={"Unlimited Student Calls\nZero Commission\nVerified Badge"} />
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end gap-3">
                            <button onClick={() => setShowForm(false)} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold">
                                Cancel
                            </button>
                            <button onClick={handleSubmit} disabled={processing} className="px-5 py-2.5 bg-[#1f5961] hover:bg-[#1a4a51] text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2">
                                {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Plan Tier"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
