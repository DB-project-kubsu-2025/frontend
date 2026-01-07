import EditCalendarForm from '@/components/widgets/calendar/CalendarEdit';
import { calendarLeavesEdit } from '@/types/common';

export default function SickLeavesClientEdit({
  id,
  initData,
}: {
  id: number;
  initData: calendarLeavesEdit;
}) {
  return (
    <EditCalendarForm

      id={id}
      initData={initData}
      title="Больничный"
      confirmText="Удалить больничный?"
      deleteEndpoint={`/sickLeaves/${id}`}
      updateEndpoint={`/sickLeaves/${id}`}
      invalidateKey="sickLeaves"
      redirectUrl="/sickLeaves"
    />
  );
}
