import { apiFetch } from '@/utils/apiFetch';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const data: any = await apiFetch(
      '/auth_service/employee/register/',
      'POST',
      {
        body: JSON.stringify(body),
      },
    );

    const access_token = data?.access_token;
    if (!access_token) {
      return NextResponse.json(
        { message: 'Некорректный ответ сервера' },
        { status: 502 },
      );
    }

    const res = NextResponse.json({ ok: true });

    res.cookies.set({
      name: 'token',
      value: access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60,
    });

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
