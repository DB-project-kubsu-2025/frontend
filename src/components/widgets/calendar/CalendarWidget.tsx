'use client';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ruLocale from '@fullcalendar/core/locales/ru';
import { CalendarEvents, employeesList } from '@/types/common';
import { useEffect, useRef, useState } from 'react';

export default function CalendarWidget({
  events,
  filterEmployees,
}: {
  events: CalendarEvents[];
  filterEmployees: employeesList[];
}) {
  const calendarRef = useRef<FullCalendar | null>(null);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const filterEvents =
    filterEmployees.length === 0
      ? events
      : events.filter((e) =>
          filterEmployees.some((emp) => emp.id === e.employee_id),
        );

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      setContainerWidth(width);
    });

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.getApi().updateSize();
    }
  }, [containerWidth]);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={filterEvents}
        locale={ruLocale}
        ref={calendarRef}
        dayMaxEvents={true}
        dayMaxEventRows={3}
        height={1000}
        handleWindowResize={false}
        customButtons={{
          addEventBtn: {
            text: 'Добавить',
            click: () => {
              console.log('Нажали на кнопку');
            },
          },
        }}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'addEventBtn',
        }}
      />
    </div>
  );
}
