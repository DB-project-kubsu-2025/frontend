import { IconButton } from '@mui/material';
import { MdOutlineEdit } from 'react-icons/md';

type TableListRowButtonsProps<T> = {
  row: T;
  onEdit?: (e: React.MouseEvent, row: T) => void; 
  onArchive?: (e: React.MouseEvent, row: T) => void;
  onRecovery?: (e: React.MouseEvent, row: T) => void;
};

export function TableListRowButtons<T>({
  row,
  onEdit,
}: TableListRowButtonsProps<T>) {
  return (
    <>
      {onEdit && (
        <IconButton onClick={e => onEdit(e, row)} aria-label="edit">
          <MdOutlineEdit size={20} />
        </IconButton>
      )}
    </>
  );
}
