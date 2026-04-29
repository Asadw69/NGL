import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiting for Vercel
const loginAttempts = new Map<string, { count: number, lastAttempt: number }>();

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
  const now = Date.now();
  
  // 1. Check Rate Limit
  const attempt = loginAttempts.get(ip);
  if (attempt) {
    // Reset count after 15 minutes of no attempts
    if (now - attempt.lastAttempt > 15 * 60 * 1000) {
      loginAttempts.delete(ip);
    } else if (attempt.count >= 5) {
      // Block if more than 5 failed attempts
      return NextResponse.json({ error: 'Too many attempts. Try again in 15 minutes.' }, { status: 429 });
    }
  }

  try {
    const { password } = await req.json();
    const correctPassword = process.env.DASHBOARD_PASSWORD;

    if (password === correctPassword) {
      // Clear attempts on success
      loginAttempts.delete(ip);
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      // Log failed attempt
      const current = loginAttempts.get(ip) || { count: 0, lastAttempt: now };
      loginAttempts.set(ip, { count: current.count + 1, lastAttempt: now });
      
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
