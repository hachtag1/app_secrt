'use client';

import { Download, GraduationCap, Home, FileText, Settings, Mail, User, ChevronDown, Facebook, Grid3X3, Github, Twitter, Instagram, ArrowLeft } from 'lucide-react';

export interface Payment {
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

interface PaymentCardPreviewProps {
  payment: Payment;
  onClose?: () => void;
}

export default function PaymentCardPreview({ payment, onClose }: PaymentCardPreviewProps) {
  const isPaid = payment.statutPaiement.toUpperCase() === 'PAYE';
  const payId = payment.id.slice(-4);

  return (
    <div className="flex flex-col bg-[#f3f4f6] rounded-lg overflow-hidden" style={{ maxHeight: '85vh' }}>
      {/* ===== HEADER (scaled down slightly for modal) ===== */}
      <header className="bg-white border-b border-gray-100 shrink-0">
        <div className="max-w-2xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-900 to-yellow-600 flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
              UD
            </div>
            <span className="text-[#1e3a8a] font-bold text-sm tracking-wide uppercase hidden sm:block">
              UNIVERSITE DE DSCHANG
            </span>
            <span className="text-[#1e3a8a] font-bold text-xs tracking-wide uppercase sm:hidden">
              UNIV. DSCHANG
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#4b5563]">
            <span className="flex items-center gap-1.5"><Home size={14} /> Accueil</span>
            <span className="flex items-center gap-1.5"><FileText size={14} /> Nos services</span>
            <span className="flex items-center gap-1.5"><Settings size={14} /> Administration <ChevronDown size={12} /></span>
            <span className="flex items-center gap-1.5"><Mail size={14} /> Contact</span>
            <div className="ml-3 w-8 h-8 rounded-full bg-[#93c5fd] flex items-center justify-center">
              <User size={15} className="text-white" />
            </div>
          </nav>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 py-8 px-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#111827] mb-1.5">
              Détails du Paiement #{payId}
            </h1>
            <p className="text-[#6b7280] text-sm">
              Ci-dessous les détails du paiement
            </p>
          </div>

          {/* Payment Card */}
          <div className="bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.05)] border border-gray-100">
            {/* Card Header */}
            <div className="px-6 sm:px-10 pt-6 pb-3 border-b border-gray-100">
              <h2 className="text-lg sm:text-xl font-semibold text-[#111827]">
                Détails du paiement #{payId}
              </h2>
            </div>

            {/* Card Body */}
            <div className="px-6 sm:px-10 py-6">
              {/* CAMPOST sub-header */}
              <div className="text-lg font-bold text-[#111827] uppercase mb-5">
                {payment.moyenPaiement || 'CAMPOST'}
              </div>

              {/* Fields */}
              <div className="space-y-3.5 mb-8">
                <DetailRow label="Référence :" value={payment.reference} muted />
                <DetailRow label="Nom complet :" value={payment.nomComplet} />
                <DetailRow label="Montant :" value={payment.montant} medium />
                <DetailRow label="Moyen de paiement :" value={payment.moyenPaiement || 'CAMPOST'} />
                <DetailRow label="Date de Paiement :" value={payment.datePaiement} />
                <DetailRow label="Numéro de Quitance :" value={payment.numeroQuittance} muted />

                {/* Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="text-[#4b5563] font-medium w-44 shrink-0 text-[14px]">
                    Statut de Paiement :
                  </span>
                  <span
                    className={`inline-block px-3 py-1 rounded-md text-xs font-semibold tracking-wide ${
                      isPaid ? 'bg-[#10b981] text-white' : 'bg-red-500 text-white'
                    }`}
                  >
                    {payment.statutPaiement}
                  </span>
                </div>

                <DetailRow label="Service :" value={payment.service} />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-3">
                {payment.documentPath ? (
                  <a
                    href={payment.documentPath}
                    download={payment.documentName || `accuse_paiement_${payId}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0F4C75] hover:bg-[#0a3554] text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-200"
                  >
                    <Download size={17} />
                    Télécharger l'accusé de paiement
                  </a>
                ) : (
                  <button
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-300 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed"
                    disabled
                  >
                    <Download size={17} />
                    Aucun accusé de paiement
                  </button>
                )}
                {onClose && (
                  <button
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-[#d1d5db] text-[#4b5563] text-sm font-medium rounded-md hover:bg-gray-50 transition-all duration-200"
                    onClick={onClose}
                  >
                    <ArrowLeft size={17} />
                    Fermer l'aperçu
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#F9FAFB] border-t border-gray-200 py-8 shrink-0">
        <div className="max-w-2xl mx-auto px-4 flex flex-col items-center text-center">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-900 to-yellow-600 flex items-center justify-center text-white font-bold text-[9px] shadow-sm">
              UD
            </div>
            <span className="text-[#1e3a8a] font-bold text-xs uppercase leading-tight">
              UNIVERSITE DE DSCHANG
            </span>
          </div>
          <p className="text-[#9ca3af] text-[11px] italic mb-1.5">
            Le trésor de la société c'est son université
          </p>
          <div className="text-[11px] text-[#6b7280] mb-3 space-y-0.5">
            <p>&copy; <span className="text-[#0F4C75]">Université de Dschang</span>. Tout droit réservé.</p>
            <p>Equipe SIGES</p>
          </div>
          <div className="flex gap-5 text-[#9ca3af]">
            <Facebook size={16} className="hover:text-[#0F4C75] transition-colors cursor-pointer" />
            <Grid3X3 size={16} className="hover:text-[#0F4C75] transition-colors cursor-pointer" />
            <Github size={16} className="hover:text-[#0F4C75] transition-colors cursor-pointer" />
            <Twitter size={16} className="hover:text-[#0F4C75] transition-colors cursor-pointer" />
            <Instagram size={16} className="hover:text-[#0F4C75] transition-colors cursor-pointer" />
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
      <span className="text-[#4b5563] font-medium w-44 shrink-0 text-[14px]">{label}</span>
      <span className={`text-[14px] break-all ${
        muted ? 'text-[#4b5563]' : medium ? 'text-[#374151] font-medium' : 'text-[#1f2937]'
      }`}>
        {value}
      </span>
    </div>
  );
}