'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

type PopupOptions = {
  message?: string;
  confirmText?: string;
  cancelText?: string;
};

type PopupFn = (options: string | PopupOptions) => Promise<boolean>;

const PopupContext = createContext<PopupFn | null>(null);

export default function PopupProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<PopupOptions>({});
  const [resolver, setResolver] = useState<(value: boolean) => void>(() => {});

  const popup: PopupFn = (opts) => {
    return new Promise<boolean>((resolve) => {
      const normalized = typeof opts === 'string' ? { message: opts } : opts;

      setOptions({
        message: normalized.message ?? 'Вы уверены?',
        confirmText: normalized.confirmText ?? 'Ок',
        cancelText: normalized.cancelText ?? 'Отмена',
      });

      setResolver(() => resolve);
      setOpen(true);
    });
  };

  const handleClose = (result: boolean) => {
    setOpen(false);
    resolver(result);
  };

  return (
    <PopupContext.Provider value={popup}>
      {children}

      <Dialog open={open} onClose={() => handleClose(false)} maxWidth="xs">
        <DialogContent sx={{ minWidth: 280 }}>
          <Typography>{options.message}</Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => handleClose(false)} color="secondary">
            {options.cancelText}
          </Button>

          <Button variant="contained" onClick={() => handleClose(true)}>
            {options.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </PopupContext.Provider>
  );
}

export function usePopup(): PopupFn {
  const ctx = useContext(PopupContext);
  if (!ctx) {
    throw new Error('usePopup must be used within PopupProvider');
  }
  return ctx;
}
