import { useQuery } from '@tanstack/react-query';
import { useApiRequest } from '@/hooks/useApiRequest';

export function useCalendarLeaves(
  quKey: string,
  year: number,
  initialData?: any,
) {
  const { request } = useApiRequest();

  return useQuery({
    queryKey: [quKey, year],
    queryFn: () => request(`/${quKey}?year=${year}`),
    staleTime: 1000 * 60 * 5,
    initialData: year === 2025 ? initialData : undefined,
  });
}
