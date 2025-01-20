'use client';

import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import Login from '@/components/Login';
import TrainingTracker from '@/components/TrainingTracker';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p>Lädt...</p>
    </div>;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {user ? <TrainingTracker /> : <Login />}
    </main>
  );
}