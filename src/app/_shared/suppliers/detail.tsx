import FieldsView from '@/components/pages/SubjectDetail/suppliers/view';
import { apiFetch } from '@/utils/apiFetch';
import {
  SuppliersDetailNormalized,
  SuppliersDetailDefault,
} from '@/entities/suppliers';
import { SubjectModes } from '@/types/common';

type FactoryOpts = {
  mode: SubjectModes;
  backHref?: string;
};

export function SuppliersDetail({ mode }: FactoryOpts) {
  return async function SuppliersPage({
    params,
  }: {
    params: Promise<{ id?: string }>;
  }) {
    const { id } = await params;

    let detail: SuppliersDetailNormalized | null = null;

    if (mode === 'create') {
      detail = SuppliersDetailDefault;
    } else {
      if (Number.isFinite(Number(id))) {
        let raw: any;
        try {
          raw = await apiFetch(`/supplies/suppliers/${id}/`);
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
        detailData={detail as SuppliersDetailNormalized}
      />
    );
  };
}
