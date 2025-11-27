'use client';
import MultiSelect from '@/components/UI/MultiSelect';
import CalendarWidget from '@/components/widgets/calendar/CalendarWidget';
import { CalendarEvents, employeesList } from '@/types/common';
import { useState } from 'react';

export default function CalendarClient({
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
  return (
    <>
      <MultiSelect
        options={employees}
        value={selectedEmployees}
        onChange={setSelectedEmployees}
        sx={{ width: '15rem', mb: 2 }}
      />
      <CalendarWidget events={events} filterEmployees={selectedEmployees} />
    </>
  );
}
