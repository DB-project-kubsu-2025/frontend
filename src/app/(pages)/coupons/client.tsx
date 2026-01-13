'use client';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Stack, Typography } from '@mui/material';
import TableList, { ColumnDef } from '@/components/widgets/TableList';
import { TableListRowButtons } from '@/components/widgets/TableListRowButtons';
import { CouponsListNormalized } from '@/entities/coupons';

const COLUMNS: Array<ColumnDef<CouponsListNormalized>> = [
  { id: 'storage_name', label: 'Хранилище' },
  { id: 'product_name', label: 'Продукт' },
  { id: 'discount_type_name', label: 'Тип скидки' },
  { id: 'value', label: 'Размер скидки' },
  { id: 'valid_from', label: 'Дата начала' },
  { id: 'valid_to', label: 'Дата окончания' },
  { id: 'is_active', label: 'Активен' },
];

export default function CouponsClient({ initData }: { initData: any }) {
  const router = useRouter();

  const data = useMemo(() => {
    if (!Array.isArray(initData)) return [];
    return initData.map((c: any) => ({
      ...c,
      storage_name: c.storage_name ?? (c.storage ? `Хранилище ${c.storage}` : '—'),
      product_name: c.product_name ?? (c.product ? `Продукт ${c.product}` : 'Все продукты'),
      discount_type_name: c.discount_type_name ?? (c.discount_type ? `Тип ${c.discount_type}` : '—'),
      is_active: c.is_active ? 'Да' : 'Нет',
    }));
  }, [initData]);

  return (
    <Box>
      <Stack direction="row" spacing={2} sx={{ mb: 2, justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={() => router.push('/coupons/create')}>
          Создать купон
        </Button>
      </Stack>

      {data.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center', border: '1px solid rgba(0,0,0,0.12)' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Купоны не найдены</Typography>
          <Button variant="contained" onClick={() => router.push('/coupons/create')}>
            Создать купон
          </Button>
        </Box>
      ) : (
        <TableList<CouponsListNormalized>
          columns={COLUMNS}
          data={data}
          pageName="coupons"
          tableListRowButtons={({ row, onDelete }) => (
            <TableListRowButtons
              row={row}
              onEdit={() => router.push(`/coupons/${row.id}/edit`)}
              onDelete={(e) => onDelete(e, row)}
            />
          )}
        />
      )}
    </Box>
  );
}
