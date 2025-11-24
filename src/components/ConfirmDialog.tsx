"use client";

import { createContext, useContext, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

type ConfirmOptions = {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
};

type ConfirmFn = (message: string | ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});
  const [resolver, setResolver] = useState<(v: boolean) => void>(() => {});

  const confirm: ConfirmFn = (message) => {
    return new Promise<boolean>((resolve) => {
      const opts =
        typeof message === "string" ? { message } : message;

      setOptions({
        title: opts.title,
        message: opts.message ?? "Вы уверены?",
        confirmText: opts.confirmText ?? "Да",
        cancelText: opts.cancelText ?? "Отмена",
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
    <ConfirmContext.Provider value={confirm}>
      {children}

      <Dialog open={open} onClose={() => handleClose(false)} maxWidth='xs'>
        <DialogTitle>{options.title}</DialogTitle>
        <DialogContent sx={{minWidth: 250}}>
          <Typography>{options.message}</Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => handleClose(false)}>
            {options.cancelText}
          </Button>
          <Button
            variant="contained"
            onClick={() => handleClose(true)}
          >
            {options.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }
  return ctx;
}
