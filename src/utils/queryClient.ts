import { QueryClient, QueryCache } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { deleteCookie } from 'cookies-next';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (e) => {
      handleApiError(e);
    },
  }),
});

function handleApiError(error: any) {
  const status = error?.response?.status || 500;
  const message =
    error?.response?.data?.message || 'Ошибка соединения с сервером';

  if (status === 400) {
    enqueueSnackbar(message, { variant: 'error' });
  } else if (status === 401) {
    deleteCookie('token', { path: '/' });
    window.location.replace('/login');
  } else if (status >= 500) {
    enqueueSnackbar('Ошибка на сервере', { variant: 'error' });
  } else {
    enqueueSnackbar(message, { variant: 'default' });
  }
}
