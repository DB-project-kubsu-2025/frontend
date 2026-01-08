'use client';
import { useRouter } from 'next/navigation';
import TableList, { ColumnDef } from '@/components/widgets/TableList';
import { TableListRowButtons } from '@/components/widgets/TableListRowButtons';
import { useAppSelector } from '@/store/hooks';
import { useMemo } from 'react';

interface ProductProps {
  id: number;
  unit: number;
  category: number;
  name: string;
  description: string;
  expiration_days: number;
  producer_name: string;
  producer_code: string;
  country_name: string;
  additional_info: string;
  category_name: string;
}

const COLUMNS: Array<ColumnDef<ProductProps>> = [
  { id: 'category_name', label: 'Категория' },
  { id: 'name', label: 'Название' },
  { id: 'additional_info', label: 'Информация' },
];

export default function VacationsClient({ initData }: { initData: any }) {
  const router = useRouter();
  const categories = useAppSelector((s) => s.dicts.categories);

  const categoriesMap = useMemo(() => {
    return new Map(categories.map((c) => [c.id, c.name] as const));
  }, [categories]);

  const data = useMemo(() => {
    return (initData ?? []).map((p: ProductProps) => ({
      ...p,
      category_name: categoriesMap.get(p.category) ?? String(p.category),
    }));
  }, [initData, categoriesMap]);
  console.log(data);
  return (
    <TableList<ProductProps>
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
