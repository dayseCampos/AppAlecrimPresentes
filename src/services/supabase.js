import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';


// Troque pelos seus valores reais:
const SUPABASE_URL = 'https://uekpnkznwkkifjzvoxjv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVla3Bua3pud2traWZqenZveGp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjUwNjcsImV4cCI6MjA3NDkwMTA2N30.4nbOPn8xLXmyWoUGdgiEEgKgGAyjfrXVlpiUBm1m7qw';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('[SUPABASE] Faltam EXPO_PUBLIC_SUPABASE_URL/ANON_KEY no app.json/app.config.js');
}

// 👇 Health check em dev: loga os 25 primeiros chars da URL e 8 da key
if (__DEV__) {
  console.log('[SUPABASE URL]', SUPABASE_URL?.slice(0, 25));
  console.log('[SUPABASE KEY]', SUPABASE_ANON_KEY?.slice(0, 8), '...(anon)');
}

export const supabase = createClient(SUPABASE_URL ?? '', SUPABASE_ANON_KEY ?? '', {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
});