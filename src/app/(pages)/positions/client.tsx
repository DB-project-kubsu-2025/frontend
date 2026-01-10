'use client';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import TableList, { ColumnDef } from '@/components/widgets/TableList';
import { TableListRowButtons } from '@/components/widgets/TableListRowButtons';
import { useAppSelector } from '@/store/hooks';
import { PositionsListNormalized } from '@/entities/positions';
import { Box, Button } from '@mui/material';
import { useApiRequest } from '@/hooks/useApiRequest';
import { enqueueSnackbar } from 'notistack';
import { useDeleteEntity } from '@/hooks/useDeleteEntity';

const COLUMNS: Array<ColumnDef<PositionsListNormalized>> = [
  { id: 'name', label: 'Название' },
];

export default function PositionsClient({ initData }: { initData: any }) {
  const router = useRouter();
  const { request } = useApiRequest();
  const deleteEntity = useDeleteEntity({
    request,
    refresh: () => router.refresh(),
    notify: (msg, variant) => enqueueSnackbar(msg, { variant }),
  });
  const handleDelete = async ({ id }: { id: number }) => {
    await deleteEntity({ subject: 'positions', id, message: 'Должность удалена' });
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
          onClick={() => router.push('/positions/create')}
        >
          Создать
        </Button>
      </Box>
      <TableList<PositionsListNormalized>
        columns={COLUMNS}
        data={initData}
        pageName="positions"
        onDelete={handleDelete}
        tableListRowButtons={({ row, onDelete }) => (
          <TableListRowButtons
            row={row}
            onEdit={(e) => {
              e.stopPropagation();
              router.push(`/positions/${row.id}/edit`)
            }}
            onDelete={(e) => onDelete(e, row)}
          />
        )}
      />
    </Box>
  );
}
