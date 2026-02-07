import React from 'react';
import { Target, Globe, Cpu, Lightbulb } from 'lucide-react'; 

const WhyAlgonest = () => {
  const cards = [
    { title: "Topic Wise Practice", desc: "Questions grouped by patterns like Sliding Window and Backtracking.", icon: <Target className="w-8 h-8 text-orange-500" /> },
    { title: "Multi Language Support", desc: "Practice in C++, Java, Python, or JavaScript seamlessly.", icon: <Globe className="w-8 h-8 text-orange-500" /> },
    { title: "AI Assistant Help", desc: "Get intelligent hints and complexity analysis when stuck.", icon: <Cpu className="w-8 h-8 text-orange-500" /> },
    { title: "Conceptual Projects", desc: "Apply knowledge to real-world scenarios through algorithm-heavy projects.", icon: <Lightbulb className="w-8 h-8 text-orange-500" /> }
  ];

  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-white">Why Choose <span className="text-orange-500">AlgoNest</span>?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, idx) => (
            <div key={idx} className="group p-8 rounded-3xl bg-black border border-white/10 hover:border-orange-500/30 transition-all duration-300 relative overflow-hidden">
              <div className="absolute -inset-1 bg-orange-600/[0.03] opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
              <div className="relative z-10">
                <div className="mb-6 p-3 rounded-2xl bg-orange-500/10 w-fit group-hover:scale-110 transition-transform">{card.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-white">{card.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyAlgonest;