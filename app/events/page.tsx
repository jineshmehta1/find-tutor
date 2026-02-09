"use client"

import { useState } from "react"
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  Crown,
} from "lucide-react"
import { format } from "date-fns"

// Static events data
export const eventsData = [
  {
    id: 1,
    slug: "state-championship-2026",
    title: "26th All India TCA Under 10, Under 14 & Under 18 Chess Tournament",
    category: "tournament",
    date: "2026-02-08",
    time: "09:00 AM",
    endDate: "2026-02-10",
    location: "Hyderabad Convention Center",
    address: "HICC Complex, Madhapur, Hyderabad, Telangana 500081",
    participants: "200+",
    prize: "₹1,00,000",
    description: "The prestigious 26th All India TCA Championship brings together the finest young chess talents from across the nation. Compete in age-appropriate categories and showcase your strategic prowess.",
    longDescription: `Join us for the most anticipated chess event of the year! The 26th All India TCA Championship is designed to nurture and recognize young chess prodigies.

**Event Highlights:**
- Three age categories: Under 10, Under 14, and Under 18
- Swiss system tournament format
- FIDE rated event
- Cash prizes and trophies for top performers
- Certificates for all participants
- Live commentary by Grandmasters

**Schedule:**
- Day 1: Registration and Rounds 1-3
- Day 2: Rounds 4-6
- Day 3: Rounds 7-9 and Prize Distribution

Don't miss this opportunity to compete with the best young minds in Indian chess!`,
    image: "/chess-tournament.png",
    status: "upcoming",
    registrationFee: 500,
    registrationFeeDisplay: "₹500",
    features: [
      "FIDE Rated Tournament",
      "Swiss System - 9 Rounds",
      "Cash Prizes Worth ₹1,00,000",
      "Trophies & Medals",
      "Participation Certificates",
      "Live Streaming"
    ],
    organizer: "Telangana Chess Academy",
    contact: "+91 98646 46481",
  },
  {
    id: 2,
    slug: "grandmaster-workshop-feb-2026",
    title: "Grandmaster Workshop - Advanced Openings",
    category: "workshop",
    date: "2026-02-15",
    time: "02:00 PM",
    endDate: "2026-02-15",
    location: "Academy Main Hall",
    address: "TCA Campus, Banjara Hills, Hyderabad",
    participants: "50",
    prize: "Certificate",
    description: "Exclusive workshop by GM Rajesh Kumar on advanced opening preparation and repertoire building.",
    longDescription: `Learn the secrets of opening preparation from a Grandmaster!

**What You'll Learn:**
- Building a solid opening repertoire
- Understanding pawn structures
- Transition from opening to middlegame
- Common opening traps and how to avoid them
- Practical exercises and analysis

**Workshop Format:**
- 3-hour intensive session
- Live demonstration on digital boards
- Q&A with the Grandmaster
- Take-home study materials

**Prerequisites:**
- FIDE rating 1200+ or equivalent
- Basic knowledge of chess notation`,
    image: "/chess-workshop.jpg",
    status: "upcoming",
    registrationFee: 800,
    registrationFeeDisplay: "₹800",
    features: [
      "Personal Guidance from GM",
      "Study Materials Included",
      "Certificate of Completion",
      "Small Batch Size",
      "Interactive Session"
    ],
    organizer: "Telangana Chess Academy",
    contact: "+91 98646 46481",
  },
  {
    id: 3,
    slug: "youth-rapid-tournament-2026",
    title: "Youth Rapid Tournament",
    category: "tournament",
    date: "2026-02-22",
    time: "10:00 AM",
    endDate: "2026-02-22",
    location: "Online Platform",
    address: "Lichess.org - Private Arena",
    participants: "100+",
    prize: "₹15,000",
    description: "Fast-paced online tournament for players under 18. Test your rapid chess skills!",
    longDescription: `Experience the thrill of rapid chess from the comfort of your home!

**Tournament Details:**
- Time Control: 10+5 (10 minutes + 5 seconds increment)
- Platform: Lichess.org
- Format: Swiss System - 7 Rounds

**Eligibility:**
- Age: Under 18 years
- Must have a Lichess account

**Prizes:**
- 1st Place: ₹5,000
- 2nd Place: ₹3,000
- 3rd Place: ₹2,000
- Top 10: ₹500 each

**Special Categories:**
- Best Under 12 Player
- Best Female Player`,
    image: "/youth-chess.jpg",
    status: "upcoming",
    registrationFee: 300,
    registrationFeeDisplay: "₹300",
    features: [
      "Online Tournament",
      "Rapid Time Control",
      "Multiple Prize Categories",
      "E-Certificates",
      "Rating Points"
    ],
    organizer: "Telangana Chess Academy",
    contact: "+91 98646 46481",
  },
  {
    id: 4,
    slug: "chess-psychology-seminar",
    title: "Chess Psychology Seminar",
    category: "seminar",
    date: "2026-02-28",
    time: "11:00 AM",
    endDate: "2026-02-28",
    location: "Academy Conference Room",
    address: "TCA Campus, Banjara Hills, Hyderabad",
    participants: "30",
    prize: "Certificate",
    description: "Learn mental strategies and psychology of competitive chess from sports psychologists.",
    longDescription: `Master the mental game of chess!

**Topics Covered:**
- Managing tournament anxiety
- Developing concentration and focus
- Handling time pressure
- Dealing with losses
- Building confidence
- Pre-game preparation routines

**Expert Speakers:**
- Dr. Priya Sharma - Sports Psychologist
- IM Vikram Rao - Experienced Tournament Player

**Who Should Attend:**
- Competitive players
- Parents of young players
- Chess coaches`,
    image: "/chess-psychology.jpg",
    status: "upcoming",
    registrationFee: 600,
    registrationFeeDisplay: "₹600",
    features: [
      "Expert Psychologists",
      "Interactive Sessions",
      "Practical Exercises",
      "Take-home Resources",
      "Certificate"
    ],
    organizer: "Telangana Chess Academy",
    contact: "+91 98646 46481",
  },
  {
    id: 5,
    slug: "simultaneous-exhibition",
    title: "Simultaneous Exhibition",
    category: "exhibition",
    date: "2026-03-05",
    time: "04:00 PM",
    endDate: "2026-03-05",
    location: "City Chess Club",
    address: "Jubilee Hills, Hyderabad",
    participants: "40",
    prize: "Experience",
    description: "Play simultaneous games against GM Rajesh Kumar. A rare opportunity!",
    longDescription: `Play against a Grandmaster!

**Event Format:**
- GM Rajesh Kumar will play 40 players simultaneously
- Time: Approximately 2-3 hours
- All skill levels welcome

**What's Included:**
- Chance to play a Grandmaster
- Signed scoresheet
- Photo opportunity
- Refreshments

**Special Recognition:**
- Draw against GM: Certificate of Achievement
- Win against GM: Special Trophy + Featured on Academy Website`,
    image: "/chess-simultaneous.jpg",
    status: "upcoming",
    registrationFee: 200,
    registrationFeeDisplay: "₹200",
    features: [
      "Play Against GM",
      "All Levels Welcome",
      "Signed Scoresheets",
      "Photo Opportunity",
      "Refreshments"
    ],
    organizer: "Telangana Chess Academy",
    contact: "+91 98646 46481",
  },
  {
    id: 6,
    slug: "womens-chess-day-2026",
    title: "Women's Chess Day",
    category: "special",
    date: "2026-03-08",
    time: "09:30 AM",
    endDate: "2026-03-08",
    location: "Academy Main Hall",
    address: "TCA Campus, Banjara Hills, Hyderabad",
    participants: "80",
    prize: "₹10,000",
    description: "Tournament & workshop celebrating women in chess on International Women's Day.",
    longDescription: `Celebrating Women in Chess!

**Event Schedule:**
- 09:30 AM: Registration & Welcome
- 10:00 AM: Opening Ceremony
- 10:30 AM: Tournament Begins (5 Rounds)
- 01:00 PM: Lunch Break
- 02:00 PM: Workshop by WGM Soumya Swaminathan
- 04:00 PM: Final Round
- 05:30 PM: Prize Distribution

**Prizes:**
- 1st Place: ₹3,000 + Trophy
- 2nd Place: ₹2,000 + Trophy
- 3rd Place: ₹1,500 + Trophy
- Best Junior: ₹1,000
- Best Veteran: ₹1,000
- All participants receive certificates

**Special Features:**
- Free entry for first 20 registrations
- Exclusive Women's Chess Day merchandise`,
    image: "/women-chess.jpg",
    status: "upcoming",
    registrationFee: 400,
    registrationFeeDisplay: "₹400",
    features: [
      "Women Only Event",
      "Tournament + Workshop",
      "Cash Prizes",
      "Exclusive Merchandise",
      "Networking Opportunity"
    ],
    organizer: "Telangana Chess Academy",
    contact: "+91 98646 46481",
  },
]

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")

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
      ? eventsData
      : eventsData.filter(event => event.category === selectedCategory)

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
          <div className="flex items-center justify-between mb-10">
            <p className="text-slate-600 font-semibold">
              Showing <span className="text-slate-900">{filteredEvents.length}</span> of {eventsData.length} events
            </p>
          </div>

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
        </div>
      </section>
    </div>
  )
}