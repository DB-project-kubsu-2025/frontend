import { JWTPayload, jwtVerify } from 'jose';
import { secretKey } from '@/libs/jwtConfig';

interface TokenPayload {
  user_id?: number | string;
  user_name?: string;
  user_role?: string;
  uid?: number | string;
  id?: number | string;
}

export async function verifyToken(request: {
  cookies: { get: (key: string) => { value?: string } | undefined };
}) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return { error: 'Нет токена', status: 401 };

    const { payload } = await jwtVerify(token, secretKey);

    const p = payload as JWTPayload & TokenPayload;

    const anyId = p.user_id ?? p.uid ?? p.id ?? p.sub;

    if (!anyId) return { error: 'Ошибка авторизации', status: 403 };

    const user_id = typeof anyId === 'number' ? String(anyId) : String(anyId);
    
    return {
      valid: true,
      user_id,
      user_name: p.user_name,
      user_role: p.user_role,
    };
  } catch (e) {
    console.error('Ошибка валидации токена:', e);
    return { error: 'Ошибка валидации токена', status: 403 };
  }
}
