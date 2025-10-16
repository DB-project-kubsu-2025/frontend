'use client';
import axios, { Method, AxiosResponse, AxiosHeaders } from 'axios';
import { getCookie, deleteCookie } from 'cookies-next/client';
import { useSnackbar } from 'notistack';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000, //7000,
  withCredentials: true,
  // validateStatus: (status) => status < 403,
});

interface ApiRequestOptions {
  method?: Method;
  data?: any;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

interface ApiResponse {
  status: number;
  message?: string;
  data: any;
}

export function useApiRequest() {
  const { enqueueSnackbar } = useSnackbar();
  async function request(
    endpoint: string,
    {
      method = 'GET',
      data = null,
      headers = {},
      signal,
    }: ApiRequestOptions = {},
  ): Promise<AxiosResponse | ApiResponse> {
    const token = getCookie('token');
    const requestHeaders = new AxiosHeaders();
    requestHeaders.set('Content-Type', 'application/json');

    document.dispatchEvent(new Event('ajaxStart'));

    Object.entries(headers).forEach(([key, value]) => {
      requestHeaders.set(key, value);
    });

    if (token) {
      requestHeaders.set('Authorization', `Bearer ${token}`);
    }

    try {
      console.log('Отправка запроса:', endpoint, method);
      const response = await apiClient({
        url: endpoint,
        method,
        headers: requestHeaders,
        ...(method === 'GET' ? { params: data } : { data }),
        signal,
      });
      return response;
    } catch (error: any) {
      if (error.response?.status === 400) {
        if (error.response?.data?.message) {
          enqueueSnackbar(error.response.data.message, { variant: 'error' });
        }
        throw error;
      }

      const status = error.response?.status || 500;
      const message =
        error.response?.data?.message || 'Ошибка соединения с сервером';
      console.error('Ошибка API:', message);

      if (status === 401) {
        deleteCookie('token', { path: '/' });
        window.location.replace('/login');
      }
      return Promise.reject({
        response: { status, data: { message } },
        message,
      });
    } finally {
      document.dispatchEvent(new Event('ajaxStop'));
    }
  }

  return { request };
}
