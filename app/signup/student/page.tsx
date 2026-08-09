"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import {
    User, ArrowLeft, ArrowRight, Mail, Phone, Calendar, MapPin,
    BookOpen, GraduationCap, Loader2, CheckCircle2, Upload, Camera, X, Star, ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import MapLocationPicker from "@/components/ui/DynamicMapPicker";

const CLOUDINARY_CLOUD_NAME = "dx2o9yq2t";
const CLOUDINARY_UPLOAD_PRESET = "gallery";

const SUBJECTS = [
    "Mathematics", "Physics", "Chemistry", "Biology", "English",
    "Hindi", "History", "Geography", "Computer Science", "Economics",
    "Accountancy", "Business Studies", "Political Science", "Psychology",
    "Sociology", "Sanskrit", "French", "German", "Music", "Art"
];

const STEPS = [
    { id: 1, title: "Account & Contact", desc: "Basic details & login info" },
    { id: 2, title: "Personal & Address", desc: "Location & profile photo" },
    { id: 3, title: "Subjects & Preferences", desc: "Select subjects to learn" },
];

export default function StudentSignupPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const profileInputRef = useRef<HTMLInputElement>(null);

    // Form data
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        dob: "",
        address: "",
        profilePhoto: "",
        subjects: [] as string[],
        otp: "",
    });

    const [isGoogleVerified, setIsGoogleVerified] = useState(false);
    const [isUploadingProfile, setIsUploadingProfile] = useState(false);

    // Persist form data to session storage during Google redirect
    useEffect(() => {
        const savedData = sessionStorage.getItem("signup_form_data");
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setFormData(prev => ({ ...prev, ...parsed }));
            sessionStorage.removeItem("signup_form_data");
        }
    }, []);

    // Handle Google Verification redirect return
    useEffect(() => {
        if (session?.user?.email) {
            setFormData(prev => ({ ...prev, email: session.user?.email || prev.email, name: prev.name || session.user?.name || "" }));
            setIsGoogleVerified(true);
        }
    }, [session]);

    const [errors, setErrors] = useState<Record<string, string>>({});

    const updateField = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    // Handle profile photo upload
    const handleProfilePhotoUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        if (file.size > 4 * 1024 * 1024) {
            toast.error("Image must be less than 4MB");
            return;
        }

        setIsUploadingProfile(true);

        try {
            const formDataUpload = new FormData();
            formDataUpload.append("file", file);
            formDataUpload.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
            formDataUpload.append("folder", "profiles");

            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formDataUpload,
                }
            );

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();

            setFormData((prev) => ({
                ...prev,
                profilePhoto: data.secure_url,
            }));

            toast.success("Profile photo uploaded!");
        } catch (error) {
            toast.error("Upload failed. Please try again.");
        } finally {
            setIsUploadingProfile(false);
        }
    };

    const toggleSubject = (subject: string) => {
        setFormData((prev) => ({
            ...prev,
            subjects: prev.subjects.includes(subject)
                ? prev.subjects.filter((s) => s !== subject)
                : [...prev.subjects, subject],
        }));
    };

    const validateStep = (stepNum: number): boolean => {
        const newErrors: Record<string, string> = {};

        if (stepNum === 1) {
            if (!formData.name.trim()) newErrors.name = "Name is required";
            if (!formData.email.trim()) newErrors.email = "Email is required";
            else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
            if (!formData.phone.trim()) newErrors.phone = "Phone is required";
            if (!formData.password) newErrors.password = "Password is required";
            else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        }

        if (stepNum === 2) {
            if (!formData.dob) newErrors.dob = "Date of birth is required";
            if (!formData.address.trim()) newErrors.address = "Address is required";
        }

        if (stepNum === 3) {
            if (formData.subjects.length === 0) newErrors.subjects = "Select at least one subject";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep((prev) => Math.min(prev + 1, 3));
        } else {
            const firstError = Object.values(errors)[0] || "Please fill in all required fields";
            toast.error(firstError);
        }
    };

    const prevStep = () => {
        setStep((prev) => Math.max(prev - 1, 1));
    };

    const verifyWithGoogle = async () => {
        sessionStorage.setItem("signup_form_data", JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            dob: formData.dob,
            address: formData.address,
            subjects: formData.subjects,
        }));
        
        signIn("google", { callbackUrl: window.location.href });
    };

    const handleSubmit = async () => {
        if (!validateStep(3)) return;

        setLoading(true);
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    role: "STUDENT",
                    isGoogleVerified,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Registration failed");
                return;
            }

            setSuccess(true);
            toast.success("Registration successful!");

            setTimeout(async () => {
                await signIn("credentials", {
                    email: formData.email,
                    password: formData.password,
                    callbackUrl: "/student",
                });
            }, 1500);
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 font-sans">
                <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md text-center">
                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Welcome Aboard!</h2>
                    <p className="text-slate-500 text-sm font-medium mb-6">
                        Your student account has been created. Redirecting to your dashboard...
                    </p>
                    <div className="flex items-center justify-center gap-2 text-teal-700 font-bold">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Redirecting...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-3 sm:p-6 font-sans">
            <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-12 min-h-[640px]">
                
                {/* LEFT SIDEBAR: Overview & Process Steps */}
                <div className="lg:col-span-5 bg-[#1f5961] p-6 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
                    {/* Background Subtle Accent */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                    
                    <div>
                        {/* Header Branding */}
                        <div className="flex items-center justify-between mb-8">
                            <Link href="/signup" className="inline-flex items-center gap-2 text-teal-200 hover:text-white text-xs font-bold transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                                <span>Role Selection</span>
                            </Link>
                            <span className="bg-white/10 text-teal-100 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase">
                                Student Portal
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-8">
                            We match you with the tutor who fits you best
                        </h1>

                        {/* Step Overview List */}
                        <div className="space-y-6 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-white/20">
                            {STEPS.map((s) => {
                                const isActive = step === s.id;
                                const isDone = step > s.id;
                                return (
                                    <div key={s.id} className="flex items-start gap-4 relative z-10">
                                        <div 
                                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-all duration-300 ${
                                                isActive 
                                                    ? "bg-white text-[#1f5961] shadow-lg scale-110" 
                                                    : isDone 
                                                        ? "bg-emerald-400 text-slate-900" 
                                                        : "bg-white/10 text-white/70 border border-white/20"
                                            }`}
                                        >
                                            {isDone ? <CheckCircle2 className="w-5 h-5" /> : s.id}
                                        </div>
                                        <div className="pt-1">
                                            <h3 className={`text-sm font-bold leading-none ${isActive ? "text-white" : "text-white/80"}`}>
                                                {s.title}
                                            </h3>
                                            <p className="text-xs text-teal-100/70 mt-1 font-medium">
                                                {s.desc}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Left Bottom Testimonial Card */}
                    <div className="mt-10 bg-white/10 border border-white/15 backdrop-blur-md rounded-2xl p-4 sm:p-5">
                        <div className="flex text-amber-300 gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-current" />
                            ))}
                        </div>
                        <p className="text-xs text-teal-50 italic font-medium leading-relaxed mb-3">
                            &quot;They helped me find an amazing teacher who really understands my learning needs. Totally recommend it to any student!&quot;
                        </p>
                        <h4 className="text-xs font-bold text-white tracking-wide">
                            Ankit Jaisawal <span className="text-teal-200 font-normal">(Class 8th Student)</span>
                        </h4>
                    </div>
                </div>

                {/* RIGHT SIDE: Form Step Contents */}
                <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                    {step === 1 && "Account & Contact"}
                                    {step === 2 && "Personal Details & Address"}
                                    {step === 3 && "Subjects of Interest"}
                                </h2>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                                    Step {step} of 3
                                </p>
                            </div>
                            <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
                                Student Registration
                            </span>
                        </div>

                        {/* STEP 1 */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Full Name *</label>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => updateField("name", e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 text-xs font-bold border ${errors.name ? 'border-red-400 bg-red-50/20' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-[#1f5961]/20 focus:border-[#1f5961] outline-none bg-slate-50/50`}
                                            placeholder="e.g. Rahul Sharma"
                                        />
                                    </div>
                                    {errors.name && <p className="text-red-500 text-xs font-semibold mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Email Address *</label>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <div className="relative flex-1">
                                            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => updateField("email", e.target.value)}
                                                className={`w-full pl-10 pr-4 py-3 text-xs font-bold border ${errors.email ? 'border-red-400 bg-red-50/20' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-[#1f5961]/20 focus:border-[#1f5961] outline-none bg-slate-50/50`}
                                                placeholder="rahul@example.com"
                                                disabled={isGoogleVerified}
                                            />
                                        </div>
                                        {isGoogleVerified ? (
                                            <div className="flex items-center gap-1.5 px-4 py-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200">
                                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                                <span>Verified</span>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={verifyWithGoogle}
                                                className="px-4 py-3 bg-white text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors border border-slate-200 flex items-center justify-center gap-2 shadow-sm shrink-0"
                                            >
                                                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                                                Verify Google
                                            </button>
                                        )}
                                    </div>
                                    {errors.email && <p className="text-red-500 text-xs font-semibold mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Phone Number *</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => updateField("phone", e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 text-xs font-bold border ${errors.phone ? 'border-red-400 bg-red-50/20' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-[#1f5961]/20 focus:border-[#1f5961] outline-none bg-slate-50/50`}
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                    {errors.phone && <p className="text-red-500 text-xs font-semibold mt-1">{errors.phone}</p>}
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Password *</label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => updateField("password", e.target.value)}
                                            className={`w-full px-4 py-3 text-xs font-bold border ${errors.password ? 'border-red-400 bg-red-50/20' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-[#1f5961]/20 focus:border-[#1f5961] outline-none bg-slate-50/50`}
                                            placeholder="••••••••"
                                        />
                                        {errors.password && <p className="text-red-500 text-xs font-semibold mt-1">{errors.password}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Confirm Password *</label>
                                        <input
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => updateField("confirmPassword", e.target.value)}
                                            className={`w-full px-4 py-3 text-xs font-bold border ${errors.confirmPassword ? 'border-red-400 bg-red-50/20' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-[#1f5961]/20 focus:border-[#1f5961] outline-none bg-slate-50/50`}
                                            placeholder="••••••••"
                                        />
                                        {errors.confirmPassword && <p className="text-red-500 text-xs font-semibold mt-1">{errors.confirmPassword}</p>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2 */}
                        {step === 2 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Date of Birth *</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                                        <input
                                            type="date"
                                            value={formData.dob}
                                            onChange={(e) => updateField("dob", e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 text-xs font-bold border ${errors.dob ? 'border-red-400 bg-red-50/20' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-[#1f5961]/20 focus:border-[#1f5961] outline-none bg-slate-50/50`}
                                        />
                                    </div>
                                    {errors.dob && <p className="text-red-500 text-xs font-semibold mt-1">{errors.dob}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Select Location / Address *</label>
                                    <MapLocationPicker
                                        onLocationSelect={(loc) => {
                                            setFormData(prev => ({ ...prev, address: loc.address }));
                                            if (errors.address) setErrors(prev => ({ ...prev, address: "" }));
                                        }}
                                        initialAddress={formData.address}
                                        accentColor="blue"
                                        height="220px"
                                    />
                                    {errors.address && <p className="text-red-500 text-xs font-semibold mt-1">{errors.address}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Profile Photo (Optional)</label>
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-300 cursor-pointer hover:border-[#1f5961] hover:bg-slate-50 transition-all overflow-hidden shrink-0"
                                            onClick={() => profileInputRef.current?.click()}
                                        >
                                            {isUploadingProfile ? (
                                                <Loader2 className="w-5 h-5 text-[#1f5961] animate-spin" />
                                            ) : formData.profilePhoto ? (
                                                <img src={formData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <Camera className="w-6 h-6 text-slate-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <button
                                                type="button"
                                                onClick={() => profileInputRef.current?.click()}
                                                disabled={isUploadingProfile}
                                                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors border border-slate-200 disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {isUploadingProfile ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="w-4 h-4" />
                                                        {formData.profilePhoto ? "Change Photo" : "Upload Photo"}
                                                    </>
                                                )}
                                            </button>
                                            <p className="text-[11px] text-slate-400 mt-1 font-semibold">JPG, PNG or WebP. Max 4MB.</p>
                                        </div>
                                        {formData.profilePhoto && (
                                            <button
                                                type="button"
                                                onClick={() => setFormData((prev) => ({ ...prev, profilePhoto: "" }))}
                                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <input
                                        ref={profileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfilePhotoUpload}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        )}

                        {/* STEP 3 */}
                        {step === 3 && (
                            <div className="space-y-4">
                                <p className="text-xs text-slate-500 font-semibold mb-2">Select the subjects you require tutoring for:</p>
                                {errors.subjects && <p className="text-red-500 text-xs font-semibold mb-2">{errors.subjects}</p>}

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-1">
                                    {SUBJECTS.map((subject) => {
                                        const isSelected = formData.subjects.includes(subject);
                                        return (
                                            <button
                                                key={subject}
                                                type="button"
                                                onClick={() => toggleSubject(subject)}
                                                className={`p-3 rounded-xl border-2 text-left transition-all ${isSelected
                                                    ? "border-[#1f5961] bg-[#1f5961]/10 text-[#1f5961]"
                                                    : "border-slate-200 hover:border-slate-300 text-slate-700"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? "border-[#1f5961] bg-[#1f5961]" : "border-slate-300"
                                                        }`}>
                                                        {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                                                    </div>
                                                    <span className="text-xs font-bold leading-snug">{subject}</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Controls */}
                    <div className="flex items-center justify-between pt-6 mt-8 border-t border-slate-100">
                        {step > 1 ? (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="px-5 py-2.5 text-xs font-extrabold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </button>
                        ) : <div />}

                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="px-7 py-3 bg-[#1f5961] hover:bg-[#1a4a51] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
                            >
                                Next Step
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Registering...
                                    </>
                                ) : (
                                    <>
                                        Complete Registration
                                        <CheckCircle2 className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
