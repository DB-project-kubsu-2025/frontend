import { NextResponse } from 'next/server';
import { apiFetch } from '@/utils/apiFetch';

export async function GET() {
  try {
    console.log('[GET /api/shops/storages] Fetching storages...');
    const res = await apiFetch('/shops/storages/');
    console.log('[GET /api/shops/storages] Success, items:', Array.isArray(res) ? res.length : 'N/A');
    return NextResponse.json(res, { status: 200 });
  } catch (error: any) {
    console.error('[GET /api/shops/storages] Error:', error);
    console.error('[GET /api/shops/storages] Error details:', {
      message: error?.message,
      status: error?.status,
      response: error?.response,
      stack: error?.stack,
    });
    
    const statusCode = error?.status || error?.response?.status || 500;
    const errorMessage = error?.message || error?.response?.data?.message || 'Ошибка получения списка хранилищ';
    
    return NextResponse.json(
      { 
        message: errorMessage,
        error: error?.response?.data || error?.response,
      },
      { status: statusCode }
    );
  }
}
