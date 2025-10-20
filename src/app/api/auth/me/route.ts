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

    const user_id = String(payload.user_id);
    if (!user_id)
      return NextResponse.json({ authenticated: false }, { status: 403 });

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user_id,
        name: (payload as any).user_name ?? null,
        role: (payload as any).user_role ?? null,
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
