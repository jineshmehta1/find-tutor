"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import {
    User, ArrowLeft, ArrowRight, Mail, Phone, Calendar, MapPin,
    BookOpen, GraduationCap, Award, Briefcase, Camera, Plus, X,
    Loader2, CheckCircle2, Upload, Star, ShieldCheck, ImageIcon
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
    { id: 2, title: "Personal & Location", desc: "Date of birth & address" },
    { id: 3, title: "Qualifications", desc: "Education & certificates" },
    { id: 4, title: "Subjects Offered", desc: "Teaching subjects" },
];

interface Certification {
    text: string;
    image?: string;
}

export default function TeacherSignupPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const profileInputRef = useRef<HTMLInputElement>(null);
    const certImageInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        dob: "",
        address: "",
        profilePhoto: "",
        education: "",
        experience: "",
        certifications: [] as Certification[],
        subjects: [] as string[],
        otp: "",
    });

    const [isGoogleVerified, setIsGoogleVerified] = useState(false);
    const [isUploadingProfile, setIsUploadingProfile] = useState(false);
    const [isUploadingCertImage, setIsUploadingCertImage] = useState(false);

    useEffect(() => {
        const savedData = sessionStorage.getItem("teacher_signup_form_data");
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setFormData(prev => ({ ...prev, ...parsed }));
            sessionStorage.removeItem("teacher_signup_form_data");
        }
    }, []);

    useEffect(() => {
        if (session?.user?.email) {
            setFormData(prev => ({ ...prev, email: session.user?.email || prev.email, name: prev.name || session.user?.name || "" }));
            setIsGoogleVerified(true);
        }
    }, [session]);

    const [certInput, setCertInput] = useState("");
    const [certImagePreview, setCertImagePreview] = useState<string | null>(null);
    const [pendingCertImage, setPendingCertImage] = useState<string>("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const updateField = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploadingProfile(true);
        try {
            const form = new FormData();
            form.append("file", file);
            form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
            form.append("folder", "profiles");
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: form });
            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            setFormData(prev => ({ ...prev, profilePhoto: data.secure_url }));
            toast.success("Profile photo uploaded!");
        } catch { toast.error("Upload failed."); } finally { setIsUploadingProfile(false); }
    };

    const handleCertImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploadingCertImage(true);
        const reader = new FileReader();
        reader.onload = (ev) => setCertImagePreview(ev.target?.result as string);
        reader.readAsDataURL(file);
        try {
            const form = new FormData();
            form.append("file", file);
            form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
            form.append("folder", "certificates");
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: form });
            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            setPendingCertImage(data.secure_url);
            toast.success("Certificate image uploaded!");
        } catch { toast.error("Upload failed."); setCertImagePreview(null); } finally { setIsUploadingCertImage(false); }
    };

    const addCertification = () => {
        if (certInput.trim()) {
            const newCert: Certification = { text: certInput.trim(), image: pendingCertImage || undefined };
            if (!formData.certifications.some((c) => c.text === newCert.text)) {
                setFormData(prev => ({ ...prev, certifications: [...prev.certifications, newCert] }));
            }
            setCertInput(""); setPendingCertImage(""); setCertImagePreview(null);
            if (certImageInputRef.current) certImageInputRef.current.value = "";
        }
    };

    const removeCertification = (text: string) => setFormData(prev => ({ ...prev, certifications: prev.certifications.filter(c => c.text !== text) }));
    const toggleSubject = (subject: string) => setFormData(prev => ({ ...prev, subjects: prev.subjects.includes(subject) ? prev.subjects.filter(s => s !== subject) : [...prev.subjects, subject] }));

    const validateStep = (stepNum: number): boolean => {
        const newErrors: Record<string, string> = {};
        if (stepNum === 1) {
            if (!formData.name.trim()) newErrors.name = "Name is required";
            if (!formData.email.trim()) newErrors.email = "Email is required";
            if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
            if (!formData.password || formData.password.length < 6) newErrors.password = "Min 6 chars";
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            toast.error(Object.values(newErrors)[0]);
            return false;
        }
        return true;
    };

    const nextStep = () => { if (validateStep(step)) setStep(prev => Math.min(prev + 1, 4)); };
    const prevStep = () => { setStep(prev => Math.max(prev - 1, 1)); };

    const verifyWithGoogle = async () => {
        sessionStorage.setItem("teacher_signup_form_data", JSON.stringify(formData));
        signIn("google", { callbackUrl: window.location.href });
    };

    const handleSubmit = async () => {
        if (!validateStep(4)) return;
        setLoading(true);
        try {
            const res = await fetch("/api/auth/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...formData, role: "TEACHER", isGoogleVerified }) });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error || "Registration failed");
                return;
            }
            setSuccess(true);
            setTimeout(async () => await signIn("credentials", { email: formData.email, password: formData.password, callbackUrl: "/teacher" }), 2000);
        } catch { toast.error("Error occurred."); } finally { setLoading(false); }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 font-sans">
                <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md text-center">
                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Registration Successful!</h2>
                    <p className="text-slate-500 text-sm font-medium mb-6">Your teacher application has been created. Redirecting to your instructor portal...</p>
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
            <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-12 min-h-[660px]">
                <div className="lg:col-span-5 bg-[#1f5961] p-6 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <Link href="/signup" className="inline-flex items-center gap-2 text-teal-200 hover:text-white text-xs font-bold transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                                <span>Role Selection</span>
                            </Link>
                            <span className="bg-white/10 text-amber-300 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border border-amber-300/30">Tutor Portal</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-8">Connect with verified local & online students</h1>
                        <div className="space-y-5 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-white/20">
                            {STEPS.map((s) => {
                                const isActive = step === s.id;
                                const isDone = step > s.id;
                                return (
                                    <div key={s.id} className="flex items-start gap-4 relative z-10">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-all duration-300 ${isActive ? "bg-amber-400 text-slate-950 shadow-lg scale-110" : isDone ? "bg-emerald-400 text-slate-900" : "bg-white/10 text-white/70 border border-white/20"}`}>
                                            {isDone ? <CheckCircle2 className="w-5 h-5" /> : s.id}
                                        </div>
                                        <div className="pt-1">
                                            <h3 className={`text-sm font-bold leading-none ${isActive ? "text-white" : "text-white/80"}`}>{s.title}</h3>
                                            <p className="text-xs text-teal-100/70 mt-1 font-medium">{s.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="mt-8 bg-white/10 border border-white/15 backdrop-blur-md rounded-2xl p-4 sm:p-5">
                        <div className="flex text-amber-300 gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                        </div>
                        <p className="text-xs text-teal-50 italic font-medium leading-relaxed mb-3">&quot;Aacharya Academy helped me double my tutoring leads within weeks. Direct parent connections with zero commission cut!&quot;</p>
                        <h4 className="text-xs font-bold text-white tracking-wide">Dr. Sandeep Kumar <span className="text-amber-300 font-normal">(Senior Physics Educator)</span></h4>
                    </div>
                </div>

                <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-black text-slate-900">{STEPS[step - 1].title}</h2>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">{STEPS[step - 1].desc}</p>
                            </div>
                            <span className="text-xs font-black text-[#1f5961] bg-teal-50 px-3 py-1 rounded-full border border-teal-200">Step {step} of 4</span>
                        </div>

                        {step === 1 && (
                            <div className="space-y-4">
                                <button type="button" onClick={verifyWithGoogle} className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all">
                                    <span className="font-extrabold text-blue-600">G</span>
                                    <span>{isGoogleVerified ? "Email Verified with Google ✓" : "Verify Email with Google"}</span>
                                </button>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Full Name *</label>
                                    <input type="text" value={formData.name} onChange={(e) => updateField("name", e.target.value)} className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-xl outline-none focus:border-[#1f5961]" placeholder="e.g. Dr. Rajesh Sharma" />
                                    {errors.name && <p className="text-[11px] text-red-500 font-bold mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Email Address *</label>
                                    <input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-xl outline-none focus:border-[#1f5961]" placeholder="e.g. rajesh@aacharya.net" />
                                    {errors.email && <p className="text-[11px] text-red-500 font-bold mt-1">{errors.email}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Phone *</label>
                                        <input type="tel" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-xl outline-none focus:border-[#1f5961]" placeholder="9876543210" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Password *</label>
                                        <input type="password" value={formData.password} onChange={(e) => updateField("password", e.target.value)} className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-xl outline-none focus:border-[#1f5961]" placeholder="••••••••" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Date of Birth *</label>
                                    <input type="date" value={formData.dob} onChange={(e) => updateField("dob", e.target.value)} className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-xl outline-none focus:border-[#1f5961]" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">📍 Teaching Address / Center Location *</label>
                                    <MapLocationPicker
                                        onLocationSelect={(loc) => {
                                            updateField("address", loc.address);
                                        }}
                                        initialAddress={formData.address}
                                        accentColor="blue"
                                        height="200px"
                                        compact={true}
                                    />
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Highest Qualification *</label>
                                    <input type="text" value={formData.education} onChange={(e) => updateField("education", e.target.value)} className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-xl outline-none focus:border-[#1f5961]" placeholder="e.g. M.Sc Physics / B.Tech Computer Science" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Teaching Experience</label>
                                    <input type="text" value={formData.experience} onChange={(e) => updateField("experience", e.target.value)} className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-xl outline-none focus:border-[#1f5961]" placeholder="e.g. 5 Years Experience" />
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-4">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Select Subjects You Teach *</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-1">
                                    {SUBJECTS.map((sub) => {
                                        const isSel = formData.subjects.includes(sub);
                                        return (
                                            <button key={sub} type="button" onClick={() => toggleSubject(sub)} className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${isSel ? "border-[#1f5961] bg-teal-50 text-[#1f5961]" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                                                {sub}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-6">
                        {step > 1 ? (
                            <button type="button" onClick={prevStep} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs">Back</button>
                        ) : <div />}
                        {step < 4 ? (
                            <button type="button" onClick={nextStep} className="px-6 py-2.5 bg-[#1f5961] hover:bg-[#1a4a51] text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-md">Next Step</button>
                        ) : (
                            <button type="button" onClick={handleSubmit} disabled={loading} className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg flex items-center gap-2">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Complete Registration"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
