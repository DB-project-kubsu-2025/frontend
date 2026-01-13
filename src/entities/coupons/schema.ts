import { z } from 'zod';
import { toInt } from '@/utils/validation';

export const CouponsListFormSchema = z.object({
  id: z.number().int().positive(),
  storage: z.number().int().positive(),
  product: z.number().int().positive().nullable(),
  discount_type: z.number().int().positive(),
  value: z.number().int().positive(),
  valid_from: z.string(),
  valid_to: z.string(),
  min_quantity: z.number().int().positive().nullable(),
  is_active: z.boolean(),
  storage_name: z.string(),
  product_name: z.string().nullable(),
  discount_type_name: z.string(),
});

export const CouponsListNormalizedSchema = CouponsListFormSchema.transform(v => {
  return {
    id: toInt(v.id),
    storage: toInt(v.storage),
    product: v.product ? toInt(v.product) : null,
    discount_type: toInt(v.discount_type),
    value: toInt(v.value),
    valid_from: v.valid_from,
    valid_to: v.valid_to,
    min_quantity: v.min_quantity ? toInt(v.min_quantity) : null,
    is_active: v.is_active,
    storage_name: v.storage_name,
    product_name: v.product_name,
    discount_type_name: v.discount_type_name,
  };
});

export const CouponsDetailFormSchema = z.object({
  id: z.number().int().positive(),
  storage: z.number().int().positive(),
  product: z.number().int().positive().nullable(),
  discount_type: z.number().int().positive(),
  value: z.number().int().positive(),
  valid_from: z.string(),
  valid_to: z.string(),
  min_quantity: z.number().int().positive().nullable(),
  is_active: z.boolean(),
  storage_name: z.string(),
  product_name: z.string().nullable(),
  discount_type_name: z.string(),
});

export const CouponsDetailNormalizedSchema = CouponsDetailFormSchema.transform(v => {
  return {
    id: toInt(v.id),
    storage: toInt(v.storage),
    product: v.product ? toInt(v.product) : null,
    discount_type: toInt(v.discount_type),
    value: toInt(v.value),
    valid_from: v.valid_from,
    valid_to: v.valid_to,
    min_quantity: v.min_quantity ? toInt(v.min_quantity) : null,
    is_active: v.is_active,
    storage_name: v.storage_name,
    product_name: v.product_name,
    discount_type_name: v.discount_type_name,
  };
});

export type CouponsListNormalized = z.infer<typeof CouponsListNormalizedSchema>;
export type CouponsDetailNormalized = z.infer<typeof CouponsDetailNormalizedSchema>;
