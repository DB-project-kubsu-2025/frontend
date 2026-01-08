import FieldsView from '@/components/pages/SubjectDetail/products/view';
import { apiFetch } from '@/utils/apiFetch';
import {
  ProductsDetailNormalized,
  ProductsDetailDefault,
} from '@/entities/products';
import { SubjectModes } from '@/types/common';

type FactoryOpts = {
  mode: SubjectModes;
  backHref?: string;
};

export function ProductsDetail({ mode, backHref = '/products' }: FactoryOpts) {
  return async function ProductsPage({
    params,
  }: {
    params: Promise<{ id?: string }>;
  }) {
    const { id } = await params;

    let detail: ProductsDetailNormalized | null = null;

    if (mode === 'create') {
      detail = ProductsDetailDefault;
    } else {
      if (Number.isFinite(Number(id))) {
        let raw: any;
        try {
          raw = await apiFetch(`/shops/products/${id}/`);
          console.log(raw, '$$$$$$$$$$$$4444');
        } catch (e: any) {
          return 'Нет такого товара';
          throw e;
        }
        detail = raw;
      }
    }

    return (
      <FieldsView
        mode={mode}
        nameSubject="products"
        detailData={detail as ProductsDetailNormalized}
      />
    );
  };
}
