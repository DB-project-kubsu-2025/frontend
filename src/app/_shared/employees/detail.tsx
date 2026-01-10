import FieldsView from '@/components/pages/SubjectDetail/employees/view';
import { apiFetch } from '@/utils/apiFetch';
import {
  EmployeesDetailNormalized,
  EmployeesDetailDefault,
} from '@/entities/employees';
import { SubjectModes } from '@/types/common';

type FactoryOpts = {
  mode: SubjectModes;
  backHref?: string;
};

export function EmployeesDetail({ mode, backHref = '/employees' }: FactoryOpts) {
  return async function EmployeesPage({
    params,
  }: {
    params: Promise<{ id?: string }>;
  }) {
    const { id } = await params;

    let detail: EmployeesDetailNormalized | null = null;

    if (mode === 'create') {
      detail = EmployeesDetailDefault;
    } else {
      if (Number.isFinite(Number(id))) {
        let raw: any;
        try {
          raw = await apiFetch(`/employees/employees/${id}/`);
        } catch (e: any) {
          return 'Нет такого сотрудника';
          throw e;
        }
        detail = raw.data;
      }
    }

    return (
      <FieldsView
        mode={mode}
        nameSubject="employees"
        detailData={detail as EmployeesDetailNormalized}
      />
    );
  };
}
