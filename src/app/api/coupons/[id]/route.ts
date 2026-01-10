import { NextRequest, NextResponse } from 'next/server';
import { apiFetch } from '@/utils/apiFetch';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const idNum = Number(id);

  const res = await apiFetch(`/shops/coupons/${idNum}/`);
  return NextResponse.json(res.data ?? null, { status: res.status });
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const idNum = Number(id);
  const body = await request.json();

  const res = await apiFetch(`/shops/coupons/${idNum}/`, 'PUT', {
    body: JSON.stringify(body),
  });

  return NextResponse.json(
    res.data ?? { message: res.text ?? 'Ошибка' },
    { status: res.status },
  );
}

export async function DELETE(_request: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const idNum = Number(id);

  const res = await apiFetch(`/shops/coupons/${idNum}/`, 'DELETE');

  // 204 нельзя через NextResponse.json (тело запрещено)
  if (res.status === 204) return new NextResponse(null, { status: 204 });

  return NextResponse.json(
    res.data ?? { message: 'Купон удалён' },
    { status: res.status },
  );
}
