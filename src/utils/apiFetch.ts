import { cookies } from 'next/headers';

const BASE_URL = 'http://backend:8070/api'; //process.env.API_URL;

interface ApiOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function apiFetch<T = any>(
  endpoint: string,
  method: string = 'GET',
  options: ApiOptions = {},
): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const headers: Record<string, string> = {
    ...(options.headers ?? {}),
  };

  // Content-Type ставим только если не FormData и если его не передали вручную
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,          // важно: пробрасываем body, credentials, cache, next, signal и т.д.
    method,
    headers,
  });

  // попытка красиво достать текст ошибки
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Ошибка API ${res.status}: ${res.statusText}${text ? ` — ${text}` : ''}`,
    );
  }

  // если вдруг 204
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}
