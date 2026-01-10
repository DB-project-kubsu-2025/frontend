import FieldsView from '@/components/pages/SubjectDetail/positions/view';
import { apiFetch } from '@/utils/apiFetch';
import {
  PositionsDetailNormalized,
  PositionsDetailDefault,
} from '@/entities/positions';
import { SubjectModes } from '@/types/common';

type FactoryOpts = {
  mode: SubjectModes;
  backHref?: string;
};

export function PositionsDetail({ mode }: FactoryOpts) {
  return async function PositionsPage({
    params,
  }: {
    params: Promise<{ id?: string }>;
  }) {
    const { id } = await params;

    let detail: PositionsDetailNormalized | null = null;

    if (mode === 'create') {
      detail = PositionsDetailDefault;
    } else {
      if (Number.isFinite(Number(id))) {
        let raw: any;
        try {
          raw = await apiFetch(`/employees/job-positions/${id}/`);
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
        nameSubject="positions"
        detailData={detail as PositionsDetailNormalized}
      />
    );
  };
}
