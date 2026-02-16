"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    CalendarIcon,
    Clock,
    MapPin,
    Users,
    Trophy,
    Phone,
    Mail,
    ArrowLeft,
    CheckCircle,
    Sparkles,
    CreditCard,
    Shield,
    Loader2,
} from "lucide-react"
import { format } from "date-fns"

interface EventData {
    id: number;
    slug: string;
    title: string;
    category: string;
    date: string;
    time: string;
    endDate: string;
    location: string;
    address: string;
    participants: string;
    prize: string;
    description: string;
    longDescription: string;
    image: string;
    status: string;
    registrationFee: number;
    registrationFeeDisplay: string;
    features: string;
    organizer: string;
    contact: string;
}

declare global {
    interface Window {
        Razorpay: any
    }
}

export default function EventDetailPage() {
    const params = useParams()
    const slug = params.slug as string

    const [event, setEvent] = useState<EventData | null>(null)
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        age: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const [paymentSuccess, setPaymentSuccess] = useState(false)
    const [razorpayLoaded, setRazorpayLoaded] = useState(false)

    // Fetch event from API
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await fetch("/api/events")
                if (!res.ok) throw new Error("Failed to fetch")
                const data = await res.json()
                const found = (Array.isArray(data) ? data : []).find((e: EventData) => e.slug === slug)
                setEvent(found || null)
            } catch (error) {
                console.error("Failed to load event:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchEvent()
    }, [slug])

    // Load Razorpay script
    useEffect(() => {
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.async = true
        script.onload = () => setRazorpayLoaded(true)
        document.body.appendChild(script)

        return () => {
            document.body.removeChild(script)
        }
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
        )
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-black text-slate-900 mb-4">Event Not Found</h1>
                    <p className="text-slate-600 mb-8 font-medium">The event you're looking for doesn't exist.</p>
                    <Link href="/events">
                        <button className="bg-[#fbbc05] hover:bg-[#f97316] text-slate-900 hover:text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 mx-auto">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Events
                        </button>
                    </Link>
                </div>
            </div>
        )
    }

    const parseFeatures = (features: string): string[] => {
        try { return JSON.parse(features); } catch { return []; }
    }

    const eventFeatures = parseFeatures(event.features)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handlePayment = async () => {
        if (!formData.name || !formData.email || !formData.phone) {
            alert("Please fill in all required fields")
            return
        }

        if (!razorpayLoaded) {
            alert("Payment system is loading. Please try again.")
            return
        }

        setIsLoading(true)

        try {
            // Create order on backend
            const response = await fetch("/api/razorpay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: event.registrationFee,
                    eventName: event.title,
                    eventId: event.id,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to create order")
            }

            const data = await response.json()

            // Initialize Razorpay
            const options = {
                key: data.key,
                amount: data.amount,
                currency: data.currency,
                name: "Aacharya Academy",
                description: event.title,
                order_id: data.orderId,
                handler: async function (response: any) {
                    try {
                        const registerRes = await fetch("/api/events/register", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                eventId: event.id,
                                name: formData.name,
                                email: formData.email,
                                phone: formData.phone,
                                age: formData.age,
                                paymentId: response.razorpay_payment_id,
                                amount: event.registrationFee,
                            }),
                        })

                        if (!registerRes.ok) throw new Error("Registration failed")

                        setPaymentSuccess(true)
                    } catch (error) {
                        console.error("Registration error:", error)
                        alert("Payment successful but registration failed. Please contact support.")
                    } finally {
                        setIsLoading(false)
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone,
                },
                notes: {
                    eventId: event.id,
                    eventName: event.title,
                },
                theme: {
                    color: "#fbbc05",
                },
                modal: {
                    ondismiss: function () {
                        setIsLoading(false)
                    },
                },
            }

            const razorpay = new window.Razorpay(options)
            razorpay.open()
        } catch (error) {
            console.error("Payment error:", error)
            alert("Payment initialization failed. Please try again.")
            setIsLoading(false)
        }
    }

    if (paymentSuccess) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md text-center border border-slate-100">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-4">Registration Successful!</h1>
                    <p className="text-slate-600 mb-8 font-medium">
                        Thank you for registering for <strong>{event.title}</strong>. A confirmation email has been sent to{" "}
                        <strong>{formData.email}</strong>.
                    </p>
                    <div className="space-y-3">
                        <Link href="/events">
                            <button className="w-full bg-[#fbbc05] hover:bg-[#f97316] text-slate-900 hover:text-white py-3 rounded-xl font-bold transition-all">
                                Browse More Events
                            </button>
                        </Link>
                        <Link href="/">
                            <button className="w-full border-2 border-slate-200 text-slate-700 hover:bg-slate-50 py-3 rounded-xl font-bold transition-all">
                                Go to Homepage
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Back Button */}
            <div className="pt-14 px-4 max-w-7xl mx-auto bg-slate-50">
                <Link href="/events">
                    <button className="mb-6 flex items-center gap-2 text-slate-600 hover:text-[#f97316] font-semibold transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Events
                    </button>
                </Link>
            </div>

            {/* Main Content */}
            <div className="px-4 pb-20 max-w-7xl mx-auto bg-slate-50">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Event Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Hero Card */}
                        <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100">
                            {/* Header Yellow Bar */}
                            <div className="h-2 bg-[#fbbc05]"></div>

                            {/* Event Image */}
                            <div className="relative h-64 md:h-80 overflow-hidden">
                                <img
                                    src={event.image || "/placeholder.svg"}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <Badge className="bg-[#fbbc05] text-slate-900 px-4 py-1.5 rounded-full shadow-lg border-0 font-bold text-xs uppercase mb-4">
                                        {event.category}
                                    </Badge>
                                    <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">{event.title}</h1>
                                </div>
                            </div>

                            {/* Event Info */}
                            <div className="p-6 md:p-8">
                                {/* Quick Info Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <CalendarIcon className="w-6 h-6 mx-auto mb-2 text-[#f97316]" />
                                        <div className="text-xs font-bold text-slate-500 uppercase">Date</div>
                                        <div className="text-sm font-black text-slate-900">
                                            {format(new Date(event.date), "MMM dd, yyyy")}
                                        </div>
                                    </div>
                                    <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <Clock className="w-6 h-6 mx-auto mb-2 text-[#f97316]" />
                                        <div className="text-xs font-bold text-slate-500 uppercase">Time</div>
                                        <div className="text-sm font-black text-slate-900">{event.time}</div>
                                    </div>
                                    <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <Users className="w-6 h-6 mx-auto mb-2 text-[#f97316]" />
                                        <div className="text-xs font-bold text-slate-500 uppercase">Participants</div>
                                        <div className="text-sm font-black text-slate-900">{event.participants}</div>
                                    </div>
                                    <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <Trophy className="w-6 h-6 mx-auto mb-2 text-[#fbbc05]" />
                                        <div className="text-xs font-bold text-slate-500 uppercase">Prize Pool</div>
                                        <div className="text-sm font-black text-slate-900">{event.prize}</div>
                                    </div>
                                </div>

                                {/* Venue */}
                                <div className="mb-8 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h3 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-[#f97316]" />
                                        Venue
                                    </h3>
                                    <p className="text-slate-800 font-bold">{event.location}</p>
                                    <p className="text-slate-600 text-sm font-medium">{event.address}</p>
                                </div>

                                {/* Description */}
                                <div className="mb-8">
                                    <h3 className="text-xl font-black text-slate-900 mb-4">About This Event</h3>
                                    <div className="prose prose-slate max-w-none">
                                        {event.longDescription.split("\n").map((paragraph, idx) => (
                                            <p key={idx} className="text-slate-600 leading-relaxed mb-3 font-medium">
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                </div>

                                {/* Features */}
                                {eventFeatures.length > 0 && (
                                    <div className="mb-8">
                                        <h3 className="text-xl font-black text-slate-900 mb-4">Event Highlights</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {eventFeatures.map((feature, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
                                                >
                                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                    <span className="text-slate-700 font-semibold">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Contact */}
                                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h3 className="text-lg font-black text-slate-900 mb-3">Contact Organizer</h3>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="flex items-center gap-2 text-slate-700">
                                            <Phone className="w-5 h-5 text-[#f97316]" />
                                            <span className="font-semibold">{event.contact}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-700">
                                            <Mail className="w-5 h-5 text-[#f97316]" />
                                            <span className="font-semibold">info@aacharyaacademy.com</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Registration Form */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <Card className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
                                {/* Header */}
                                <div className="h-2 bg-[#fbbc05]"></div>
                                <CardHeader className="pb-4 pt-6 px-6">
                                    <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-2">
                                        <Sparkles className="w-6 h-6 text-[#fbbc05]" />
                                        Register Now
                                    </CardTitle>
                                    <p className="text-slate-600 font-medium">Secure your spot for this event</p>
                                </CardHeader>

                                <CardContent className="space-y-6 px-6 pb-6">
                                    {/* Price Display */}
                                    <div className="text-center p-6 bg-[#fbbc05] rounded-2xl">
                                        <div className="text-sm font-bold uppercase tracking-wide text-slate-800">Registration Fee</div>
                                        <div className="text-4xl font-black text-slate-900">{event.registrationFeeDisplay}</div>
                                        <div className="text-sm font-semibold text-slate-700 mt-1">per participant</div>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="name" className="text-slate-700 font-bold">
                                                Full Name *
                                            </Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Enter your full name"
                                                className="mt-1.5 rounded-xl border-slate-200 focus:border-[#fbbc05] focus:ring-[#fbbc05]"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="email" className="text-slate-700 font-bold">
                                                Email Address *
                                            </Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="your@email.com"
                                                className="mt-1.5 rounded-xl border-slate-200 focus:border-[#fbbc05] focus:ring-[#fbbc05]"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="phone" className="text-slate-700 font-bold">
                                                Phone Number *
                                            </Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="+91 98765 43210"
                                                className="mt-1.5 rounded-xl border-slate-200 focus:border-[#fbbc05] focus:ring-[#fbbc05]"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="age" className="text-slate-700 font-bold">
                                                Age (for tournaments)
                                            </Label>
                                            <Input
                                                id="age"
                                                name="age"
                                                type="number"
                                                value={formData.age}
                                                onChange={handleInputChange}
                                                placeholder="Enter age"
                                                className="mt-1.5 rounded-xl border-slate-200 focus:border-[#fbbc05] focus:ring-[#fbbc05]"
                                            />
                                        </div>
                                    </div>

                                    {/* Pay Button */}
                                    <button
                                        onClick={handlePayment}
                                        disabled={isLoading}
                                        className="w-full bg-[#fbbc05] hover:bg-[#f97316] text-slate-900 hover:text-white py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-black text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="w-5 h-5" />
                                                Pay {event.registrationFeeDisplay}
                                            </>
                                        )}
                                    </button>

                                    {/* Security Badge */}
                                    <div className="flex items-center justify-center gap-2 text-sm text-slate-500 font-medium">
                                        <Shield className="w-4 h-4" />
                                        <span>Secured by Razorpay</span>
                                    </div>

                                    {/* Trust Indicators */}
                                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100">
                                        <div className="text-center">
                                            <div className="text-xl font-black text-slate-900">500+</div>
                                            <div className="text-xs text-slate-500 font-semibold">Participants</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xl font-black text-slate-900">50+</div>
                                            <div className="text-xs text-slate-500 font-semibold">Events</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xl font-black text-slate-900">4.9★</div>
                                            <div className="text-xs text-slate-500 font-semibold">Rating</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
