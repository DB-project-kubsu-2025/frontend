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
    if (!initData || !Array.isArray(initData)) {
      return [];
    }
    
    return initData.map((c: any) => ({
      ...c,
      storage_name: c.storage_name || `Хранилище ${c.storage}` || '—',
      product_name: c.product_name || (c.product ? `Продукт ${c.product}` : 'Все продукты'),
      discount_type_name: c.discount_type_name || `Тип ${c.discount_type}` || '—',
      is_active: c.is_active ? 'Да' : 'Нет',
    }));
  }, [initData]);
  
  return (
    <Box
      sx={{
        '& .MuiTable-root': {
          borderCollapse: 'separate',
          borderSpacing: 0,
          border: '1px solid rgba(0, 0, 0, 0.12)',
        },
        '& .MuiTableCell-root': {
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          '&:first-of-type': {
            borderLeft: 'none',
          },
        },
        '& .MuiTableHead .MuiTableCell-root': {
          borderTop: 'none',
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          fontWeight: 600,
          textAlign: 'center',
          '&:last-of-type': {
            borderRight: 'none',
            textAlign: 'right',
          },
        },
        '& .MuiTableBody .MuiTableCell-root': {
          textAlign: 'left',
          '&:last-of-type': {
            borderRight: 'none',
            textAlign: 'right',
          },
        },
        '& .MuiTableBody .MuiTableRow-root:last-child .MuiTableCell-root': {
          borderBottom: 'none',
        },
      }}
    >
      <Stack direction="row" spacing={2} sx={{ mb: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/coupons/create')}
        >
          Создать купон
        </Button>
      </Stack>
      
      {data.length === 0 ? (
        <Box sx={{ 
          padding: '40px', 
          textAlign: 'center',
          border: '1px solid rgba(0, 0, 0, 0.12)',
          borderRadius: '4px',
          backgroundColor: '#f5f5f5'
        }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Купоны не найдены
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Создайте первый купон, нажав кнопку "Создать купон"
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push('/coupons/create')}
          >
            Создать купон
          </Button>
        </Box>
      ) : (
        <TableList<CouponsListNormalized>
          columns={COLUMNS}
          data={data}
          pageName="coupons"
          tableListRowButtons={({ row }) => (
            <TableListRowButtons
              row={row}
              onEdit={() => router.push(`/coupons/${row.id}/edit`)}
            />
          )}
        />
      )}
    </Box>
  );
}
