'use client';
import CalendarWidget from '@/components/widgets/fullCalendar/CalendarWidget';
import { CalendarTimeTrack } from '@/types/common';
import { EventContentArg } from '@fullcalendar/core/index.js';

function getColorTime(work_time: number, all_time: number) {
  const diff = work_time - all_time;

  if (diff >= 0) return 'green';
  if (diff >= -60 && diff <= -30) return 'orange';
  return 'red';
}

function minutesToHours(minutes: number) {
  const _minutes = minutes % 60;
  const hours = (minutes - _minutes) / 60;
  return `${hours}${_minutes !== 0 ? ':' + String(_minutes).padStart(2, '0') : ''}`;
}

export default function TimeTrackClient({
  events,
}: {
  events: CalendarTimeTrack[];
}) {
  const filterEventsRes = events.map((ev) => ({
    ...ev,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  }));

  const eventContent = (arg: EventContentArg) => {
    const { employee_name, work_time, all_time } =
      arg.event.extendedProps;
    const time_color = getColorTime(work_time, all_time);

    return {
      html: `
        <div style="
          padding: 2px 4px;
          margin-bottom: 2px;
          border-radius: 5px;
          background: #fff;
          color: #ffffffff;
          border: 1px solid #555;
          font-size: 0.8rem;
          line-height: 0.9rem;
          display: grid;
          grid-template-columns: 1fr auto;
          grid-template-rows: auto auto;
          align-items: center;
        ">
          <div style="font-weight: 600;">
            ${employee_name}
          </div>

          <div style="
            font-weight: 700; 
            color: ${time_color}
          ">
            ${minutesToHours(work_time)}/${minutesToHours(all_time)}
          </div>
        </div>
      `,
    };
  };

  return (
    <CalendarWidget
      events={filterEventsRes}
      overrides={{
        eventContent,
      }}
    />
  );
}
