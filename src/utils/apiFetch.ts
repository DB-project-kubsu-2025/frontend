import { cookies } from 'next/headers'; //, headers

const BACKEND_BASE_URL =
  process.env.API_URL ||
  (process.env.DOCKER_ENV === 'true'
    ? 'http://backend:8070/api'
    : 'http://localhost:8070/api');

interface ApiOptions extends RequestInit {
  headers?: Record<string, string>;
  local?: boolean;
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

// async function getRequestOrigin() {
//   const h = await headers();

//   const forwardedProto = h.get('x-forwarded-proto');
//   const forwardedHost = h.get('x-forwarded-host');

//   const proto = forwardedProto ?? 'http';
//   const host = forwardedHost ?? h.get('host');

//   const fallback =
//     process.env.NEXT_PUBLIC_APP_URL ||
//     process.env.APP_URL ||
//     'http://localhost:3000';

//   return host ? `${proto}://${host}` : fallback;
// }

export async function apiFetch<T = any>(
  endpoint: string,
  methodOrOptions: string | ApiOptions = 'GET',
  maybeOptions: ApiOptions = {},
): Promise<ApiResult<T>> {
  const method = typeof methodOrOptions === 'string' ? methodOrOptions : 'GET';
  const options =
    typeof methodOrOptions === 'string' ? maybeOptions : methodOrOptions;

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const headersOut: Record<string, string> = {
    ...(options.headers ?? {}),
  };

  const isFormData =
    typeof FormData !== 'undefined' && options.body instanceof FormData;

  if (!isFormData && !headersOut['Content-Type']) {
    headersOut['Content-Type'] = 'application/json';
  }

  if (token && !headersOut['Authorization']) {
    headersOut['Authorization'] = `Bearer ${token}`;
  }

  const isServer = typeof window === 'undefined';

  let base: string;

  if (options.local) {
    if (isServer) {
      base =
        process.env.LOCAL_API_URL ||
        (process.env.DOCKER_ENV === 'true'
          ? 'http://127.0.0.1:3000/api'
          : 'http://localhost:3000/api');
    } else {
      base = '/api';
    }
  } else {
    base = BACKEND_BASE_URL;
  }

  const url = joinUrl(base, endpoint);
  
  const res = await fetch(url, {
    ...options,
    method,
    headers: headersOut,
  });

  if (res.status === 204 || res.status === 205) {
    return { status: res.status, ok: res.ok, data: null };
  }

  const contentType = res.headers.get('content-type') ?? '';
  const rawText = await res.text().catch(() => '');

  if (!rawText) {
    return { status: res.status, ok: res.ok, data: null };
  }

  if (contentType.includes('application/json')) {
    try {
      return { status: res.status, ok: res.ok, data: JSON.parse(rawText) as T };
    } catch {
      return { status: res.status, ok: res.ok, data: null, text: rawText };
    }
  }

  return { status: res.status, ok: res.ok, data: null, text: rawText };
}
