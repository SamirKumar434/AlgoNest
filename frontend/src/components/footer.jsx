import React from 'react';
import { Link } from 'react-router';
import { FaLinkedin, FaGithub, FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer id='contact' className="bg-black text-white py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        
        <div className="mb-8">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <span className="text-orange-500">{"<>"}</span> AlgoNest
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mb-10 text-sm font-medium text-gray-400">
          <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <Link to="/problems" className="hover:text-orange-500 transition-colors">Problems</Link>
          {/* External Link to Visualizer */}
          <a href="https://algoflickv2.netlify.app/" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">Visualize</a>
          {/* Internal Scroll Link to Contact */}
          <a href="#contact" className="hover:text-orange-500 transition-colors">Contact Us</a>
        </div>

        <div className="flex items-center gap-6 mb-10">
          <a href="https://www.linkedin.com/in/samir-kumar-sahu-1726883a6" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-orange-500 transition-all shadow-lg"><FaLinkedin size={20} /></a>
          <a href="https://github.com/SamirKumar434" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-orange-500 transition-all shadow-lg"><FaGithub size={20} /></a>
          <a href="https://x.com/Samir_kumar19?t=59IZjgWvM2UOMVTwaPKoDw&s=08" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-orange-500 transition-all shadow-lg"><FaXTwitter size={18} /></a>
        </div>

        <div className="w-full pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-gray-600 font-mono tracking-widest uppercase">
          <p>© {new Date().getFullYear()} AlgoNest // DEPLOYED_READY</p>
          <p className="flex items-center gap-1">Built for <span className="text-orange-500 font-bold px-1">{"{ Developers }"}</span> by AlgoNest</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;