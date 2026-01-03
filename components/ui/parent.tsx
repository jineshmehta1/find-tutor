import React from 'react';

const curriculumData = [
  {
    title: "Reggio Emilia",
    description: "Creative, project-based experiences that encourage exploration and self-expression",
    color: "border-rose-400"
  },
  {
    title: "Waldorf",
    description: "Imagination-driven learning through music, movement, stories, and nature",
    color: "border-orange-400"
  },
  {
    title: "NEP 2020",
    description: "Strong foundation in literacy, numeracy, life skills, and holistic development",
    color: "border-blue-400"
  },
  {
    title: "Project Zero (Harvard)",
    description: "Learning that makes children's thinking visible, nurturing deep understanding",
    color: "border-amber-500"
  },
  {
    title: "Montessori",
    description: "Hands-on learning that builds independence, focus, and fine motor skills",
    color: "border-emerald-400"
  },
  {
    title: "EYFS (UK)",
    description: "Play-based learning that develops communication, confidence, and social skills",
    color: "border-indigo-400"
  },
];

const CurriculumSun = () => {
  return (
    <section className="bg-[#FFD642] py-20 px-6 overflow-hidden relative">
      {/* Decorative background circle */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl -z-0" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* LEFT SIDE: THE SUN DIAGRAM */}
        <div className="relative flex items-center justify-center min-h-[550px] md:min-h-[650px]">
          
          {/* Central Hub - Strong Black/Yellow Mix */}
          <div className="z-30 w-48 h-48 md:w-60 md:h-60 bg-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-center text-center p-8 border-[12px] border-amber-400">
            <div>
              <h3 className="font-black text-slate-900 text-xl md:text-2xl leading-none uppercase tracking-tighter">
                AACHARYA
              </h3>
              <div className="h-1 w-12 bg-amber-500 mx-auto my-2" />
              <p className="text-slate-800 text-sm md:text-base font-bold leading-tight">
                International<br/>
                <span className="text-amber-600">Curriculum</span><br/>
                Integration
              </p>
            </div>
          </div>

          {/* RADIAL CARDS (Desktop Layout) */}
          <div className="absolute inset-0 hidden md:block">
            
            {/* Positioned Cards Wrapper */}
            {[
              { pos: "top-12 left-28 -translate-x-1/2", data: curriculumData[0] },
              { pos: "top-12 right-3", data: curriculumData[1] },
              { pos: "top-1/2 -translate-y-1/2 -right-12", data: curriculumData[2] },
              { pos: "bottom-12 right-0", data: curriculumData[3] },
              { pos: "bottom-12 left-4", data: curriculumData[4] },
              { pos: "top-1/2 -translate-y-1/2 -left-12", data: curriculumData[5] },
            ].map((item, idx) => (
              <div key={idx} className={`absolute ${item.pos} w-52 group`}>
                <div className={`bg-white p-5 rounded-2xl shadow-xl border-l-4 ${item.data.color} transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl`}>
                  <h4 className="font-black text-amber-500 text-base mb-1 uppercase tracking-tight">
                    {item.data.title}
                  </h4>
                  <p className="text-[11px] font-bold text-slate-900 leading-snug">
                    {item.data.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Layout (Visible only on small screens) */}
          <div className="md:hidden grid grid-cols-2 gap-3 mt-12 w-full">
            {curriculumData.map((item, i) => (
              <div key={i} className="bg-white p-4 rounded-xl shadow-md border-l-4 border-amber-500">
                <h4 className="font-bold text-amber-600 text-[10px] uppercase mb-1">{item.title}</h4>
                <p className="text-[9px] font-black text-slate-900 leading-tight">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: THE TEXT CONTENT */}
        <div className="text-center lg:text-left space-y-8">
          <div className="inline-block px-4 py-1 rounded-full bg-white/30 border border-white/50 text-slate-900 font-bold text-sm uppercase tracking-widest">
            Our Learning Philosophy
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-[0.95] tracking-tighter">
            Global Curriculum.<br />
            <span className="text-white drop-shadow-sm">Strong Foundation.</span><br />
            <span className="text-amber-900/40">Happy Learners..</span>
          </h2>
          <p className="text-slate-900 text-lg md:text-xl font-bold leading-relaxed max-w-xl opacity-90">
            At Aacharya Preschool, learning goes beyond books. We blend play, thinking, 
            creativity, and care to nurture confident, curious, and capable children.
          </p>
          <button className="bg-slate-900 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest hover:bg-amber-600 transition-colors shadow-xl">
            Explore Programs
          </button>
        </div>

      </div>
    </section>
  );
};

export default CurriculumSun;