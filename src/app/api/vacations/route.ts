import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    const events = [
      {
        id: '1',
        employee_id: 1,
        title: 'отпуск 1 Сотрудник ГК',
        date: '2025-11-01',
        color: '#aa0000',
      },
      { id: '2', employee_id: 3, title: 'отпуск 1 Товаровед', date: '2025-11-02' },
      { id: '3', employee_id: 3, title: 'отпуск 2 Товаровед', date: '2025-11-02' },
      { id: '4', employee_id: 1, title: 'отпуск 2 Сотрудник ГК', date: '2025-11-02' },
      { id: '5', employee_id: 5, title: 'отпускя Продавец', date: '2025-11-02' },
      {
        id: '6',
        employee_id: 2,
        title: 'Директор магазина',
        start: '2025-11-01',
        end: '2025-11-04', //с 01.11 до 03.11 включительно
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
