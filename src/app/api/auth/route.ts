import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(`${process.env.API_URL}/auth_service/token/obtain/`, process.env.API_URL);
    const r = await fetch(
      `${process.env.API_URL}/auth_service/token/obtain/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    let data: any = null;
    const text = await r.text();
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }

    if (!r.ok) {
      return NextResponse.json(
        { message: data?.message || data?.detail || 'Ошибка входа' },
        { status: r.status }
      );
    }

    const access_token = data?.access_token;
    if (!access_token) {
      return NextResponse.json(
        { message: 'Некорректный ответ сервера' },
        { status: 502 }
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
      maxAge: 60 * 60,
    });

    return res;
  } catch (err) {
    console.error('Login route error:', err);
    return NextResponse.json(
      { message: 'Сервер авторизации недоступен' },
      { status: 503 }
    );
  }
}
