'use client';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ruLocale from '@fullcalendar/core/locales/ru';
import { CalendarEvents } from '@/types/common';

export default function CalendarWidget({events}: {events: CalendarEvents[]}) {
  console.log(events);
  return <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      locale={ruLocale}
      dayMaxEvents={true}
      dayMaxEventRows={3}
      height={600}
      customButtons={{
        addEventBtn: {
          text: 'Добавить',
          click: () => {
            console.log('Нажали на кнопку');
            // здесь ты можешь открыть модалку MUI
          },
        },
      }}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'addEventBtn',
      }}
    />
}