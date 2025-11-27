'use client';
import MultiSelect from '@/components/UI/MultiSelect';
import CalendarWidget from '@/components/widgets/fullCalendar/CalendarWidget';
import { CalendarTimeTrack, employeesList } from '@/types/common';
import { EventContentArg } from '@fullcalendar/core/index.js';
import { useState } from 'react';

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
  employees,
}: {
  events: CalendarTimeTrack[];
  employees: employeesList[];
}) {
  const [selectedEmployees, setSelectedEmployees] = useState<employeesList[]>(
    [],
  );

  const filterEvents =
    selectedEmployees.length === 0
      ? events
      : events.filter((e) =>
          selectedEmployees.some((emp) => emp.id == e.employee_role_id),
        );

  const filterEventsRes = filterEvents.map((ev) => ({
    ...ev,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  }));

  const eventContent = (arg: EventContentArg) => {
    const { employee_name, employee_role_id, work_time, all_time } =
      arg.event.extendedProps;
    const employee_role_name = employees.find(
      (emp) => emp.id === employee_role_id,
    )?.name;
    const time_color = getColorTime(work_time, all_time);

    return {
      html: `
        <div style="
          padding: 2px 4px;
          margin-bottom: 2px;
          border-radius: 5px;
          background: #fff;
          color: #333;
          border: 1px solid #555;
          font-size: 0.7rem;
          line-height: 0.8rem;
          display: grid;
          grid-template-columns: 1fr auto;
          grid-template-rows: auto auto;
          align-items: center;
        ">
          <div style="font-weight: 600;">
            ${employee_name}
          </div>

          <div style="
            grid-row: span 2;
            font-size: 0.8rem;
            font-weight: 700; 
            display: flex; 
            align-items: center;
            color: ${time_color}
          ">
            ${minutesToHours(work_time)}/${minutesToHours(all_time)}
          </div>

          <div style="color: #777;">
            ${employee_role_name}
          </div>
        </div>
      `,
    };
  };

  return (
    <>
      <MultiSelect
        options={employees}
        value={selectedEmployees}
        onChange={setSelectedEmployees}
        sx={{ width: '15rem', mb: 2 }}
      />
      <CalendarWidget
        events={filterEventsRes}
        overrides={{
          eventContent,
        }}
      />
    </>
  );
}
