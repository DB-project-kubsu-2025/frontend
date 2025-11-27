'use client';
import MultiSelect from '@/components/UI/MultiSelect';
import CalendarWidget from '@/components/widgets/fullCalendar/CalendarWidget';
import { CalendarEvents, employeesList } from '@/types/common';
import { useState } from 'react';

export default function VacationsClient({
  events,
  employees,
}: {
  events: CalendarEvents[];
  employees: employeesList[];
}) {
  console.log(events);
  const [selectedEmployees, setSelectedEmployees] = useState<employeesList[]>(
    [],
  );

  const filterEvents =
    selectedEmployees.length === 0
      ? events
      : events.filter((e) =>
          selectedEmployees.some((emp) => emp.id == e.employee_role_id),
        )

  return (
    <>
      <MultiSelect
        options={employees}
        value={selectedEmployees}
        onChange={setSelectedEmployees}
        sx={{ width: '15rem', mb: 2 }}
      />
      <CalendarWidget
        events={filterEvents}
        overrides={{
          customButtons: {
            addEventBtn: {
              text: 'Добавить отпуск',
              click: () => {
                console.log('Клик по Добавить отпуск');
              },
            },
          },
          headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'addEventBtn',
          },
        }}
      />
    </>
  );
}
