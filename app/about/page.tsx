import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  BookOpen,
  Award,
  Sparkles,
  Compass,
  Link2,
  MapPin,
  GraduationCap,
  Users,
  Target,
  ArrowRight,
  CheckCircle2,
  Layers,
  HeartHandshake,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Laptop,
  Home,
  School,
  Trophy,
  Brain,
  Quote
} from "lucide-react";

export const metadata: Metadata = {
  title: "About AACHARYA – Find Tutors & Coaches Nearby",
  description:
    "Discover AACHARYA, a platform connecting parents and students with nearby home tutors, academic teachers, activity coaches and skill trainers.",
  keywords: [
    "Find tutors nearby",
    "home tutors",
    "tutors near me",
    "find coaches nearby",
    "academic tutors",
    "online tutors",
    "chess coaches",
    "abacus trainers",
    "robotics classes",
    "skill development coaches",
    "AACHARYA"
  ],
  alternates: {
    canonical: "/about"
  },
  openGraph: {
    title: "About AACHARYA – Find Tutors & Coaches Nearby",
    description:
      "Connecting parents and students with verified academic tutors, activity coaches and skill trainers nearby.",
    url: "https://aacharya-tutor.vercel.app/about",
    siteName: "AACHARYA",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://aacharya-tutor.vercel.app/image.png",
        width: 1200,
        height: 630,
        alt: "AACHARYA - Find Tutors & Coaches Nearby"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "About AACHARYA – Find Tutors & Coaches Nearby",
    description:
      "Connecting parents and students with nearby home tutors, academic teachers, activity coaches and skill trainers."
  }
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://aacharya.net/#website",
        "url": "https://aacharya.net",
        "name": "AACHARYA",
        "description":
          "Find Tutors, Academic Teachers, Coaches & Skill Trainers Nearby",
        "publisher": {
          "@id": "https://aacharya.net/#organization"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://aacharya.net/#organization",
        "name": "AACHARYA",
        "url": "https://aacharya.net",
        "logo": "https://aacharya.net/image.png",
        "description":
          "A tutor discovery and learning connection platform designed to help parents and students find suitable academic tutors, subject teachers, activity coaches and skill trainers nearby.",
        "email": "aacharyateam@gmail.com",
        "telephone": "+918074103400",
        "address": {
          "@type": "PostalAddress",
          "streetAddress":
            "Opposite Indrakeeladri Apartment, Lalitha Nagar, Swathi Road, Near Sivalayam Center, Bhavanipuram",
          "addressLocality": "Vijayawada",
          "postalCode": "520012",
          "addressRegion": "Andhra Pradesh",
          "addressCountry": "IN"
        },
        "founder": {
          "@id": "https://aacharya.net/#founder"
        }
      },
      {
        "@type": "Person",
        "@id": "https://aacharya.net/#founder",
        "name": "Dr. Rajesh Gunti",
        "jobTitle": "Founder & Educator",
        "worksFor": {
          "@id": "https://aacharya.net/#organization"
        },
        "alumniOf":
          "Jawaharlal Nehru Technological University Hyderabad (JNTUH)",
        "description":
          "Academician and Professor of Mechanical Engineering with over 20 years of teaching experience, M.Tech, Ph.D. from JNTUH, and JNTUK Best Teacher Awardee.",
        "image": "https://aacharya.net/chess-cen.jpeg"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://aacharya.net/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "About Us",
            "item": "https://aacharya.net/about"
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ========================================================
          1. HERO SECTION: Clean Ed-Tech Platform Identity
         ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0a1829] via-[#0d1f35] to-[#0a1829] text-white pt-16 sm:pt-20 pb-20 sm:pb-24 border-b border-slate-800">
        {/* Subtle grid background pattern */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(#ffb800 1px, transparent 1px), radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "36px 36px",
            backgroundPosition: "0 0, 18px 18px"
          }}
        />

        {/* Ambient Gold Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-yellow-500/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb & Identifier */}
          <div className="flex items-center gap-2 mb-6">
            <span className="px-3 py-1 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AACHARYA • ABOUT US</span>
            </span>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Semantic H1 & Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Primary SEO H1 */}
              <h1 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-amber-400">
                About AACHARYA – Find Tutors, Teachers &amp; Coaches Nearby
              </h1>

              {/* Main Display Headline */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-white tracking-tight leading-[1.12]">
                The Right Learning Partner Is{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffb800] via-amber-300 to-yellow-200">
                  Closer Than You Think.
                </span>
              </h2>

              <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed max-w-2xl">
                Connecting parents and students with trusted academic tutors, subject teachers, and activity coaches nearby.
              </p>

              {/* Value Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-bold text-slate-300">
                <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Academic Subjects (Class 1–12)</span>
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Chess, Abacus, Coding &amp; Arts</span>
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Home &amp; Online Modes</span>
                </span>
              </div>

              {/* Primary Call-to-Actions */}
              <div className="flex flex-wrap items-center gap-3.5 pt-4">
                <Link
                  href="/find-tutor-nearby"
                  className="px-6 py-3.5 rounded-2xl bg-[#ffb800] hover:bg-[#ffa000] text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 hover:shadow-xl hover:scale-[1.02] active:scale-95 flex items-center gap-2"
                >
                  <Search className="w-4 h-4 stroke-[2.5]" />
                  <span>Find a Tutor</span>
                </Link>

                <Link
                  href="/find-tutor-nearby?type=coach"
                  className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all border border-white/20 hover:border-amber-400/50 flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Find a Coach</span>
                </Link>

                <Link
                  href="/request-tutor"
                  className="px-5 py-3.5 rounded-2xl text-slate-300 hover:text-white font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5"
                >
                  <span>Post Requirement</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Column: Platform Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden border-2 border-white/15 shadow-2xl bg-slate-900 group">
                <img
                  src="/tutor_teaching_card.png"
                  alt="Tutor helping a student during a dedicated 1-on-1 learning session"
                  className="w-full h-auto object-cover max-h-[420px] transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />

                {/* Floating pill badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl text-left">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider mb-0.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Direct Connection Platform</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium">
                    Discover tutors and coaches for personalized 1-on-1 or group coaching in your locality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. OUR PURPOSE: Making it easier to find the right teacher
         ======================================================== */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
            <span className="text-[11px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Our Purpose
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Making it easier to find the right teacher.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              Every student has different learning needs. AACHARYA helps families discover suitable academic tutors and activity coaches based on their requirements, preferences and location.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                icon: <Compass className="w-6 h-6 text-amber-500" />,
                title: "Discover",
                desc: "Explore nearby tutors and coaches filtered by subject, grade level, and area."
              },
              {
                step: "02",
                icon: <Link2 className="w-6 h-6 text-indigo-500" />,
                title: "Connect",
                desc: "Find suitable learning partners and connect directly without intermediary barriers."
              },
              {
                step: "03",
                icon: <MapPin className="w-6 h-6 text-rose-500" />,
                title: "Choose Nearby",
                desc: "Explore local at-home tuition, teacher centre locations, or online sessions."
              },
              {
                step: "04",
                icon: <GraduationCap className="w-6 h-6 text-emerald-500" />,
                title: "Learn & Grow",
                desc: "Begin the right learning journey tailored to your child's pace and curriculum goals."
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50 hover:bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 hover:border-amber-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <span className="text-xs font-black text-slate-400">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          3. WHAT CAN YOU FIND ON AACHARYA?
         ======================================================== */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-[11px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Learning Opportunities
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              What Can You Find on AACHARYA?
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              Comprehensive support spanning core academics, competitive prep, and co-curricular cognitive skills.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Academic Tutors */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group text-left">
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src="/about-academic-tutors.jpg"
                  alt="Academic tuition session with teacher guiding a student"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                  Academics
                </span>
              </div>
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-900">
                    Academic Tutors
                  </h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    School subjects, board preparation, intermediate and other academic learning for Classes 1 to 12.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {["Mathematics", "Physics", "Chemistry", "Biology", "English", "CBSE / ICSE"].map((sub) => (
                      <span
                        key={sub}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  href="/find-tutor-nearby"
                  className="pt-3 border-t border-slate-100 inline-flex items-center gap-1.5 text-xs font-black text-amber-600 hover:text-amber-700 transition-colors"
                >
                  <span>Explore Academic Tutors</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 2: Activity & Skill Coaches */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group text-left">
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src="/about-activity-coaches.jpg"
                  alt="Young student playing chess during a mentor-led skill activity session"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                  Skills &amp; Activities
                </span>
              </div>
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-900">
                    Activity &amp; Skill Coaches
                  </h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Chess, abacus, robotics, coding, yoga, music, dance, art and more creative co-curriculars.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {["Chess Coaching", "Abacus", "Robotics", "Coding", "Music & Dance", "Yoga"].map((sub) => (
                      <span
                        key={sub}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  href="/find-tutor-nearby?type=coach"
                  className="pt-3 border-t border-slate-100 inline-flex items-center gap-1.5 text-xs font-black text-amber-600 hover:text-amber-700 transition-colors"
                >
                  <span>Explore Activity Coaches</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 3: Learning Centres & Institutes */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group text-left">
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src="/about-learning-centres.jpg"
                  alt="Modern learning centre classroom with students engaged in collaborative learning"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                  Centres
                </span>
              </div>
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-900">
                    Learning Centres &amp; Institutes
                  </h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Discover coaching centres, skill academies, and structured small-batch learning programmes.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {["Coaching Centres", "Activity Studios", "Small Batches", "Foundation Prep"].map((sub) => (
                      <span
                        key={sub}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  href="/find-tutor-nearby"
                  className="pt-3 border-t border-slate-100 inline-flex items-center gap-1.5 text-xs font-black text-amber-600 hover:text-amber-700 transition-colors"
                >
                  <span>Discover Centres</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. ABOUT AACHARYA: Mission, What We Do, How It Works, Vision
         ======================================================== */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Main Story & Connecting Students */}
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5 text-left">
              <span className="text-[11px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                About AACHARYA
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Connecting Students with the Right Learning Opportunities
              </h2>
              <div className="space-y-3.5 text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                <p>
                  AACHARYA is a tutor discovery and learning connection platform designed to help parents and students find suitable academic tutors, subject teachers, activity coaches and skill trainers nearby.
                </p>
                <p>
                  We believe that finding the right teacher should be simple, convenient and accessible. Every student has different learning goals, interests and educational needs. AACHARYA helps families explore available learning options and connect with educators who match their requirements.
                </p>
                <p>
                  Whether you are looking for a home tutor, an online teacher, a chess coach, an abacus trainer, a robotics instructor or another skill development professional, AACHARYA brings different learning opportunities together in one place.
                </p>
              </div>
            </div>

            {/* Mission Statement Box */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0a1829] to-[#132a48] rounded-3xl p-7 sm:p-8 text-white space-y-5 shadow-xl text-left border border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                <Target className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-amber-400">
                  Our Mission
                </h3>
                <h4 className="text-xl sm:text-2xl font-black text-white leading-snug">
                  To make the process of finding the right tutor or coach easier for every parent and student.
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                We aim to connect learners with suitable educators through a convenient platform that encourages accessibility, choice and meaningful learning relationships.
              </p>
            </div>
          </div>

          {/* What We Do: 4 Key Pillars */}
          <div className="space-y-6 text-left">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                What We Do
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Four core ways AACHARYA supports learners and educators.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  icon: <BookOpen className="w-5 h-5 text-amber-600" />,
                  title: "1. Find Academic Tutors",
                  desc: "Discover tutors for school subjects and academic learning across different classes and educational boards. Explore options based on subject, class, location, preferred learning mode and other requirements."
                },
                {
                  icon: <Brain className="w-5 h-5 text-indigo-600" />,
                  title: "2. Find Activity & Skill Coaches",
                  desc: "Learning extends beyond textbooks. Discover instructors for chess, abacus, robotics, coding, yoga, music, dance, art, languages and other extracurricular and skill development activities."
                },
                {
                  icon: <MessageSquare className="w-5 h-5 text-rose-600" />,
                  title: "3. Post Your Learning Requirement",
                  desc: "Unable to find a suitable tutor or coach? Parents can submit their specific learning requirements. AACHARYA helps connect them with relevant educators who may be interested and available."
                },
                {
                  icon: <School className="w-5 h-5 text-emerald-600" />,
                  title: "4. Discover Learning Centres",
                  desc: "Explore institutes, coaching centres and organised learning programmes offering academic and extracurricular education."
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-2.5 hover:border-amber-400 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <h4 className="text-base font-black text-slate-900">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* How AACHARYA Works (Step-by-step) */}
          <div className="space-y-8 text-left pt-4">
            <div className="border-b border-slate-200 pb-3">
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                Simple Process
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                How AACHARYA Works
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                A straightforward path from requirement to active learning.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "Step 1",
                  title: "Search for a Tutor or Coach",
                  desc: "Browse available profiles using subject, activity, class and location filters."
                },
                {
                  step: "Step 2",
                  title: "Post Your Requirement",
                  desc: "Share your learning needs so suitable tutors or coaches can respond."
                },
                {
                  step: "Step 3",
                  title: "Explore and Connect",
                  desc: "Review relevant profiles and connect with educators to discuss availability, fees and learning preferences."
                },
                {
                  step: "Step 4",
                  title: "Begin Learning",
                  desc: "Finalise the arrangement and start your learning journey."
                }
              ].map((s, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider">
                      {s.step}
                    </span>
                    <h4 className="text-sm font-black text-slate-900 leading-snug">
                      {s.title}
                    </h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Our Vision Callout */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-7 sm:p-9 text-left space-y-3 relative overflow-hidden">
            <Quote className="w-10 h-10 text-amber-200 absolute top-4 right-4 pointer-events-none" />
            <h3 className="text-xs font-black uppercase tracking-widest text-amber-800">
              Our Vision
            </h3>
            <p className="text-base sm:text-lg text-slate-900 font-bold leading-relaxed max-w-4xl">
              "We envision a learning ecosystem where every student can discover the right guidance, every parent can explore suitable educational support, and every dedicated tutor or coach has an opportunity to connect with learners. We aspire to make AACHARYA a trusted destination for discovering academic tutoring and skill development opportunities."
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. MEET OUR FOUNDER: Dr. Rajesh Gunti (Genuine Credentials)
         ======================================================== */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-[11px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Leadership &amp; Academic Heritage
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Meet Our Founder – Dr. Rajesh Gunti
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              Academic leadership rooted in two decades of engineering education and student mentorship.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 lg:p-12">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Founder Image Column */}
              <div className="lg:col-span-5 text-center">
                <div className="relative mx-auto max-w-sm rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-slate-900">
                  <img
                    src="/chess-cen.jpeg"
                    alt="Dr. Rajesh Gunti, Founder of AACHARYA"
                    className="w-full h-auto object-cover max-h-[460px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-5 left-5 right-5 text-left text-white">
                    <h3 className="text-xl font-bold tracking-tight">
                      Dr. Rajesh Gunti
                    </h3>
                    <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                      Founder, AACHARYA
                    </p>
                  </div>
                </div>

                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                  <GraduationCap className="w-4 h-4 text-amber-600" />
                  <span>M.Tech | Ph.D., JNTUH | JNTUK Best Teacher Awardee</span>
                </div>
              </div>

              {/* Founder Biography Column */}
              <div className="lg:col-span-7 space-y-5 text-left">
                <div className="space-y-1">
                  <span className="text-xs font-black text-amber-600 uppercase tracking-widest">
                    Academician &amp; Professor
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                    Dr. Rajesh Gunti
                  </h3>
                  <p className="text-xs text-slate-500 font-bold">
                    Professor of Mechanical Engineering • 20+ Years Teaching Experience
                  </p>
                </div>

                <div className="space-y-3 text-sm text-slate-600 font-medium leading-relaxed">
                  <p>
                    AACHARYA was founded by Dr. Rajesh Gunti, an academician and Professor of Mechanical Engineering with over 20 years of teaching experience, committed to making quality learning opportunities more accessible.
                  </p>
                  <p>
                    He holds an M.Tech and Ph.D. from Jawaharlal Nehru Technological University Hyderabad (JNTUH). His professional journey includes academic teaching, institutional leadership and educational administration.
                  </p>
                  <p>
                    He has served in roles including Head of Department, Principal, NSS Programme Officer and NSS JNTUK District Resource Officer.
                  </p>
                  <p>
                    His academic contributions include more than 10 SCI/SCOPUS journal publications and over 15 international conference presentations. He is also a recipient of the JNTUK Best Teacher Award and has delivered over 150 guest lectures and organised more than 500 events.
                  </p>
                  <p className="font-semibold text-slate-800">
                    His vision behind AACHARYA is to create meaningful educational opportunities and make it easier for learners to connect with the right teachers, mentors and skill development professionals.
                  </p>
                </div>

                {/* Verified Credential Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {[
                    { label: "20+ Years", sub: "Teaching" },
                    { label: "Ph.D. JNTUH", sub: "Engineering" },
                    { label: "10+ SCI/SCOPUS", sub: "Publications" },
                    { label: "Best Teacher", sub: "Awardee" }
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center"
                    >
                      <span className="block text-xs sm:text-sm font-black text-slate-900">
                        {stat.label}
                      </span>
                      <span className="block text-[10px] text-slate-500 font-bold uppercase mt-0.5">
                        {stat.sub}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. WHY AACHARYA?
         ======================================================== */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-[11px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Platform Advantages
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Why AACHARYA?
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              Built specifically to bridge learners and educators transparently and effectively.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {[
              {
                title: "Unified Platform",
                desc: "Discover academic tutors and activity coaches in one unified platform."
              },
              {
                title: "Location-Based Discovery",
                desc: "Explore learning options based on your specific location and neighborhood preferences."
              },
              {
                title: "Flexible Learning Modes",
                desc: "Compare educator profiles and available learning modes: At Student Home, At Teacher Home, or Online."
              },
              {
                title: "Personalised Assistance",
                desc: "Submit a learning requirement when you need tailored assistance to find specific subjects or coaches."
              },
              {
                title: "Educator Empowerment",
                desc: "Help passionate tutors and coaches reach students who are actively looking for their expertise."
              },
              {
                title: "Holistic Opportunities",
                desc: "Explore a wide range of academic curriculums and extracurricular cognitive skill development."
              }
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-amber-400 transition-all hover:shadow-md space-y-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs">
                  ✓
                </div>
                <h3 className="text-base font-black text-slate-900">
                  {benefit.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          7. FINAL CALL-TO-ACTION SECTION
         ======================================================== */}
      <section className="py-16 sm:py-24 bg-[#0a1829] text-white relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-black uppercase tracking-widest inline-block">
              Start Today
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Find the Right Tutor. Discover New Skills. <br className="hidden sm:inline" />
              <span className="text-[#ffb800]">Grow with AACHARYA.</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed">
              The right guidance can make a meaningful difference in a student's learning journey. Start exploring tutors and coaches near you today.
            </p>
          </div>

          {/* Golden Highlight Tagline */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 max-w-2xl mx-auto">
            <p className="text-xs sm:text-sm font-bold text-amber-300">
              AACHARYA – Find the Right Tutor. Discover the Right Coach. Learn and Grow.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/find-tutor-nearby"
              className="px-8 py-4 rounded-2xl bg-[#ffb800] hover:bg-[#ffa000] text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95"
            >
              EXPLORE TUTORS &amp; COACHES
            </Link>

            <Link
              href="/request-tutor"
              className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all border border-white/20 hover:border-amber-400"
            >
              POST YOUR REQUIREMENT
            </Link>

            <Link
              href="/contact"
              className="px-6 py-4 rounded-2xl text-slate-400 hover:text-white font-bold text-xs sm:text-sm transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
