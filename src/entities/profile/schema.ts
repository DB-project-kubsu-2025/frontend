import { z } from 'zod';
import { digits, emptyOrDigits, emptyOrDigitsRange, toInt } from '@/utils/validation';

export const ProfileFormSchema = z.object({
  username: z.string(),
  email: z.string(),
  last_name: z.string(),
  first_name: z.string(),
  second_name: z.string(),
  gender: z.enum(['', 'male', 'female']),
  phone: z.string(),
  birth_date: z.string(),
  snils: z.string(),
  inn: z.string(),
  work_phone: z.string(),
});

export const ProfileNormalizedSchema = ProfileFormSchema.transform(v => {
  return {
    username: v.username,
    email: v.email,
    last_name: v.last_name,
    first_name: v.first_name,
    second_name: v.second_name,
    gender: v.gender,
    phone: v.phone,
    birth_date: v.birth_date,
    snils: v.snils,
    inn: v.inn,
    work_phone: v.work_phone,
  };
});

export type ProfileNormalized = z.infer<typeof ProfileNormalizedSchema>;
