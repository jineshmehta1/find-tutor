"use client";

import React, { useState } from 'react';
import { 
  Phone, Mail, MapPin, ArrowRight, MessageSquare, 
  User, AtSign, Smartphone, GraduationCap, ChevronDown, 
  Loader2, CheckCircle 
} from 'lucide-react';

const ContactSection: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
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
    setStatus('loading');

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ parentName: '', studentName: '', email: '', phone: '', queryType: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <section className="relative py-24 bg-slate-50 overflow-hidden font-sans" id="contact">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-amber-50 -skew-x-12 translate-x-32 z-0"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-200 rounded-full blur-3xl opacity-50 z-0"></div>
      
      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
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
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* --- LEFT: Contact Info --- */}
          <div className="w-full lg:w-5/12">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20 h-full flex flex-col justify-between">
               <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
               <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">Contact Information</h3>
                  <div className="space-y-8 mt-10">
                     <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                           <Phone className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Call Us</p>
                           <p className="text-lg font-medium text-white">+91 80741 03400</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                           <Mail className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Us</p>
                           <p className="text-lg font-medium text-white">info@aacharya.com</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* --- RIGHT: The Form --- */}
          <div className="w-full lg:w-7/12">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100">
               {status === 'success' ? (
                 <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-slate-900">Enquiry Sent!</h3>
                    <p className="text-slate-500 mt-2">We will get back to you shortly.</p>
                    <button onClick={() => setStatus('idle')} className="mt-6 text-amber-600 font-bold hover:underline">Send another enquiry</button>
                 </div>
               ) : (
                 <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Parent's Name <span className="text-red-500">*</span></label>
                        <div className="relative">
                           <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                           <input required name="parentName" value={formData.parentName} onChange={handleChange} type="text" placeholder="Enter your name" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium text-slate-900 placeholder:text-slate-400" />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Student's Name <span className="text-red-500">*</span></label>
                        <div className="relative">
                           <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                           <input required name="studentName" value={formData.studentName} onChange={handleChange} type="text" placeholder="Enter child's name" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium text-slate-900 placeholder:text-slate-400" />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Email Address <span className="text-red-500">*</span></label>
                        <div className="relative">
                           <AtSign className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                           <input required name="email" value={formData.email} onChange={handleChange} type="email" placeholder="example@gmail.com" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium text-slate-900 placeholder:text-slate-400" />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Phone Number <span className="text-red-500">*</span></label>
                        <div className="relative">
                           <Smartphone className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                           <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="+91 80741 03400" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium text-slate-900 placeholder:text-slate-400" />
                        </div>
                     </div>

                     {/* --- NEW DROPDOWN --- */}
                     <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">What is query about? <span className="text-red-500">*</span></label>
                        <div className="relative">
                           <GraduationCap className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                           <select 
                             required
                             name="queryType"
                             value={formData.queryType}
                             onChange={handleChange}
                             className="w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium text-slate-900 appearance-none cursor-pointer"
                           >
                              <option value="" disabled>Select a category</option>
                              <option value="Pre School Admission">Pre School Admission</option>
                              <option value="Chess Class Admission">Chess Class Admission</option>
                              <option value="Robotics Class Admission">Robotics Class Admission</option>
                              <option value="Abacus Class Admission">Abacus Class Admission</option>
                              <option value="Tuition point Admission">Tuition point Admission</option>
                              <option value="Other enquiries">Other enquiries</option>
                           </select>
                           <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                        </div>
                     </div>

                     <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Message / Query</label>
                        <textarea name="message" value={formData.message} onChange={handleChange} rows={4} placeholder="Tell us about your requirements..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium text-slate-900 placeholder:text-slate-400 resize-none"></textarea>
                     </div>
                  </div>

                  <div className="pt-4">
                     <button 
                       disabled={status === 'loading'}
                       type="submit" 
                       className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white font-bold py-4 px-10 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 hover:-translate-y-1"
                     >
                        {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Enquiry'}
                        <ArrowRight className="w-5 h-5" />
                     </button>
                     {status === 'error' && <p className="text-red-500 text-sm mt-2 font-medium">Something went wrong. Please try again.</p>}
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