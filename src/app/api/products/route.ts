import { apiFetch } from '@/utils/apiFetch';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const data: any = await apiFetch('/shops/products/', 'POST', {
      body: JSON.stringify(body),
    });

    return NextResponse.json(
      data.status === 400 ? data.data : { message: 'Товар добавлен' },
      { status: data.status },
    );
  } catch (err: any) {
    console.error('Products POST error:', err);

    return NextResponse.json(
      { message: err?.data || err?.message || {} },
      { status: err?.status || 503 },
    );
  }
}
