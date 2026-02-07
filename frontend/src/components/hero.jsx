import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router'; // Added for navigation

const Hero = () => {
  const navigate = useNavigate(); // Initialize navigation
  const [textIndex, setTextIndex] = useState(0);
  const words = ["AlgoNest!", "Concepts!"];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const codeString = `class AlgoNest {
  private:
    vector<string> patterns;
    bool isGrasped;

  public:
    void learn() {
      // Mastering DSA logic...
      graspConcept();
    }
};`;

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-black text-white">
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-orange-600/[0.08] blur-[120px] rounded-full" />
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center z-10">
        <div className="text-left lg:pl-12">
          <div className="inline-block px-4 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-500 text-xs mb-6 uppercase tracking-wider">
            Master Patterns, Not Just Problems
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight tracking-tight">
            Crack the Code with{" "}
            <span className="inline-block relative h-[1.2em] align-top overflow-visible min-w-[280px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={words[textIndex]}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-orange-500 absolute left-0 whitespace-nowrap"
                >
                  {words[textIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>
          <p className="mt-6 text-gray-400 text-base lg:text-lg max-w-lg leading-relaxed">
            We simplify DSA by organizing questions into recognizable <b>patterns</b>. 
            Grasp core concepts faster with our integrated visualizer and AI-driven insights.
          </p>
          <div className="mt-10 flex gap-4">
            {/* Navigates to the problems page on click */}
            <button 
              onClick={() => navigate('/problems')}
              className="px-7 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full transition-all shadow-lg shadow-orange-900/40 hover:scale-105 text-sm"
            >
              Start Practicing
            </button>
            <button className="px-7 py-3 border border-white/20 text-white font-bold rounded-full hover:bg-white/5 transition-all text-sm">
              View Roadmap
            </button>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end lg:pr-12">
          <div className="relative w-full max-w-[380px]">
            <div className="absolute -inset-1 bg-gradient-to-br from-orange-500 to-orange-800 rounded-2xl opacity-40 blur-md"></div>
            <div className="relative bg-black border border-orange-500/20 rounded-2xl overflow-hidden aspect-[4/4.5] shadow-[0_0_50px_-12px_rgba(249,115,22,0.3)]">
              <div className="bg-[#0a0a0a] px-5 py-3 flex items-center justify-between border-b border-white/5 text-[9px] text-gray-400 font-mono tracking-widest uppercase">
                AlgoNest.cpp
              </div>
              <div className="p-6 font-mono text-[11px] sm:text-xs text-gray-300 leading-relaxed overflow-hidden">
                <Typewriter text={codeString} delay={40} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Typewriter = ({ text, delay }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else {
      setTimeout(() => { setCurrentText(''); setCurrentIndex(0); }, 4000);
    }
  }, [currentIndex, delay, text]);

  return <span className="block whitespace-pre">{currentText}<span className="animate-pulse border-r-2 border-orange-500 ml-1"></span></span>;
};

export default Hero;