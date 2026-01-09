'use client';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import TableList, { ColumnDef } from '@/components/widgets/TableList';
import { TableListRowButtons } from '@/components/widgets/TableListRowButtons';
import { useAppSelector } from '@/store/hooks';
import { ProductsListNormalized } from '@/entities/products';
import { Box, Button } from '@mui/material';
import { useApiRequest } from '@/hooks/useApiRequest';
import { enqueueSnackbar } from 'notistack';
import { useDeleteEntity } from '@/hooks/useDeleteEntity';

const COLUMNS: Array<ColumnDef<ProductsListNormalized>> = [
  { id: 'category_name', label: 'Категория' },
  { id: 'name', label: 'Название' },
  { id: 'additional_info', label: 'Информация' },
];

export default function ProductsClient({ initData }: { initData: any }) {
  const router = useRouter();
  const { request } = useApiRequest();
  const categories = useAppSelector((s) => s.dicts.categories);
  const deleteEntity = useDeleteEntity({
    request,
    refresh: () => router.refresh(),
    notify: (msg, variant) => enqueueSnackbar(msg, { variant }),
  });
  console.log(categories);

  const categoriesMap = useMemo(() => {
    return new Map(categories.map((c) => [c.id, c.name] as const));
  }, [categories]);

  const data = useMemo(() => {
    return (initData ?? []).map((p: ProductsListNormalized) => ({
      ...p,
      category_name: categoriesMap.get(p.category) ?? String(p.category),
    }));
  }, [initData, categoriesMap]);

  const handleDelete = async ({ id }: { id: number }) => {
    await deleteEntity({ subject: 'products', id, message: 'Товар удалён' });
  };

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
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="success"
          onClick={() => router.push('/products/create')}
        >
          Создать
        </Button>
      </Box>
      <TableList<ProductsListNormalized>
        columns={COLUMNS}
        data={data}
        pageName="products"
        onDelete={handleDelete}
        tableListRowButtons={({ row, onDelete }) => (
          <TableListRowButtons
            row={row}
            onEdit={(e) => {
              e.stopPropagation();
              router.push(`/products/${row.id}/edit`)
            }}
            onDelete={(e) => onDelete(e, row)}
          />
        )}
      />
    </Box>
  );
}
