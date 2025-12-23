"use client";

import React from 'react';
import { Phone, Mail, MapPin, ArrowRight, MessageSquare, User, AtSign, Smartphone } from 'lucide-react';

const ContactSection: React.FC = () => {
  return (
    <section className="relative py-24 bg-slate-50 overflow-hidden font-sans" id="contact">
      
      {/* --- Background Elements --- */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-amber-50 -skew-x-12 translate-x-32 z-0"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-200 rounded-full blur-3xl opacity-50 z-0"></div>
      
      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        
        {/* --- Header --- */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-4">
             <MessageSquare className="w-4 h-4 text-amber-500" />
             <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Admissions Open</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
             Start Your Journey <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-500">
               With Aacharya.
             </span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">
             Have questions about our curriculum or fee structure? Fill out the form and our academic counselor will get in touch.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* --- LEFT: Contact Info Card (Premium Glass Style) --- */}
          <div className="w-full lg:w-5/12">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20 h-full flex flex-col justify-between">
               
               {/* Decor */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

               <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">Contact Information</h3>
                  <p className="text-slate-400 mb-10 text-sm">Reach out to us directly via phone or email.</p>

                  <div className="space-y-8">
                     {/* Phone Item */}
                     <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                           <Phone className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Call Us</p>
                           <p className="text-lg font-medium text-white hover:text-amber-400 transition-colors cursor-pointer">+91 80741 03400</p>
                        </div>
                     </div>

                     {/* Email Item */}
                     <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                           <Mail className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Us</p>
                           <p className="text-lg font-medium text-white hover:text-amber-400 transition-colors cursor-pointer break-all">info@aacharya.com</p>
                        </div>
                     </div>

                     {/* Location Item */}
                     <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                           <MapPin className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Main Campus</p>
                           <p className="text-lg font-medium text-white leading-snug">
                              Lalitha Nagar Road, Swathi Theatre Rd, opposite Indrakeeladri Apartment, near Sivalayam Center, Chittinagar, Bhavanipuram, V D Puram, Vijayawada, Andhra Pradesh 520012
                           </p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Bottom Quote */}
               <div className="relative z-10 pt-12 mt-8 border-t border-white/10">
                  <p className="text-slate-400 text-sm italic">
                    "Education is the passport to the future."
                  </p>
               </div>

            </div>
          </div>

          {/* --- RIGHT: The Form (Clean & Spacious) --- */}
          <div className="w-full lg:w-7/12">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100">
               
               <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     
                     {/* Parent Name */}
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Parent's Name <span className="text-red-500">*</span></label>
                        <div className="relative">
                           <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                           <input 
                             type="text" 
                             placeholder="Enter your name" 
                             className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                           />
                        </div>
                     </div>

                     {/* Student Name */}
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Student's Name <span className="text-red-500">*</span></label>
                        <div className="relative">
                           <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                           <input 
                             type="text" 
                             placeholder="Enter child's name" 
                             className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                           />
                        </div>
                     </div>

                     {/* Email */}
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Email Address <span className="text-red-500">*</span></label>
                        <div className="relative">
                           <AtSign className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                           <input 
                             type="email" 
                             placeholder="example@gmail.com" 
                             className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                           />
                        </div>
                     </div>

                     {/* Phone */}
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Phone Number <span className="text-red-500">*</span></label>
                        <div className="relative">
                           <Smartphone className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                           <input 
                             type="tel" 
                             placeholder="+91 98765 43210" 
                             className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                           />
                        </div>
                     </div>

                     {/* Message */}
                     <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Message / Query</label>
                        <textarea 
                          rows={4}
                          placeholder="Tell us about your requirements..." 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium text-slate-900 placeholder:text-slate-400 resize-none"
                        ></textarea>
                     </div>

                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                     <button type="button" className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-10 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 hover:-translate-y-1">
                        Submit Enquiry
                        <ArrowRight className="w-5 h-5" />
                     </button>
                  </div>

               </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;