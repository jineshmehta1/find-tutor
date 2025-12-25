"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Star,
  Users,
  Clock,
  BookOpen,
  Target,
  Zap,
  Crown,
  ChevronDown,
  ChevronUp,
  Play,
  CheckCircle,
  Award,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function CoursesPage() {
  const [expandedCourses, setExpandedCourses] = useState<{ [key: number]: boolean }>({});
  const [activeLevel, setActiveLevel] = useState("all");

  const toggleFeatures = (index: number) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const courses = [
    {
      title: "Beginner Level –1",
      level: "beginner",
      duration: "3 Months",
      price: "₹15,000",
      students: "50+",
      rating: "4.9",
      icon: BookOpen,
      color: "from-blue-400 to-cyan-400",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
      description: "Perfect for complete beginners starting their chess journey.",
      features: [
        "Introduction to Chess",
        "Chess Board setup and Name of Pieces",
        "Initial Position of pieces",
        "Movement of Pieces",
        "Value of Pieces",
        "Rules",
        "Capture and Exchange",
        "Files, Ranks, Diagonals, Center",
        "Checkmate and Stalemate",
        "Special Rules – Castling, Pawn Promotion, and En Passant",
      ],
      schedule: "2 classes per week (1.5 hours each)",
      ageGroup: "6+ years",
      classSize: "8-10 students",
      popular: true,
    },
    {
      title: "Beginner Level –2",
      level: "beginner",
      duration: "3 Months",
      price: "₹15,000",
      students: "45+",
      rating: "4.8",
      icon: BookOpen,
      color: "from-blue-400 to-cyan-400",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
      description: "Builds on basics with focus on checkmates and simple tactics.",
      features: [
        "Elementary Checkmates",
        "King + Queen Vs King",
        "King + 2 Rooks Vs King",
        "King + Rook Vs King",
        "King + 2 Bishops Vs King",
        "Check Combination",
        "Checkmate in 1 move",
        "Checkmate in 2 move",
        "Pin (basic)",
        "Fork (basic)",
      ],
      schedule: "2 classes per week (1.5 hours each)",
      ageGroup: "6+ years",
      classSize: "8-10 students",
    },
    {
      title: "Intermediate Level –1",
      level: "intermediate",
      duration: "4 Months",
      price: "₹20,000",
      students: "40+",
      rating: "4.8",
      icon: Target,
      color: "from-emerald-400 to-green-400",
      bgColor: "bg-gradient-to-br from-emerald-50 to-green-50",
      borderColor: "border-emerald-200",
      description: "Introduces intermediate players to advanced tactics.",
      features: [
        "Pin",
        "Absolute Pin",
        "Relative Pin",
        "Fork",
        "Checkmate in 3 moves",
        "Checkmate in 4 moves",
        "Double Attack",
        "Discovered Check",
      ],
      schedule: "3 classes per week (2 hours each)",
      ageGroup: "8+ years",
      classSize: "6-8 students",
      popular: true,
    },
    {
      title: "Intermediate Level –2",
      level: "intermediate",
      duration: "4 Months",
      price: "₹20,000",
      students: "40+",
      rating: "4.8",
      icon: Target,
      color: "from-emerald-400 to-green-400",
      bgColor: "bg-gradient-to-br from-emerald-50 to-green-50",
      borderColor: "border-emerald-200",
      description: "Focuses on opening basics and tactical patterns.",
      features: [
        "Opening Basics",
        "Center control",
        "Development of pieces",
        "Placing piece on good squares",
        "Coordination of pieces",
        "Opening – Giuoco Piano (King Pawn Opening)",
        "Checkmate in 3 moves",
        "Checkmate in 4 moves",
        "Double Attack",
        "Discovered Check",
      ],
      schedule: "3 classes per week (2 hours each)",
      ageGroup: "8+ years",
      classSize: "6-8 students",
    },
    {
      title: "Intermediate Level –3",
      level: "intermediate",
      duration: "4 Months",
      price: "₹20,000",
      students: "35+",
      rating: "4.8",
      icon: Target,
      color: "from-emerald-400 to-green-400",
      bgColor: "bg-gradient-to-br from-emerald-50 to-green-50",
      borderColor: "border-emerald-200",
      description: "Deepens tactical understanding with complex motifs.",
      features: [
        "Discovered Attack",
        "Decoy",
        "X – ray",
        "Attraction",
        "Interference",
        "Over worked piece",
      ],
      schedule: "3 classes per week (2 hours each)",
      ageGroup: "8+ years",
      classSize: "6-8 students",
    },
    {
      title: "Intermediate Level –4",
      level: "intermediate",
      duration: "4 Months",
      price: "₹20,000",
      students: "35+",
      rating: "4.8",
      icon: Target,
      color: "from-emerald-400 to-green-400",
      bgColor: "bg-gradient-to-br from-emerald-50 to-green-50",
      borderColor: "border-emerald-200",
      description: "Covers opening preparation and pawn structures.",
      features: [
        "Opening",
        "Preparing an Opening repertoire according to need of Intermediate level",
        "Open files and Diagonals",
        "Pawn Structure",
        "Double Pawns",
        "Isolated Pawn",
        "Connected Pawns",
        "Backward Pawn",
        "Passed Pawn",
        "Double Check",
        "Trapped Man",
        "Zugzwang",
        "Clearance",
      ],
      schedule: "3 classes per week (2 hours each)",
      ageGroup: "8+ years",
      classSize: "6-8 students",
    },
    {
      title: "Advanced Level –1",
      level: "advanced",
      duration: "6 Months",
      price: "₹30,000",
      students: "25+",
      rating: "4.9",
      icon: Trophy,
      color: "from-purple-400 to-pink-400",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
      borderColor: "border-purple-200",
      description: "Intensive training for competitive players.",
      features: [
        "Types of Centre",
        "Open Centre",
        "Closed Centre",
        "Static Centre",
        "Dynamic Centre",
        "Pawn Centre",
        "Pawn Endgames",
        "Opening Repertoire for Advanced Level player",
        "Space Advantage",
        "In depth analysis of Opening lines",
        "Pawn chain",
        "Pawn wedge",
        "Prophylaxis",
        "Exploiting an Advantage",
        "Knight Endgames",
        "Outpost",
        "Including Pieces into Attack",
        "Greek gift",
        "Focal Point g7",
        "Sacrifice on f7",
        "Sacrifice on h6",
        "Rook Lifting",
        "Bishop Vs Knight",
        "Initiative",
        "Manoeuvring",
        "Positional Sacrifices",
      ],
      schedule: "4 classes per week (2.5 hours each)",
      ageGroup: "12+ years",
      classSize: "4-6 students",
      popular: true,
    },
    {
      title: "Advanced Level –2",
      level: "expert",
      duration: "6 Months",
      price: "₹30,000",
      students: "20+",
      rating: "4.9",
      icon: Crown,
      color: "from-amber-400 to-orange-400",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
      borderColor: "border-amber-200",
      description: "Elite training for aspiring masters with focus on discipline.",
      features: [
        "Conditions",
        "Completing Chess homework on time",
        "Participation in tournaments as recommended",
        "Regular attendance",
        "Regular practice at home",
      ],
      schedule: "4 classes per week (2.5 hours each)",
      ageGroup: "12+ years",
      classSize: "4-6 students",
    }
  ];

  const filteredCourses = activeLevel === "all" 
    ? courses 
    : courses.filter(course => course.level === activeLevel);

  const levelFilters = [
    { id: "all", label: "All Courses", color: "from-gray-600 to-gray-800" },
    { id: "beginner", label: "Beginner", color: "from-blue-500 to-cyan-500" },
    { id: "intermediate", label: "Intermediate", color: "from-emerald-500 to-green-500" },
    { id: "advanced", label: "Advanced", color: "from-purple-500 to-pink-500" },
    { id: "expert", label: "Expert", color: "from-amber-500 to-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-10">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-6 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 px-6 py-2 text-lg shadow-lg">
            <Sparkles className="w-4 h-4 mr-2" />
            Master Chess with Expert Guidance
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
            Chess Courses
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Strategic learning paths designed to transform beginners into masters through proven methodologies
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/contact">
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-3 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <Play className="w-5 h-5 mr-2" />
                Start Learning Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Level Filter */}
      <section className="relative py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {levelFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveLevel(filter.id)}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeLevel === filter.id
                    ? `bg-gradient-to-r ${filter.color} text-white shadow-lg`
                    : "bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 hover:bg-white"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Courses Grid*/}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredCourses.map((course, index) => (
              <div
                key={index}
                className={`relative ${course.bgColor} border-2 ${course.borderColor} rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden group`}
              >
                {/* Popular Badge */}
                {course.popular && (
                  <div className="absolute top-6 right-6 z-10">
                    <Badge className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-4 py-1 rounded-full shadow-lg">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                {/* Course Header */}
                <div className={`h-3 bg-gradient-to-r ${course.color}`}></div>
                
                <CardContent className="p-8">
                  {/* Course Icon and Title */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 bg-gradient-to-r ${course.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <course.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">{course.title}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className={`border-current text-xs px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm`}>
                            {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {course.rating}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price and Duration */}
                  <div className="flex items-center justify-between mb-6 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200">
                    <div>
                      <div className="text-3xl font-bold text-gray-800">{course.price}</div>
                      <div className="text-sm text-gray-600">{course.duration} program</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        {course.students} students
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed">{course.description}</p>

                  {/* Course Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Course Schedule
                      </h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>{course.schedule}</div>
                        <div>Age: {course.ageGroup}</div>
                        <div>Class size: {course.classSize}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Key Topics
                      </h4>
                      <div className="space-y-2">
                        {course.features.slice(0, 3).map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </div>
                        ))}
                        {course.features.length > 3 && (
                          <>
                            {expandedCourses[index] ? (
                              <>
                                {course.features.slice(3).map((feature, featureIndex) => (
                                  <div key={featureIndex + 3} className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-sm text-gray-600">{feature}</span>
                                  </div>
                                ))}
                                <button
                                  className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:underline mt-2"
                                  onClick={() => toggleFeatures(index)}
                                >
                                  <ChevronUp className="w-4 h-4" />
                                  Show less
                                </button>
                              </>
                            ) : (
                              <button
                                className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:underline mt-2"
                                onClick={() => toggleFeatures(index)}
                              >
                                <ChevronDown className="w-4 h-4" />
                                +{course.features.length - 3} more topics
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-3">
                    <Link href="/contact" className="flex-1">
                      <Button className={`w-full bg-gradient-to-r ${course.color} hover:opacity-90 text-white py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300`}>
                        Enroll Now
                      </Button>
                    </Link>
                    <Button variant="outline" className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-white/50 py-3 rounded-2xl backdrop-blur-sm">
                     Learn more
                    </Button>
                  </div>
                </CardContent>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Why Learn With Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our proven approach combines expert instruction with personalized attention
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Small Batch Sizes",
                description: "Maximum 10 students per batch ensuring individual attention and personalized feedback.",
                color: "from-blue-400 to-cyan-400"
              },
              {
                icon: Trophy,
                title: "Proven Track Record",
                description: "500+ students transformed from beginners to competitive tournament players.",
                color: "from-emerald-400 to-green-400"
              },
              {
                icon: Zap,
                title: "Progressive Curriculum",
                description: "Systematic learning path designed by FIDE rated coaches and chess masters.",
                color: "from-purple-400 to-pink-400"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-3xl border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-2">
                <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Master Chess?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join our community of chess enthusiasts and start your journey towards mastery today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  Book Free Trial Class
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg rounded-2xl font-semibold backdrop-blur-sm">
                  Speak with Coach
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
