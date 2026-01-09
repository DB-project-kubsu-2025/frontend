import { IconButton } from '@mui/material';
import { MdDeleteOutline, MdOutlineEdit } from 'react-icons/md';

type TableListRowButtonsProps<T> = {
  row: T;
  onEdit?: (e: React.MouseEvent, row: T) => void; 
  onDelete?: (e: React.MouseEvent, row: T) => void;
};

export function TableListRowButtons<T>({
  row,
  onEdit,
  onDelete,
}: TableListRowButtonsProps<T>) {
  return (
    <>
      {onEdit && (
        <IconButton onClick={e => onEdit(e, row)} aria-label="edit">
          <MdOutlineEdit size={20} />
        </IconButton>
      )}
      {onDelete && (
        <IconButton onClick={e => onDelete(e, row)} aria-label="delete">
          <MdDeleteOutline size={20} />
        </IconButton>
      )}
    </>
  );
}
