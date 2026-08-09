"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, User, GraduationCap, ShieldCheck, Sparkles, ChevronLeft, ArrowRight, Eye, EyeOff } from "lucide-react";

type UserRole = "STUDENT" | "TEACHER" | "ADMIN";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        role: selectedRole,
      });

      if (res?.error) {
        setError("Invalid email address or password. Please try again.");
      } else {
        const session = await getSession();
        const actualRole = session?.user?.role || selectedRole;
        const targetUrl = getCallbackUrl(actualRole as UserRole);
        window.location.href = targetUrl;
      }
    } catch (err) {
      setError("Something went wrong. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      id: "STUDENT" as UserRole,
      label: "Student / Parent",
      icon: GraduationCap,
      description: "Find Home Tutors"
    },
    {
      id: "TEACHER" as UserRole,
      label: "Teacher",
      icon: User,
      description: "Student Leads"
    },
    {
      id: "ADMIN" as UserRole,
      label: "Admin",
      icon: ShieldCheck,
      description: "Portal Control"
    },
  ];

  return (
    <div className="min-h-screen bg-[#19484e] flex flex-col justify-between p-4 sm:p-6 text-white font-sans relative overflow-hidden">
      {/* Background Lighting Elements */}
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
            <span className="text-[9px] font-extrabold text-teal-200 uppercase tracking-widest mt-0.5 block">Bhavanipuram, Vijayawada</span>
          </div>
        </Link>

        <Link href="/" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold transition-all text-white">
          <ChevronLeft className="w-4 h-4 text-amber-300" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="flex-1 flex items-center justify-center relative z-10 py-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 text-slate-900 shadow-2xl w-full max-w-md space-y-6 border border-slate-100">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-teal-50 border-2 border-teal-200/80 rounded-2xl flex items-center justify-center mx-auto text-[#1f5961] shadow-sm">
              <Lock className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Welcome Back</h1>
            <p className="text-slate-500 text-xs font-medium">Sign in to your Aacharya Academy account</p>
          </div>

          {/* Role selector */}
          <div className="space-y-2">
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider">I am logging in as</label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-3 rounded-2xl border transition-all duration-200 flex flex-col items-center justify-center gap-1 ${isSelected
                      ? "border-[#1f5961] bg-teal-50 text-[#1f5961] ring-2 ring-[#1f5961]/20 font-black shadow-sm"
                      : "border-slate-200/80 bg-slate-50/50 text-slate-600 hover:bg-slate-100 font-bold"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? "text-[#1f5961]" : "text-slate-400"}`} />
                    <span className="text-[10px] uppercase tracking-wider text-center leading-none">{role.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-rose-50 text-rose-700 text-xs p-3.5 rounded-2xl border border-rose-200/80 font-bold text-center">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-[#1f5961] outline-none text-xs font-bold text-slate-900 placeholder:text-slate-400 bg-slate-50/50"
                  placeholder="name@aacharya.net"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl focus:border-[#1f5961] outline-none text-xs font-bold text-slate-900 placeholder:text-slate-400 bg-slate-50/50"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1f5961] hover:bg-[#1a4a51] text-white font-black py-3.5 rounded-xl transition-all shadow-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              {loading ? (
                "Signing In..."
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch link */}
          <div className="text-center border-t border-slate-100 pt-4">
            <p className="text-slate-500 text-xs font-medium">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-[#1f5961] font-black hover:underline">
                Create an Account
              </Link>
            </p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-3 text-teal-100/70 text-[11px] font-medium relative z-10 border-t border-white/10 max-w-6xl w-full mx-auto">
        © {new Date().getFullYear()} Aacharya Academy Bhavanipuram. All Rights Reserved.
      </div>
    </div>
  );
}