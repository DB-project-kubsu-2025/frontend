import { apiFetch } from '@/utils/apiFetch';
import EmployeesClient from './client';

export default async function EmployeesPage() {
  const res: any = (await apiFetch('/employees/employees/')).data;
  console.log(res);
  return <EmployeesClient initData={res} />;
}
