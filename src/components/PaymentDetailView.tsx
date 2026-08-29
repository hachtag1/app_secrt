'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Home, FileText, Settings, Mail, User, ChevronDown, Facebook, Grid3X3, Github, Twitter, Instagram } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface Payment {
  id: string;
  reference: string;
  nomComplet: string;
  montant: string;
  moyenPaiement: string;
  datePaiement: string;
  numeroQuittance: string;
  statutPaiement: string;
  service: string;
  documentPath: string | null;
  documentName: string | null;
  createdAt: string;
}

export default function PaymentDetailView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  const paymentId = searchParams.get('id');

  const fetchPayment = useCallback(async () => {
    if (!paymentId) return;
    try {
      const res = await fetch(`/api/payments/${paymentId}`);
      if (res.ok) {
        const data = await res.json();
        setPayment(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [paymentId]);

  useEffect(() => {
    fetchPayment();
  }, [fetchPayment]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-900/10" />
          <p className="text-gray-500">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6]">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 p-8 text-center">
          <p className="text-red-500 text-lg mb-4">Paiement introuvable</p>
          <Button onClick={() => router.push('/')} variant="outline" className="border-gray-300 text-gray-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  const isPaid = payment.statutPaiement.toUpperCase() === 'PAYE';
  const payId = payment.id.slice(-4);

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f4f6] font-sans text-slate-800">
      {/* ===== HEADER ===== */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-900 to-yellow-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              UD
            </div>
            <span className="text-[#1e3a8a] font-bold text-lg tracking-wide uppercase hidden sm:block">
              UNIVERSITE DE DSCHANG
            </span>
            <span className="text-[#1e3a8a] font-bold text-sm tracking-wide uppercase sm:hidden">
              UNIV. DSCHANG
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#4b5563]">
            <button className="hover:text-[#1e3a8a] transition-colors flex items-center gap-2">
              <Home size={16} /> Accueil
            </button>
            <button className="hover:text-[#1e3a8a] transition-colors flex items-center gap-2">
              <FileText size={16} /> Nos services
            </button>
            <button className="hover:text-[#1e3a8a] transition-colors flex items-center gap-2">
              <Settings size={16} /> Administration <ChevronDown size={14} />
            </button>
            <button className="hover:text-[#1e3a8a] transition-colors flex items-center gap-2">
              <Mail size={16} /> Contact
            </button>
            <div className="ml-4 w-9 h-9 rounded-full bg-[#93c5fd] flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
          </nav>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Page Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            Détails du Paiement #{payId}
          </h1>
          <p className="text-[#6b7280] text-base">
            Ci-dessous les détails du paiement
          </p>
        </div>

        {/* Payment Card */}
        <div className="bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.05)] max-w-3xl mx-auto border border-gray-100">
          {/* Card Header */}
          <div className="px-8 sm:px-12 pt-8 pb-4 border-b border-gray-100">
            <h2 className="text-2xl font-semibold text-[#111827]">
              Détails du paiement #{payId}
            </h2>
          </div>

          {/* Card Body */}
          <div className="px-8 sm:px-12 py-8">
            {/* Moyen de paiement sub-header */}
            <div className="text-xl font-bold text-[#111827] uppercase mb-6">
              {payment.moyenPaiement || 'CAMPOST'}
            </div>

            {/* Fields */}
            <div className="space-y-4 mb-10">
              <DetailRow label="Référence :" value={payment.reference} muted />
              <DetailRow label="Nom complet :" value={payment.nomComplet} />
              <DetailRow label="Montant :" value={payment.montant} medium />
              <DetailRow label="Moyen de paiement :" value={payment.moyenPaiement || 'CAMPOST'} />
              <DetailRow label="Date de Paiement :" value={payment.datePaiement} />
              <DetailRow label="Numéro de Quitance :" value={payment.numeroQuittance} muted />

              {/* Status */}
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="text-[#4b5563] font-medium w-48 shrink-0 text-[15px]">
                  Statut de Paiement :
                </span>
                <span
                  className={`inline-block px-3 py-1 rounded-md text-xs font-semibold tracking-wide ${
                    isPaid
                      ? 'bg-[#10b981] text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {payment.statutPaiement}
                </span>
              </div>

              <DetailRow label="Service :" value={payment.service} />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              {payment.documentPath ? (
                <a
                  href={payment.documentPath}
                  download={payment.documentName || `accuse_paiement_${payId}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0F4C75] hover:bg-[#0a3554] text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-200"
                >
                  <Download size={18} />
                  Télécharger l'accusé de paiement
                </a>
              ) : (
                <button
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-300 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed"
                  disabled
                >
                  <Download size={18} />
                  Aucun accusé de paiement
                </button>
              )}
              <button
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-[#d1d5db] text-[#4b5563] text-sm font-medium rounded-md hover:bg-gray-50 transition-all duration-200"
                onClick={() => router.push('/')}
              >
                <ArrowLeft size={18} />
                Retour
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#F9FAFB] border-t border-gray-200 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-900 to-yellow-600 flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
              UD
            </div>
            <span className="text-[#1e3a8a] font-bold text-sm uppercase leading-tight">
              UNIVERSITE DE DSCHANG
            </span>
          </div>
          <p className="text-[#9ca3af] text-xs italic mb-2">
            Le trésor de la société c'est son université
          </p>
          <div className="text-xs text-[#6b7280] mb-4 space-y-0.5">
            <p>&copy; <span className="text-[#0F4C75]">Université de Dschang</span>. Tout droit réservé.</p>
            <p>Equipe SIGES</p>
          </div>
          <div className="flex gap-6 text-[#9ca3af]">
            <Facebook size={18} className="hover:text-[#0F4C75] transition-colors cursor-pointer" />
            <Grid3X3 size={18} className="hover:text-[#0F4C75] transition-colors cursor-pointer" />
            <Github size={18} className="hover:text-[#0F4C75] transition-colors cursor-pointer" />
            <Twitter size={18} className="hover:text-[#0F4C75] transition-colors cursor-pointer" />
            <Instagram size={18} className="hover:text-[#0F4C75] transition-colors cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
}

function DetailRow({
  label,
  value,
  muted = false,
  medium = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
  medium?: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline">
      <span className="text-[#4b5563] font-medium w-48 shrink-0 text-[15px]">{label}</span>
      <span className={`text-[15px] break-all ${
        muted
          ? 'text-[#4b5563]'
          : medium
          ? 'text-[#374151] font-medium'
          : 'text-[#1f2937]'
      }`}>
        {value}
      </span>
    </div>
  );
}
