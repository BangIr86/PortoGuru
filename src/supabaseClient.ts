import { createClient } from '@supabase/supabase-js';

// Ganti string di bawah dengan URL dan Key dari dashboard Supabase Anda
const supabaseUrl = 'https://vmleprjsetpzeqwnipoi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtbGVwcmpzZXRwemVxd25pcG9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MzkxODAsImV4cCI6MjEwMDQxNTE4MH0.04vR1dhwtZEtcr7tK272kvhg0G4MQJs8K2BuUyJChRQ';

export const supabase = createClient(supabaseUrl, supabaseKey);