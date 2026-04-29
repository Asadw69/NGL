'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { ChevronLeft, Camera, Palette, X } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function MessageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [message, setMessage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessage = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('id', params.id)
        .single();

      if (!error && data) {
        setMessage(data);
      }
      setLoading(false);
    };

    fetchMessage();
  }, [params.id]);

  const handleShareToIG = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 3, // Higher resolution
      });
      
      const image = canvas.toDataURL('image/png');
      
      // Since we are in a web browser, we can't directly open Instagram Stories with the image
      // But we can download it and give instructions, or use a share link
      const link = document.createElement('a');
      link.href = image;
      link.download = `ngl-message-${params.id}.png`;
      link.click();

      // Attempt to open Instagram (this usually just opens the app)
      window.location.href = 'instagram://story-camera';
      
      alert('Message image downloaded! You can now share it to your Instagram story.');
    } catch (err) {
      console.error('Error sharing to IG:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!message) return <div>Message not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 relative overflow-hidden">
      {/* Top Controls */}
      <div className="w-full flex justify-between items-center mb-12">
        <button onClick={() => router.back()} className="p-2 bg-white rounded-full shadow-sm">
          <X size={20} className="text-gray-400" />
        </button>
        
        <div className="flex bg-gray-200/50 p-1 rounded-full">
           <div className="bg-white p-2 rounded-full shadow-sm">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900">
               <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
               <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
               <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
             </svg>
           </div>
           <div className="p-2 rounded-full">
             <span className="text-xl grayscale opacity-30">👻</span>
           </div>
           <div className="p-2 rounded-full">
             <span className="text-xl grayscale opacity-30">💬</span>
           </div>
        </div>

        <div className="p-2">
           <ChevronLeft size={20} className="text-transparent" /> {/* Spacer */}
        </div>
      </div>

      {/* Shareable Card Container */}
      <div className="w-full max-w-sm" ref={cardRef}>
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#ff3c83] to-[#ff7a18] p-8 text-center">
            <h2 className="text-white text-[22px] font-black tracking-tight leading-tight uppercase">
              send me anonymous<br />messages!
            </h2>
          </div>
          <div className="p-12 text-center flex flex-col items-center justify-center min-h-[180px]">
            <p className="text-black text-[28px] font-black tracking-tight leading-tight">
              {message.content}
            </p>
          </div>
        </div>
      </div>

      {/* Technical Data (Owner Only) */}
      <div className="mt-8 w-full max-w-sm bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
        <div>
          <h3 className="text-gray-400 font-black text-xs uppercase tracking-widest mb-4">Sender Hints</h3>
          <div className="flex flex-wrap gap-2">
            {message.device && (
              <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-[11px] font-black flex items-center">
                <span className="mr-1">{message.device.includes('iPhone') ? '📱' : '💻'}</span>
                {message.device}
              </div>
            )}
            {message.browser && (
              <div className="bg-purple-50 text-purple-600 px-3 py-1.5 rounded-full text-[11px] font-black flex items-center">
                <span className="mr-1">🌐</span>
                {message.browser}
              </div>
            )}
            {message.ip && (
              <div className="bg-green-50 text-green-600 px-3 py-1.5 rounded-full text-[11px] font-black flex items-center">
                <span className="mr-1">📍</span>
                From your region
              </div>
            )}
            <div className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-[11px] font-black flex items-center">
              <span className="mr-1">👀</span>
              First time sender
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-50">
          <h3 className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-3">Raw Metadata</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[9px] text-gray-300 font-bold uppercase">Location</p>
              <p className="text-xs font-black truncate">
                {message.latitude ? `${message.latitude.toFixed(3)}, ${message.longitude.toFixed(3)}` : 'Not available'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] text-gray-300 font-bold uppercase">Sender IP</p>
              <p className="text-xs font-black truncate">{message.ip || 'Hidden'}</p>
            </div>
          </div>
        </div>

        {message.latitude && (
          <a 
            href={`https://www.google.com/maps?q=${message.latitude},${message.longitude}`}
            target="_blank"
            className="block w-full text-center py-3 bg-gray-50 rounded-2xl text-[11px] font-black text-gray-400 hover:bg-gray-100 transition-all active:scale-95"
          >
            📍 VIEW PRECISE LOCATION ON MAPS
          </a>
        )}
      </div>

      {/* Card Controls */}
      <div className="flex space-x-4 mt-8">
         <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-100">
           <Palette size={24} className="text-pink-500" />
         </button>
         <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-100">
           <Camera size={24} className="text-gray-400" />
         </button>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-[320px] mt-auto space-y-4 pb-8">
        <button className="w-full bg-[#ff3b30] text-white py-[1.1rem] rounded-full font-black text-[17px] shadow-xl active:scale-[0.97] transition-all">
          Who sent this 👀
        </button>
        
        <button 
          onClick={handleShareToIG}
          className="w-full bg-black text-white py-[1.1rem] rounded-full font-black text-[17px] shadow-xl active:scale-[0.97] transition-all flex items-center justify-center space-x-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
          <span>reply</span>
        </button>
      </div>
    </div>
  );
}
