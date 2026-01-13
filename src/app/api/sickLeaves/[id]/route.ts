import { NextRequest, NextResponse } from 'next/server';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year');
    console.log(year);
    const { id } = await params;

    const vacations = {
      number: 1232432,
      calendar: {
        id,
        start_date: '2025-07-01',
        end_date: '2025-07-14',
        status: 'planned',
      },
    };

    return NextResponse.json(vacations, { status: 200 });
  } catch (error) {
    console.error('Ошибка при обработке запроса:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const reqData = await req.json();
  const calendar = reqData.calendar;
  console.log('###', calendar);
  return NextResponse.json({ message: 'Больничный обновлен' }, { status: 200 });
}

export async function DELETE(req: Request, { params }: Ctx) {
  const aa = await params;
  console.log(aa);
  return NextResponse.json({ message: 'Больничный удалён' }, { status: 200 });
}
