'use client';

import { Suspense } from 'react';
import AdminDashboard from '@/components/AdminDashboard';

function AppContent() {
  return <AdminDashboard />;
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-pulse flex flex-col items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-cyan-700/20" />
            <p className="text-gray-400 text-sm">Chargement...</p>
          </div>
        </div>
      }
    >
      <AppContent />
    </Suspense>
  );
}
