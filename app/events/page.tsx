"use client"

import { useState, useEffect } from "react"
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CalendarIcon,
  Clock,
  MapPin,
  Users,
  Trophy,
  BookOpen,
  Star,
  ArrowRight,
  Sparkles,
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

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [events, setEvents] = useState<EventData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events")
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setEvents(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Failed to load events:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const categories = [
    { id: "all", name: "All Events", icon: CalendarIcon },
    { id: "tournament", name: "Tournaments", icon: Trophy },
    { id: "workshop", name: "Workshops", icon: BookOpen },
    { id: "seminar", name: "Seminars", icon: Users },
    { id: "exhibition", name: "Exhibitions", icon: Star },
    { id: "special", name: "Special Events", icon: Sparkles },
  ]

  const filteredEvents =
    selectedCategory === "all"
      ? events
      : events.filter(event => event.category === selectedCategory)

  const parseFeatures = (features: string) => {
    try { return JSON.parse(features); } catch { return []; }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 mb-6">
            <Sparkles className="w-4 h-4 text-amber-600 fill-amber-600" />
            <span className="text-amber-800 font-bold text-xs uppercase tracking-wider">Upcoming Events</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            Chess <span className="text-[#f97316]">Events</span> & Tournaments
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Join thrilling tournaments, master workshops, and exclusive chess events. Compete, learn, and grow with the chess community.
          </p>
        </div>
      </section>

      {/* Event Categories */}
      <section className="relative py-12 px-4 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
              Event <span className="text-[#f97316]">Categories</span>
            </h2>
            <p className="text-slate-600 font-medium max-w-2xl mx-auto">
              Discover events tailored to your interests and skill level
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map(category => (
              <button
                key={category.id}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-3 ${selectedCategory === category.id
                  ? "bg-[#fbbc05] text-slate-900 border-[#fbbc05] shadow-lg"
                  : "bg-white border-slate-200 text-slate-700 hover:border-[#fbbc05] hover:bg-amber-50"
                  }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <category.icon className="w-7 h-7" />
                <span className="text-sm font-bold text-center">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-16 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-10">
                <p className="text-slate-600 font-semibold">
                  Showing <span className="text-slate-900">{filteredEvents.length}</span> of {events.length} events
                </p>
              </div>

              {filteredEvents.length === 0 ? (
                <div className="text-center py-20">
                  <CalendarIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No Events Found</h3>
                  <p className="text-slate-500">Check back later for upcoming events.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredEvents.map(event => (
                    <Card
                      key={event.id}
                      className="bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
                    >
                      {/* Yellow Top Bar */}
                      <div className="h-1.5 w-full bg-[#fbbc05] group-hover:bg-[#f97316] transition-colors"></div>

                      <CardContent className="p-0">
                        {/* Event Image */}
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={event.image || "/placeholder.svg"}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                          {/* Category Badge */}
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-[#fbbc05] text-slate-900 px-3 py-1 rounded-full shadow-lg border-0 font-bold text-xs uppercase">
                              {event.category}
                            </Badge>
                          </div>

                          {/* Event Date */}
                          <div className="absolute bottom-4 left-4 bg-white rounded-xl px-4 py-2 shadow-lg">
                            <div className="text-sm font-black text-slate-900">
                              {format(new Date(event.date), "MMM dd, yyyy")}
                            </div>
                          </div>
                        </div>

                        {/* Event Content */}
                        <div className="p-6">
                          <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-[#f97316] transition-colors line-clamp-2 leading-tight">
                            {event.title}
                          </h3>
                          <p className="text-slate-600 mb-5 leading-relaxed line-clamp-2 text-sm font-medium">
                            {event.description}
                          </p>

                          {/* Event Details */}
                          <div className="space-y-2.5 mb-5">
                            <div className="flex items-center gap-3 text-slate-700">
                              <Clock className="w-4 h-4 text-[#f97316]" />
                              <span className="text-sm font-semibold">{event.time}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-700">
                              <MapPin className="w-4 h-4 text-[#f97316]" />
                              <span className="text-sm font-semibold">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-700">
                              <Users className="w-4 h-4 text-[#f97316]" />
                              <span className="text-sm font-semibold">{event.participants} participants</span>
                            </div>
                          </div>

                          {/* Prize and Fee */}
                          <div className="grid grid-cols-2 gap-3 mb-5">
                            <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                              <Trophy className="w-5 h-5 mx-auto mb-1.5 text-[#fbbc05]" />
                              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Prize</div>
                              <div className="text-sm font-black text-slate-900">{event.prize}</div>
                            </div>
                            <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                              <CalendarIcon className="w-5 h-5 mx-auto mb-1.5 text-[#f97316]" />
                              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Fee</div>
                              <div className="text-sm font-black text-slate-900">{event.registrationFeeDisplay}</div>
                            </div>
                          </div>

                          {/* CTA Button */}
                          <Link href={`/events/${event.slug}`}>
                            <button className="w-full bg-[#fbbc05] hover:bg-[#f97316] text-slate-900 hover:text-white py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-black text-sm flex items-center justify-center gap-2">
                              View Details & Register
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}