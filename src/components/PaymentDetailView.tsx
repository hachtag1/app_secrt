'use client';

import { ArrowLeft, Download, Home, FileText, Settings, ChevronDown, Facebook, Github, Twitter, Instagram, Contact, Slack, User } from 'lucide-react';
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

export default function PaymentDetailView({ paymentIdProp }: { paymentIdProp?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  const paymentId = paymentIdProp || searchParams.get('id');

  const fetchPayment = useCallback(async () => {
    if (!paymentId) {
      // For visual preview matching the image when no ID is provided, load some mock data
      setPayment({
        id: '1498',
        reference: 'c22379e3-18e5-4172-807e-2825e011c93c',
        nomComplet: 'Eliane Noelle Zebaze Mahakou',
        montant: '25.000 XAF',
        moyenPaiement: 'CAMPOST',
        datePaiement: '18/07/2026, à 14:22',
        numeroQuittance: '04R23362202607',
        statutPaiement: 'PAYE',
        service: 'Authentification de diplôme',
        documentPath: null,
        documentName: null,
        createdAt: new Date().toISOString(),
      });
      setLoading(false);
      return;
    }
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
      <div className="min-h-screen flex items-center justify-center bg-[#f6f8fa]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-[#0074a6]/10" />
          <p className="text-gray-500">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f8fa]">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 p-8 text-center">
          <p className="text-red-500 text-lg mb-4">Paiement introuvable</p>
          <button onClick={() => router.push('/')} className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-[#d1d5db] text-[#4b5563] text-sm font-medium rounded-md hover:bg-gray-50 transition-all duration-200">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </button>
        </div>
      </div>
    );
  }

  const isPaid = payment.statutPaiement.toUpperCase() === 'PAYE';
  // Fallback to "1498" if it's the exact mock id or fallback. Otherwise slice -4.
  const displayId = paymentId ? payment.id.slice(-4) : '1498';

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f5f9] font-sans text-slate-800 relative overflow-hidden">

      {/* ===== HEADER ===== */}
      <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={() => router.push('/')}>
            <img src="/logo-header.png" alt="Université de Dschang" className="h-[46px] object-contain" />
          </div>
          <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-[#64748b]">
            <button className="hover:text-[#1e3a8a] transition-colors flex items-center gap-[6px]">
              <Home size={16} className="stroke-[1.5]" /> Accueil
            </button>
            <button className="hover:text-[#1e3a8a] transition-colors flex items-center gap-[6px]">
              <FileText size={16} className="stroke-[1.5]" /> Nos services
            </button>
            <button className="hover:text-[#1e3a8a] transition-colors flex items-center gap-[6px]">
              <Settings size={16} className="stroke-[1.5]" /> Administration <ChevronDown size={14} className="ml-[-2px] mt-[1px]" />
            </button>
            <button className="hover:text-[#1e3a8a] transition-colors flex items-center gap-[6px]">
              <Contact size={16} className="stroke-[1.5]" /> Contact
            </button>
            <div className="ml-2 w-8 h-8 rounded-full bg-[#93c5fd] flex items-center justify-center overflow-hidden cursor-pointer">
              <User size={18} className="text-white mt-1.5" fill="white" />
            </div>
          </nav>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 w-full flex flex-col relative z-10 bg-left-top bg-no-repeat bg-cover" style={{ backgroundImage: "url('/card-11.svg')" }}>
        {/* Page Title (No solid background, sits on page bg) */}
        <div className="w-full pt-[5rem] pb-[4rem] text-center">
          <h1 className="text-[28px] font-bold text-[#1f2937] tracking-tight mb-2">
            Détails du Paiement #{displayId}
          </h1>
          <p className="text-[#8e99a8] text-[15px]">
            Ci-dessous les détails du paiement
          </p>
        </div>

        {/* Payment Card Area */}
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-2 pb-12 relative">
          <div className="bg-white rounded-lg shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-gray-100 max-w-[700px] mx-auto overflow-hidden">
          {/* Card Header */}
          <div className="px-10 py-[22px] border-b border-gray-100">
            <h2 className="text-[22px] font-semibold text-[#111827]">
              Détails du paiement #{displayId}
            </h2>
          </div>

          {/* Card Body */}
          <div className="px-10 py-8">
            <h3 className="text-[17px] font-semibold text-[#111827] uppercase mb-6 tracking-wide">
              {payment.moyenPaiement || 'CAMPOST'}
            </h3>

            {/* Fields */}
            <div className="space-y-[18px] text-[15.5px] mb-[45px]">
              <p className="text-[#596371]">Référence : {payment.reference}</p>
              <p className="text-[#596371]">Nom complet : {payment.nomComplet}</p>
              <p className="text-[#596371]">Montant : {payment.montant}</p>
              <p className="text-[#596371]">Moyen de paiement : {payment.moyenPaiement || 'CAMPOST'}</p>
              <p className="text-[#596371]">Date de Paiement : {payment.datePaiement}</p>
              <p className="text-[#596371]">Numéro de Quittance : {payment.numeroQuittance}</p>
              <div className="flex items-center gap-[6px]">
                <span className="text-[#596371]">Statut de Paiement :</span>
                <span
                  className={`inline-block px-[6px] py-[1px] rounded-none text-[12.5px] font-medium tracking-wide ${
                    isPaid ? 'bg-[#18d2a6] text-[#596371]' : 'bg-red-500 text-white'
                  }`}
                >
                  {payment.statutPaiement.toUpperCase()}
                </span>
              </div>
              <p className="text-[#596371]">Service : {payment.service}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-[14px] pt-4">
              <a
                href={payment.documentPath || '#'}
                download={payment.documentName || `accuse_paiement_${displayId}`}
                className="inline-flex items-center justify-center gap-[8px] px-6 py-[10px] bg-[#0074A6] hover:bg-[#005f8a] text-white text-[14.5px] font-medium rounded shadow-sm transition-all duration-200"
              >
                <Download size={18} className="stroke-[2]" />
                Télécharger l'accusé de paiement
              </a>
              <button
                className="inline-flex items-center justify-center gap-[8px] px-[22px] py-[10px] bg-white border border-[#e5e7eb] text-[#596371] text-[14.5px] font-medium rounded hover:bg-gray-50 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-200"
                onClick={() => router.push('/')}
              >
                <ArrowLeft size={18} className="stroke-[2]" />
                Retour
              </button>
            </div>
          </div>
        </div>
        </div>
      </main>

      {/* ===== BLUE SEPARATOR LINE ===== */}
      <div className="h-[1px] bg-[#0074A6] w-full relative z-10" />

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#f6f8fa] pt-[30px] pb-[40px] relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          <div className="flex flex-col items-center mb-[18px]">
            <img src="/logo-footer.png" alt="Université de Dschang" className="h-[52px] object-contain" />
          </div>
          <div className="text-[13px] text-[#8e99a8] mb-[22px] space-y-[4px]">
            <p>&copy; <span className="text-[#0074A6]">Université de Dschang</span>. Tout droit réservé.</p>
            <p>Equipe SIGES</p>
          </div>
          <div className="flex gap-[28px] text-[#94a3b8]">
            <Facebook size={17} className="hover:text-[#0074A6] transition-colors cursor-pointer fill-current stroke-0" />
            <Slack size={17} className="hover:text-[#0074A6] transition-colors cursor-pointer fill-current stroke-0" />
            <Github size={17} className="hover:text-[#0074A6] transition-colors cursor-pointer fill-current stroke-0" />
            <Twitter size={17} className="hover:text-[#0074A6] transition-colors cursor-pointer fill-current stroke-0" />
            <Instagram size={17} className="hover:text-[#0074A6] transition-colors cursor-pointer stroke-[2]" />
          </div>
        </div>
      </footer>
    </div>
  );
}
