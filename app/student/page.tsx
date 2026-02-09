"use client";

import { useSession } from "next-auth/react";
import { BookOpen, Users, Bell, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function StudentDashboard() {
    const { data: session } = useSession();

    const stats = [
        { label: "Subjects", value: "5", icon: BookOpen, color: "from-blue-500 to-blue-600" },
        { label: "Teachers Contacted", value: "3", icon: Users, color: "from-green-500 to-green-600" },
        { label: "Pending Responses", value: "2", icon: Bell, color: "from-amber-500 to-amber-600" },
        { label: "Active Sessions", value: "1", icon: TrendingUp, color: "from-purple-500 to-purple-600" },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {session?.user?.name?.split(" ")[0] || "Student"}! 👋
                </h1>
                <p className="text-blue-100 text-lg">
                    Find qualified teachers in your area and start learning today.
                </p>
                <Link
                    href="/student/teachers"
                    className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
                >
                    Find Teachers
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
                            </div>
                            <p className="text-slate-500 font-medium">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Find Teachers Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Find Teachers Near You</h2>
                    <p className="text-slate-500 mb-6">
                        Browse qualified teachers in your area filtered by subject, distance, and ratings.
                    </p>
                    <Link
                        href="/student/teachers"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                    >
                        Browse Teachers
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Complete Your Profile</h2>
                    <p className="text-slate-500 mb-6">
                        Update your profile to help teachers understand your learning needs better.
                    </p>
                    <Link
                        href="/student/profile"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                    >
                        Edit Profile
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-slate-900">No recent activity</p>
                            <p className="text-sm text-slate-500">Start by exploring available teachers</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
