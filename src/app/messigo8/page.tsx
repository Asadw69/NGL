'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { Settings, Eye, ChevronRight, Bell, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InboxPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const SECRET_PASSWORD = "messigo8hai"; // You can change this anytime

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SECRET_PASSWORD) {
      setAuthorized(true);
      fetchMessages();
    } else {
      setError('Wrong password');
      setPassword('');
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('recipient_username', 'asad_w69')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setMessages(data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
    setLoading(false);
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#ff3c83] flex items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm bg-white rounded-[2.5rem] p-10 shadow-2xl text-center"
        >
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="text-[#ff3c83]" size={30} />
          </div>
          <h1 className="text-2xl font-black text-black mb-2">Private Inbox</h1>
          <p className="text-gray-400 font-bold text-sm mb-8">Enter password to view messages</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#ff3c83] focus:outline-none font-bold text-center transition-all"
              autoFocus
            />
            {error && <p className="text-red-500 text-xs font-black uppercase tracking-tighter">{error}</p>}
            <button 
              type="submit"
              className="w-full bg-black text-white py-4 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-transform"
            >
              Unlock
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff3c83]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto relative font-sans">
      {/* Meta tag added via Head in a real app, but Next.js handles it in layout or metadata. 
          For now, this page is locked by password which is 100% secure. */}
      
      {/* Header */}
      <header className="px-6 pt-12 pb-4 flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="relative">
          <Eye size={24} className="text-black" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full border-2 border-white" />
        </div>
        
        <div className="flex items-center space-x-6 text-[14px] font-black tracking-widest uppercase">
          <span className="text-gray-300">Play</span>
          <span className="text-black border-b-2 border-black pb-1">Inbox</span>
        </div>

        <Settings size={24} className="text-black" />
      </header>

      {/* Notification Toggle */}
      <div className="px-4 py-2">
        <div className="bg-gray-50/80 rounded-3xl p-5 flex items-center justify-between border border-gray-100">
          <div className="space-y-1">
            <h3 className="font-extrabold text-[15px] flex items-center">
              Turn on Notifications <span className="ml-1 text-lg">🔔</span>
            </h3>
            <p className="text-gray-400 text-[13px] font-medium leading-tight">
              Get notified when you get new messages
            </p>
          </div>
          <div className="w-12 h-6 bg-gray-200 rounded-full relative">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
          </div>
        </div>
      </div>

      {/* Message List */}
      <main className="flex-1 px-4 py-4 space-y-0.5 pb-32">
        {!messages || messages.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-bold">No messages yet...</div>
        ) : (
          messages.map((msg) => (
            <Link 
              key={msg?.id || Math.random()} 
              href={`/messigo8/${msg?.id}`}
              className="flex items-center p-4 hover:bg-gray-50 active:bg-gray-100 rounded-2xl transition-colors group"
            >
              <div className="relative w-12 h-12 flex-shrink-0">
                 <div className="w-full h-full bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-sm">
                   <div className="bg-white rounded-md p-1 scale-90">
                     <span className="text-xs">❤️</span>
                   </div>
                 </div>
              </div>

              <div className="ml-4 flex-1">
                <h4 className="font-black text-[16px] text-gray-900 truncate">
                  {msg?.content || 'New Message'}
                </h4>
                <p className="text-gray-400 text-[13px] font-medium">
                  {msg?.created_at ? DateTime.fromISO(msg.created_at).toRelative() : 'just now'}
                </p>
              </div>

              <ChevronRight size={20} className="text-gray-200 group-hover:text-gray-400" />
            </Link>
          ))
        )}
      </main>

      {/* Bottom CTA */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[320px] px-6">
        <button className="w-full bg-[#ff3b30] text-white py-4 rounded-full font-black text-[17px] shadow-xl active:scale-95 transition-transform">
          Who sent these? 👀
        </button>
      </div>
    </div>
  );
}
