import { NextResponse } from 'next/server';

const vacations = {
  used_days: 21,
  balance_days: 9,
  planned_days: 2,
  calendarLeaves: [
    {
      id: 1,
      employee: 'Иванов Иван',
      start_date: '2025-07-01',
      end_date: '2025-07-14',
      status: 'done',
    },
    {
      id: 2,
      employee: 'Петров Петр',
      start_date: '2025-08-10',
      end_date: '2025-08-20',
      status: 'planned',
    },
    {
      id: 3,
      employee: 'Сидоров Сергей',
      start_date: '2025-09-05',
      end_date: '2025-09-12',
      status: 'planned',
    },
  ],
};

export async function GET() {
  try {
    return NextResponse.json(vacations, { status: 200 });
  } catch (error) {
    console.error('Ошибка при обработке запроса:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
