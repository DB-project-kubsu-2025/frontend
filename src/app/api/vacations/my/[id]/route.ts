import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year');
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
