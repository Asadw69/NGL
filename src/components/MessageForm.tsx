'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface MessageFormProps {
  username: string;
  onSubmit: (message: string) => void;
  isSubmitting: boolean;
  fakeCount: number;
}

export default function MessageForm({ username, onSubmit, isSubmitting, fakeCount }: MessageFormProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSubmitting) return;

    onSubmit(message);
    setMessage('');
  };

  const handleDiceClick = () => {
    const prompts = [
      "send me a secret...",
      "what's your biggest regret?",
      "tell me something you've never told anyone",
      "what do you think of me?",
      "if you could go anywhere, where would it be?",
      "tell me a joke!",
      "truth or dare?"
    ];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setMessage(randomPrompt);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm px-4 flex flex-col items-center space-y-6"
    >
      {/* Main Card */}
      <div className="w-full bg-white/20 backdrop-blur-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/30">
        {/* Header - Solid White */}
        <div className="bg-white px-6 py-4 flex items-center space-x-3">
          {/* Avatar Placeholder */}
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
             <div className="w-full h-full bg-[#cbd5e1] flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
             </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-[13px] font-medium text-gray-900">@{username}</span>
            <span className="text-[14px] font-extrabold text-gray-900 leading-tight">send me anonymous messages!</span>
          </div>
        </div>

        {/* Form Body - Semi Transparent */}
        <div className="p-6 relative">
          <form onSubmit={handleSubmit} className="w-full">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="how tall r u"
              className="w-full h-40 bg-transparent text-white/90 text-[19px] font-bold placeholder-pink-200/50 border-none focus:ring-0 focus:outline-none resize-none p-0 lowercase"
              maxLength={300}
              required
            />
            
            {/* Dice Icon Button */}
            <button
              type="button"
              onClick={handleDiceClick}
              className="absolute bottom-6 right-6 w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20"
            >
              <span className="text-2xl">🎲</span>
            </button>
          </form>
        </div>
      </div>

      {/* Middle Section */}
      <div className="w-full flex flex-col items-center space-y-6">
        <div className="flex items-center space-x-1.5 text-white/90 text-[12px] font-bold opacity-80">
          <span>🔒</span>
          <span className="lowercase">anonymous q&a</span>
        </div>
        
        <div className="flex flex-col items-center space-y-6 w-full">
          {/* Conditional Send! Button */}
          <AnimatePresence>
            {message.trim().length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-black text-white py-[1.2rem] rounded-full font-black text-[18px] shadow-2xl active:scale-[0.97] transition-all disabled:opacity-50 focus:outline-none"
              >
                {isSubmitting ? 'Sending...' : 'Send!'}
              </motion.button>
            )}
          </AnimatePresence>

          <p className="text-white font-bold text-[14px] flex items-center space-x-1.5">
            <span>👇</span>
            <span>{fakeCount} friends just tapped the button</span>
            <span>👇</span>
          </p>

          {/* CTA Button */}
          <button
            className="w-full bg-black text-white py-[1.2rem] rounded-full font-black text-[18px] shadow-2xl active:scale-[0.97] transition-all focus:outline-none"
          >
            Get your own messages!
          </button>
        </div>
      </div>

      {/* Footer Links */}
      <div className="flex justify-center space-x-4 text-white/50 text-[11px] font-bold tracking-tight mt-4">
        <a 
          href="https://ngl.link/p/terms?fbclid=PAdGRleAReuntleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA8xMjQwMjQ1NzQyODc0MTQAAaeCKEjTeOH6znGyLz1RGmH5C2XYtN8DdlheU16jKf9LE3LrswvRUgwH3yqOBw_aem_iKjZ3epj44qFebb_7TtRpA" 
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white/80 transition-colors"
        >
          Terms
        </a>
        <a 
          href="https://ngl.link/p/privacy?fbclid=PAdGRleAReuldleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA8xMjQwMjQ1NzQyODc0MTQAAaeCKEjTeOH6znGyLz1RGmH5C2XYtN8DdlheU16jKf9LE3LrswvRUgwH3yqOBw_aem_iKjZ3epj44qFebb_7TtRpA" 
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white/80 transition-colors"
        >
          Privacy
        </a>
      </div>
    </motion.div>
  );
}
