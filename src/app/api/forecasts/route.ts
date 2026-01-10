import { NextRequest, NextResponse } from 'next/server';
import { apiFetch } from '@/utils/apiFetch';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    // const res = await apiFetch(`/ml_service/predict?${url.searchParams.toString()}`, 'GET');
    const res = await apiFetch(`/ml_service/predict?${url.searchParams.toString()}`, 'GET', {
  headers: { Accept: 'application/json' },
});
    console.log('@@@@@@@@@@@', `/ml_service/predict?${url.searchParams.toString()}`);
    if (res.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json(res.data ?? { message: res.text ?? 'OK' }, {
      status: res.status,
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message ?? 'Ошибка запроса к ML-сервису' },
      { status: 500 },
    );
  }
}
