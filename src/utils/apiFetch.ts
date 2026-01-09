import { cookies } from 'next/headers';

// Для серверных компонентов используем внутренний URL Docker или localhost
// NEXT_PUBLIC_API_URL используется для клиентских компонентов
// Для сервера нужно использовать другой подход
const getBaseUrl = () => {
  // Если есть переменная окружения для сервера (приоритет)
  if (process.env.API_URL) {
    return process.env.API_URL;
  }
  
  // В Docker контейнере frontend может обращаться к backend по имени сервиса
  // Проверяем, запущено ли в Docker (по наличию переменной окружения DOCKER_ENV)
  const isDocker = process.env.DOCKER_ENV === 'true';
  
  if (isDocker) {
    // В Docker используем имя сервиса backend из docker-compose
    // Это работает для Server Components, которые выполняются на сервере
    return 'http://backend:8070/api';
  }
  
  // По умолчанию localhost для локальной разработки (без Docker)
  return 'http://localhost:8070/api';
};

const BASE_URL = getBaseUrl();

// Логирование для отладки (только в development)
if (process.env.NODE_ENV === 'development') {
  console.log('[apiFetch] Using BASE_URL:', BASE_URL);
}

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

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const url = `${BASE_URL}${endpoint}`;
    
    // Логирование для отладки (только в development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[apiFetch] ${method} ${url}`, {
        hasToken: !!token,
        headers: Object.keys(headers),
      });
    }
    
    const res = await fetch(url, {
      ...options,
      method,
      headers,
    });
    
    // Логирование ответа для отладки
    if (process.env.NODE_ENV === 'development') {
      console.log(`[apiFetch] Response: ${res.status} ${res.statusText}`, {
        url,
        ok: res.ok,
      });
    }

    if (!res.ok) {
      let errorText = '';
      try {
        errorText = await res.text();
      } catch (e) {
        // Игнорируем ошибку чтения текста
      }
      
      // Для статуса 400 возвращаем JSON, если возможно
      if (res.status === 400) {
        try {
          return JSON.parse(errorText) as T;
        } catch (e) {
          // Если не JSON, продолжаем с ошибкой
        }
      }
      
      // Создаем объект ошибки с дополнительной информацией
      const error = new Error(
        `Ошибка API ${res.status}: ${res.statusText}${errorText ? ` — ${errorText.substring(0, 200)}` : ''}`,
      ) as Error & { status?: number; response?: any };
      error.status = res.status;
      
      try {
        error.response = errorText ? JSON.parse(errorText) : null;
      } catch (e) {
        error.response = { detail: errorText };
      }
      
      throw error;
    }

    if (res.status === 204) return undefined as T;

    return res.json() as Promise<T>;
  } catch (error: any) {
    // Улучшенная обработка ошибок сети
    if (error.message?.includes('fetch failed') || error.code === 'ECONNREFUSED') {
      throw new Error(
        `Не удалось подключиться к серверу. Убедитесь, что backend запущен на ${BASE_URL}`
      );
    }
    throw error;
  }
}
