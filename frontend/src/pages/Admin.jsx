import React, { useState } from 'react';
import { Plus, Edit, Trash2, Video, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router';
import Navbar from '../components/navBar'; // Ensure branding consistency

function Admin() {
  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem with test cases and templates.',
      icon: Plus,
      route: '/admin/create'
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Edit existing problems, descriptions, or code logic.',
      icon: Edit,
      route: '/admin/update'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Permanently remove coding problems from the database.',
      icon: Trash2,
      route: '/admin/delete'
    },
    {
      id: 'video',
      title: 'Video Solutions',
      description: 'Manage and upload video walkthroughs for problems.',
      icon: Video,
      route: '/admin/video'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-500/30 overflow-x-hidden">
      <Navbar />

      {/* Background Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-orange-600/[0.05] blur-[120px] pointer-events-none -z-0" />

      <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Admin <span className="text-orange-500">Panel</span>
          </h1>
          <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">
            Control Center // Manage Platform Assets
          </p>
        </div>

        {/* Admin Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {adminOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <NavLink 
                key={option.id}
                to={option.route}
                className="group relative p-8 rounded-3xl bg-black border border-white/10 hover:border-orange-500/40 transition-all duration-500 overflow-hidden shadow-2xl"
              >
                {/* Hover Glow Effect */}
                <div className="absolute -inset-1 bg-orange-600/[0.03] opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                
                <div className="relative flex items-start gap-6">
                  {/* Icon Container */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-orange-500 group-hover:scale-110 group-hover:bg-orange-500/10 group-hover:border-orange-500/20 transition-all duration-500">
                    <IconComponent size={32} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl font-bold group-hover:text-orange-500 transition-colors">
                        {option.title}
                      </h2>
                      <ChevronRight size={20} className="text-gray-600 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                    </div>
                    
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                      {option.description}
                    </p>

                    <span className="text-xs font-bold uppercase tracking-widest text-orange-500/60 group-hover:text-orange-500">
                      Launch Module →
                    </span>
                  </div>
                </div>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Admin;