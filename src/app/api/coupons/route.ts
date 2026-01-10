import { NextRequest, NextResponse } from 'next/server';
import { apiFetch } from '@/utils/apiFetch';

export async function GET() {
  const res = await apiFetch('/shops/coupons/');
  console.log('###########', res);

  // отдаём как есть (обычно массив или {results:[]})
  return NextResponse.json(res.data ?? null, { status: res.status });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const res = await apiFetch('/shops/coupons/', 'POST', {
    body: JSON.stringify(body),
  });

  return NextResponse.json(res.data ?? { message: res.text ?? 'Ошибка' }, {
    status: res.status,
  });
}
