import { z } from 'zod';
import { toInt } from '@/utils/validation';

export const PositionsListFormSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
});

export const PositionsListNormalizedSchema = PositionsListFormSchema.transform(v => {
  return {
    id: toInt(v.id),
    name: v.name,
  };
});

export const PositionsDetailFormSchema = z.object({
  id: z.number().int().optional().default(0),
  name: z.string(),
});

export const PositionsDetailNormalizedSchema = PositionsDetailFormSchema.transform(v => {
  return {
    id: v.id && v.id > 0 ? v.id : undefined,
    name: v.name,
  };
});

export type PositionsListNormalized = z.infer<typeof PositionsListNormalizedSchema>;
export type PositionsDetailNormalized = z.infer<typeof PositionsDetailNormalizedSchema>;
