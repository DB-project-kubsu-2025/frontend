import EditCalendarForm from '@/components/widgets/calendar/CalendarEdit';
import { calendarLeavesEdit } from '@/types/common';

const DEFAULT_DATA: calendarLeavesEdit = {
  number: 0,
  calendar: {
    id: 0,
    start_date: '',
    end_date: '',
    status: 'planned',
  },
  
};

export default function MyVacationsAddClient() {
  return (
    <EditCalendarForm
      initData={DEFAULT_DATA}
      title="Новый отпуск"
      mode="create"
      updateEndpoint="/vacations/my"
      invalidateKey="vacations/my"
      redirectUrl="/vacations/my"
    />
  );
}
