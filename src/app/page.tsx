'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Shield, Zap } from 'lucide-react';

export default function LandingPage() {
  const [username, setUsername] = useState('');

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-black italic tracking-tighter text-black">NGL</h1>
        <Link 
          href="/messigo8" 
          className="bg-black text-white px-5 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition-transform"
        >
          My Inbox
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="px-6 pt-16 pb-24 max-w-5xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] text-black">
            GET ANONYMOUS<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff3c83] to-[#ff7a18]">MESSAGES</span>
          </h2>
          <p className="text-gray-500 font-bold text-lg md:text-xl max-w-md mx-auto">
            Share your link on Instagram and see what your friends really think!
          </p>
        </motion.div>

        {/* Action Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-12 w-full max-w-md bg-gray-50 rounded-[2.5rem] p-10 shadow-sm border border-gray-100"
        >
          <div className="flex flex-col space-y-6">
            <div className="bg-white p-6 rounded-3xl border-2 border-gray-100 shadow-inner">
               <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mb-1">Your Unique Link</p>
               <p className="text-xl font-black text-black">ngl.link/asad_w69</p>
            </div>
            
            <Link
              href="/asad_w69"
              className="w-full py-5 rounded-2xl font-black text-xl flex items-center justify-center space-x-2 transition-all shadow-xl active:scale-95 bg-black text-white hover:bg-gray-900"
            >
              <span>View Public Page</span>
              <ArrowRight size={24} />
            </Link>
          </div>
          
          <p className="mt-6 text-gray-400 font-bold text-sm">
            🔒 asad_w69's anonymous q&a
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <FeatureCard 
            icon={<Shield className="text-[#ff3c83]" />} 
            title="Safe & Private" 
            desc="Top tier AI moderation to keep things fun and safe." 
          />
          <FeatureCard 
            icon={<Zap className="text-[#ff7a18]" />} 
            title="Fast Replies" 
            desc="Get notifications instantly when a friend sends a message." 
          />
          <FeatureCard 
            icon={<MessageCircle className="text-cyan-500" />} 
            title="IG Integration" 
            desc="Specially built for Instagram stories with premium layouts." 
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 text-center">
        <p className="text-gray-400 font-bold text-sm italic">Made with ❤️ by Antigravity</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-gray-50 rounded-3xl p-8 text-left border border-gray-100 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
        {icon}
      </div>
      <h3 className="font-black text-xl mb-2">{title}</h3>
      <p className="text-gray-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}
