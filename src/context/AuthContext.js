import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext({ session: null, user: null, loading: true });

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) console.error('[AUTH] getSession error:', error);
        if (alive) setSession(data?.session ?? null);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, newSession) => {
      setSession(newSession ?? null);
    });

    return () => {
      alive = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
