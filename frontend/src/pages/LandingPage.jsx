import React from 'react';
import Navbar from '../components/navBar';
import Hero from '../components/hero';
import WhyAlgonest from '../components/WhyAlgoNest';
import Footer from '../components/footer';
import Roadmap from '../components/Roadmap';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-500/30 overflow-x-hidden">
      <Navbar />
      
      {/* Background Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-orange-600/[0.03] blur-[120px] pointer-events-none -z-0" />
      
      <main className="relative z-10 bg-black">
        {/* Hero Section - The "View Roadmap" button here should call scrollIntoView */}
        <Hero />

        {/* Core Value Proposition Section */}
        <WhyAlgonest />

        {/* Integrated Roadmap Section with ID for Scroll Navigation */}
        <div className="bg-[#050505] border-y border-white/5">
          <Roadmap id="roadmap-section" />
        </div>

        {/* Call to Action Section */}
        <section className="relative py-32 overflow-hidden bg-black border-t border-white/5">
          {/* Section Decorative Flare */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/[0.07] blur-[120px] pointer-events-none" />
          
          <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
            <div className="inline-block px-4 py-1 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              Limited Access Beta
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-black mb-8 tracking-tighter uppercase leading-[0.9]">
              Ready to master <br />
              <span className="text-orange-500">DSA Patterns</span>?
            </h2>
            
            <p className="text-gray-500 mb-12 text-lg leading-relaxed max-w-2xl mx-auto font-medium">
              Join students from SJBIT and beyond who are simplifying their technical interview preparation with our pattern-based approach.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="px-10 py-4 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest text-xs rounded-full shadow-2xl shadow-orange-900/40 transition-all hover:scale-105 active:scale-95">
                Get Started for Free
              </button>
              <button className="px-10 py-4 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-white/5 transition-all">
                Explore Problems
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;