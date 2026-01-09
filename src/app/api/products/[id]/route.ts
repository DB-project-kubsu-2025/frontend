import { apiFetch } from '@/utils/apiFetch';
import { da } from 'date-fns/locale';
import { NextResponse } from 'next/server';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  const idNum = Number(id);
  try {
    const body = await req.json();

    const data: any = await apiFetch(`/shops/products/${idNum}/`, 'PUT', {
      body: JSON.stringify(body),
    });
    console.log('%%%', data);

    const res = NextResponse.json(
      data.status === 400 ? data.data : { message: 'Товар обновлён' },
      { status: data.status },
    );
    return res;
  } catch (err: any) {
    console.error('Register route error:', err);

    console.log(err.data, err.status);
    if (err) {
      return NextResponse.json(
        { message: err.data || {} },
        { status: err.status },
      );
    }

    return NextResponse.json(
      { message: 'Сервер авторизации недоступен' },
      { status: 503 },
    );
  }
}
