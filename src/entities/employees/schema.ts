import { z } from 'zod';
import { toInt } from '@/utils/validation';

export const EmployeesListFormSchema = z.object({
  id: z.number().int().positive(),
  first_name: z.string(),
  last_name: z.string(),
  second_name: z.string(),
  email: z.string(),
});

export const EmployeesListNormalizedSchema = EmployeesListFormSchema.transform(v => {
  return {
    id: toInt(v.id),
    first_name: v.first_name,
    last_name: v.last_name,
    second_name: v.second_name,
    email: v.email,
  };
});

export const EmployeesDetailFormSchema = z.object({
  id: z.number().int().optional().default(0),
  username: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  second_name: z.string(),
  email: z.string(),
  birth_date: z.string(),
  gender: z.string(),
  passport: z.string(),
  snils: z.string(),
  inn: z.string(),
  phone: z.string(),
  work_phone: z.string(),
  workplace: z.string(),
});

export const EmployeesDetailNormalizedSchema = EmployeesDetailFormSchema.transform(v => {
  return {
    id: v.id && v.id > 0 ? v.id : undefined,
    username: v.username,
    first_name: v.first_name,
    last_name: v.last_name,
    second_name: v.second_name,
    email: v.email,
    birth_date: v.birth_date,
    gender: v.gender,
    passport: v.passport,
    snils: v.snils,
    inn: v.inn,
    phone: v.phone,
    work_phone: v.work_phone,
    workplace: v.workplace,
  };
});

export type EmployeesListNormalized = z.infer<typeof EmployeesListNormalizedSchema>;
export type EmployeesDetailNormalized = z.infer<typeof EmployeesDetailNormalizedSchema>;
