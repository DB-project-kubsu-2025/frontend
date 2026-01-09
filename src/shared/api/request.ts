import axios, { Method, AxiosHeaders } from 'axios';
import { getCookie, deleteCookie } from 'cookies-next/client';

const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000,
  withCredentials: true,
});

export interface ApiRequestOptions {
  method?: Method;
  data?: any;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export interface ApiResponse<T = any> {
  status: number;
  message?: string;
  data: T;
}

export async function apiRequest<T = any>(
  endpoint: string,
  { method = 'GET', data = null, headers = {}, signal }: ApiRequestOptions = {},
): Promise<ApiResponse<T>> {
  const token = getCookie('token');

  const requestHeaders = new AxiosHeaders();
  requestHeaders.set('Content-Type', 'application/json');

  Object.entries(headers).forEach(([key, value]) => {
    requestHeaders.set(key, value);
  });

  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await apiClient({
      url: endpoint,
      method,
      headers: requestHeaders,
      ...(method === 'GET' ? { params: data } : { data }),
      signal,
    });

    return {
      status: response.status,
      message: response.data?.message,
      data: response.data,
    };
  } catch (error: any) {
    const status = error?.response?.status ?? 500;
    const responseData = error?.response?.data;

    // нормальное сообщение (если есть)
    const message =
      responseData?.message ??
      (typeof responseData === 'string' ? responseData : null) ??
      'Ошибка соединения с сервером';

    if (status === 401) {
      if (
        typeof window !== 'undefined' &&
        window.location.pathname !== '/login'
      ) {
        deleteCookie('token', { path: '/' });
        window.location.replace('/login');
      }
    }

    return Promise.reject({
      response: { status, data: responseData },
      message,
    });
  }
}
