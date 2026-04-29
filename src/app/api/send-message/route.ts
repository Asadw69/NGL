import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { parseUA } from '@/lib/ua-parser';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, sender_token, recipient_username, latitude, longitude } = body;

    // 1. Validate Input
    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    if (message.length > 500) {
      return NextResponse.json({ error: 'Message too long' }, { status: 400 });
    }

    // 2. Extract Metadata
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const ua = req.headers.get('user-agent') || '';
    const { device, os, browser } = parseUA(ua);

    // 3. Basic Rate Limiting (Prevent Spam)
    // Check if this IP sent more than 5 messages in the last minute
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
    const { count, error: countError } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('ip', ip)
      .gt('created_at', oneMinuteAgo);

    if (count !== null && count >= 5) {
      return NextResponse.json({ error: 'Too many messages. Please wait a minute.' }, { status: 429 });
    }

    // 4. Insert into Supabase
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          content: message,
          sender_token,
          recipient_username,
          latitude,
          longitude,
          ip,
          device: `${device} (${os})`,
          browser,
          os
        }
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });

  } catch (err) {
    console.error('API Route Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
