'use client';

import { getStatusColor, getStatusRus } from '@/utils/helper';
import { statusTypes } from '@/types/common';

export default function StatusSpan({ status }: { status: statusTypes }) {
  return (
    <span style={{ color: getStatusColor(status) }}>
      {getStatusRus(status)}
    </span>
  );
}
