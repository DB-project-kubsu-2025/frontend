import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { secretKey } from '@/libs/jwtConfig';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token)
    return NextResponse.json({ authenticated: false }, { status: 401 });

  try {
    const { payload } = await jwtVerify(token, secretKey);
    const user_id = String(
      (payload as any).user_id ??
        (payload as any).uid ??
        (payload as any).id ??
        payload.sub,
    );
    if (!user_id)
      return NextResponse.json({ authenticated: false }, { status: 403 });

    return NextResponse.json({
      authenticated: true,
      user: {
        user_id,
        user_name: (payload as any).user_name ?? null,
        user_role: (payload as any).user_role ?? null,
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
