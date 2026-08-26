"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import {
    User, ArrowLeft, ArrowRight, Mail, Phone, Calendar, MapPin,
    BookOpen, GraduationCap, Award, Briefcase, Camera, Plus, X,
    Loader2, CheckCircle2, Upload, Star, ShieldCheck, ImageIcon,
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
    { id: 1, title: "Account Details", desc: "Basic details & login info" },
    { id: 2, title: "Location & Profile", desc: "Date of birth & address" },
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
    
    const [tutorType, setTutorType] = useState<"teacher" | "coach">("teacher");
    const [subjectLevels, setSubjectLevels] = useState<Record<string, string[]>>({});
    
    const profileInputRef = useRef<HTMLInputElement>(null);
    const certImageInputRef = useRef<HTMLInputElement>(null);
    const qualCertInputRef = useRef<HTMLInputElement>(null);
    const achCertInputRef = useRef<HTMLInputElement>(null);

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
        qualificationCertificate: "",
        achievementCertificate: "",
    });

    // Custom signup UI states matching Flipkart/Aacharya aesthetics
    const [gender, setGender] = useState<"male" | "female" | "other" | "">("");
    const [preferredLanguage, setPreferredLanguage] = useState("English");
    const [securityQuestion, setSecurityQuestion] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [termsAgreed, setTermsAgreed] = useState(false);

    const [isGoogleVerified, setIsGoogleVerified] = useState(false);
    const [isUploadingProfile, setIsUploadingProfile] = useState(false);
    const [isUploadingCertImage, setIsUploadingCertImage] = useState(false);
    const [isUploadingQualCert, setIsUploadingQualCert] = useState(false);
    const [isUploadingAchCert, setIsUploadingAchCert] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [certInput, setCertInput] = useState("");
    const [certImagePreview, setCertImagePreview] = useState<string | null>(null);
    const [pendingCertImage, setPendingCertImage] = useState<string>("");
    
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const savedData = sessionStorage.getItem("teacher_signup_form_data");
        if (savedData) {
            const parsed = JSON.parse(savedData);
            if (parsed.tutorType) setTutorType(parsed.tutorType);
            if (parsed.subjectLevels) setSubjectLevels(parsed.subjectLevels);
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

    const updateField = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }
        if (file.size > 4 * 1024 * 1024) {
            toast.error("Profile picture must be less than 4MB");
            return;
        }

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

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }
        if (file.size > 4 * 1024 * 1024) {
            toast.error("Certificate photo must be less than 4MB");
            return;
        }

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

    const handleQualCertUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }
        if (file.size > 4 * 1024 * 1024) {
            toast.error("Certificate photo must be less than 4MB");
            return;
        }

        setIsUploadingQualCert(true);
        try {
            const form = new FormData();
            form.append("file", file);
            form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
            form.append("folder", "certificates");
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: form });
            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            setFormData(prev => ({ ...prev, qualificationCertificate: data.secure_url }));
            toast.success("Qualification certificate uploaded!");
        } catch { toast.error("Upload failed."); } finally { setIsUploadingQualCert(false); }
    };

    const handleAchCertUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }
        if (file.size > 4 * 1024 * 1024) {
            toast.error("Certificate photo must be less than 4MB");
            return;
        }

        setIsUploadingAchCert(true);
        try {
            const form = new FormData();
            form.append("file", file);
            form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
            form.append("folder", "certificates");
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: form });
            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            setFormData(prev => ({ ...prev, achievementCertificate: data.secure_url }));
            toast.success("Achievement certificate uploaded!");
        } catch { toast.error("Upload failed."); } finally { setIsUploadingAchCert(false); }
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
    
    const toggleSubject = (subject: string) => {
        setFormData(prev => {
            const exists = prev.subjects.includes(subject);
            return {
                ...prev,
                subjects: exists ? prev.subjects.filter(s => s !== subject) : [...prev.subjects, subject]
            };
        });
        setSubjectLevels(prev => {
            const copy = { ...prev };
            delete copy[subject];
            return copy;
        });
    };

    // Live password validations
    const passMinLength = formData.password.length >= 6;
    const passHasNumberOrSymbol = /[0-9\W]/.test(formData.password);
    const passHasCaseTypes = /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password);

    const validateStep = (stepNum: number): boolean => {
        const newErrors: Record<string, string> = {};
        if (stepNum === 1) {
            if (!formData.name.trim()) newErrors.name = "Name is required";
            if (!formData.email.trim()) newErrors.email = "Email is required";
            else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
            if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
            if (!formData.password || formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
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
            if (!formData.education.trim()) newErrors.education = "Education qualification is required";
            if (!formData.experience.trim()) newErrors.experience = "Teaching experience details is required";
        }
        if (stepNum === 4) {
            if (formData.subjects.length === 0) {
                newErrors.subjects = "Select at least one subject you offer";
            } else if (tutorType === "teacher") {
                for (const subject of formData.subjects) {
                    const levels = subjectLevels[subject] || [];
                    if (levels.length === 0) {
                        newErrors.subjects = `Please select at least one teaching level for ${subject}`;
                        break;
                    }
                }
            }
        }
        
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            toast.error(Object.values(newErrors)[0]);
            return false;
        }
        return true;
    };

    const validateAllSteps = (): boolean => {
        const newErrors: Record<string, string> = {};
        
        // Step 1 validation
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        if (!formData.password || formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        if (!gender) {
            setStep(1);
            toast.error("Please select your gender");
            return false;
        }
        if (!securityQuestion || !securityAnswer.trim()) {
            setStep(1);
            toast.error("Please provide a security question and answer");
            return false;
        }
        if (!termsAgreed) {
            setStep(1);
            toast.error("You must agree to the Terms & Conditions and Privacy Policy");
            return false;
        }

        if (Object.keys(newErrors).length > 0) {
            setStep(1);
            setErrors(newErrors);
            toast.error(Object.values(newErrors)[0]);
            return false;
        }

        // Step 2 validation
        if (!formData.dob) newErrors.dob = "Date of birth is required";
        if (!formData.address.trim()) newErrors.address = "Address is required";

        if (Object.keys(newErrors).length > 0) {
            setStep(2);
            setErrors(newErrors);
            toast.error(Object.values(newErrors)[0]);
            return false;
        }

        // Step 3 validation
        if (!formData.education.trim()) newErrors.education = "Education qualification is required";
        if (!formData.experience.trim()) newErrors.experience = "Teaching experience details is required";

        if (Object.keys(newErrors).length > 0) {
            setStep(3);
            setErrors(newErrors);
            toast.error(Object.values(newErrors)[0]);
            return false;
        }

        // Step 4 validation
        if (formData.subjects.length === 0) newErrors.subjects = "Select at least one subject you offer";
        if (Object.keys(newErrors).length > 0) {
            setStep(4);
            setErrors(newErrors);
            toast.error(Object.values(newErrors)[0]);
            return false;
        }

        if (tutorType === "teacher") {
            for (const subject of formData.subjects) {
                const levels = subjectLevels[subject] || [];
                if (levels.length === 0) {
                    setStep(4);
                    toast.error(`Please select at least one teaching level for ${subject}`);
                    return false;
                }
            }
        }

        setErrors({});
        return true;
    };

    const nextStep = () => { if (validateStep(step)) setStep(prev => Math.min(prev + 1, 4)); };
    const prevStep = () => { setStep(prev => Math.max(prev - 1, 1)); };

    const verifyWithGoogle = async () => {
        sessionStorage.setItem("teacher_signup_form_data", JSON.stringify({
            ...formData,
            tutorType,
            subjectLevels
        }));
        signIn("google", { callbackUrl: window.location.href });
    };

    const handleSubmit = async () => {
        if (!validateAllSteps()) return;
        setLoading(true);
        try {
            const payloadSubjects = tutorType === "teacher"
                ? formData.subjects.map(subj => {
                    const levels = subjectLevels[subj] || [];
                    return `${subj} (${levels.join(", ")})`;
                  })
                : formData.subjects;

            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    subjects: payloadSubjects,
                    accountCreator: "teacher",
                    gender,
                    preferredLanguage,
                    securityQuestion,
                    securityAnswer,
                    role: "TEACHER",
                    isGoogleVerified
                })
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error || "Registration failed");
                if (data.error?.toLowerCase().includes("email")) {
                    setStep(1);
                    setErrors(prev => ({ ...prev, email: data.error }));
                } else if (data.error?.toLowerCase().includes("phone")) {
                    setStep(1);
                    setErrors(prev => ({ ...prev, phone: data.error }));
                }
                return;
            }
            setSuccess(true);
            toast.success("Tutor account registered!");
            setTimeout(async () => await signIn("credentials", { email: formData.email, password: formData.password, callbackUrl: "/teacher" }), 1500);
        } catch { toast.error("Error occurred. Please try again."); } finally { setLoading(false); }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 font-sans antialiased">
                <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md text-center border border-slate-105">
                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Tutor Account Registered!</h2>
                    <p className="text-slate-500 text-xs font-semibold mb-6">Your teacher profile application is created. Redirecting to your instructor portal...</p>
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
                        <span className="text-[15px] font-black text-slate-900 leading-none tracking-wider font-sans uppercase">
                            Aacharya
                        </span>
                        <span className="text-[8px] font-black text-slate-400 leading-none tracking-widest mt-1 uppercase">
                            Find Tutors Nearby
                        </span>
                    </div>
                </Link>
                
                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-8 text-[11px] font-black text-slate-650 uppercase tracking-wider">
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
                    <Link href="/signup" className="px-4 py-2 bg-[#ffb800] hover:bg-[#ffa000] text-slate-955 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md">
                        Sign Up
                    </Link>
                </div>
            </header>

            {/* Signup Form Container Wrapper */}
            <div className="flex-grow flex items-center justify-center p-4 sm:p-8">
                <div className="max-w-6xl w-full bg-white rounded-3xl shadow-xl overflow-hidden grid lg:grid-cols-12 min-h-[690px] border border-slate-100">
                    
                    {/* LEFT SIDEBAR: Overview & Progress Steps */}
                    <div className="lg:col-span-4 bg-[#0a1829] p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800/10 rounded-full blur-3xl pointer-events-none" />
                        
                        <div className="space-y-8">
                            {/* Blue Card block at the top */}
                            <div className="bg-[#122238]/60 border border-[#213550] rounded-2xl p-4">
                                <h2 className="text-xs font-black uppercase text-amber-400 tracking-wider">Join Aacharya</h2>
                                <h1 className="text-lg font-black text-white uppercase tracking-tight mt-1 leading-none">Instructor Portal</h1>
                                <p className="text-[10px] text-slate-400 mt-2 leading-relaxed font-bold">
                                    Register as an expert educator to connect with nearby student leads and grow your teaching practice.
                                </p>
                            </div>

                            {/* Step Wizard indicator */}
                            <div className="space-y-6 relative before:absolute before:left-4.5 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-800">
                                {STEPS.map((s) => {
                                    const isActive = step === s.id;
                                    const isDone = step > s.id;
                                    return (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => setStep(s.id)}
                                            className="flex items-start gap-4 relative z-10 text-left bg-transparent border-none cursor-pointer w-full group focus:outline-none"
                                        >
                                            <div 
                                                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all duration-300 ${
                                                    isActive 
                                                        ? "bg-amber-400 text-slate-950 shadow-lg scale-110 font-black" 
                                                        : isDone 
                                                            ? "bg-emerald-500 text-white" 
                                                            : "bg-[#122238] text-slate-500 border border-slate-700/30"
                                                } group-hover:border-amber-400/50`}
                                            >
                                                {isDone ? <CheckCircle2 className="w-5 h-5" /> : s.id}
                                            </div>
                                            <div className="pt-1">
                                                <h3 className={`text-xs font-black leading-none ${isActive ? "text-white font-black" : "text-slate-400 group-hover:text-white transition-colors"}`}>
                                                    {s.title}
                                                </h3>
                                                <p className="text-[10px] text-slate-505 mt-1 font-bold">
                                                    {s.desc}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Left bottom details block */}
                        <div className="mt-8 pt-6 border-t border-slate-900/60 space-y-4">
                            <h4 className="text-[10px] font-black text-slate-450 uppercase tracking-widest">Why Register as a Tutor?</h4>
                            <ul className="space-y-3 text-[10px] text-slate-400 font-bold">
                                <li className="flex items-start gap-2.5">
                                    <Star className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                    <span>Receive real-time student inquiries matching your subjects</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <Users className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                    <span>Keep 100% of your earnings with zero platform cuts</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                    <span>Verified instructor profile check boosts parent trust</span>
                                </li>
                            </ul>

                            <div className="flex items-center gap-2 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-[9px] font-bold text-emerald-400 mt-2">
                                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-500" />
                                <span>Verification is simple and takes less than 24 hours.</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Form steps container */}
                    <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between">
                        
                        {/* Header Details with cartoon uploader mockup */}
                        <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-slate-100 pb-4 mb-6 items-start">
                            <div className="space-y-1">
                                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Create Instructor Profile</h1>
                                <p className="text-[10px] text-slate-500 font-bold leading-normal max-w-md">
                                    Provide your contact, credentials and classes details to get verified as a premier tutor on our network.
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-3 self-end sm:self-center">
                                <button
                                    type="button"
                                    onClick={async () => {
                                        if (session) {
                                            await signOut({ redirect: false });
                                        }
                                        setFormData({
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
                                            certifications: [],
                                            subjects: [],
                                            qualificationCertificate: "",
                                            achievementCertificate: "",
                                        });
                                        setTutorType("teacher");
                                        setSubjectLevels({});
                                        setIsGoogleVerified(false);
                                        setGender("");
                                        setSecurityQuestion("");
                                        setSecurityAnswer("");
                                        setTermsAgreed(false);
                                        setStep(1);
                                        setErrors({});
                                        toast.success("Form cleared successfully!");
                                    }}
                                    className="px-3.5 py-1.5 border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 transition-colors font-bold text-[10px] uppercase tracking-wider cursor-pointer shadow-sm bg-white"
                                >
                                    Reset Form
                                </button>
                                <div className="hidden sm:flex items-center gap-2 relative">
                                    <div className="w-20 h-14 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 border overflow-hidden">
                                        <img src="https://cdn-icons-png.flaticon.com/512/2941/2941658.png" alt="illustration" className="w-10 h-10 object-contain" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[8px] font-black">✓</div>
                                </div>
                            </div>
                        </div>

                        {/* STEP 1: Account Details */}
                        {step === 1 && (
                            <div className="space-y-5">
                                <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                                    <span className="w-5 h-5 rounded-full bg-[#0a1829] text-white text-[10px] font-black flex items-center justify-center">1</span>
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Account Details</h3>
                                    <span className="text-[10px] text-slate-400 font-bold ml-1">• Basic login credentials</span>
                                </div>

                                <div className="space-y-2 text-left">
                                    <label className="block text-[11px] font-black text-slate-450 uppercase tracking-wider">Account Type *</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setTutorType("teacher")}
                                            className={cn(
                                                "p-4 border rounded-2xl font-bold text-xs transition-all flex flex-col items-start gap-2 cursor-pointer text-left shadow-sm bg-white w-full",
                                                tutorType === "teacher" 
                                                    ? "border-amber-400 bg-amber-50/10 text-slate-900 ring-2 ring-amber-400/20" 
                                                    : "border-slate-200 text-slate-650 hover:bg-slate-50"
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0", tutorType === "teacher" ? "border-amber-500 bg-amber-500" : "border-slate-250")}>
                                                    {tutorType === "teacher" && <Check className="w-3 h-3 text-slate-950 stroke-[3]" />}
                                                </div>
                                                <span className="font-extrabold uppercase tracking-wider text-[10px]">Academic Teacher</span>
                                            </div>
                                            <p className="text-[9px] text-slate-450 leading-snug">Teaches school subjects (Maths, Science, etc.) with level selection.</p>
                                        </button>
                                        
                                        <button
                                            type="button"
                                            onClick={() => setTutorType("coach")}
                                            className={cn(
                                                "p-4 border rounded-2xl font-bold text-xs transition-all flex flex-col items-start gap-2 cursor-pointer text-left shadow-sm bg-white w-full",
                                                tutorType === "coach" 
                                                    ? "border-amber-400 bg-amber-50/10 text-slate-900 ring-2 ring-amber-400/20" 
                                                    : "border-slate-200 text-slate-650 hover:bg-slate-50"
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0", tutorType === "coach" ? "border-amber-500 bg-amber-500" : "border-slate-250")}>
                                                    {tutorType === "coach" && <Check className="w-3 h-3 text-slate-950 stroke-[3]" />}
                                                </div>
                                                <span className="font-extrabold uppercase tracking-wider text-[10px]">Activity Coach</span>
                                            </div>
                                            <p className="text-[9px] text-slate-450 leading-snug">Trains in co-curricular areas (Chess, Music, Yoga, etc.). No level required.</p>
                                        </button>
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    {/* Full Name */}
                                    <div className="space-y-1.5 text-left">
                                        <label className="block text-[11px] font-black text-slate-450 uppercase tracking-wider">Full Name *</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => updateField("name", e.target.value)}
                                                className="w-full pl-9 pr-4 py-2.5 text-xs font-bold border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-slate-50/50"
                                                placeholder="e.g. Dr. Rajesh Sharma"
                                            />
                                        </div>
                                        {errors.name && <p className="text-red-500 text-[10px] font-bold">{errors.name}</p>}
                                    </div>

                                    {/* Gender */}
                                    <div className="space-y-1.5 text-left">
                                        <label className="block text-[11px] font-black text-slate-450 uppercase tracking-wider">Gender *</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setGender("male")}
                                                className={cn(
                                                    "py-2.5 border rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer",
                                                    gender === "male" ? "border-amber-400 bg-amber-50/15 text-slate-900" : "border-slate-200 text-slate-650 hover:bg-slate-50"
                                                )}
                                            >
                                                <span>♂</span> Male
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setGender("female")}
                                                className={cn(
                                                    "py-2.5 border rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer",
                                                    gender === "female" ? "border-amber-400 bg-amber-50/15 text-slate-900" : "border-slate-200 text-slate-650 hover:bg-slate-50"
                                                )}
                                            >
                                                <span>♀</span> Female
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setGender("other")}
                                                className={cn(
                                                    "py-2.5 border rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer",
                                                    gender === "other" ? "border-amber-400 bg-amber-50/15 text-slate-900" : "border-slate-200 text-slate-650 hover:bg-slate-50"
                                                )}
                                            >
                                                <span>⚦</span> Other
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    {/* Phone Number */}
                                    <div className="space-y-1.5 text-left">
                                        <label className="block text-[11px] font-black text-slate-450 uppercase tracking-wider">Mobile Number *</label>
                                        <div className="flex border border-slate-200 rounded-xl overflow-hidden focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 bg-slate-50/50">
                                            <div className="flex items-center gap-1 px-3 py-2.5 border-r border-slate-200 bg-slate-100 text-xs font-bold text-slate-700 shrink-0">
                                                <span>🇮🇳</span>
                                                <span>+91</span>
                                            </div>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => updateField("phone", e.target.value)}
                                                className="w-full px-3.5 py-2.5 text-xs font-bold bg-transparent outline-none border-none"
                                                placeholder="98765 43210"
                                            />
                                        </div>
                                        {errors.phone && <p className="text-red-500 text-[10px] font-bold">{errors.phone}</p>}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1.5 text-left flex flex-col">
                                        <label className="block text-[11px] font-black text-slate-450 uppercase tracking-wider">Email Address *</label>
                                        <div className="flex gap-2 w-full">
                                            <div className="relative flex-1">
                                                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => updateField("email", e.target.value)}
                                                    className="w-full pl-9 pr-4 py-2.5 text-xs font-bold border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-slate-50/50"
                                                    placeholder="rajesh@aacharya.net"
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
                                        {isGoogleVerified && (
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    await signOut({ redirect: false });
                                                    setIsGoogleVerified(false);
                                                    setFormData(prev => ({ ...prev, email: "" }));
                                                }}
                                                className="text-[10px] text-red-500 font-bold hover:underline bg-transparent border-none cursor-pointer mt-1 self-start"
                                            >
                                                Not you? Register with another email address (Sign out)
                                            </button>
                                        )}
                                        {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.email}</p>}
                                    </div>
                                </div>

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
                                                className="w-full pl-9 pr-9 py-2.5 text-xs font-bold border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-slate-50/50"
                                                placeholder="Enter password"
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-650 bg-transparent border-none">
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        {errors.password && <p className="text-red-500 text-[10px] font-bold">{errors.password}</p>}
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
                                                className="w-full pl-9 pr-9 py-2.5 text-xs font-bold border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-slate-50/50"
                                                placeholder="Confirm password"
                                            />
                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-650 bg-transparent border-none">
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

                                {/* Security Question */}
                                <div className="grid sm:grid-cols-2 gap-4">
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

                                {/* Terms agreement checkbox */}
                                <div className="flex items-start gap-2.5 text-left py-1">
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
                                <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                                    <span className="w-5 h-5 rounded-full bg-[#0a1829] text-white text-[10px] font-black flex items-center justify-center">2</span>
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Location & Profile</h3>
                                    <span className="text-[10px] text-slate-400 font-bold ml-1">• Find nearby student requests</span>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5 text-left">
                                        <label className="block text-[11px] font-black text-slate-450 uppercase tracking-wider">Date of Birth *</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                            <input
                                                type="date"
                                                value={formData.dob}
                                                onChange={(e) => updateField("dob", e.target.value)}
                                                className="w-full pl-9 pr-4 py-2.5 text-xs font-bold border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-slate-50/50"
                                            />
                                        </div>
                                        {errors.dob && <p className="text-red-500 text-[10px] font-bold">{errors.dob}</p>}
                                    </div>

                                    <div className="space-y-1.5 text-left">
                                        <label className="block text-[11px] font-black text-slate-450 uppercase tracking-wider">Preferred Teaching Language</label>
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

                                <div className="space-y-1.5 text-left">
                                    <label className="block text-[11px] font-black text-slate-450 uppercase tracking-wider">📍 Teaching Address / Center Location *</label>
                                    <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-inner">
                                        <MapLocationPicker
                                            onLocationSelect={(loc) => {
                                                updateField("address", loc.address);
                                            }}
                                            initialAddress={formData.address}
                                            accentColor="amber"
                                            height="200px"
                                        />
                                    </div>
                                    {errors.address && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.address}</p>}
                                </div>

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
                                    <input ref={profileInputRef} type="file" accept="image/*" onChange={handleProfilePhotoUpload} className="hidden" />
                                </div>
                            </div>
                        )}

                        {/* STEP 3: Qualifications */}
                        {step === 3 && (
                            <div className="space-y-5">
                                <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                                    <span className="w-5 h-5 rounded-full bg-[#0a1829] text-white text-[10px] font-black flex items-center justify-center">3</span>
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Qualifications</h3>
                                    <span className="text-[10px] text-slate-400 font-bold ml-1">• Academic certifications</span>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    {/* Education */}
                                    <div className="space-y-1.5 text-left">
                                        <label className="block text-[11px] font-black text-slate-450 uppercase tracking-wider">Highest Qualification *</label>
                                        <div className="relative">
                                            <GraduationCap className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                            <input
                                                type="text"
                                                value={formData.education}
                                                onChange={(e) => updateField("education", e.target.value)}
                                                className="w-full pl-9 pr-4 py-2.5 text-xs font-bold border border-slate-200 rounded-xl outline-none bg-slate-50/50"
                                                placeholder="e.g. M.Sc Physics / B.Tech"
                                            />
                                        </div>
                                    </div>

                                    {/* Experience */}
                                    <div className="space-y-1.5 text-left">
                                        <label className="block text-[11px] font-black text-slate-450 uppercase tracking-wider">Teaching Experience *</label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                            <input
                                                type="text"
                                                value={formData.experience}
                                                onChange={(e) => updateField("experience", e.target.value)}
                                                className="w-full pl-9 pr-4 py-2.5 text-xs font-bold border border-slate-200 rounded-xl outline-none bg-slate-50/50"
                                                placeholder="e.g. 5 Years Experience"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Qualification Certificate Upload */}
                                <div className="space-y-1.5 text-left">
                                    <label className="block text-[11px] font-black text-slate-455 uppercase tracking-wider">Highest Qualification Certificate Document</label>
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                        <div
                                            className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-250 cursor-pointer hover:border-amber-500 hover:bg-slate-55/40 transition-all overflow-hidden shrink-0 shadow-sm"
                                            onClick={() => qualCertInputRef.current?.click()}
                                        >
                                            {isUploadingQualCert ? (
                                                <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
                                            ) : formData.qualificationCertificate ? (
                                                <img src={formData.qualificationCertificate} alt="Qualification Certificate" className="w-full h-full object-cover" />
                                            ) : (
                                                <Upload className="w-5 h-5 text-slate-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <button
                                                type="button"
                                                onClick={() => qualCertInputRef.current?.click()}
                                                disabled={isUploadingQualCert}
                                                className="px-4 py-2 bg-white text-slate-700 text-[10px] font-black rounded-xl hover:bg-slate-50 transition-colors border border-slate-200 disabled:opacity-50 flex items-center gap-1.5 shadow-sm cursor-pointer"
                                            >
                                                {isUploadingQualCert ? "Uploading..." : formData.qualificationCertificate ? "Change Certificate" : "Upload Certificate"}
                                            </button>
                                            <p className="text-[9px] text-slate-400 mt-1 font-bold">JPG, PNG or WebP. Max 4MB.</p>
                                        </div>
                                        {formData.qualificationCertificate && (
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, qualificationCertificate: "" }))}
                                                className="p-1 hover:text-red-500 transition-colors border-none bg-transparent cursor-pointer"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <input ref={qualCertInputRef} type="file" accept="image/*" onChange={handleQualCertUpload} className="hidden" />
                                </div>

                                {/* Achievement Certificate Upload */}
                                <div className="space-y-1.5 text-left">
                                    <label className="block text-[11px] font-black text-slate-455 uppercase tracking-wider">Achievements Certificate Document (Optional)</label>
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                        <div
                                            className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-250 cursor-pointer hover:border-amber-500 hover:bg-slate-55/40 transition-all overflow-hidden shrink-0 shadow-sm"
                                            onClick={() => achCertInputRef.current?.click()}
                                        >
                                            {isUploadingAchCert ? (
                                                <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
                                            ) : formData.achievementCertificate ? (
                                                <img src={formData.achievementCertificate} alt="Achievement Certificate" className="w-full h-full object-cover" />
                                            ) : (
                                                <Upload className="w-5 h-5 text-slate-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <button
                                                type="button"
                                                onClick={() => achCertInputRef.current?.click()}
                                                disabled={isUploadingAchCert}
                                                className="px-4 py-2 bg-white text-slate-700 text-[10px] font-black rounded-xl hover:bg-slate-50 transition-colors border border-slate-200 disabled:opacity-50 flex items-center gap-1.5 shadow-sm cursor-pointer"
                                            >
                                                {isUploadingAchCert ? "Uploading..." : formData.achievementCertificate ? "Change Certificate" : "Upload Certificate"}
                                            </button>
                                            <p className="text-[9px] text-slate-400 mt-1 font-bold">JPG, PNG or WebP. Max 4MB.</p>
                                        </div>
                                        {formData.achievementCertificate && (
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, achievementCertificate: "" }))}
                                                className="p-1 hover:text-red-500 transition-colors border-none bg-transparent cursor-pointer"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <input ref={achCertInputRef} type="file" accept="image/*" onChange={handleAchCertUpload} className="hidden" />
                                </div>

                                {/* Certification Uploader Card Widget */}
                                <div className="space-y-2.5 text-left">
                                    <label className="block text-[11px] font-black text-slate-450 uppercase tracking-wider">Certifications & Achievements (Optional)</label>
                                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
                                        
                                        {/* Certification Name Input */}
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={certInput}
                                                onChange={(e) => setCertInput(e.target.value)}
                                                placeholder="e.g. Google Educator Certified"
                                                className="w-full px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl outline-none bg-white"
                                            />
                                            
                                            {/* Cert image upload trigger button */}
                                            <button
                                                type="button"
                                                onClick={() => certImageInputRef.current?.click()}
                                                className="px-3 py-2 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-center shrink-0"
                                                title="Upload Certificate Image"
                                            >
                                                {isUploadingCertImage ? (
                                                    <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                                                ) : pendingCertImage ? (
                                                    <Check className="w-4 h-4 text-emerald-500" />
                                                ) : (
                                                    <ImageIcon className="w-4 h-4" />
                                                )}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={addCertification}
                                                className="px-4 py-2 bg-[#0a1829] hover:bg-amber-500 hover:text-slate-900 text-white text-[10px] font-black rounded-xl uppercase tracking-wider cursor-pointer border-none shrink-0"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        
                                        <input ref={certImageInputRef} type="file" accept="image/*" onChange={handleCertImageUpload} className="hidden" />

                                        {/* Certifications Added Grid */}
                                        {formData.certifications.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {formData.certifications.map((cert, cIdx) => (
                                                    <div key={cIdx} className="flex items-center justify-between p-2.5 bg-white border border-slate-100 rounded-xl shadow-sm text-xs font-bold text-slate-700">
                                                        <div className="flex items-center gap-2 truncate">
                                                            <Award className="w-4 h-4 text-amber-500 shrink-0" />
                                                            <span className="truncate">{cert.text}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeCertification(cert.text)}
                                                            className="text-slate-350 hover:text-red-500 border-none bg-transparent cursor-pointer"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-[10px] text-slate-400 font-bold italic text-center">No certifications added yet.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 4: Subjects Offered */}
                        {step === 4 && (
                            <div className="space-y-5">
                                <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                                    <span className="w-5 h-5 rounded-full bg-[#0a1829] text-white text-[10px] font-black flex items-center justify-center">4</span>
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Subjects Offered</h3>
                                    <span className="text-[10px] text-slate-400 font-bold ml-1">• Choose subjects you teach</span>
                                </div>

                                <div className="space-y-1.5 text-left">
                                    <p className="text-xs text-slate-500 font-bold mb-2">Select the subjects or activities you are qualified to tutor:</p>
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

                                    {/* Subjects Level Section (Only for academic teacher) */}
                                    {formData.subjects.length > 0 && tutorType === "teacher" && (
                                        <div className="mt-6 border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-3 text-left">
                                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Specify levels for selected subjects:</h4>
                                            <div className="overflow-x-auto max-h-[250px] pr-1">
                                                <table className="w-full text-left text-xs border-collapse">
                                                    <thead>
                                                        <tr className="border-b border-slate-200 text-slate-400 font-black uppercase tracking-wider text-[10px]">
                                                            <th className="py-2 pr-4">Subject</th>
                                                            <th className="py-2 px-2 text-center w-20">Pre-Primary</th>
                                                            <th className="py-2 px-2 text-center w-20">Primary</th>
                                                            <th className="py-2 px-2 text-center w-20">High School</th>
                                                            <th className="py-2 px-2 text-center w-20">Secondary</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100 font-bold">
                                                        {formData.subjects.map((subj) => {
                                                            const baseSubj = subj.split(" (")[0];
                                                            const levels = subjectLevels[baseSubj] || [];
                                                            return (
                                                                <tr key={baseSubj} className="hover:bg-slate-100/50 transition-colors">
                                                                    <td className="py-3 pr-4 font-extrabold text-slate-900">{baseSubj}</td>
                                                                    {["Pre-Primary", "Primary", "High School", "Secondary School"].map((level) => {
                                                                        const checked = levels.includes(level);
                                                                        return (
                                                                            <td key={level} className="py-3 px-2 text-center">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={checked}
                                                                                    onChange={() => {
                                                                                        const currentLevels = subjectLevels[baseSubj] || [];
                                                                                        const nextLevels = currentLevels.includes(level)
                                                                                            ? currentLevels.filter((l) => l !== level)
                                                                                            : [...currentLevels, level];
                                                                                        setSubjectLevels((prev) => ({
                                                                                            ...prev,
                                                                                            [baseSubj]: nextLevels,
                                                                                        }));
                                                                                    }}
                                                                                    className="w-4.5 h-4.5 text-amber-500 rounded border-slate-300 focus:ring-amber-500 cursor-pointer"
                                                                                />
                                                                            </td>
                                                                        );
                                                                    })}
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Bottom Wizard Controls */}
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

                            {step < 4 ? (
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
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                            <h4 className="text-[10px] font-black text-slate-900 uppercase">100% Safe & Secure</h4>
                            <p className="text-[8px] text-slate-400 font-bold leading-none mt-0.5">Your data is fully encrypted</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                            <Users className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                            <h4 className="text-[10px] font-black text-slate-900 uppercase">Trusted by Thousands</h4>
                            <p className="text-[8px] text-slate-400 font-bold leading-none mt-0.5">Students across all cities</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                            <GraduationCap className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                            <h4 className="text-[10px] font-black text-slate-900 uppercase">Verified Tutors</h4>
                            <p className="text-[8px] text-slate-400 font-bold leading-none mt-0.5">Manually audited background check</p>
                        </div>
                    </div>
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
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm text-slate-500 mb-2">
                                <Search className="w-4 h-4" />
                            </div>
                            <h4 className="font-extrabold text-slate-900">1. Complete Profile</h4>
                            <p className="text-[9px] text-slate-450 mt-1 leading-relaxed max-w-[150px]">Add education details, certificates and subjects.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm text-slate-500 mb-2">
                                <Users className="w-4 h-4" />
                            </div>
                            <h4 className="font-extrabold text-slate-900">2. Review & Approve</h4>
                            <p className="text-[9px] text-slate-450 mt-1 leading-relaxed max-w-[150px]">Our verification team approves your profile in 24 hours.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm text-slate-500 mb-2">
                                <Calendar className="w-4 h-4" />
                            </div>
                            <h4 className="font-extrabold text-slate-900">3. Receive Leads</h4>
                            <p className="text-[9px] text-slate-450 mt-1 leading-relaxed max-w-[150px]">Get immediate notifications for students requesting your subjects.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm text-slate-500 mb-2">
                                <TrendingUp className="w-4 h-4" />
                            </div>
                            <h4 className="font-extrabold text-slate-900">4. Start Tutoring</h4>
                            <p className="text-[9px] text-slate-450 mt-1 leading-relaxed max-w-[150px]">Schedule sessions and grow your educational center.</p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200/60 max-w-sm mx-auto text-xs font-bold text-slate-550">
                        <span>Already have an account? </span>
                        <Link href="/login" className="text-amber-600 hover:underline font-black">Login here</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
