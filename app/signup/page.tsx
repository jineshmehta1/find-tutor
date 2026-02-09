"use client";

import Link from "next/link";
import { GraduationCap, User, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function SignupPage() {
    const roles = [
        {
            id: "student",
            label: "Student",
            icon: GraduationCap,
            href: "/signup/student",
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
            description: "Find qualified teachers near you",
            features: ["Browse tutors by subject", "Filter by location & distance", "Connect with teachers directly"],
        },
        {
            id: "teacher",
            label: "Teacher",
            icon: User,
            href: "/signup/teacher",
            color: "from-amber-500 to-amber-600",
            bgColor: "bg-amber-50",
            borderColor: "border-amber-200",
            description: "Grow your teaching practice",
            features: ["Showcase your expertise", "Receive student inquiries", "Manage your profile"],
        },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-amber-50 p-4">
            <div className="w-full max-w-4xl">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <Sparkles className="w-4 h-4" />
                        Join Our Community
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-3">Create Your Account</h1>
                    <p className="text-slate-500 text-lg">Choose how you want to use our platform</p>
                </div>

                {/* Role Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                    {roles.map((role, index) => {
                        const Icon = role.icon;
                        return (
                            <Link
                                key={role.id}
                                href={role.href}
                                className={`group relative ${role.bgColor} ${role.borderColor} border-2 rounded-3xl p-8 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:border-transparent overflow-hidden`}
                            >
                                {/* Background Gradient on Hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                {/* Content */}
                                <div className="relative z-10">
                                    {/* Icon */}
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>

                                    {/* Title & Description */}
                                    <h2 className="text-2xl font-bold text-slate-900 group-hover:text-white transition-colors mb-2">
                                        I&apos;m a {role.label}
                                    </h2>
                                    <p className="text-slate-600 group-hover:text-white/80 transition-colors mb-6">
                                        {role.description}
                                    </p>

                                    {/* Features */}
                                    <ul className="space-y-2 mb-6">
                                        {role.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2 text-slate-600 group-hover:text-white/90 transition-colors text-sm">
                                                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${role.color} group-hover:bg-white`} />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA */}
                                    <div className="flex items-center gap-2 text-slate-900 group-hover:text-white font-semibold">
                                        <span>Get Started</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Login Link */}
                <div className="mt-8 text-center">
                    <p className="text-slate-500">
                        Already have an account?{" "}
                        <Link href="/login" className="text-amber-600 font-semibold hover:text-amber-700 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
