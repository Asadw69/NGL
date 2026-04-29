import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Graceful fallback for UI preview if env vars are missing
// Graceful fallback for UI preview if env vars are missing
const mockSupabase = {
  from: (table: string) => ({
    insert: async (data: any) => ({ error: null, data: null }),
    select: (columns: string) => ({
      eq: (col: string, val: any) => ({
        single: async () => ({ 
          error: null, 
          data: { 
            id: val, 
            content: 'hahsjs', 
            created_at: new Date().toISOString() 
          } 
        }),
      }),
      order: (col: string, { ascending }: any) => ({
        // Make it a thenable so await works
        then: (onfulfilled: any) => onfulfilled({ 
          error: null, 
          data: [
            { id: '1', content: 'hahsjs', created_at: new Date(Date.now() - 7 * 60000).toISOString() },
            { id: '2', content: 'Mere friends ne bola tu bhi mujhe...', created_at: new Date(Date.now() - 39 * 60000).toISOString() },
            { id: '3', content: 'Is weekend kuch kare kya saath m...', created_at: new Date(Date.now() - 44 * 60000).toISOString() },
          ] 
        }),
      }),
    }),
  }),
} as any;

export const supabase = supabaseUrl && supabaseUrl !== 'your-project-url.supabase.co'
  ? createClient(supabaseUrl, supabaseAnonKey)
  : mockSupabase;
