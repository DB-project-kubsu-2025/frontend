'use client';

import { useSnackbar } from 'notistack';
import { apiRequest, ApiRequestOptions, ApiResponse } from '@/shared/api/request';

export function useApiRequest() {
  const { enqueueSnackbar } = useSnackbar();

  async function request<T = any>(
    endpoint: string,
    options: ApiRequestOptions = {},
  ): Promise<ApiResponse<T>> {
    try {
      return await apiRequest<T>(endpoint, options);
    } catch (error: any) {
      // console.log(error?.response?.data?.message, '@@@@@@@@@@@@@@@@');
      // if (error?.response?.status === 400 && error?.response?.data?.message) {
      //   enqueueSnackbar(error.response.data.message, { variant: 'error' });
      // }
      throw error;
    }
  }

  return { request };
}
