'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Download, GraduationCap, Home, Mail, Settings, User } from 'lucide-react';

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
  createdAt: string;
}

interface PaymentCardPreviewProps {
  payment: Payment;
  onClose?: () => void;
}

export default function PaymentCardPreview({ payment, onClose }: PaymentCardPreviewProps) {
  const isPaid = payment.statutPaiement.toUpperCase() === 'PAYE';

  return (
    <div className="flex flex-col bg-gray-50 rounded-lg overflow-hidden" style={{ maxHeight: '85vh' }}>
      {/* Header - identique à la page publique */}
      <header className="bg-white border-b border-gray-200 shrink-0">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-cyan-700 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-cyan-800 text-base hidden sm:block">
              UNIVERSITE DE DSCHANG
            </span>
            <span className="font-bold text-cyan-800 text-sm sm:hidden">
              UNIV. DSCHANG
            </span>
          </div>
          <nav className="flex items-center gap-1 sm:gap-3 text-sm">
            <span className="flex items-center gap-1 text-gray-600 px-2 py-1">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Accueil</span>
            </span>
            <span className="flex items-center gap-1 text-gray-600 px-2 py-1">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Nos services</span>
            </span>
            <span className="flex items-center gap-1 text-gray-600 px-2 py-1">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Contact</span>
            </span>
            <div className="h-7 w-7 rounded-full bg-cyan-100 flex items-center justify-center ml-1">
              <User className="h-3.5 w-3.5 text-cyan-700" />
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-6 px-4 overflow-y-auto">
        <div className="max-w-xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Details du Paiement #{payment.id.slice(-4)}
            </h1>
            <p className="text-gray-500 mt-1.5 text-sm">
              Ci-dessous les details du paiement
            </p>
          </div>

          {/* Payment Card */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-white border-b px-5 py-3">
              <h2 className="text-base font-bold text-gray-900">
                Details du paiement #{payment.id.slice(-4)}
              </h2>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              {/* Moyen de paiement header */}
              <div className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                {payment.moyenPaiement || 'CAMPOST'}
              </div>

              {/* Fields */}
              <div className="space-y-2.5">
                <DetailRow label="Reference :" value={payment.reference} mono />
                <DetailRow label="Nom complet :" value={payment.nomComplet} />
                <DetailRow label="Montant :" value={payment.montant} />
                <DetailRow label="Moyen de paiement :" value={payment.moyenPaiement || 'CAMPOST'} />
                <DetailRow label="Date de Paiement :" value={payment.datePaiement} />
                <DetailRow label="Numero de Quitance :" value={payment.numeroQuittance} mono />
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                  <span className="text-sm text-gray-500 min-w-[170px]">Statut de Paiement :</span>
                  <Badge
                    className={`${isPaid ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'} text-white font-bold px-3 py-0.5`}
                  >
                    {payment.statutPaiement}
                  </Badge>
                </div>
                <DetailRow label="Service :" value={payment.service} />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-3 border-t mt-5">
                <Button
                  className="bg-cyan-700 hover:bg-cyan-800 text-white flex-1"
                  onClick={() => {
                    const receiptContent = generateReceiptText(payment);
                    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `accuse_paiement_${payment.id.slice(-4)}.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Telecharger l'accuse de paiement
                </Button>
                {onClose && (
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                    onClick={onClose}
                  >
                    Fermer l'apercu
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 shrink-0">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-cyan-700 flex items-center justify-center">
                <GraduationCap className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bold text-cyan-800 text-sm">UNIVERSITE DE DSCHANG</span>
            </div>
            <p className="text-gray-400 text-xs italic text-center">
              Le tresor de la societe c'est son universite
            </p>
            <p className="text-gray-500 text-[11px]">
              &copy; Universite de Dschang. Tout droit reserve.
            </p>
            <p className="text-gray-400 text-[11px]">Equipe SIGES</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
      <span className="text-sm text-gray-500 min-w-[170px]">{label}</span>
      <span className={`text-sm text-gray-900 ${mono ? 'font-mono text-gray-500 text-xs' : ''}`}>
        {value}
      </span>
    </div>
  );
}

function generateReceiptText(p: Payment): string {
  return `
========================================
       ACCUSE DE PAIEMENT
       Universite de Dschang
========================================

Reference          : ${p.reference}
Nom complet        : ${p.nomComplet}
Montant            : ${p.montant}
Moyen de paiement  : ${p.moyenPaiement || 'CAMPOST'}
Date de paiement   : ${p.datePaiement}
N de Quittance    : ${p.numeroQuittance}
Statut             : ${p.statutPaiement}
Service            : ${p.service}

========================================
`.trim();
}
