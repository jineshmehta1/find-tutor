"use client";

import React, { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import {
   Phone, Mail, MapPin, ArrowRight, MessageSquare,
   User, AtSign, Smartphone, GraduationCap, ChevronDown,
   Loader2, CheckCircle, Clock, ShieldCheck
} from 'lucide-react';

const ContactSection: React.FC = () => {
   const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
   const [captchaToken, setCaptchaToken] = useState<string | null>(null);
   const [captchaError, setCaptchaError] = useState('');
   const recaptchaRef = useRef<ReCAPTCHA>(null);
   const [formData, setFormData] = useState({
      parentName: '',
      studentName: '',
      email: '',
      phone: '',
      queryType: '',
      message: ''
   });

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setCaptchaError('');

      if (!captchaToken) {
         setCaptchaError('Please complete the CAPTCHA verification.');
         return;
      }

      setStatus('loading');

      try {
         const response = await fetch('/api/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData, captchaToken }),
         });

         if (response.ok) {
            setStatus('success');
            setFormData({ parentName: '', studentName: '', email: '', phone: '', queryType: '', message: '' });
            setCaptchaToken(null);
            recaptchaRef.current?.reset();
         } else {
            const data = await response.json().catch(() => ({}));
            if (data?.error === 'CAPTCHA verification failed') {
               setCaptchaError('CAPTCHA verification failed. Please try again.');
               setCaptchaToken(null);
               recaptchaRef.current?.reset();
            }
            setStatus('error');
         }
      } catch (error) {
         setStatus('error');
      }
   };

   return (
      <section className="relative py-20 bg-slate-50 overflow-hidden font-sans" id="contact">
         {/* Background accent lines */}
         <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-100 -skew-x-12 translate-x-32 z-0"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-200/50 rounded-full blur-3xl opacity-50 z-0"></div>

         <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
            
            {/* Header */}
            <div className="text-center mb-16 space-y-3">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Connect with Us</span>
               </div>
               <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight leading-none">
                  Start Your Learning Journey <br />
                  <span className="text-gradient-gold">With Aacharya Platform</span>
               </h2>
               <p className="text-slate-500 text-xs md:text-sm font-semibold max-w-xl mx-auto">
                  Have questions about tutor rates, background checks, or want to register as an expert trainer? Send us a message!
               </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
               
               {/* --- LEFT: Contact Info --- */}
               <div className="w-full lg:w-5/12">
                  <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl flex flex-col justify-between h-full space-y-12">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                     
                     <div className="space-y-6 relative z-10">
                        <h3 className="text-2xl font-black tracking-tight">Contact Information</h3>
                        <p className="text-slate-400 text-xs font-medium leading-relaxed">
                           Our helpdesk is operational Monday to Saturday from 9:00 AM to 7:00 PM to help match you with verified home & online tutors.
                        </p>
                        
                        <div className="space-y-8 mt-10">
                           {/* Call */}
                           <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                                 <Phone className="w-5 h-5 text-amber-400" />
                              </div>
                              <div>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Call Support</p>
                                 <p className="text-base font-bold text-white">+91 80741 03400</p>
                              </div>
                           </div>

                           {/* Email */}
                           <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                                 <Mail className="w-5 h-5 text-amber-400" />
                              </div>
                              <div>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Email Team</p>
                                 <p className="text-base font-bold text-white">aacharyateam@gmail.com</p>
                              </div>
                           </div>

                           {/* Address */}
                           <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                                 <MapPin className="w-5 h-5 text-amber-400" />
                              </div>
                              <div>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Academy Address</p>
                                 <p className="text-xs font-medium text-slate-200 leading-relaxed">
                                    Aacharya, Opposite Indrakeeladri Apartment, Lalitha Nagar, Swathi Road, Near Sivalayam Center, Bhavanipuram, Vijayawada - 520012, Andhra Pradesh.
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Extra Trust Badge */}
                     <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-3 relative z-10">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                           <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified Safety Audit
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                           All tutors matched through Aacharya have their degrees, government IDs, and physical address audited by our team.
                        </p>
                     </div>

                  </div>
               </div>

               {/* --- RIGHT: The Form --- */}
               <div className="w-full lg:w-7/12">
                  <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100/50">
                     {status === 'success' ? (
                        <div className="text-center py-12 space-y-4">
                           <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-md">
                              <CheckCircle className="w-9 h-9" />
                           </div>
                           <h3 className="text-2xl font-black text-slate-950 tracking-tight">Enquiry Received!</h3>
                           <p className="text-xs text-slate-500 font-semibold max-w-sm mx-auto">
                              Our academic coordinator will evaluate your request and contact you directly with matching tutor quotes within 2 hours.
                           </p>
                           <button 
                              onClick={() => setStatus('idle')} 
                              className="text-xs font-extrabold text-primary hover:underline block mx-auto pt-2"
                           >
                              Send Another Request &rarr;
                           </button>
                        </div>
                     ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              
                              {/* Parent Name */}
                              <div className="space-y-1.5">
                                 <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Parent's Name <span className="text-red-500">*</span></label>
                                 <div className="relative">
                                    <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                                    <input required name="parentName" value={formData.parentName} onChange={handleChange} type="text" placeholder="e.g. Rajesh Kumar" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-xs font-semibold text-slate-900 placeholder:text-slate-400" />
                                 </div>
                              </div>

                              {/* Student Name */}
                              <div className="space-y-1.5">
                                 <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Student's Name <span className="text-red-500">*</span></label>
                                 <div className="relative">
                                    <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                                    <input required name="studentName" value={formData.studentName} onChange={handleChange} type="text" placeholder="e.g. Rohan Kumar" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-xs font-semibold text-slate-900 placeholder:text-slate-400" />
                                 </div>
                              </div>

                              {/* Email Address */}
                              <div className="space-y-1.5">
                                 <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Email Address <span className="text-red-500">*</span></label>
                                 <div className="relative">
                                    <AtSign className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                                    <input required name="email" value={formData.email} onChange={handleChange} type="email" placeholder="e.g. parent@example.com" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-xs font-semibold text-slate-900 placeholder:text-slate-400" />
                                 </div>
                              </div>

                              {/* Phone Number */}
                              <div className="space-y-1.5">
                                 <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Phone Number <span className="text-red-500">*</span></label>
                                 <div className="relative">
                                    <Smartphone className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                                    <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="e.g. 9876543210" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-xs font-semibold text-slate-900 placeholder:text-slate-400" />
                                 </div>
                              </div>

                              {/* --- QUERY TYPE DROPDOWN --- */}
                              <div className="md:col-span-2 space-y-1.5">
                                 <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">What is this query about? <span className="text-red-500">*</span></label>
                                 <div className="relative">
                                    <GraduationCap className="absolute left-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                                    <select
                                       required
                                       name="queryType"
                                       value={formData.queryType}
                                       onChange={handleChange}
                                       className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-xs font-semibold text-slate-950 appearance-none cursor-pointer"
                                    >
                                       <option value="" disabled>Select a category</option>
                                       <option value="School Tuition (Class 1-12)">School Tuition (Class 1-12)</option>
                                       <option value="Coding & AI Robotics Class">Coding & AI Robotics Class</option>
                                       <option value="Abacus Speed Math Class">Abacus Speed Math Class</option>
                                       <option value="Grandmaster Chess Coaching">Grandmaster Chess Coaching</option>
                                       <option value="JEE / NEET Competitive Exam Prep">JEE / NEET Competitive Exam Prep</option>
                                       <option value="Tutor Registration / Join Network">Tutor Registration / Join Network</option>
                                       <option value="General Enquiries">General Enquiries</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                                 </div>
                              </div>

                              {/* Message */}
                              <div className="md:col-span-2 space-y-1.5">
                                 <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Message / Detail</label>
                                 <textarea name="message" value={formData.message} onChange={handleChange} rows={4} placeholder="Mention class level, subjects, timing preferences, home or online choice..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-xs font-semibold text-slate-900 placeholder:text-slate-400 resize-none"></textarea>
                              </div>

                              {/* --- reCAPTCHA --- */}
                              <div className="md:col-span-2">
                                 <ReCAPTCHA
                                    ref={recaptchaRef}
                                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                                    onChange={(token) => { setCaptchaToken(token); setCaptchaError(''); }}
                                    onExpired={() => setCaptchaToken(null)}
                                 />
                                 {captchaError && <p className="text-red-500 text-xs font-semibold mt-2">{captchaError}</p>}
                              </div>
                           </div>

                           <div className="pt-2">
                              <button
                                 disabled={status === 'loading'}
                                 type="submit"
                                 className="w-full md:w-auto bg-primary hover:bg-primary/95 disabled:bg-slate-300 text-white font-bold py-4 px-10 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 text-xs uppercase tracking-wider"
                              >
                                 {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Inquiry'}
                                 <ArrowRight className="w-4 h-4" />
                              </button>
                              {status === 'error' && <p className="text-red-500 text-xs mt-2 font-semibold">Something went wrong. Please try again.</p>}
                           </div>
                        </form>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
};

export default ContactSection;