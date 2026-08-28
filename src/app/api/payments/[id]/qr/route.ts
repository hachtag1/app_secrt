import QRCode from 'qrcode';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // In production, this would be your actual domain
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const paymentUrl = `${baseUrl}/?id=${id}`;

    const qrDataUrl = await QRCode.toDataURL(paymentUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#0e7490',
        light: '#ffffff',
      },
    });

    return NextResponse.json({ qrCode: qrDataUrl, paymentUrl });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 });
  }
}
