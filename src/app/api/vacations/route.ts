import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year');

    let vacations = {};
    
    if (year == '2025') {
      vacations = {
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
    } else {
      vacations = {
        used_days: 20,
        balance_days: 10,
        planned_days: 1,
        calendarLeaves: [
          {
            id: 1,
            employee: 'Иванов Иван',
            start_date: '2024-04-01',
            end_date: '2024-04-14',
            status: 'done',
          },
          {
            id: 2,
            employee: 'Петров Петр',
            start_date: '2024-10-10',
            end_date: '2024-10-20',
            status: 'planned',
          },
        ],
      };
    }

    return NextResponse.json(vacations, { status: 200 });
  } catch (error) {
    console.error('Ошибка при обработке запроса:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
