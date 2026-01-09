import FieldsView from '@/components/pages/SubjectDetail/coupons/view';
import { apiFetch } from '@/utils/apiFetch';
import {
  CouponsDetailNormalized,
  CouponsDetailDefault,
} from '@/entities/coupons';
import { SubjectModes } from '@/types/common';

type FactoryOpts = {
  mode: SubjectModes;
  backHref?: string;
};

export function CouponsDetail({ mode, backHref = '/coupons' }: FactoryOpts) {
  return async function CouponsPage({
    params,
  }: {
    params: Promise<{ id?: string }>;
  }) {
    const { id } = await params;

    let detail: CouponsDetailNormalized | null = null;

    if (mode === 'create') {
      detail = CouponsDetailDefault;
    } else {
      if (Number.isFinite(Number(id))) {
        let raw: any;
        try {
          raw = await apiFetch(`/shops/coupons/${id}/`);
        } catch (e: any) {
          return 'Нет такого купона';
          throw e;
        }
        detail = raw;
      }
    }

    return (
      <FieldsView
        mode={mode}
        nameSubject="coupon"
        detailData={detail as CouponsDetailNormalized}
      />
    );
  };
}
