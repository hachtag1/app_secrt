'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowLeft, Download, Home, Mail, User, Settings, GraduationCap } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-cyan-700/20" />
          <p className="text-gray-500">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <p className="text-red-500 text-lg mb-4">Paiement introuvable</p>
            <Button onClick={() => router.push('/')} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPaid = payment.statutPaiement.toUpperCase() === 'PAYE';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-cyan-700 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-cyan-800 text-lg hidden sm:block">
              UNIVERSITE DE DSCHANG
            </span>
            <span className="font-bold text-cyan-800 text-sm sm:hidden">
              UNIV. DSCHANG
            </span>
          </div>
          <nav className="flex items-center gap-1 sm:gap-4 text-sm">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-1 text-gray-600 hover:text-cyan-700 transition-colors px-2 py-1"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Accueil</span>
            </button>
            <span className="flex items-center gap-1 text-gray-600 px-2 py-1">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Nos services</span>
            </span>
            <span className="flex items-center gap-1 text-gray-600 px-2 py-1">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Contact</span>
            </span>
            <div className="h-8 w-8 rounded-full bg-cyan-100 flex items-center justify-center ml-2">
              <User className="h-4 w-4 text-cyan-700" />
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Détails du Paiement #{payment.id.slice(-4)}
            </h1>
            <p className="text-gray-500 mt-2">
              Ci-dessous les détails du paiement
            </p>
          </div>

          {/* Payment Card */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-white border-b px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">
                Détails du paiement #{payment.id.slice(-4)}
              </h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Moyen de paiement header */}
              <div className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                {payment.moyenPaiement || 'CAMPOST'}
              </div>

              {/* Fields */}
              <div className="space-y-3">
                <DetailRow label="Référence :" value={payment.reference} mono />
                <DetailRow label="Nom complet :" value={payment.nomComplet} />
                <DetailRow label="Montant :" value={payment.montant} />
                <DetailRow label="Moyen de paiement :" value={payment.moyenPaiement || 'CAMPOST'} />
                <DetailRow label="Date de Paiement :" value={payment.datePaiement} />
                <DetailRow label="Numéro de Quitance :" value={payment.numeroQuittance} mono />
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-sm text-gray-500 min-w-[180px]">Statut de Paiement :</span>
                  <Badge
                    className={`${isPaid ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'} text-white font-bold px-3 py-1`}
                  >
                    {payment.statutPaiement}
                  </Badge>
                </div>
                <DetailRow label="Service :" value={payment.service} />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t mt-6">
                {payment.documentPath ? (
                  <a
                    href={payment.documentPath}
                    download={payment.documentName || `accuse_paiement_${payment.id.slice(-4)}`}
                    className="inline-flex items-center justify-center gap-2 bg-cyan-700 hover:bg-cyan-800 text-white flex-1 h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Télécharger l'accusé de paiement
                  </a>
                ) : (
                  <Button
                    className="flex-1 opacity-50 cursor-not-allowed"
                    disabled
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Aucun accusé de paiement
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  onClick={() => router.push('/')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-cyan-700 flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-cyan-800">UNIVERSITE DE DSCHANG</span>
            </div>
            <p className="text-gray-400 text-sm italic text-center">
              Le trésor de la société c'est son université
            </p>
            <p className="text-gray-500 text-xs">
              &copy; Université de Dschang. Tout droit réservé.
            </p>
            <p className="text-gray-400 text-xs">Equipe SIGES</p>
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
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
      <span className="text-sm text-gray-500 min-w-[180px]">{label}</span>
      <span className={`text-sm text-gray-900 ${mono ? 'font-mono text-gray-500' : ''}`}>
        {value}
      </span>
    </div>
  );
}


