import { NextRequest, NextResponse } from 'next/server';
import { apiFetch } from '@/utils/apiFetch';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const res = await apiFetch(`/shops/coupons/${id}/`, 'PUT', {
      body: JSON.stringify(body),
    });
    
    return NextResponse.json(res, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Ошибка обновления купона' },
      { status: error.response?.status || 500 }
    );
  }
}
