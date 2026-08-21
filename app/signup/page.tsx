"use client";

import Link from "next/link";
import { GraduationCap, User, ArrowRight, Sparkles, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function SignupPage() {
    const roles = [
        {
            id: "student",
            label: "Student / Parent",
            icon: GraduationCap,
            href: "/signup/student",
            color: "from-[#ffb800] to-[#ffa000]",
            bgColor: "bg-amber-500/10",
            borderColor: "border-amber-500/25",
            description: "Find qualified tutors near you",
            features: ["Browse tutors by subject", "Filter by location & distance", "Free 30-min demo session"],
        },
        {
            id: "teacher",
            label: "Teacher / Trainer",
            icon: User,
            href: "/signup/teacher",
            color: "from-amber-500 to-amber-600",
            bgColor: "bg-amber-500/10",
            borderColor: "border-amber-500/25",
            description: "Grow your teaching practice",
            features: ["Showcase your expertise", "Receive local student leads", "Manage your profile & reviews"],
        },
    ];

    return (
        <div className="min-h-screen flex flex-col justify-between bg-[#0a1829] text-white p-4 sm:p-6 relative overflow-hidden font-sans">
            {/* Background glowing effects */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-white/5 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-400/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Top Header */}
            <div className="max-w-6xl w-full mx-auto flex items-center justify-between py-2 relative z-10">
                <Link href="/" className="flex items-center gap-3">
                    <div className="bg-white p-1.5 rounded-xl shadow-md">
                        <img src="/image.png" alt="Aacharya Academy" className="h-7 w-auto object-contain" />
                    </div>
                    <div>
                        <span className="font-black text-lg tracking-tight text-white block leading-none">AACHARYA</span>
                        <span className="text-[9px] font-extrabold text-amber-200 uppercase tracking-widest mt-0.5 block">Bhavanipuram, Vijayawada</span>
                    </div>
                </Link>

                <Link href="/" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold transition-all text-white">
                    <ChevronLeft className="w-4 h-4 text-amber-300" />
                    <span>Back to Home</span>
                </Link>
            </div>

            {/* Role Cards Area */}
            <div className="flex-grow flex flex-col justify-center items-center relative z-10 py-10 max-w-4xl mx-auto w-full">
                
                {/* Header */}
                <div className="text-center mb-10 space-y-3">
                    <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                        <span>Join Our Community</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">Create Your Account</h1>
                    <p className="text-slate-300 text-xs md:text-sm font-semibold">Select how you want to register on Aacharya Platform</p>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 gap-6 w-full">
                    {roles.map((role) => {
                        const Icon = role.icon;
                        return (
                            <Link
                                key={role.id}
                                href={role.href}
                                className={`group relative bg-white/5 border border-white/15 rounded-[2.5rem] p-8 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:border-transparent overflow-hidden flex flex-col justify-between`}
                            >
                                {/* Background Gradient on Hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />

                                {/* Content */}
                                <div>
                                    {/* Icon */}
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 border border-white/10`}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>

                                    {/* Title & Description */}
                                    <h2 className="text-2xl font-black text-white group-hover:text-white transition-colors mb-2 leading-none">
                                        I&apos;m a {role.label}
                                    </h2>
                                    <p className="text-slate-300 group-hover:text-white/80 transition-colors text-xs font-semibold mb-6 leading-relaxed">
                                        {role.description}
                                    </p>

                                    {/* Features */}
                                    <ul className="space-y-2 mb-8">
                                        {role.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2.5 text-slate-300 group-hover:text-white/90 transition-colors text-xs font-semibold">
                                                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${role.color} group-hover:bg-white border border-white/10`} />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* CTA */}
                                <div className="flex items-center gap-2 text-white font-extrabold text-xs uppercase tracking-wider">
                                    <span>Get Started</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Switch link */}
                <div className="mt-10 text-center">
                    <p className="text-slate-400 text-xs font-semibold">
                        Already have an account?{" "}
                        <Link href="/login" className="text-amber-400 font-extrabold hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center py-3 text-amber-100/70 text-[11px] font-medium relative z-10 border-t border-white/10 max-w-6xl w-full mx-auto">
                © {new Date().getFullYear()} Aacharya Academy Bhavanipuram. All Rights Reserved.
            </div>
        </div>
    );
}
