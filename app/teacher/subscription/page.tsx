"use client";

import { useState, useEffect } from "react";
import {
    Crown, CheckCircle, Clock, Shield, Zap, Loader2, AlertCircle, Users, FileText, Star, Sparkles, Check, ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface SubscriptionData {
    hasAccess: boolean;
    status: string;
    isApproved: boolean;
    subscriptionEnd: string | null;
    daysRemaining: number;
}

interface PlanData {
    id: number;
    name: string;
    price: number;
    duration: number;
    description: string;
    features: string;
    isActive: boolean;
}

export default function TeacherSubscriptionPage() {
    const { data: session } = useSession();
    const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
    const [plans, setPlans] = useState<PlanData[]>([]);
    const [loading, setLoading] = useState(true);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const [processing, setProcessing] = useState<number | null>(null);

    useEffect(() => {
        fetchSubscription();
        fetchPlans();
        loadRazorpay();
    }, []);

    const loadRazorpay = () => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => setRazorpayLoaded(true);
        document.body.appendChild(script);
    };

    const fetchSubscription = async () => {
        try {
            const res = await fetch("/api/teacher/subscription");
            if (res.ok) {
                const data = await res.json();
                setSubscription(data);
            }
        } catch (error) {
            toast.error("Failed to load subscription info");
        } finally {
            setLoading(false);
        }
    };

    const fetchPlans = async () => {
        try {
            const res = await fetch("/api/admin/plans?active=true");
            if (res.ok) {
                const data = await res.json();
                setPlans(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error("Failed to load plans");
        }
    };

    const parseFeatures = (features: string): string[] => {
        try {
            return JSON.parse(features);
        } catch {
            return features.split(",").map(f => f.trim()).filter(Boolean);
        }
    };

    const handleSubscribe = async (plan: PlanData) => {
        if (!razorpayLoaded) {
            toast.error("Payment gateway is loading... Please try again.");
            return;
        }

        setProcessing(plan.id);

        try {
            const orderRes = await fetch("/api/razorpay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: plan.price,
                    eventName: `Subscription: ${plan.name}`,
                    eventId: `plan_${plan.id}`,
                }),
            });

            if (!orderRes.ok) throw new Error("Failed to create order");
            const orderData = await orderRes.json();

            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Aacharya Academy",
                description: `${plan.name} - ${plan.duration} days`,
                order_id: orderData.orderId,
                handler: async function (response: any) {
                    try {
                        const activateRes = await fetch("/api/teacher/subscription/activate", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                paymentId: response.razorpay_payment_id,
                                planId: plan.id,
                            }),
                        });

                        if (!activateRes.ok) throw new Error("Failed to activate");
                        toast.success("Premium Subscription activated successfully!");
                        fetchSubscription();
                    } catch (error) {
                        toast.error("Payment received but activation failed. Contact support.");
                    }
                },
                prefill: {
                    name: session?.user?.name || "",
                    email: session?.user?.email || "",
                },
                theme: {
                    color: "#ffb800",
                },
                modal: {
                    ondismiss: () => {
                        setProcessing(null);
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            toast.error("Payment process failed. Please try again.");
        } finally {
            setProcessing(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-[#ffb800] animate-spin" />
            </div>
        );
    }

    const status = subscription?.status || "none";
    const hasAccess = subscription?.hasAccess || false;

    return (
        <div className="space-y-8 font-sans pb-12 max-w-5xl mx-auto">
            {/* Header Banner */}
            <div className="bg-[#ffb800] p-6 sm:p-8 rounded-3xl text-slate-950 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950/10 text-slate-900 text-xs font-black rounded-full border border-slate-950/10">
                        <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                        <span>Tutor Membership</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Subscription Plans</h1>
                    <p className="text-xs sm:text-sm text-slate-800 font-medium max-w-xl">
                        Unlock unlimited student leads, zero commission cuts, and verified instructor badge in Bhavanipuram & Vijayawada.
                    </p>
                </div>
            </div>

            {/* Current Status Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                        <h2 className="text-base font-black text-slate-900">Current Membership Status</h2>
                        <p className="text-xs text-slate-500 font-medium">Your active tier and access privileges</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${hasAccess ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" : "bg-rose-50 text-rose-700 border border-rose-200/60"}`}>
                        {hasAccess ? (status === "trial" ? "Free Trial" : "Verified Premium") : "Access Restricted"}
                    </span>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${hasAccess ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                        <Crown className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-900">
                            {status === "trial" ? "30-Day Free Instructor Trial" :
                                status === "active" ? "Aacharya Premium Tutor Membership" :
                                    status === "expired" ? "Subscription Expired" : "Awaiting Verification"}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {hasAccess
                                ? `${subscription?.daysRemaining} days remaining • Active until ${subscription?.subscriptionEnd ? new Date(subscription.subscriptionEnd).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}`
                                : "Upgrade to a plan below to view student phone numbers & direct inquiries."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Plans List */}
            {plans.length > 0 && (
                <div className="space-y-6">
                    <div>
                        <h2 className="text-lg font-black text-slate-900">Available Instructor Membership Plans</h2>
                        <p className="text-xs text-slate-500 font-medium">Select a plan to activate instant student leads access</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {plans.map((plan, index) => {
                            const isPopular = index === 1;
                            const features = parseFeatures(plan.features);

                            return (
                                <div
                                    key={plan.id}
                                    className={`bg-white rounded-3xl p-6 shadow-sm border transition-all relative flex flex-col justify-between ${isPopular ? "border-[#ffb800] ring-2 ring-[#ffb800]/20 shadow-md" : "border-slate-200/80"}`}
                                >
                                    {isPopular && (
                                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-full shadow-md">
                                            Most Popular Choice
                                        </span>
                                    )}

                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-base font-black text-slate-900">{plan.name}</h3>
                                            <p className="text-xs text-slate-500 font-medium mt-0.5">{plan.description}</p>
                                        </div>

                                        <div className="flex items-baseline gap-1 border-y border-slate-100 py-3">
                                            <span className="text-3xl font-black text-[#ffb800]">₹{plan.price}</span>
                                            <span className="text-xs text-slate-500 font-bold">/ {plan.duration} Days</span>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">Included Features:</p>
                                            {features.map((feat, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                                    <span>{feat}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleSubscribe(plan)}
                                        disabled={processing === plan.id}
                                        className={`w-full mt-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md ${isPopular ? "bg-amber-500 hover:bg-amber-600 text-slate-950" : "bg-[#ffb800] hover:bg-[#ffa000] text-white"}`}
                                    >
                                        {processing === plan.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                <span>Activate {plan.name}</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
