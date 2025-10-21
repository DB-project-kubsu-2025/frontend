import { useQuery } from '@tanstack/react-query';
import { useApiRequest } from '@/hooks/useApiRequest';

export function useVacations(year: number, initialData?: any) {
  const { request } = useApiRequest();

  return useQuery({
    queryKey: ['vacations2', year],
    queryFn: () => request(`/vacations?year=${year}`),
    staleTime: 1000 * 60 * 5,
    initialData: year === 2025 ? initialData : undefined,
  });
}