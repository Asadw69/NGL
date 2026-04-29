'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface SuccessScreenProps {
  onReset: () => void;
  fakeCount: number;
}

export default function SuccessScreen({ onReset, fakeCount }: SuccessScreenProps) {

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-sm px-4 flex flex-col items-center justify-center space-y-8"
    >
      <div className="flex flex-col items-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl"
        >
          <CheckCircle2 size={72} className="text-[#ff3c83]" strokeWidth={3} />
        </motion.div>
        <h2 className="text-white text-[32px] font-black tracking-tight">Sent!</h2>
      </div>

      <div className="w-full text-center space-y-8">
        <p className="text-white font-bold text-[14px] flex items-center justify-center space-x-1.5">
            <span>👇</span>
            <span>{fakeCount} friends just tapped the button</span>
            <span>👇</span>
        </p>

        <div className="space-y-5">
          <button
            className="w-full bg-black text-white py-[1.2rem] rounded-full font-black text-[18px] shadow-2xl active:scale-[0.97] transition-all"
          >
            Get your own messages!
          </button>

          <button
            onClick={onReset}
            className="text-white font-black text-[18px] underline decoration-2 underline-offset-8 active:opacity-70 transition-opacity block w-full"
          >
            Send another message
          </button>
        </div>
      </div>
    </motion.div>
  );
}
