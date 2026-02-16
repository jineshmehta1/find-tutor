"use client";

import { useState, useEffect } from "react";
import {
    Crown, CheckCircle, Clock, Shield, Zap, Loader2, AlertCircle, Users, FileText, Star
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
            // 1. Create Razorpay order
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

            // 2. Open Razorpay checkout
            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Aacharya Academy",
                description: `${plan.name} - ${plan.duration} days`,
                order_id: orderData.orderId,
                handler: async function (response: any) {
                    // 3. Verify payment and activate subscription
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
                        const result = await activateRes.json();
                        toast.success("Subscription activated successfully!");
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
                    color: "#f59e0b",
                },
                modal: {
                    ondismiss: () => {
                        setProcessing(null);
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            toast.error("Failed to initiate payment");
        } finally {
            setProcessing(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
        );
    }

    const status = subscription?.status || "none";
    const hasAccess = subscription?.hasAccess || false;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Subscription</h1>
                <p className="text-slate-500 mt-1">Manage your teacher subscription plan</p>
            </div>

            {/* Current Status */}
            <div className={`rounded-2xl p-6 border ${hasAccess
                ? status === "trial"
                    ? "bg-blue-50 border-blue-200"
                    : "bg-green-50 border-green-200"
                : status === "expired"
                    ? "bg-red-50 border-red-200"
                    : "bg-slate-50 border-slate-200"
                }`}>
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${hasAccess
                        ? status === "trial"
                            ? "bg-blue-100"
                            : "bg-green-100"
                        : "bg-red-100"
                        }`}>
                        {hasAccess ? (
                            status === "trial"
                                ? <Clock className="w-7 h-7 text-blue-600" />
                                : <CheckCircle className="w-7 h-7 text-green-600" />
                        ) : (
                            <AlertCircle className="w-7 h-7 text-red-600" />
                        )}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900">
                            {status === "trial" ? "Free Trial" :
                                status === "active" ? "Premium Plan" :
                                    status === "expired" ? "Subscription Expired" :
                                        "No Subscription"}
                        </h3>
                        <p className="text-slate-500">
                            {hasAccess
                                ? `${subscription?.daysRemaining} days remaining • Expires ${subscription?.subscriptionEnd
                                    ? new Date(subscription.subscriptionEnd).toLocaleDateString("en-IN", {
                                        day: "numeric", month: "long", year: "numeric"
                                    })
                                    : "—"
                                }`
                                : status === "expired"
                                    ? "Your access has expired. Subscribe to a plan below to continue."
                                    : "Awaiting admin approval to start your free trial."
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Subscription Plans */}
            {plans.length > 0 ? (
                <>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-1">Choose a Plan</h2>
                        <p className="text-slate-500 text-sm">Select a subscription plan to continue accessing all features</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {plans.map((plan, index) => {
                            const isPopular = index === Math.floor(plans.length / 2);
                            return (
                                <div
                                    key={plan.id}
                                    className={`relative bg-white rounded-2xl shadow-sm border overflow-hidden transition-shadow hover:shadow-lg ${isPopular ? "border-amber-300 ring-2 ring-amber-200" : "border-slate-100"
                                        }`}
                                >
                                    {isPopular && (
                                        <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                                            POPULAR
                                        </div>
                                    )}

                                    <div className={`p-6 ${isPopular ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white" : "bg-slate-50"}`}>
                                        <h3 className={`text-lg font-bold ${isPopular ? "text-white" : "text-slate-900"}`}>{plan.name}</h3>
                                        <div className="flex items-baseline gap-1 mt-2">
                                            <span className={`text-4xl font-bold ${isPopular ? "text-white" : "text-slate-900"}`}>
                                                ₹{plan.price.toLocaleString("en-IN")}
                                            </span>
                                            <span className={isPopular ? "text-white/80" : "text-slate-500"}>
                                                / {plan.duration} days
                                            </span>
                                        </div>
                                        <p className={`text-sm mt-2 ${isPopular ? "text-white/80" : "text-slate-500"}`}>{plan.description}</p>
                                    </div>

                                    <div className="p-6">
                                        <div className="space-y-3 mb-6">
                                            {parseFeatures(plan.features).map((feature, idx) => (
                                                <div key={idx} className="flex items-center gap-2.5">
                                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                    <span className="text-slate-700 text-sm">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => handleSubscribe(plan)}
                                            disabled={processing === plan.id || (status === "active" && hasAccess)}
                                            className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${status === "active" && hasAccess
                                                ? "bg-green-100 text-green-700 cursor-default"
                                                : isPopular
                                                    ? "bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/25"
                                                    : "bg-slate-900 text-white hover:bg-slate-800"
                                                }`}
                                        >
                                            {processing === plan.id ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : status === "active" && hasAccess ? (
                                                <>
                                                    <CheckCircle className="w-5 h-5" />
                                                    Currently Active
                                                </>
                                            ) : (
                                                <>
                                                    <Crown className="w-5 h-5" />
                                                    Subscribe Now
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                    <Crown className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No Plans Available</h3>
                    <p className="text-slate-500">Subscription plans will be available soon. Please check back later.</p>
                </div>
            )}

            {/* Secured Payment Note */}
            <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                <Shield className="w-4 h-4" />
                <span>Secured by Razorpay • 100% safe & encrypted</span>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-1">What happens after my free trial?</h4>
                        <p className="text-slate-500 text-sm">After your 30-day free trial, you&apos;ll need to subscribe to a plan to continue accessing the dashboard and managing student leads.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-1">What&apos;s included in the free trial?</h4>
                        <p className="text-slate-500 text-sm">The free trial gives you full access to all features for 30 days, starting from the day your account is approved.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-1">Can I extend my subscription?</h4>
                        <p className="text-slate-500 text-sm">Yes! If you subscribe while your current plan is active, the new duration will be added to your remaining days.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
