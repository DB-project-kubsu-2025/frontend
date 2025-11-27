'use client';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ruLocale from '@fullcalendar/core/locales/ru';
import { CalendarEvents, CalendarTimeTrack } from '@/types/common';
import { useEffect, useRef, useState } from 'react';
import { CalendarOptions } from '@fullcalendar/core/index.js';

export default function CalendarWidget({
  events,
  overrides,
}: {
  events: CalendarEvents[] | CalendarTimeTrack[];
  overrides?: Partial<CalendarOptions>;
}) {
  const calendarRef = useRef<FullCalendar | null>(null);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

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
    <div
      ref={containerRef}
      style={{ width: '100%', height: 'calc(100vh - 167px)' }}
    >
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        locale={ruLocale}
        ref={calendarRef}
        dayMaxEvents={true}
        dayMaxEventRows={3}
        height="100%"
        contentHeight="100%"
        expandRows={true}
        handleWindowResize={false}
        {...overrides}
      />
    </div>
  );
}
