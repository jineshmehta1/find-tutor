"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, User, GraduationCap, ShieldCheck } from "lucide-react";

type UserRole = "STUDENT" | "TEACHER" | "ADMIN";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("STUDENT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getCallbackUrl = (role: UserRole) => {
    if (callbackUrl) return callbackUrl;
    switch (role) {
      case "ADMIN": return "/admin";
      case "TEACHER": return "/teacher";
      case "STUDENT": return "/student";
      default: return "/";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push(getCallbackUrl(selectedRole));
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      id: "STUDENT" as UserRole,
      label: "Student",
      icon: GraduationCap,
      color: "from-blue-500 to-blue-600",
      description: "Find tutors near you"
    },
    {
      id: "TEACHER" as UserRole,
      label: "Teacher",
      icon: User,
      color: "from-amber-500 to-amber-600",
      description: "Manage your students"
    },
    {
      id: "ADMIN" as UserRole,
      label: "Admin",
      icon: ShieldCheck,
      color: "from-slate-700 to-slate-800",
      description: "Platform management"
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-amber-50 p-4">
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-200/50">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30 transform rotate-3">
            <Lock className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 text-sm mt-2">Sign in to your account</p>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-3">Login as</label>
          <div className="grid grid-cols-3 gap-2">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`relative p-3 rounded-xl border-2 transition-all duration-300 ${isSelected
                      ? `border-transparent bg-gradient-to-br ${role.color} text-white shadow-lg scale-105`
                      : "border-slate-200 hover:border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  <Icon className={`w-5 h-5 mx-auto mb-1 ${isSelected ? "text-white" : "text-slate-400"}`} />
                  <span className="text-xs font-medium block">{role.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl text-center border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-slate-50/50 transition-all"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-slate-50/50 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold py-3 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 transform hover:-translate-y-0.5"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Signup Link */}
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-amber-600 font-semibold hover:text-amber-700 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}