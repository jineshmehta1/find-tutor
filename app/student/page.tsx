"use client";

import { useSession } from "next-auth/react";
import { Calendar, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function StudentDashboard() {
    const { data: session } = useSession();

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

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* My Events Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">My Events</h2>
                    </div>
                    <p className="text-slate-500 mb-6">
                        View your registered events, track registration status, and browse upcoming events.
                    </p>
                    <Link
                        href="/student/events"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                    >
                        View My Events
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Find Teachers Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                            <Users className="w-5 h-5 text-green-600" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Find Teachers</h2>
                    </div>
                    <p className="text-slate-500 mb-6">
                        Browse qualified teachers in your area filtered by subject, distance, and ratings.
                    </p>
                    <Link
                        href="/student/teachers"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                    >
                        Browse Teachers
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
