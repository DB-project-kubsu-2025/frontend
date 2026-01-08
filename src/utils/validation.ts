import z from 'zod';

export const digits = (len: number, msg: string) =>
  z.string().regex(new RegExp(`^\\d{${len}}$`), msg);

export const digitsRange = (min: number, max: number, msg: string) =>
  z.string().regex(new RegExp(`^\\d{${min},${max}}$`), msg);

export const emptyOrDigits = (len: number, msg: string) =>
  z.union([z.literal(''), digits(len, msg)]);

export const emptyOrDigitsRange = (min: number, max: number, msg: string) =>
  z.union([z.literal(''), digitsRange(min, max, msg)]);

export const toInt = (x: string | number) => {
  const n = Number(x);
  if (!Number.isFinite(n)) throw new Error('Ожидалось число');
  return Math.trunc(n);
};
