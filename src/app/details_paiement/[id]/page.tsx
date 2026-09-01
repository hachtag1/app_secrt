'use client';

import PaymentDetailView from '@/components/PaymentDetailView';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';

function DetailsPaiementContent() {
  const params = useParams();
  const id = params?.id as string;
  return <PaymentDetailView paymentIdProp={id} />;
}

export default function DetailsPaiementPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-cyan-700/20" />
          <p className="text-gray-400 text-sm">Chargement des détails...</p>
        </div>
      </div>
    }>
      <DetailsPaiementContent />
    </Suspense>
  );
}
