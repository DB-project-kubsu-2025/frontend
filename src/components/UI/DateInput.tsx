import React, { ChangeEvent } from 'react';
import TextField from '@mui/material/TextField';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { updateInputsData } from '@/utils/updateInputsData';
import { formatDate } from '@/utils/helper';

interface DateInputProps {
  label?: string;
  value?: string;
  name: string;
  required?: boolean;
  errors?: string;
  sectionPaths?: string[];
  setInputsData?: React.Dispatch<React.SetStateAction<any>>;
  onChange?: (e: ChangeEvent<HTMLInputElement> | string) => void;
  [x: string]: any;
  error?: string | null;
  clearFieldError?: (section: string, name: string) => void;
  sectionListRef?: React.Ref<HTMLInputElement>;
}

const DateInput: React.FC<DateInputProps> = ({
  label,
  value,
  name,
  required = false,
  errors,
  sectionPaths,
  setInputsData,
  onChange,
  error = null,
  clearFieldError,
  sectionListRef,
  ...rest
}) => {
  const hasError = Boolean(errors);
  const errorText = typeof errors === 'string' ? errors : '';

  const handleDateChange = (newValue: Dayjs | null) => {
    if (newValue === null) {
      if (sectionPaths && setInputsData) {
        setInputsData((prevValues: any) =>
          updateInputsData('date', '', sectionPaths, prevValues),
        );
      }
      return;
    }

    const parsedDate = dayjs(newValue.format('DD.MM.YYYY'), 'DD.MM.YYYY', true);

    if (!parsedDate.isValid()) return;

    const formattedValue = parsedDate.format('YYYY-MM-DD');

    if (formattedValue.startsWith('0')) return;
    onChange?.(formattedValue);

    if (clearFieldError && sectionPaths) {
      clearFieldError(sectionPaths[0][0], name);
    }

    if (sectionPaths && setInputsData) {
      setInputsData((prevValues: any) =>
        updateInputsData('date', formattedValue, sectionPaths, prevValues),
      );
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div
        className={`input-box ${error ? 'error' : ''}`}
        style={{ width: '100%' }}
      >
        <DatePicker
          label={label}
          value={value ? dayjs(formatDate(value, 'ymd'), 'YYYY-MM-DD') : null}
          onChange={handleDateChange}
          format="DD.MM.YYYY"
          slotProps={{
            textField: {
              name,
              required,
              error: hasError,
              helperText: errorText,
              fullWidth: true,
              InputProps: {
                sx: {
                  '& .MuiPickersSectionList-root': { py: 1.25 },
                },
              },
            },
          }}
        />
        <h5>{error == 'error' ? '' : error}</h5>
      </div>
    </LocalizationProvider>
  );
};

export default React.memo(DateInput);
