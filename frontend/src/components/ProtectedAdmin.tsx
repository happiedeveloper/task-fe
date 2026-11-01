import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function ProtectedAdmin({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<'checking' | 'signed-in' | 'signed-out'>('checking');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setStatus(data.session ? 'signed-in' : 'signed-out'));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus(session ? 'signed-in' : 'signed-out');
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (status === 'checking') return <div className="min-h-screen" aria-busy="true" />;
  return status === 'signed-in' ? children : <Navigate to="/admin" replace />;
}

