import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    console.log(month, year);

    const events = [
      {
        id: 1,
        date: '2025-11-01',
        employee_name: 'Иванов И. И.',
        work_time: 481,
        all_time: 480,
      },
      {
        id: 2,
        date: '2025-11-01',
        employee_name: 'Васильев А. А.',
        work_time: 420,
        all_time: 480,
      },
      {
        id: 3,
        date: '2025-11-02',
        employee_name: 'Иванов И. И.',
        work_time: 480,
        all_time: 480,
      },
      {
        id: 4,
        date: '2025-11-02',
        employee_name: 'Васильев А. А.',
        work_time: 480,
        all_time: 480,
      },
      {
        id: 5,
        date: '2025-11-04',
        employee_name: 'Петькин К. А.',
        work_time: 480,
        all_time: 480,
      },
      {
        id: 6,
        date: '2025-11-11',
        employee_name: 'Дубров К. М.',
        work_time: 240,
        all_time: 480,
      },
    ];

    return NextResponse.json(
      {
        events,
        employees: [
          { id: 1, name: 'Сотрудник ГК' },
          { id: 2, name: 'Директор магазина' },
          { id: 3, name: 'Товаровед' },
          { id: 4, name: 'Кладовщик' },
          { id: 5, name: 'Продавец' },
        ],
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Ошибка при обработке запроса:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
