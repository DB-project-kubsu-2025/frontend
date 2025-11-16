import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    const events = [
      { id: '1', title: 'Универ', date: '2025-11-01', color: '#aa0000' },
      { id: '2', title: 'Работа', date: '2025-11-02' },
      { id: '3', title: 'Работа', date: '2025-11-02' },
      { id: '4', title: 'Работа', date: '2025-11-02' },
      { id: '5', title: 'Работа', date: '2025-11-02' },
      {
        id: '6',
        title: 'Машину на ремонт',
        start: '2025-11-01',
        end: '2025-11-04', //с 01.11 до 03.11 включительно
      },
    ];

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error('Ошибка при обработке запроса:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
