"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, ChevronLeft, ChevronRight, Camera, Trophy, Users, BookOpen, Grid3X3, List, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, MapPin, ArrowRight, CheckCircle, Globe, Headphones, Monitor } from "lucide-react"
import { format } from "date-fns"

export default function OnlineCoachingPage() {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedCoach, setSelectedCoach] = useState("")
  const [selectedPackage, setSelectedPackage] = useState("")

  const packages = [
    { name: "Single Session", price: "₹800", duration: "60 minutes", description: "Perfect for trying out online coaching or getting help with specific problems.", features: ["1-on-1 coaching", "Screen sharing", "Game analysis", "Homework assignment"], color: "from-blue-700 to-cyan-700", popular: false },
    { name: "Weekly Package", price: "₹2,800", duration: "4 sessions", description: "Consistent weekly coaching for steady improvement over a month.", features: ["4 sessions (1 per week)", "Progress tracking", "Custom study plan", "WhatsApp support"], color: "from-teal-700 to-emerald-700", popular: true },
    { name: "Intensive Monthly", price: "₹5,200", duration: "8 sessions", description: "Accelerated learning with twice-weekly sessions for rapid improvement.", features: ["8 sessions (2 per week)", "Tournament preparation", "Opening repertoire", "24/7 chat support"], color: "from-purple-700 to-pink-700", popular: false },
    { name: "Master Class", price: "₹9,600", duration: "12 sessions", description: "Comprehensive coaching program for serious players aiming for titles.", features: ["12 sessions (3 per week)", "GM-level analysis", "Psychological training", "Competition coaching"], color: "from-yellow-600 to-orange-600", popular: false },
  ]

  const coaches = [
    { name: "GM Rajesh Kumar", rating: "2650", price: "₹1000/hr", speciality: "Opening Theory" },
    { name: "WGM Priya Sharma", rating: "2450", price: "₹800/hr", speciality: "Tactical Training" },
    { name: "IM Arjun Reddy", rating: "2400", price: "₹700/hr", speciality: "Endgame Mastery" },
    { name: "FM Kavitha Nair", rating: "2300", price: "₹600/hr", speciality: "Youth Coaching" },
  ]

  const timeSlots = ["09:00 AM","10:00 AM","11:00 AM","02:00 PM","03:00 PM","04:00 PM","05:00 PM","06:00 PM","07:00 PM"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-r from-blue-800 via-cyan-800 to-emerald-700 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-6 bg-gradient-to-r from-blue-700 to-cyan-700 text-white">
            Online Coaching
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-700 to-cyan-700 to-emerald-700 bg-clip-text text-transparent">
            Learn Chess Online
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-cyan-100">
            Get personalized coaching from expert instructors with interactive, flexible sessions.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-700 to-emerald-700 bg-clip-text text-transparent">
            Why Choose Online Coaching?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[{icon:Globe,title:"Learn Anywhere",description:"Access world-class coaching from anywhere with internet."},
              {icon:Clock,title:"Flexible Timing",description:"Choose time slots that suit your schedule."},
              {icon:Monitor,title:"Interactive Tools",description:"Includes screen sharing and real-time analysis."},
              {icon:Headphones,title:"Personalized Attention",description:"One-on-one sessions tailored to your goals."}]
              .map((f,i) => (
                <Card key={i} className="text-center border-2 border-cyan-700 hover:border-cyan-500 transition-transform hover:scale-105 p-6">
                  <div className="w-16 h-16 mb-4 mx-auto rounded-full bg-gradient-to-tr from-blue-700 to-emerald-700 flex items-center justify-center">
                    <f.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2 text-blue-900">{f.title}</h3>
                  <p className="text-gray-700">{f.description}</p>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-700 to-emerald-700 bg-clip-text text-transparent">
            Choose Your Package
          </h2>
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {packages.map((pkg,i) => (
              <Card key={i} className={`relative shadow-lg ${pkg.popular ? "ring-4 ring-emerald-400" : ""}`}>
                {pkg.popular && <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-700 to-cyan-700 text-white px-4 py-1 rounded-bl-lg font-bold text-sm">Most Popular</div>}
                <div className={`h-2 bg-gradient-to-r ${pkg.color}`}></div>
                <CardContent>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2 text-blue-900">{pkg.name}</h3>
                    <div className="text-4xl font-extrabold text-emerald-700 mb-1">{pkg.price}</div>
                    <div className="text-gray-600">{pkg.duration}</div>
                  </div>
                  <p className="text-center mb-6 text-gray-700">{pkg.description}</p>
                  <div className="space-y-3 mb-6">
                    {pkg.features.map((f,i) => (
                      <div key={i} className="flex items-center gap-3 text-blue-900">
                        <CheckCircle className="w-5 h-5 text-emerald-700" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                  <Button className={`w-full bg-gradient-to-r ${pkg.color} text-white`} onClick={() => setSelectedPackage(pkg.name)}>Select Package</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Booking */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-700 to-emerald-700 bg-clip-text text-transparent">
            Book Your Session
          </h2>
          <Card className="shadow-xl">
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="block font-semibold text-blue-900 mb-1">Full Name</Label>
                    <Input id="name" placeholder="Enter full name" />
                  </div>
                  <div>
                    <Label htmlFor="email" className="block font-semibold text-blue-900 mb-1">Email Address</Label>
                    <Input id="email" type="email" placeholder="Enter email" />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="block font-semibold text-blue-900 mb-1">Phone Number</Label>
                    <Input id="phone" placeholder="Enter phone" />
                  </div>
                  <div>
                    <Label className="block font-semibold text-blue-900 mb-1">Select Coach</Label>
                    <Select value={selectedCoach} onValueChange={setSelectedCoach}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose coach" />
                      </SelectTrigger>
                      <SelectContent>
                        {coaches.map((c,i) => (
                          <SelectItem key={i} value={c.name}>{c.name} ({c.rating}) - {c.price}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="block font-semibold text-blue-900 mb-1">Package</Label>
                    <Select value={selectedPackage} onValueChange={setSelectedPackage}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose package" />
                      </SelectTrigger>
                      <SelectContent>
                        {packages.map((p,i) => (
                          <SelectItem key={i} value={p.name}>{p.name} - {p.price}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <Label className="block font-semibold text-blue-900 mb-1">Select Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button className="w-full justify-start" variant="outline">
                          <CalendarIcon className="mr-2" />
                          {selectedDate ? format(selectedDate, 'PPP') : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label className="block font-semibold text-blue-900 mb-1">Time Slot</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((time,i) => (
                        <Button key={i} size="sm" variant="outline" className="hover:bg-cyan-50 hover:border-cyan-500">{time}</Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="level" className="block font-semibold text-blue-900 mb-1">Chess Level</Label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose your level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner (0-1000)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (1000-1500)</SelectItem>
                        <SelectItem value="advanced">Advanced (1500-2000)</SelectItem>
                        <SelectItem value="expert">Expert (2000+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="goals" className="block font-semibold text-blue-900 mb-1">Learning Goals</Label>
                    <Textarea placeholder="Your goals here" />
                  </div>
                </div>
              </div>
              <div className="mt-8 text-center">
                <Button size="lg" className="bg-gradient-to-r from-blue-700 to-emerald-700 text-white px-12">
                  Book Session <ArrowRight className="ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-gradient-to-br from-blue-700 to-emerald-700">
        <div className="max-w-6xl mx-auto text-center text-white">
          <h2 className="text-4xl mb-12">Student Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[{name:"Rahul Sharma",improvement:"800 → 1400 rating",testimonial:"Online coaching helped me improve rapidly. The flexibility was perfect for my schedule."},
              {name:"Anita Patel",improvement:"Beginner → State Champion",testimonial:"Started as a beginner and won the state championship within 2 years!"},
              {name:"Kiran Kumar",improvement:"1200 → 1800 rating",testimonial:"The personalized attention and analysis helped me reach new heights."}]
              .map((s,i) => (
                <Card key={i} className="bg-white bg-opacity-10 backdrop-blur-sm rounded p-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-blue-900 flex items-center justify-center mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">{s.name}</h3>
                  <div className="text-cyan-300 font-semibold mb-3">{s.improvement}</div>
                  <p className="italic">"{s.testimonial}"</p>
                </Card>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}
