import { z } from 'zod';
import { toInt } from '@/utils/validation';

export const SuppliersListFormSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  address: z.string(),
  ogrn: z.string(),
});

export const SuppliersListNormalizedSchema = SuppliersListFormSchema.transform(
  (v) => {
    return {
      id: toInt(v.id),
      name: v.name,
      address: v.address,
      ogrn: v.ogrn,
    };
  },
);

export const SuppliersDetailFormSchema = z.object({
  id: z.number().int().optional().default(0),
  dt_created: z.string(),
  dt_updated: z.string(),
  name: z.string(),
  address: z.string(),
  ogrn: z.string(),
  inn: z.string(),
  kpp: z.string(),
  bank_name: z.string(),
  bik: z.string(),
  corr_account: z.string(),
  checking_account: z.string(),
  swift: z.string(),
  iban: z.string(),
});

export const SuppliersDetailNormalizedSchema =
  SuppliersDetailFormSchema.transform((v) => {
    return {
      id: v.id && v.id > 0 ? v.id : undefined,
      dt_created: v.dt_created,
      dt_updated: v.dt_updated,
      name: v.name,
      address: v.address,
      ogrn: v.ogrn,
      inn: v.inn,
      kpp: v.kpp,
      bank_name: v.bank_name,
      bik: v.bik,
      corr_account: v.corr_account,
      checking_account: v.checking_account,
      swift: v.swift,
      iban: v.iban,
    };
  });

export type SuppliersListNormalized = z.infer<
  typeof SuppliersListNormalizedSchema
>;
export type SuppliersDetailNormalized = z.infer<
  typeof SuppliersDetailNormalizedSchema
>;
