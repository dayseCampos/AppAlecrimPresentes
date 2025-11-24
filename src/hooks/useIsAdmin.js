// src/hooks/useIsAdmin.js
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export function useIsAdmin() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  async function load() {
    try {
      const { data: ses } = await supabase.auth.getSession();
      const uid = ses?.session?.user?.id || null;
      if (!uid) {
        setIsAdmin(false);
        return;
      }
      // chama a função do banco (mais robusto que ler profiles direto)
      const { data, error } = await supabase.rpc('is_admin');
      if (error) {
        console.warn('rpc(is_admin) error:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(!!data);
      }
    } catch (e) {
      console.warn('is_admin load error:', e);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let sub = null;
    (async () => {
      setLoading(true);
      await load();
      // reavalia sempre que sessão mudar (login/logout/refresh)
      const res = supabase.auth.onAuthStateChange((_e, _s) => {
        setLoading(true);
        load();
      });
      sub = res?.data?.subscription ?? res?.subscription ?? null;
    })();
    return () => {
      try { sub?.unsubscribe?.(); } catch {}
    };
  }, []);

  return { isAdmin, loading };
}
