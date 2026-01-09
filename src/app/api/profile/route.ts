import { apiFetch } from '@/utils/apiFetch';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const data: any = await apiFetch(
      '/auth_service/employee/',
      'PATCH',
      {
        body: JSON.stringify(body),
      },
    );
    console.log('%%%',data);
    // if (!access_token) {
    //   return NextResponse.json(
    //     { message: 'Некорректный ответ сервера' },
    //     { status: 502 },
    //   );
    // }

    const res = NextResponse.json(data, { status: 400 });
    return res;
  } catch (err: any) {
    console.error('Register route error:', err);

    if (err) {
      console.log(err.data);
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
