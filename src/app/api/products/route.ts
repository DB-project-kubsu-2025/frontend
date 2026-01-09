import { apiFetch } from '@/utils/apiFetch';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const data: any = await apiFetch(
      '/shops/products/',
      'POST',
      {
        body: JSON.stringify(body),
      },
    );
    console.log('%%%',data);
    
    const res = NextResponse.json(data.data, { status: data.status });
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
