'use client';

import { useCallback } from 'react';

type Deps = {
  request: (url: string, opts?: any) => Promise<any>;
  refresh?: () => void;
  notify?: (msg: string, variant: 'success' | 'error') => void;
};

export function useDeleteEntity({ request, refresh, notify }: Deps) {
  return useCallback(
    async ({
      subject,
      id,
      message,
    }: {
      subject: string;
      id: number;
      message: string;
    }) => {
      try {
        const res = await request(`/${subject}/${id}`, { method: 'DELETE' });

        const msg = message ?? 'Удалено';
        notify?.(msg, 'success');

        refresh?.();
        return res?.data ?? res;
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ?? err?.message ?? 'Ошибка удаления';

        notify?.(msg, 'error');
        return null;
      }
    },
    [request, refresh, notify],
  );
}
