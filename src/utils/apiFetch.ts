import { cookies } from 'next/headers';

const BASE_URL = 'http://backend:8070/api';

interface ApiOptions extends RequestInit {
  headers?: Record<string, string>;
}

export type ApiResult<T> = {
  status: number;
  ok: boolean;
  data: T | null;
  text?: string;
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

  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    method,
    headers,
  });

  if (res.status === 204) {
    return { status: res.status, ok: res.ok, data: null };
  }

  const text = await res.text().catch(() => '');
  let data: any = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  return {
    status: res.status,
    ok: res.ok,
    data,
    ...(data === null && text ? { text } : {}),
  };
}
