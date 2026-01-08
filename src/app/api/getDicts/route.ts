import { NextResponse } from 'next/server';
import dictsApi from '@/shared/dictsApi';

export async function GET() {
  try {
    const [units, categories, paymentMethods] = await Promise.all([
      dictsApi.getUnits(),
      dictsApi.getCategories(),
      dictsApi.getPaymentMethods(),
    ]);
    
    return NextResponse.json({ units, categories, paymentMethods });
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message || 'Failed to load dicts' },
      { status: 500 },
    );
  }
}
