import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const payments = await db.payment.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(payments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      reference,
      nomComplet,
      montant,
      moyenPaiement,
      datePaiement,
      numeroQuittance,
      statutPaiement = 'PAYE',
      service,
    } = body;

    if (!nomComplet || !montant || !service) {
      return NextResponse.json(
        { error: 'Nom complet, montant et service sont requis' },
        { status: 400 }
      );
    }

    const payment = await db.payment.create({
      data: {
        reference: reference || crypto.randomUUID(),
        nomComplet,
        montant,
        moyenPaiement: moyenPaiement || 'CAMPOST',
        datePaiement: datePaiement || new Date().toLocaleString('fr-FR'),
        numeroQuittance: numeroQuittance || '',
        statutPaiement,
        service,
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}
