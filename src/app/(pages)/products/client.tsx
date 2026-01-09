'use client';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import TableList, { ColumnDef } from '@/components/widgets/TableList';
import { TableListRowButtons } from '@/components/widgets/TableListRowButtons';
import { useAppSelector } from '@/store/hooks';
import { ProductsListNormalized } from '@/entities/products';

const COLUMNS: Array<ColumnDef<ProductsListNormalized>> = [
  { id: 'category_name', label: 'Категория' },
  { id: 'name', label: 'Название' },
  { id: 'additional_info', label: 'Информация' },
];

export default function ProductsClient({ initData }: { initData: any }) {
  const router = useRouter();
  const categories = useAppSelector((s) => s.dicts.categories);

  const categoriesMap = useMemo(() => {
    return new Map(categories.map((c) => [c.id, c.name] as const));
  }, [categories]);

  const data = useMemo(() => {
    return (initData ?? []).map((p: ProductsListNormalized) => ({
      ...p,
      category_name: categoriesMap.get(p.category) ?? String(p.category),
    }));
  }, [initData, categoriesMap]);
  
  return (
    <TableList<ProductsListNormalized>
      columns={COLUMNS}
      data={data}
      pageName="products"
      tableListRowButtons={({ row }) => (
        <TableListRowButtons
          row={row}
          onEdit={() => router.push(`/products/${row.id}/edit`)}
        />
      )}
    />
  );
}
