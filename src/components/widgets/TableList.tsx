'use client';

import React, { useState } from 'react';
import { useConfirm } from '@/components/ConfirmDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TableFooter,
  TablePagination,
  Paper,
  Box,
} from '@mui/material';
import { usePrevURL } from '@/hooks/usePrevURL';
import { usePathname } from 'next/navigation';
import { nameSubjects } from '@/types/common';

type Order = 'asc' | 'desc';

export interface ColumnDef<T> {
  id: keyof T;
  label: string;
  href?: string;
  hrefReplaceKeys?: string[];
  rowFormat?: (row: T) => string;
}

export interface UniversalTableProps<T extends object> {
  data?: T[];
  columns: Array<ColumnDef<T>>;
  pageName: nameSubjects;
  clickableRow?: boolean;
  onDelete?: (orgId: number) => void;
  tableListRowButtons?: (args: { row: T }) => React.ReactNode;
  rowProps?: (row: T) => Record<string, any>;
}

export default function UniversalTable<T extends { id: number }>({
  data = [],
  columns,
  pageName,
  clickableRow = true,
  tableListRowButtons,
  rowProps,
}: UniversalTableProps<T>) {
  const confirm = useConfirm();
  const pathname = usePathname();
  const { prevURLClickHandler, navigateWithPrev } = usePrevURL();
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof T | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  const handleSort = (columnId: keyof T) => {
    if (orderBy === columnId) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(columnId);
      setOrder('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!orderBy) return 0;

    const aValue = a[orderBy];
    const bValue = b[orderBy];
    const aStr = typeof aValue === 'string' ? aValue.toLowerCase() : aValue;
    const bStr = typeof bValue === 'string' ? bValue.toLowerCase() : bValue;

    if (aStr === bStr) return 0;
    return order === 'asc' ? (aStr > bStr ? 1 : -1) : aStr > bStr ? -1 : 1;
  });

  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleClickRow = async (url: string) => {
    if (clickableRow) navigateWithPrev(`${url}`);
  };

  return (
    <TableContainer component={Paper} sx={{ height: '100%', overflowX: 'hidden' }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map(col => (
              <TableCell key={String(col.id)}>
                <TableSortLabel
                  active={orderBy === col.id}
                  direction={orderBy === col.id ? order : 'asc'}
                  onClick={() => handleSort(col.id)}
                >
                  {col.label}
                </TableSortLabel>
              </TableCell>
            ))}
            <TableCell></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {paginatedData.map(row => {
            // const isFading = fadingIds.has(row.id);
            return (
              <TableRow
                key={row.id}
                hover={clickableRow}
                onClick={() => handleClickRow(`${pathname}/${row.id}`)}
                {...rowProps?.(row)}
              >
                {columns.map(col => {
                  const raw = row[col.id];
                  const cellContent = col.rowFormat ? col.rowFormat(row) : (raw ?? '');

                  if (col.href && col?.hrefReplaceKeys) {
                    let link = col.href;
                    let hasValidId = true;

                    col.hrefReplaceKeys.forEach(hrefReplaceKey => {
                      const hrefParam = hrefReplaceKey
                        .split('.')
                        .reduce<any>((o, key) => (o ? o[key] : undefined), row);

                      if (!hrefParam) hasValidId = false;

                      link = link.replace(
                        `{${hrefReplaceKey}}`,
                        encodeURIComponent(hrefParam ?? ''),
                      );
                    });

                    return (
                      <TableCell key={String(col.id)}>
                        {hasValidId ? (
                          <span
                            onClick={prevURLClickHandler(link, { scroll: false })}
                            className="a"
                            dangerouslySetInnerHTML={{ __html: String(cellContent) }}
                          />
                        ) : (
                          <span dangerouslySetInnerHTML={{ __html: String(cellContent) }} />
                        )}
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell key={String(col.id)}>{cellContent as React.ReactNode}</TableCell>
                  );
                })}

                <TableCell>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'end',
                    }}
                  >
                    {tableListRowButtons?.({
                      row,
                    })}
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TablePagination
              count={sortedData.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={event => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[25, 50, 100, 200]}
              labelRowsPerPage="Строк на странице:"
              labelDisplayedRows={({ from, to, count }) => `${from}–${to} из ${count}`}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
