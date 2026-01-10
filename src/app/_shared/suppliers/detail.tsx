import FieldsView from '@/components/pages/SubjectDetail/suppliers/view';
import { apiFetch } from '@/utils/apiFetch';
import {
  suppliersDetailNormalized,
  suppliersDetailDefault,
} from '@/entities/suppliers';
import { SubjectModes } from '@/types/common';

type FactoryOpts = {
  mode: SubjectModes;
  backHref?: string;
};

export function suppliersDetail({ mode, backHref = '/suppliers' }: FactoryOpts) {
  return async function suppliersPage({
    params,
  }: {
    params: Promise<{ id?: string }>;
  }) {
    const { id } = await params;

    let detail: suppliersDetailNormalized | null = null;

    if (mode === 'create') {
      detail = suppliersDetailDefault;
    } else {
      if (Number.isFinite(Number(id))) {
        let raw: any;
        try {
          raw = await apiFetch(`/employees/job-suppliers/${id}/`);
        } catch (e: any) {
          return 'Нет такой должности';
          throw e;
        }
        detail = raw.data;
      }
    }

    return (
      <FieldsView
        mode={mode}
        nameSubject="suppliers"
        detailData={detail as suppliersDetailNormalized}
      />
    );
  };
}
