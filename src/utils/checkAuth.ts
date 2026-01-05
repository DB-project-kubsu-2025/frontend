export async function verifyToken(request: {
  cookies: { get: (key: string) => { value?: string } | undefined };
}) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return { error: 'Нет токена', status: 401 };

    return {
      valid: true,
    };
  } catch (e) {
    console.error('Ошибка валидации токена:', e);
    return { error: 'Ошибка валидации токена', status: 403 };
  }
}
