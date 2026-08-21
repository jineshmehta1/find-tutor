"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import {
    User, ArrowLeft, ArrowRight, Mail, Phone, Calendar, MapPin,
    BookOpen, GraduationCap, Loader2, CheckCircle2, Upload, Camera, X, Star, ShieldCheck,
    Lock, Eye, EyeOff, Check, Heart, HelpCircle, Search, Users, TrendingUp
} from "lucide-react";
import { toast } from "sonner";
import MapLocationPicker from "@/components/ui/DynamicMapPicker";
import { cn } from "@/lib/utils";

const CLOUDINARY_CLOUD_NAME = "dx2o9yq2t";
const CLOUDINARY_UPLOAD_PRESET = "gallery";

const SUBJECTS = [
    "Mathematics", "Physics", "Chemistry", "Biology", "English",
    "Hindi", "History", "Geography", "Computer Science", "Economics",
    "Accountancy", "Business Studies", "Political Science", "Psychology",
    "Sociology", "Sanskrit", "French", "German", "Music", "Art", "Chess",
    "Abacus", "Drawing", "Dance", "Yoga", "Robotics"
];

const STEPS = [
    { id: 1, title: "Account Details", desc: "Basic account information" },
    { id: 2, title: "Location & Profile", desc: "Date of birth & address" },
    { id: 3, title: "You're All Set!", desc: "Select learning preferences" },
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
    });

    // Custom signup UI states matching Flipkart/Aacharya aesthetics
    const [accountCreator, setAccountCreator] = useState<"parent" | "student">("parent");
    const [gender, setGender] = useState<"male" | "female" | "other" | "">("");
    const [preferredLanguage, setPreferredLanguage] = useState("English");
    const [securityQuestion, setSecurityQuestion] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [termsAgreed, setTermsAgreed] = useState(false);

    const [isGoogleVerified, setIsGoogleVerified] = useState(false);
    const [isUploadingProfile, setIsUploadingProfile] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    // Handle profile photo upload to Cloudinary
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

    // Live password validation checklist utilities
    const passMinLength = formData.password.length >= 6;
    const passHasNumberOrSymbol = /[0-9\W]/.test(formData.password);
    const passHasCaseTypes = /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password);

    const validateStep = (stepNum: number): boolean => {
        const newErrors: Record<string, string> = {};

        if (stepNum === 1) {
            if (!formData.name.trim()) newErrors.name = "Name is required";
            if (!formData.email.trim()) newErrors.email = "Email is required";
            else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
            if (!formData.phone.trim()) newErrors.phone = "Phone is required";
            if (!formData.password) newErrors.password = "Password is required";
            else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
            
            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match";
            }
            if (!gender) {
                toast.error("Please select your gender");
                return false;
            }
            if (!securityQuestion || !securityAnswer.trim()) {
                toast.error("Please provide a security question and answer");
                return false;
            }
            if (!termsAgreed) {
                toast.error("You must agree to the Terms & Conditions and Privacy Policy");
                return false;
            }
        }

        if (stepNum === 2) {
            if (!formData.dob) newErrors.dob = "Date of birth is required";
            if (!formData.address.trim()) newErrors.address = "Address is required";
        }

        if (stepNum === 3) {
            if (formData.subjects.length === 0) newErrors.subjects = "Select at least one subject of interest";
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
                    accountCreator,
                    gender,
                    preferredLanguage,
                    securityQuestion,
                    securityAnswer,
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
            <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 font-sans antialiased">
                <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md text-center border border-slate-100">
                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Welcome Aboard!</h2>
                    <p className="text-slate-500 text-xs font-semibold mb-6">
                        Your account has been created. Redirecting to your dashboard...
                    </p>
                    <div className="flex items-center justify-center gap-2 text-amber-700 font-extrabold text-xs">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Redirecting...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800">
            {/* Header Navbar Brand */}
            <header className="w-full bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10 shrink-0">
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white p-0.5 shadow flex items-center justify-center shrink-0">
                        <img src="/image.png" alt="Aacharya Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[15px] font-black text-white leading-none tracking-wider font-sans uppercase">
                            Aacharya
                        </span>
                        <span className="text-[8px] font-black text-slate-400 leading-none tracking-widest mt-1 uppercase">
                            Find Tutors Nearby
                        </span>
                    </div>
                </Link>
                
                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-8 text-[11px] font-black text-slate-655 uppercase tracking-wider">
                    <Link href="/find-tutor-nearby?type=tutor" className="hover:text-slate-900 transition-colors">Find Tutors</Link>
                    <Link href="/find-tutor-nearby?type=coach" className="hover:text-slate-900 transition-colors">Find Coaches</Link>
                    <Link href="/#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</Link>
                    <Link href="/about" className="hover:text-slate-900 transition-colors">About Us</Link>
                    <Link href="/contact" className="hover:text-slate-900 transition-colors">Contact Us</Link>
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center gap-3">
                    <Link href="/login" className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all border border-slate-200 shadow-sm flex items-center gap-2">
                        <User className="w-3.5 h-3.5" /> Login
                    </Link>
                    <Link href="/signup" className="px-4 py-2 bg-[#ffb800] hover:bg-[#ffa000] text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md">
                        Sign Up
                    </Link>
                </div>
            </header>

            {/* Signup Form Container Wrapper */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
                <div className="max-w-6xl w-full bg-white rounded-3xl shadow-xl overflow-hidden grid lg:grid-cols-12 min-h-[680px] border border-slate-100">
                    
                    {/* LEFT SIDEBAR: Overview & Wizard Progress Steps */}
                    <div className="lg:col-span-4 bg-[#0a1829] p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800/10 rounded-full blur-3xl pointer-events-none" />
                        
                        <div className="space-y-8">
                            {/* Blue Card block at the top */}
                            <div className="bg-[#122238]/60 border border-[#213550] rounded-2xl p-4">
                                <h2 className="text-xs font-black uppercase text-amber-400 tracking-wider">Create Your</h2>
                                <h1 className="text-lg font-black text-white uppercase tracking-tight mt-1 leading-none">AACHARYA Account</h1>
                                <p className="text-[10px] text-slate-400 mt-2 leading-relaxed font-bold">
                                    Join thousands of parents and students who trust AACHARYA to find the right tutors and coaches.
                                </p>
                            </div>

                            {/* Step Wizard indicator */}
                            <div className="space-y-6 relative before:absolute before:left-4.5 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-800">
                                {STEPS.map((s) => {
                                    const isActive = step === s.id;
                                    const isDone = step > s.id;
                                    return (
                                        <div key={s.id} className="flex items-start gap-4 relative z-10">
                                            <div 
                                                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all duration-300 ${
                                                    isActive 
                                                        ? "bg-amber-400 text-slate-950 shadow-lg scale-110 font-black" 
                                                        : isDone 
                                                            ? "bg-emerald-500 text-white" 
                                                            : "bg-[#122238] text-slate-500 border border-slate-700/30"
                                                }`}
                                            >
                                                {isDone ? <CheckCircle2 className="w-5 h-5" /> : s.id}
                                            </div>
                                            <div className="pt-1">
                                                <h3 className={`text-xs font-black leading-none ${isActive ? "text-white font-black" : "text-slate-400"}`}>
                                                    {s.title}
                                                </h3>
                                                <p className="text-[10px] text-slate-500 mt-1 font-bold">
                                                    {s.desc}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Left bottom details block */}
                        <div className="mt-8 pt-6 border-t border-slate-900/60 space-y-4">
                            <h4 className="text-[10px] font-black text-slate-450 uppercase tracking-widest">Why Create an Account?</h4>
                            
                            <ul className="space-y-3 text-[10px] text-slate-400 font-bold">
                                <li className="flex items-start gap-2.5">
                                    <Search className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                    <span>Search and connect with verified tutors & coaches</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <Heart className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                    <span>Save profiles and manage your enquiries</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                    <span>Book appointments and get quick responses</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                    <span>Safe, secure and trusted platform</span>
                                </li>
                            </ul>

                            <div className="flex items-center gap-2 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-[9px] font-bold text-emerald-400 mt-2">
                                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-500" />
                                <span>Your privacy and security are our priority.</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Wizard content area */}
                    <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between">
                        
                        {/* Header Details with cartoon girl working mockup */}
                        <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
                            <div className="space-y-1">
                                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Create Your AACHARYA Account</h1>
                                <p className="text-[10px] text-slate-500 font-bold leading-normal max-w-md">
                                    Just a few details to get you started. You can search for tutors or coaches for yourself or for anyone you are helping.
                                </p>
                            </div>
                            
                            {/* Graphic mockup details */}
                            <div className="hidden sm:flex items-center gap-2 relative">
                                <div className="w-20 h-14 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 border overflow-hidden">
                                    <img src="https://cdn-icons-png.flaticon.com/512/3429/3429433.png" alt="illustration" className="w-10 h-10 object-contain" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[8px] font-black">✓</div>
                            </div>
                        </div>

                        {/* STEP 1: Account Details Form */}
                        {step === 1 && (
                            <div className="space-y-5">
                                {/* Wizard step name subheader */}
                                <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                                    <span className="w-5 h-5 rounded-full bg-[#0a1829] text-white text-[10px] font-black flex items-center justify-center">1</span>
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Account Details</h3>
                                    <span className="text-[10px] text-slate-400 font-bold ml-1">• Tell us who you are</span>
                                </div>

                                {/* I am creating this account as radio cards */}
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black text-slate-450 uppercase tracking-wider">I am creating this account as *</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Parent card option */}
                                        <div 
                                            onClick={() => setAccountCreator("parent")}
                                            className={cn(
                                                "p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between",
                                                accountCreator === "parent"
                                                    ? "border-amber-400 bg-amber-50/10"
                                                    : "border-slate-200 hover:border-slate-300"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                                                    <Users className="w-4.5 h-4.5" />
                                                </div>
                                                <div className="text-left">
                                                    <h4 className="text-xs font-black text-slate-900">Parent</h4>
                                                    <p className="text-[9px] text-slate-450 mt-0.5 leading-tight max-w-[170px]">I am creating this account on behalf of child</p>
                                                </div>
                                            </div>
                                            <div className={cn(
                                                "w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                                                accountCreator === "parent" ? "border-amber-400 bg-amber-400 text-slate-900 text-[8px] font-bold" : "border-slate-300"
                                            )}>
                                                {accountCreator === "parent" && "✓"}
                                            </div>
                                        </div>

                                        {/* Student card option */}
                                        <div 
                                            onClick={() => setAccountCreator("student")}
                                            className={cn(
                                                "p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between",
                                                accountCreator === "student"
                                                    ? "border-amber-400 bg-amber-50/10"
                                                    : "border-slate-200 hover:border-slate-300"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                                    <User className="w-4.5 h-4.5" />
                                                </div>
                                                <div className="text-left">
                                                    <h4 className="text-xs font-black text-slate-900">Student</h4>
                                                    <p className="text-[9px] text-slate-450 mt-0.5 leading-tight max-w-[170px]">I am creating this account for myself</p>
                                                </div>
                                            </div>
                                            <div className={cn(
                                                "w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                                                accountCreator === "student" ? "border-amber-400 bg-amber-400 text-slate-900 text-[8px] font-bold" : "border-slate-300"
                                            )}>
                                                {accountCreator === "student" && "✓"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Inputs grid name & gender */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {/* Full Name input */}
                                    <div className="space-y-1.5 text-left">
                                        <label className="block text-[11px] font-black text-slate-450 uppercase tracking-wider">Full Name *</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => updateField("name", e.target.value)}
                                                className={`w-full pl-9 pr-4 py-2.5 text-xs font-bold border ${errors.name ? 'border-red-400 bg-red-50/20' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-slate-50/50`}
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                        {errors.name && <p className="text-red-500 text-[10px] font-bold">{errors.name}</p>}
                                    </div>

                                    {/* Gender selector */}
                                    <div className="space-y-1.5 text-left">
                                        <label className="block text-[11px] font-black text-slate-450 uppercase tracking-wider">Gender *</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {/* Male button */}
                                            <button
                                                type="button"
                                                onClick={() => setGender("male")}
                                                className={cn(
                                                    "py-2.5 border rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer",
                                                    gender === "male"
                                                        ? "border-amber-400 bg-amber-50/15 text-slate-900"
                                                        : "border-slate-200 text-slate-650 hover:bg-slate-50"
                                                )}
                                            >
                                                <span>♂</span> Male
                                            </button>
                                            
                                            {/* Female button */}
                                            <button
                                                type="button"
                                                onClick={() => setGender("female")}
                                                className={cn(
                                                    "py-2.5 border rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer",
                                                    gender === "female"
                                                        ? "border-amber-400 bg-amber-50/15 text-slate-900"
                                                        : "border-slate-200 text-slate-650 hover:bg-slate-50"
                                                )}
                                            >
                                                <span>♀</span> Female
                                            </button>

                                            {/* Other button */}
                                            <button
                                                type="button"
                                                onClick={() => setGender("other")}
                                                className={cn(
                                                    "py-2.5 border rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer",
                                                    gender === "other"
                                                        ? "border-amber-400 bg-amber-50/15 text-slate-900"
                                                        : "border-slate-200 text-slate-650 hover:bg-slate-50"
                                                )}
                                            >
                                                <span>⚦</span> Other
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Inputs grid phone & email */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {/* Mobile Number */}
                                    <div className="space-y-1.5 text-left">
                                        <label className="block text-[11px] font-black text-slate-450 uppercase tracking-wider">Mobile Number *</label>
                                        <div className="flex border border-slate-200 rounded-xl overflow-hidden focus-within:border-amber-550 focus-within:ring-2 focus-within:ring-amber-500/20 bg-slate-50/50">
                                            <div className="flex items-center gap-1 px-3 py-2.5 border-r border-slate-200 bg-slate-100 text-xs font-bold text-slate-700 shrink-0">
                                                <span>🇮🇳</span>
                                                <span>+91</span>
                                            </div>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => updateField("phone", e.target.value)}
                                                className={`w-full px-3.5 py-2.5 text-xs font-bold bg-transparent outline-none border-none`}
                                                placeholder="Enter 10 digit mobile number"
                                            />
                                        </div>
                                        {errors.phone && <p className="text-red-500 text-[10px] font-bold">{errors.phone}</p>}
                                        <p className="text-[9px] text-slate-450 font-bold mt-1 leading-none">We will send an OTP to verify your number.</p>
                                    </div>

                                    {/* Email address with Google Verification */}
                                    <div className="space-y-1.5 text-left">
                                        <label className="block text-[11px] font-black text-slate-450 uppercase tracking-wider">Email Address *</label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => updateField("email", e.target.value)}
                                                    className={`w-full pl-9 pr-4 py-2.5 text-xs font-bold border ${errors.email ? 'border-red-400 bg-red-50/20' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-slate-50/50`}
                                                    placeholder="Enter your email address"
                                                    disabled={isGoogleVerified}
                                                />
                                            </div>
                                            {isGoogleVerified ? (
                                                <div className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-xl border border-emerald-100">
                                                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                                                    <span>Verified</span>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={verifyWithGoogle}
                                                    className="px-3.5 py-2 bg-white text-slate-700 text-[10px] font-black rounded-xl hover:bg-slate-50 transition-colors border border-slate-200 flex items-center justify-center gap-1.5 shadow-sm shrink-0 cursor-pointer"
                                                >
                                                    <img src="https://www.google.com/favicon.ico" alt="Google Logo" className="w-3.5 h-3.5" />
                                                    <span>Verify</span>
                                                </button>
                                            )}
                                        </div>
                                        {errors.email && <p className="text-red-500 text-[10px] font-bold">{errors.email}</p>}
                                        <p className="text-[9px] text-slate-450 font-bold mt-1 leading-none">Use your email to receive updates.</p>
                                    </div>
                                </div>

                                {/* Passwords row */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {/* Password */}
                                    <div className="space-y-1.5 text-left">
                                        <label className="block text-[11px] font-black text-slate-450 uppercase tracking-wider">Create Password *</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={formData.password}
                                                onChange={(e) => updateField("password", e.target.value)}
                                                className={`w-full pl-9 pr-9 py-2.5 text-xs font-bold border ${errors.password ? 'border-red-400 bg-red-50/20' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-slate-50/50`}
                                                placeholder="Enter password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 outline-none border-none bg-transparent"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        {errors.password && <p className="text-red-500 text-[10px] font-bold">{errors.password}</p>}
                                        <p className="text-[9px] text-slate-450 font-bold mt-1 leading-none">Minimum 6 characters with one number.</p>
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="space-y-1.5 text-left">
                                        <label className="block text-[11px] font-black text-slate-450 uppercase tracking-wider">Confirm Password *</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={formData.confirmPassword}
                                                onChange={(e) => updateField("confirmPassword", e.target.value)}
                                                className={`w-full pl-9 pr-9 py-2.5 text-xs font-bold border ${errors.confirmPassword ? 'border-red-400 bg-red-50/20' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-slate-50/50`}
                                                placeholder="Confirm password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 outline-none border-none bg-transparent"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && <p className="text-red-500 text-[10px] font-bold">{errors.confirmPassword}</p>}
                                    </div>
                                </div>

                                {/* Password requirements checklist card */}
                                <div className="p-4 bg-emerald-50/25 border border-emerald-50 rounded-2xl space-y-2 text-left">
                                    <h4 className="text-[10px] font-black text-emerald-850 uppercase tracking-wider">Password must contain:</h4>
                                    <ul className="grid sm:grid-cols-3 gap-2 text-[10px] font-bold">
                                        <li className="flex items-center gap-1.5">
                                            <span className={cn("w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black", passMinLength ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400")}>✓</span>
                                            <span className={passMinLength ? "text-emerald-700 font-extrabold" : "text-slate-450"}>Minimum 6 characters</span>
                                        </li>
                                        <li className="flex items-center gap-1.5">
                                            <span className={cn("w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black", passHasNumberOrSymbol ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400")}>✓</span>
                                            <span className={passHasNumberOrSymbol ? "text-emerald-700 font-extrabold" : "text-slate-450"}>At least 1 number/symbol</span>
                                        </li>
                                        <li className="flex items-center gap-1.5">
                                            <span className={cn("w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black", passHasCaseTypes ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400")}>✓</span>
                                            <span className={passHasCaseTypes ? "text-emerald-700 font-extrabold" : "text-slate-450"}>Mixed case letters</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Security Question details */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {/* Security Question dropdown */}
                                    <div className="space-y-1.5 text-left">
                                        <label className="block text-[11px] font-black text-slate-450 uppercase tracking-wider">Security Question *</label>
                                        <div className="relative">
                                            <HelpCircle className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                                            <select
                                                value={securityQuestion}
                                                onChange={(e) => setSecurityQuestion(e.target.value)}
                                                className="w-full pl-9 pr-4 py-2.5 text-xs font-bold border border-slate-200 rounded-xl outline-none bg-slate-50/50 cursor-pointer"
                                            >
                                                <option value="">Select a security question</option>
                                                <option value="school">What was your first school name?</option>
                                                <option value="pet">What was the name of your first pet?</option>
                                                <option value="city">In what city were you born?</option>
                                                <option value="maiden">What is your mother's maiden name?</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Security Answer */}
                                    <div className="space-y-1.5 text-left">
                                        <label className="block text-[11px] font-black text-slate-450 uppercase tracking-wider">Answer *</label>
                                        <input
                                            type="text"
                                            value={securityAnswer}
                                            onChange={(e) => setSecurityAnswer(e.target.value)}
                                            className="w-full px-4 py-2.5 text-xs font-bold border border-slate-200 rounded-xl outline-none bg-slate-50/50"
                                            placeholder="Enter your security answer"
                                        />
                                    </div>
                                </div>

                                {/* Safety Info banner */}
                                <div className="flex items-center gap-2.5 p-3.5 bg-blue-50 border border-blue-100 rounded-2xl text-[10px] font-bold text-blue-700 text-left">
                                    <Lock className="w-4 h-4 shrink-0 text-blue-500" />
                                    <span>Your information is safe with us. We never share your personal details with anyone.</span>
                                </div>

                                {/* Terms agreement checkbox */}
                                <div className="flex items-start gap-2.5 text-left py-2">
                                    <input
                                        type="checkbox"
                                        id="termsCheckbox"
                                        checked={termsAgreed}
                                        onChange={(e) => setTermsAgreed(e.target.checked)}
                                        className="w-4.5 h-4.5 rounded text-amber-500 focus:ring-amber-500 border-slate-300 mt-0.5 cursor-pointer"
                                    />
                                    <label htmlFor="termsCheckbox" className="text-[11px] font-bold text-slate-550 select-none cursor-pointer">
                                        I agree to AACHARYA's <Link href="/terms" target="_blank" className="text-amber-600 hover:underline">Terms & Conditions</Link> and <Link href="/privacy" target="_blank" className="text-amber-600 hover:underline">Privacy Policy</Link>.
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: Location & Address */}
                        {step === 2 && (
                            <div className="space-y-5">
                                {/* Wizard step name subheader */}
                                <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                                    <span className="w-5 h-5 rounded-full bg-[#0a1829] text-white text-[10px] font-black flex items-center justify-center">2</span>
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Location & Profile</h3>
                                    <span className="text-[10px] text-slate-400 font-bold ml-1">• Find matching tutors nearby</span>
                                </div>

                                {/* Birth Date & Preferred Language */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {/* Date of Birth input */}
                                    <div className="space-y-1.5 text-left">
                                        <label className="block text-[11px] font-black text-slate-450 uppercase tracking-wider">Date of Birth *</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                            <input
                                                type="date"
                                                value={formData.dob}
                                                onChange={(e) => updateField("dob", e.target.value)}
                                                className={`w-full pl-9 pr-4 py-2.5 text-xs font-bold border ${errors.dob ? 'border-red-400 bg-red-50/20' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-slate-50/50`}
                                            />
                                        </div>
                                        {errors.dob && <p className="text-red-500 text-[10px] font-bold">{errors.dob}</p>}
                                    </div>

                                    {/* Preferred Language dropdown */}
                                    <div className="space-y-1.5 text-left">
                                        <label className="block text-[11px] font-black text-slate-450 uppercase tracking-wider">Preferred Language (Optional)</label>
                                        <div className="relative">
                                            <BookOpen className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                            <select
                                                value={preferredLanguage}
                                                onChange={(e) => setPreferredLanguage(e.target.value)}
                                                className="w-full pl-9 pr-4 py-2.5 text-xs font-bold border border-slate-200 rounded-xl outline-none bg-slate-50/50 cursor-pointer"
                                            >
                                                <option value="English">English</option>
                                                <option value="Hindi">Hindi</option>
                                                <option value="Telugu">Telugu</option>
                                                <option value="Tamil">Tamil</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Address Picker */}
                                <div className="space-y-1.5 text-left">
                                    <label className="block text-[11px] font-black text-slate-450 uppercase tracking-wider">Select Location / Address *</label>
                                    <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-inner">
                                        <MapLocationPicker
                                            onLocationSelect={(loc) => {
                                                setFormData(prev => ({ ...prev, address: loc.address }));
                                                if (errors.address) setErrors(prev => ({ ...prev, address: "" }));
                                            }}
                                            initialAddress={formData.address}
                                            accentColor="amber"
                                            height="200px"
                                        />
                                    </div>
                                    {errors.address && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.address}</p>}
                                </div>

                                {/* Cloudinary Profile photo upload block */}
                                <div className="space-y-1.5 text-left">
                                    <label className="block text-[11px] font-black text-slate-450 uppercase tracking-wider">Profile Photo (Optional)</label>
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                        <div
                                            className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-250 cursor-pointer hover:border-amber-500 hover:bg-slate-50/40 transition-all overflow-hidden shrink-0 shadow-sm"
                                            onClick={() => profileInputRef.current?.click()}
                                        >
                                            {isUploadingProfile ? (
                                                <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
                                            ) : formData.profilePhoto ? (
                                                <img src={formData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <Camera className="w-5 h-5 text-slate-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <button
                                                type="button"
                                                onClick={() => profileInputRef.current?.click()}
                                                disabled={isUploadingProfile}
                                                className="px-4 py-2 bg-white text-slate-700 text-[10px] font-black rounded-xl hover:bg-slate-50 transition-colors border border-slate-200 disabled:opacity-50 flex items-center gap-1.5 shadow-sm cursor-pointer"
                                            >
                                                {isUploadingProfile ? (
                                                    <>
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        <span>Uploading...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="w-3.5 h-3.5" />
                                                        <span>{formData.profilePhoto ? "Change Photo" : "Upload Photo"}</span>
                                                    </>
                                                )}
                                            </button>
                                            <p className="text-[9px] text-slate-400 mt-1 font-bold">JPG, PNG or WebP. Max 4MB.</p>
                                        </div>
                                        {formData.profilePhoto && (
                                            <button
                                                type="button"
                                                onClick={() => setFormData((prev) => ({ ...prev, profilePhoto: "" }))}
                                                className="p-2 text-slate-450 hover:text-red-500 transition-colors border-none bg-transparent cursor-pointer"
                                            >
                                                <X className="w-4.5 h-4.5" />
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

                        {/* STEP 3: Subjects & preferences */}
                        {step === 3 && (
                            <div className="space-y-5">
                                {/* Wizard step name subheader */}
                                <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                                    <span className="w-5 h-5 rounded-full bg-[#0a1829] text-white text-[10px] font-black flex items-center justify-center">3</span>
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Learning Preferences</h3>
                                    <span className="text-[10px] text-slate-400 font-bold ml-1">• Choose matching subjects</span>
                                </div>

                                <div className="space-y-1.5 text-left">
                                    <p className="text-xs text-slate-500 font-bold mb-2">Select the subjects or co-curricular activities you need mentoring for:</p>
                                    {errors.subjects && <p className="text-red-500 text-xs font-black mb-2">{errors.subjects}</p>}

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[290px] overflow-y-auto pr-1">
                                        {SUBJECTS.map((subject) => {
                                            const isSelected = formData.subjects.includes(subject);
                                            return (
                                                <button
                                                    key={subject}
                                                    type="button"
                                                    onClick={() => toggleSubject(subject)}
                                                    className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${isSelected
                                                        ? "border-amber-400 bg-amber-50/10 text-slate-900"
                                                        : "border-slate-100 hover:border-slate-200 text-slate-700 bg-white"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? "border-amber-400 bg-amber-400" : "border-slate-250"
                                                            }`}>
                                                            {isSelected && <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />}
                                                        </div>
                                                        <span className="text-[11px] font-black leading-snug">{subject}</span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Bottom Wizard Controls (Back / Next Step / Complete Register) */}
                        <div className="flex items-center justify-between pt-6 mt-8 border-t border-slate-100">
                            {step > 1 ? (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="px-5 py-2.5 text-xs font-black text-slate-400 hover:text-slate-800 transition-colors flex items-center gap-1.5 border-none bg-transparent cursor-pointer"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>Back</span>
                                </button>
                            ) : <div />}

                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="px-6 py-3 bg-[#ffb800] hover:bg-[#ffa000] text-slate-950 text-xs font-black rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer border-none"
                                >
                                    <span>Next Step</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center gap-2 cursor-pointer border-none"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Registering...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Complete Registration</span>
                                            <CheckCircle2 className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                    </div>

                </div>
            </div>

            {/* Bottom Safe Badge Indicators Grid */}
            <section className="bg-white border-y border-slate-100 py-6 shrink-0">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {/* Item 1 */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                            <h4 className="text-[10px] font-black text-slate-900 uppercase">100% Safe & Secure</h4>
                            <p className="text-[8px] text-slate-400 font-bold leading-none mt-0.5">Your data is fully encrypted</p>
                        </div>
                    </div>
                    {/* Item 2 */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                            <Users className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                            <h4 className="text-[10px] font-black text-slate-900 uppercase">Trusted by Thousands</h4>
                            <p className="text-[8px] text-slate-400 font-bold leading-none mt-0.5">Students across all cities</p>
                        </div>
                    </div>
                    {/* Item 3 */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                            <GraduationCap className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                            <h4 className="text-[10px] font-black text-slate-900 uppercase">Verified Tutors</h4>
                            <p className="text-[8px] text-slate-400 font-bold leading-none mt-0.5">Manually audited background check</p>
                        </div>
                    </div>
                    {/* Item 4 */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-550 flex items-center justify-center shrink-0">
                            <Phone className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                            <h4 className="text-[10px] font-black text-slate-900 uppercase">Quick Support</h4>
                            <p className="text-[8px] text-slate-400 font-bold leading-none mt-0.5">Here to assist you at every step</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works After Sign Up Flow */}
            <section className="bg-slate-50 py-8 shrink-0">
                <div className="max-w-6xl mx-auto px-6 text-center space-y-4">
                    <h3 className="text-[10px] font-black text-slate-450 uppercase tracking-widest">How It Works After Sign Up</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 max-w-4xl mx-auto text-xs font-bold text-slate-700">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm text-slate-500 mb-2">
                                <Search className="w-4 h-4" />
                            </div>
                            <h4 className="font-extrabold text-slate-900">1. Search</h4>
                            <p className="text-[9px] text-slate-450 mt-1 leading-relaxed max-w-[150px]">Search by class, subject or co-curricular activity.</p>
                        </div>
                        {/* Step 2 */}
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm text-slate-500 mb-2">
                                <Users className="w-4 h-4" />
                            </div>
                            <h4 className="font-extrabold text-slate-900">2. Connect</h4>
                            <p className="text-[9px] text-slate-450 mt-1 leading-relaxed max-w-[150px]">View tutor profiles and compare details.</p>
                        </div>
                        {/* Step 3 */}
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm text-slate-500 mb-2">
                                <Calendar className="w-4 h-4" />
                            </div>
                            <h4 className="font-extrabold text-slate-900">3. Book / Enquire</h4>
                            <p className="text-[9px] text-slate-450 mt-1 leading-relaxed max-w-[150px]">Schedule demo classes or send direct inquiries.</p>
                        </div>
                        {/* Step 4 */}
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm text-slate-500 mb-2">
                                <TrendingUp className="w-4 h-4" />
                            </div>
                            <h4 className="font-extrabold text-slate-900">4. Learn & Grow</h4>
                            <p className="text-[9px] text-slate-450 mt-1 leading-relaxed max-w-[150px]">Achieve study goals with your private mentor.</p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200/60 max-w-sm mx-auto text-xs font-bold text-slate-500">
                        <span>Already have an account? </span>
                        <Link href="/login" className="text-amber-600 hover:underline font-black">Login here</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
