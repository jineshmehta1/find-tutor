"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import {
    User, ArrowLeft, ArrowRight, Mail, Phone, Calendar, MapPin,
    BookOpen, GraduationCap, Award, Briefcase, Camera, Plus, X,
    Loader2, CheckCircle2, Upload, ImageIcon
} from "lucide-react";
import { toast } from "sonner";
const CLOUDINARY_CLOUD_NAME = "dx2o9yq2t";
const CLOUDINARY_UPLOAD_PRESET = "gallery"; // or create a "profiles" preset
const SUBJECTS = [
    "Mathematics", "Physics", "Chemistry", "Biology", "English",
    "Hindi", "History", "Geography", "Computer Science", "Economics",
    "Accountancy", "Business Studies", "Political Science", "Psychology",
    "Sociology", "Sanskrit", "French", "German", "Music", "Art"
];

interface Certification {
    text: string;
    image?: string;
}

export default function TeacherSignupPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const profileInputRef = useRef<HTMLInputElement>(null);
    const certImageInputRef = useRef<HTMLInputElement>(null);

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
        education: "",
        experience: "",
        certifications: [] as Certification[],
        subjects: [] as string[],
        otp: "",
    });

    const [otpSent, setOtpSent] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);
    const [isOtpSending, setIsOtpSending] = useState(false);
    const [isUploadingProfile, setIsUploadingProfile] = useState(false);
    const [isUploadingCertImage, setIsUploadingCertImage] = useState(false);

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
        const form = new FormData();
        form.append("file", file);
        form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        form.append("folder", "profiles");

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: form,
            }
        );

        if (!res.ok) throw new Error("Upload failed");

        const data = await res.json();

        setFormData((prev) => ({
            ...prev,
            profilePhoto: data.secure_url,
        }));

        toast.success("Profile photo uploaded!");
    } catch {
        toast.error("Upload failed. Please try again.");
    } finally {
        setIsUploadingProfile(false);
    }
};

    // Handle certification image upload
    const handleCertImageUpload = async (
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

    setIsUploadingCertImage(true);

    // Local preview immediately
    const reader = new FileReader();
    reader.onload = (ev) =>
        setCertImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    try {
        const form = new FormData();
        form.append("file", file);
        form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        form.append("folder", "certificates");

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: form,
            }
        );

        if (!res.ok) throw new Error("Upload failed");

        const data = await res.json();

        setPendingCertImage(data.secure_url);
        toast.success("Certificate image uploaded!");
    } catch {
        toast.error("Upload failed. Please try again.");
        setCertImagePreview(null);
    } finally {
        setIsUploadingCertImage(false);
    }
};

    const addCertification = () => {
        if (certInput.trim()) {
            const newCert: Certification = {
                text: certInput.trim(),
                image: pendingCertImage || undefined,
            };
            // Check for duplicate text
            if (!formData.certifications.some((c) => c.text === newCert.text)) {
                setFormData((prev) => ({
                    ...prev,
                    certifications: [...prev.certifications, newCert],
                }));
            }
            setCertInput("");
            setPendingCertImage("");
            setCertImagePreview(null);
            // Reset the file input
            if (certImageInputRef.current) {
                certImageInputRef.current.value = "";
            }
        }
    };

    const removeCertification = (text: string) => {
        setFormData((prev) => ({
            ...prev,
            certifications: prev.certifications.filter((c) => c.text !== text),
        }));
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
            if (otpSent && !formData.otp.trim()) newErrors.otp = "OTP is required";
            if (!otpSent && formData.email && !/\S+@\S+\.\S+/.test(formData.email) === false) newErrors.otp = "Please verify your email first";

            if (!formData.phone.trim()) newErrors.phone = "Phone is required";
            else if (formData.phone.length < 10) newErrors.phone = "Invalid phone number";
            if (!formData.password) newErrors.password = "Password is required";
            else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
            if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
        }

        if (stepNum === 2) {
            if (!formData.dob) newErrors.dob = "Date of birth is required";
            if (!formData.address.trim()) newErrors.address = "Address is required";
        }

        if (stepNum === 3) {
            if (!formData.education.trim()) newErrors.education = "Education is required";
            if (!formData.experience.trim()) newErrors.experience = "Experience is required";
            if (formData.certifications.length === 0) newErrors.certifications = "At least one certification is required";
        }

        if (stepNum === 4) {
            if (formData.subjects.length === 0) newErrors.subjects = "Select at least one subject";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep((prev) => Math.min(prev + 1, 4));
        }
    };

    const prevStep = () => {
        setStep((prev) => Math.max(prev - 1, 1));
    };

    const sendOtp = async () => {
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
            setErrors(prev => ({ ...prev, email: "Please enter a valid email first" }));
            return;
        }

        setIsOtpSending(true);
        try {
            const res = await fetch("/api/auth/otp/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email }),
            });
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Failed to send OTP");
                return;
            }

            toast.success("OTP sent to your email!");
            setOtpSent(true);
            setOtpTimer(60);

            // Start timer
            const interval = setInterval(() => {
                setOtpTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

        } catch (error) {
            toast.error("Failed to send OTP. Please try again.");
        } finally {
            setIsOtpSending(false);
        }
    };

    const handleSubmit = async () => {
        if (!validateStep(4)) return;

        setLoading(true);
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    role: "TEACHER",
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Registration failed");
                return;
            }

            setSuccess(true);
            toast.success("Registration successful!");

            // Auto login
            setTimeout(async () => {
                await signIn("credentials", {
                    email: formData.email,
                    password: formData.password,
                    callbackUrl: "/teacher",
                });
            }, 2000);
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-amber-50 p-4">
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Registration Successful!</h2>
                    <p className="text-slate-500 mb-4">
                        Your account is pending admin approval. You&apos;ll be redirected to your dashboard shortly.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-amber-600">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Redirecting...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-amber-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Back Link */}
                <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to role selection
                </Link>

                {/* Header */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                                <User className="w-7 h-7" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Teacher Registration</h1>
                                <p className="text-amber-100">Step {step} of 4</p>
                            </div>
                        </div>
                        {/* Progress Bar */}
                        <div className="mt-6 h-2 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white transition-all duration-500 rounded-full"
                                style={{ width: `${(step / 4) * 100}%` }}
                            />
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Step 1: Basic Info */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h2>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => updateField("name", e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 border ${errors.name ? 'border-red-300' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-slate-50/50`}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => updateField("email", e.target.value)}
                                                className={`w-full pl-10 pr-4 py-3 border ${errors.email ? 'border-red-300' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-slate-50/50`}
                                                placeholder="john@example.com"
                                                disabled={otpSent}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={sendOtp}
                                            disabled={isOtpSending || otpTimer > 0 || !formData.email}
                                            className="px-4 py-3 bg-amber-100 text-amber-700 font-medium rounded-xl hover:bg-amber-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                        >
                                            {isOtpSending ? <Loader2 className="w-5 h-5 animate-spin" /> : otpTimer > 0 ? `Resend in ${otpTimer}s` : otpSent ? "Resend OTP" : "Verify Email"}
                                        </button>
                                    </div>
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>

                                {otpSent && (
                                    <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Enter Verification Code</label>
                                        <input
                                            type="text"
                                            value={formData.otp}
                                            onChange={(e) => updateField("otp", e.target.value)}
                                            className={`w-full px-4 py-3 border ${errors.otp ? 'border-red-300' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-slate-50/50 tracking-widest text-center text-lg`}
                                            placeholder="••••••"
                                            maxLength={6}
                                        />
                                        {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
                                        <p className="text-xs text-slate-500 mt-2">
                                            We sent a 6-digit code to <span className="font-medium text-slate-900">{formData.email}</span>
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => updateField("phone", e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 border ${errors.phone ? 'border-red-300' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-slate-50/50`}
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => updateField("password", e.target.value)}
                                            className={`w-full px-4 py-3 border ${errors.password ? 'border-red-300' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-slate-50/50`}
                                            placeholder="••••••••"
                                        />
                                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                                        <input
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => updateField("confirmPassword", e.target.value)}
                                            className={`w-full px-4 py-3 border ${errors.confirmPassword ? 'border-red-300' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-slate-50/50`}
                                            placeholder="••••••••"
                                        />
                                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Personal Details */}
                        {step === 2 && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-slate-900 mb-4">Personal Details</h2>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <input
                                            type="date"
                                            value={formData.dob}
                                            onChange={(e) => updateField("dob", e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 border ${errors.dob ? 'border-red-300' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-slate-50/50`}
                                        />
                                    </div>
                                    {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <textarea
                                            value={formData.address}
                                            onChange={(e) => updateField("address", e.target.value)}
                                            rows={3}
                                            className={`w-full pl-10 pr-4 py-3 border ${errors.address ? 'border-red-300' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-slate-50/50 resize-none`}
                                            placeholder="Enter your complete address"
                                        />
                                    </div>
                                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                                </div>

                                {/* Profile Photo Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Profile Photo (Optional)</label>
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-300 cursor-pointer hover:border-amber-400 hover:bg-amber-50/50 transition-all overflow-hidden"
                                            onClick={() => profileInputRef.current?.click()}
                                        >
                                            {isUploadingProfile ? (
                                                <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                                            ) : formData.profilePhoto ? (
                                                <img src={formData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <Camera className="w-8 h-8 text-slate-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <button
                                                type="button"
                                                onClick={() => profileInputRef.current?.click()}
                                                disabled={isUploadingProfile}
                                                className="px-4 py-2.5 bg-amber-50 text-amber-700 font-medium rounded-xl hover:bg-amber-100 transition-colors border border-amber-200 disabled:opacity-50 flex items-center gap-2"
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
                                            <p className="text-xs text-slate-500 mt-1.5">JPG, PNG or WebP. Max 4MB.</p>
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

                        {/* Step 3: Qualifications */}
                        {step === 3 && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-slate-900 mb-4">Qualifications</h2>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Education</label>
                                    <div className="relative">
                                        <GraduationCap className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={formData.education}
                                            onChange={(e) => updateField("education", e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 border ${errors.education ? 'border-red-300' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-slate-50/50`}
                                            placeholder="e.g., M.Sc. Mathematics, B.Ed."
                                        />
                                    </div>
                                    {errors.education && <p className="text-red-500 text-sm mt-1">{errors.education}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Experience</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={formData.experience}
                                            onChange={(e) => updateField("experience", e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 border ${errors.experience ? 'border-red-300' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-slate-50/50`}
                                            placeholder="e.g., 5 years teaching in schools"
                                        />
                                    </div>
                                    {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
                                </div>

                                {/* Certifications with Image Support */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Certifications</label>
                                    <div className="space-y-3 mb-3">
                                        {/* Certification text input */}
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Award className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                                <input
                                                    type="text"
                                                    value={certInput}
                                                    onChange={(e) => setCertInput(e.target.value)}
                                                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCertification())}
                                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-slate-50/50"
                                                    placeholder="Add a certification"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => certImageInputRef.current?.click()}
                                                disabled={isUploadingCertImage}
                                                className="px-3 py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors border border-slate-200 disabled:opacity-50"
                                                title="Attach certificate image"
                                            >
                                                {isUploadingCertImage ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <ImageIcon className="w-5 h-5" />
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={addCertification}
                                                disabled={!certInput.trim()}
                                                className="px-4 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {/* Certificate image preview (pending) */}
                                        {certImagePreview && (
                                            <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-xl border border-amber-200">
                                                <img src={certImagePreview} alt="Certificate" className="w-12 h-12 rounded-lg object-cover" />
                                                <span className="text-xs text-amber-700 flex-1">Certificate image attached</span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setCertImagePreview(null);
                                                        setPendingCertImage("");
                                                        if (certImageInputRef.current) certImageInputRef.current.value = "";
                                                    }}
                                                    className="p-1 text-amber-500 hover:text-red-500 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}

                                        <input
                                            ref={certImageInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleCertImageUpload}
                                            className="hidden"
                                        />
                                    </div>

                                    {errors.certifications && <p className="text-red-500 text-sm mb-2">{errors.certifications}</p>}

                                    {/* Added certifications list */}
                                    <div className="space-y-2">
                                        {formData.certifications.map((cert) => (
                                            <div
                                                key={cert.text}
                                                className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl"
                                            >
                                                {cert.image && (
                                                    <img src={cert.image} alt={cert.text} className="w-10 h-10 rounded-lg object-cover border border-amber-300" />
                                                )}
                                                <span className="flex-1 text-sm font-medium text-amber-800">{cert.text}</span>
                                                <button type="button" onClick={() => removeCertification(cert.text)} className="p-1 text-amber-500 hover:text-red-500 transition-colors">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Subjects */}
                        {step === 4 && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-slate-900 mb-2">Select Subjects You Teach</h2>
                                <p className="text-slate-500 text-sm mb-4">Choose all subjects you are qualified to teach</p>

                                {errors.subjects && <p className="text-red-500 text-sm mb-2">{errors.subjects}</p>}

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {SUBJECTS.map((subject) => {
                                        const isSelected = formData.subjects.includes(subject);
                                        return (
                                            <button
                                                key={subject}
                                                type="button"
                                                onClick={() => toggleSubject(subject)}
                                                className={`p-3 rounded-xl border-2 text-left transition-all ${isSelected
                                                    ? "border-amber-500 bg-amber-50 text-amber-700"
                                                    : "border-slate-200 hover:border-slate-300 text-slate-600"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-amber-500 bg-amber-500" : "border-slate-300"
                                                        }`}>
                                                        {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                                                    </div>
                                                    <span className="text-sm font-medium">{subject}</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
                            {step > 1 ? (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="flex items-center gap-2 px-6 py-3 text-slate-600 hover:text-slate-900 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Previous
                                </button>
                            ) : (
                                <div />
                            )}

                            {step < 4 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/30"
                                >
                                    Next
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg shadow-green-500/30 disabled:opacity-50"
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
        </div>
    );
}
