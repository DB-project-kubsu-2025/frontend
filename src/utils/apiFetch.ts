import { cookies } from 'next/headers';

const BASE_URL =
  process.env.API_URL ||
  (process.env.DOCKER_ENV === 'true'
    ? 'http://backend:8070/api'
    : 'http://localhost:8070/api');

interface ApiOptions extends RequestInit {
  headers?: Record<string, string>;
}

export type ApiResult<T> = {
  status: number;
  ok: boolean;
  data: T | null;
  text?: string;
};

const joinUrl = (base: string, endpoint: string) => {
  const b = base.replace(/\/+$/, '');
  const e = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${b}${e}`;
};

export async function apiFetch<T = any>(
  endpoint: string,
  method: string = 'GET',
  options: ApiOptions = {},
): Promise<ApiResult<T>> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const headers: Record<string, string> = {
    ...(options.headers ?? {}),
  };

  const isFormData =
    typeof FormData !== 'undefined' && options.body instanceof FormData;

  // Content-Type по умолчанию ставим только если не FormData и если не задан вручную
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = joinUrl(BASE_URL, endpoint);

  const res = await fetch(url, {
    ...options,
    method,
    headers,
  });

  // 204/205: тело отсутствует
  if (res.status === 204 || res.status === 205) {
    return { status: res.status, ok: res.ok, data: null };
  }

  const contentType = res.headers.get('content-type') ?? '';
  const rawText = await res.text().catch(() => '');

  // Если пусто — просто null
  if (!rawText) {
    return { status: res.status, ok: res.ok, data: null };
  }

  // Если похоже на JSON — парсим, иначе возвращаем text
  if (contentType.includes('application/json')) {
    try {
      return { status: res.status, ok: res.ok, data: JSON.parse(rawText) as T };
    } catch {
      return { status: res.status, ok: res.ok, data: null, text: rawText };
    }
  }

  // не JSON
  return { status: res.status, ok: res.ok, data: null, text: rawText };
}
