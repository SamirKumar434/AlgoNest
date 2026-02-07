import React from 'react';
import { Map, ChevronRight, Lock, CheckCircle2 } from 'lucide-react';

const Roadmap = ({ id }) => {
  const chapters = [
    { id: 1, title: "Foundations", topics: ["Arrays", "Hashing"], status: "completed" },
    { id: 2, title: "Linear Structures", topics: ["Two Pointers", "Sliding Window"], status: "current" },
    { id: 3, title: "Hierarchical Data", topics: ["Trees", "Graphs"], status: "locked" },
  ];

  return (
    <section id={id} className="py-24 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-orange-600/5 blur-[100px] -z-10" />
      
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            Learning <span className="text-orange-500">Roadmap</span>
          </h2>
          <p className="text-gray-500 font-mono text-[10px] uppercase tracking-[0.3em] mt-2">
            Master patterns through deliberate practice
          </p>
        </div>

        <div className="space-y-4">
          {chapters.map((chapter, index) => (
            <div key={chapter.id} className="relative group">
              {index !== chapters.length - 1 && (
                <div className="absolute left-[39px] top-16 w-px h-12 bg-white/10" />
              )}
              
              <div className={`flex items-center gap-6 p-5 rounded-2xl border transition-all ${
                chapter.status === 'current' 
                ? 'bg-orange-500/[0.03] border-orange-500/30 shadow-[0_0_30px_-10px_rgba(249,115,22,0.2)]' 
                : 'bg-white/[0.01] border-white/5'
              }`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                  chapter.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                  chapter.status === 'current' ? 'bg-orange-500 border-orange-600 text-white shadow-lg shadow-orange-900/40' :
                  'bg-white/5 border-white/10 text-gray-700'
                }`}>
                  {chapter.status === 'completed' ? <CheckCircle2 size={20} /> : 
                   chapter.status === 'locked' ? <Lock size={20} /> : 
                   <Map size={20} />}
                </div>

                <div className="flex-1">
                  <h3 className={`text-sm font-black uppercase tracking-widest ${chapter.status === 'locked' ? 'text-gray-700' : 'text-white'}`}>
                    {chapter.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {chapter.topics.map(topic => (
                      <span key={topic} className="text-[9px] font-mono text-gray-500 uppercase">
                        #{topic}
                      </span>
                    ))}
                  </div>
                </div>

                <ChevronRight size={18} className={chapter.status === 'locked' ? 'text-gray-800' : 'text-gray-500'} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Roadmap;