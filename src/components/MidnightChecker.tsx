'use client';

import { useEffect, useRef } from 'react';
import { usePopup } from '@/components/Popup';

export default function MidnightChecker() {
  const popup = usePopup();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function msToNextMidnight() {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      let diff = midnight.getTime() - now.getTime();

      if (diff < 0) {
        diff += 24 * 60 * 60 * 1000;
      }

      return diff;
    }

    async function showPopup() {
      const result = await popup({
        message: 'Вы продолжаете работать?',
        confirmText: 'Да',
        cancelText: 'Нет',
      });

      if (!result) {
        console.log('ЗАКРЫТЬ');
      }
    }

    timeoutRef.current = setTimeout(() => showPopup(), msToNextMidnight());

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [popup]);

  return null;
}
