"use client";

import React from 'react';
import { CheckIcon, ClockIcon, UsersIcon, SparklesIcon } from 'lucide-react';

interface Course {
  title: string;
  subtitle: string;
  image: string;
  goals: string;
  schedule: string;
  groupSize: string;
  price: string;
  privatePrice: string;
  benefits: string;
  accentColor: string;
}

const courses: Course[] = [
  {
    title: "Beginner",
    subtitle: "Learn to play",
    image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    goals: "Understanding the game, basic strategies and concepts in a fun way. Develop confidence to play matches.",
    schedule: "Weekly: 2 sessions, each lasting 45 minutes.",
    groupSize: "Determined based on the coach's recommendation.",
    price: "45 USD",
    privatePrice: "20 USD (1:1) | 18 USD (2:1)",
    benefits: "Complimentary guided practice sessions on zoom call.",
    accentColor: "border-green-400"
  },
  {
    title: "Intermediate",
    subtitle: "Master Chess Like a Pro",
    image: "https://aacharyaacademy.com/images/md2.png",
    goals: "Gain the confidence to participate in competitive chess tournaments. Progress towards earning a FIDE rating.",
    schedule: "Weekly: 2 sessions, each lasting 45 minutes.",
    groupSize: "Determined based on the coach's recommendation.",
    price: "52 USD",
    privatePrice: "20 USD (1:1) | 18 USD (2:1)",
    benefits: "Complimentary guided practice sessions on zoom call.",
    accentColor: "border-blue-400"
  },
  {
    title: "Advanced",
    subtitle: "Achieve Top Performance",
    image: "https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    goals: "Enhance performance in FIDE-rated tournaments. Master the finer points and nuances of chess.",
    schedule: "Weekly: 2 sessions, each 45 minutes long.",
    groupSize: "Determined based on the coach's recommendation.",
    price: "62 USD",
    privatePrice: "20 USD (1:1) | 18 USD (2:1)",
    benefits: "Free guided practice sessions.",
    accentColor: "border-purple-400"
  }
];

const CoursesSection: React.FC = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* --- Header Section --- */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-purple-700 bg-purple-100 rounded-full">
            Courses Fees
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a1a4b] tracking-tight">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Courses</span>
          </h2>
        </div>

        {/* --- Grid Layout --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {courses.map((course, index) => (
            <div 
              key={index} 
              className={`group bg-white rounded-[24px] border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full`}
            >
              
              {/* Image Header */}
              <div className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  }}
                />
                <div className="absolute bottom-4 left-6 z-20 text-white">
                  <h3 className="text-2xl font-bold">{course.title}</h3>
                  <p className="text-sm font-medium opacity-90">{course.subtitle}</p>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 md:p-8 flex-1 flex flex-col">
                
                {/* Goals */}
                <div className="mb-6">
                  <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">
                    <SparklesIcon className="w-4 h-4" /> Goals
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {course.goals}
                  </p>
                </div>

                <hr className="border-dashed border-gray-200 mb-6" />

                {/* Details List */}
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3">
                    <ClockIcon className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs font-bold text-gray-400 uppercase">Schedule</span>
                      <span className="text-sm text-gray-700 font-medium">{course.schedule}</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <UsersIcon className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs font-bold text-gray-400 uppercase">Group Size</span>
                      <span className="text-sm text-gray-700 font-medium">Small groups or 1:1</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs font-bold text-gray-400 uppercase">Benefits</span>
                      <span className="text-sm text-gray-700 font-medium">{course.benefits}</span>
                    </div>
                  </li>
                </ul>

                {/* Pricing Box */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mt-auto">
                  <div className="flex items-center justify-between mb-2">
                     <span className="text-sm text-gray-500 font-medium">Group Class</span>
                     <span className="text-xl font-bold text-[#1a1a4b]">{course.price} <span className="text-xs font-normal text-gray-400">/mo</span></span>
                  </div>
                  <div className="flex flex-col pt-2 border-t border-gray-200">
                     <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 font-medium">1:1 Session</span>
                        <span className="text-sm font-bold text-purple-600 text-right">{course.privatePrice}</span>
                     </div>
                     <span className="text-[10px] text-gray-400 text-right mt-1">per session</span>
                  </div>
                </div>

                {/* Button */}
                <button className="w-full mt-6 py-3 rounded-xl border-2 border-[#1a1a4b] text-[#1a1a4b] font-bold text-sm uppercase tracking-wide hover:bg-[#1a1a4b] hover:text-white transition-colors duration-300">
                  Enroll Now
                </button>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;