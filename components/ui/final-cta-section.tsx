"use client";

import React from 'react';
import { ChevronRight, Star, Trophy, Users, Clock } from 'lucide-react';

export default function FinalCTASection() {
  const benefits = [
    {
      icon: <Star className="w-6 h-6" />,
      text: "Free Trial Class",
      subtext: "No commitment needed",
    },
    {
      icon: <Users className="w-6 h-6" />,
      text: "Expert Coaches",
      subtext: "FIDE-rated trainers",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      text: "Flexible Timing",
      subtext: "Choose your schedule",
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      text: "Proven Results",
      subtext: "100+ champions created",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 border-2 border-white rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/30 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
            <span className="text-sm font-semibold text-amber-300">Limited Time Offer</span>
          </div>
          
          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8">
            Ready to Begin Your{" "}
            <span className="relative">
              <span className="relative z-10 bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
                Champion's Journey?
              </span>
              <span className="absolute -bottom-2 left-0 w-full h-3 bg-gradient-to-r from-purple-500/50 to-pink-500/50 transform rotate-[-1deg] z-0"></span>
            </span>
          </h2>
          
          {/* Subheading */}
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join 5,000+ students who transformed their chess skills with Aacharya Academy. 
            Your first step to becoming a champion starts here.
          </p>

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-amber-400 mb-4">
                  {benefit.icon}
                </div>
                <p className="text-white font-bold text-lg mb-1">{benefit.text}</p>
                <p className="text-gray-400 text-sm">{benefit.subtext}</p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="group bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-gray-900 font-bold py-5 px-12 rounded-xl text-lg flex items-center gap-3 shadow-lg shadow-amber-500/20 hover:shadow-xl transition-all duration-300">
              <span>Book Free Trial Class</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="group border-2 border-white/30 hover:border-white/60 text-white font-bold py-5 px-12 rounded-xl text-lg flex items-center gap-3 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <span>Talk to Advisor</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

          {/* Trust Signals */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="text-gray-400 mb-6">Trusted by parents worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-300">
              <span className="font-semibold">Google Reviews 4.9/5</span>
              <span className="font-semibold">Trustpilot Excellent</span>
              <span className="font-semibold">Chess.com Partner</span>
              <span className="font-semibold">FIDE Certified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-4 h-4 bg-amber-400 rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/3 right-10 w-6 h-6 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
    </section>
  );
}