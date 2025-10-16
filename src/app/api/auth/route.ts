import { expiresIn, secretKey } from '@/libs/jwtConfig';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

export async function POST(req: any) {
  // const { username, password } = await req.json();
  const user = {
    id: 1,
    name: 'Иван Иванов',
    role: 'admin',
  };

  const token = await new SignJWT({
    user_id: user.id,
    user_name: user.name,
    user_role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expiresIn)
    .sign(secretKey);

  const cookieStore = await cookies();
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60,
    path: '/',
  });
  return Response.json({ token, user }, { status: 200 });

  // return Response.json(
  //   { message: 'Неверный логин или пароль' },
  //   { status: 400 },
  // );
}
