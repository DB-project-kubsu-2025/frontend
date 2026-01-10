import { apiFetch } from '@/utils/apiFetch';
import { NextResponse } from 'next/server';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  const idNum = Number(id);
  try {
    const body = await req.json();

    const data: any = await apiFetch(`/employees/job-positions/${idNum}/`, 'PUT', {
      body: JSON.stringify(body),
    });
    console.log('%%%', data);

    const res = NextResponse.json(
      data.status === 400 ? data.data : { message: 'Должность обновлена' },
      { status: data.status },
    );
    return res;
  } catch (err: any) {
    console.error('Register route error:', err);

    console.log(err.data, err.status);
    if (err) {
      return NextResponse.json(
        { message: err.data || {} },
        { status: err.status },
      );
    }

    return NextResponse.json(
      { message: 'Сервер авторизации недоступен' },
      { status: 503 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  const idNum = Number(id);
  try {
    const data: any = await apiFetch(`/employees/job-positions/${idNum}/`, 'DELETE'); //{ status: 204, ok: true, data: null }
    console.log('%%%', data);

    if (data?.status === 204) {
      return NextResponse.json({ message: 'Должность удалён' }, { status: 200 });
    }

    return NextResponse.json(data?.data ?? { message: 'Должность удалён' }, {
      status: data?.status ?? 200,
    });
  } catch (err: any) {
    console.error('Register route error:', err);

    console.log(err.data, err.status);
    if (err) {
      return NextResponse.json(
        { message: err?.data ?? 'Ошибка удаления' },
        { status: err?.status ?? 503 },
      );
    }

    return NextResponse.json(
      { message: 'Сервер авторизации недоступен' },
      { status: 503 },
    );
  }
}
