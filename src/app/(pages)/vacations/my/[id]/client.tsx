import EditCalendarForm from '@/components/widgets/calendar/CalendarEdit';
import { calendarLeavesEdit } from '@/types/common';

export default function MyVacationsClientEdit({
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
      title="Номер заявки"
      confirmText="Удалить отпуск?"
      deleteEndpoint={`/vacations/my/${id}`}
      updateEndpoint={`/vacations/my/${id}`}
      invalidateKey="vacations/my"
      redirectUrl="/vacations/my"
    />
  );
}
