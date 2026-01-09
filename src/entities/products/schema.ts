import { z } from 'zod';
import { digits, emptyOrDigits, emptyOrDigitsRange, toInt } from '@/utils/validation';

export const ProductsListFormSchema = z.object({
  id: z.number().int().positive(),
  category: z.number().int().positive(),
  name: z.string(),
  additional_info: z.string(),
  category_name: z.string(),
});

export const ProductsListNormalizedSchema = ProductsListFormSchema.transform(v => {
  return {
    id: toInt(v.id),
    category: toInt(v.category),
    name: v.name,
    additional_info: v.additional_info,
    category_name: v.category_name,
  };
});

export const ProductsDetailFormSchema = z.object({
  id: z.number().int().optional().default(0),
  unit: z.number().int().positive(),
  category: z.number().int().positive(),
  name: z.string(),
  description: z.string(),
  expiration_days: z.coerce.number().int().positive(),
  producer_name: z.string(),
  producer_code: z.string(),
  country_name: z.string(),
  additional_info: z.string(),
  category_name: z.string().optional(),
});

export const ProductsDetailNormalizedSchema = ProductsDetailFormSchema.transform(v => {
  return {
    id: v.id && v.id > 0 ? v.id : undefined,
    unit: toInt(v.unit),
    category: toInt(v.category),
    name: v.name,
    description: v.description,
    expiration_days: toInt(v.expiration_days),
    producer_name: v.producer_name,
    producer_code: v.producer_code,
    country_name: v.country_name,
    additional_info: v.additional_info,
    category_name: v.category_name,
  };
});

export type ProductsListNormalized = z.infer<typeof ProductsListNormalizedSchema>;
export type ProductsDetailNormalized = z.infer<typeof ProductsDetailNormalizedSchema>;
