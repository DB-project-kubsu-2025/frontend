import { cookies } from 'next/headers';

const BASE_URL = process.env.API_URL;

interface ApiOptions extends RequestInit {
  headers?: any;
}

export async function apiFetch(
  endpoint: string,
  method: string = 'GET',
  options: ApiOptions = {},
) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const headers: any = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
  });

  if (!res.ok) {
    throw new Error(`Ошибка API ${res.status}: ${res.statusText}`);
  }

  return res.json();
}
