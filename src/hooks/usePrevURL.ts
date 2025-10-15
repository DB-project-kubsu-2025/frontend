'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

type NavigateOptions = {
  scroll?: boolean;
  replace?: boolean;
  storageKey?: string;
  savePrevURL?: boolean;
  dispatchAjaxStart?: boolean;
};

export function usePrevURL(defaultStorageKey = 'prevURL') {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getCurrentURL = useCallback(() => {
    const qs = searchParams?.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }, [pathname, searchParams]);

  const navigateWithPrev = useCallback(
    (url: string, opts: NavigateOptions = {}) => {
      const {
        replace = false,
        scroll = false,
        storageKey = defaultStorageKey,
        savePrevURL = true,
        dispatchAjaxStart = true,
      } = opts;

      if (dispatchAjaxStart && typeof document !== 'undefined') {
        document.dispatchEvent(new Event('ajaxStart'));
      }

      if (savePrevURL) {
        const prev = getCurrentURL();
        sessionStorage.setItem(storageKey, prev);
      }

      if (replace) router.replace(url, { scroll });
      else router.push(url, { scroll });
    },
    [router, defaultStorageKey, getCurrentURL],
  );

  const prevURLClickHandler = useCallback(
    (url: string, opts?: NavigateOptions) => (e?: React.MouseEvent) => {
      console.log('a');
      e?.preventDefault();
      e?.stopPropagation();
      navigateWithPrev(url, opts);
    },
    [navigateWithPrev],
  );

  return { navigateWithPrev, prevURLClickHandler, getCurrentURL };
}
