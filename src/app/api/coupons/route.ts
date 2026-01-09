import { NextRequest, NextResponse } from 'next/server';
import { apiFetch } from '@/utils/apiFetch';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const res = await apiFetch('/shops/coupons/', 'POST', {
      body: JSON.stringify(body),
    });
    
    return NextResponse.json(res, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Ошибка создания купона' },
      { status: error.response?.status || 500 }
    );
  }
}
