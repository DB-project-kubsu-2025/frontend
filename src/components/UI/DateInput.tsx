'use client';

import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { updateInputsData } from '@/utils/updateInputsData';

dayjs.extend(customParseFormat);

type ISODate = string;

interface DateInputProps {
  label?: string;
  name: string;
  value?: ISODate;
  required?: boolean;
  fieldsError?: string;
  sectionPaths?: string[];
  setInputsData?: React.Dispatch<React.SetStateAction<any>>;
  onChangeISO?: (iso: ISODate) => void;
  clearFieldError?: (section: string, name: string) => void;
  minDate?: string;
  maxDate?: string;
  [x: string]: any;
}

const ISO_FORMAT = 'YYYY-MM-DD';
const UI_FORMAT = 'DD.MM.YYYY';

function isoToDayjs(iso?: string): Dayjs | null {
  if (!iso) return null;
  const d = dayjs(iso, ISO_FORMAT, true);
  return d.isValid() ? d : null;
}

export default function DateInput({
  label,
  name,
  value = '',
  required = false,
  fieldsError,

  sectionPaths,
  setInputsData,
  onChangeISO,
  clearFieldError,

  minDate,
  maxDate,
  ...rest
}: DateInputProps) {
  const [draft, setDraft] = React.useState<Dayjs | null>(isoToDayjs(value));

  React.useEffect(() => {
    setDraft(isoToDayjs(value));
  }, [value]);

  const commitISO = (iso: ISODate) => {
    onChangeISO?.(iso);

    if (sectionPaths && setInputsData) {
      setInputsData((prev: any) =>
        updateInputsData('date', iso, sectionPaths, prev),
      );
    }

    if (clearFieldError && sectionPaths?.[0]) {
      clearFieldError(sectionPaths[0], name);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div
        className={`input-box ${fieldsError ? 'error' : ''}`}
        style={{ width: '100%' }}
      >
        <DatePicker
          label={label}
          format={UI_FORMAT}
          value={draft}
          onChange={(newValue) => {
            setDraft(newValue);
            if (newValue === null) {
              commitISO('');
            }
          }}
          onAccept={(newValue) => {
            if (!newValue) return;
            if (!dayjs.isDayjs(newValue)) return;
            if (!newValue.isValid()) return;
            const y = newValue.year();
            if (y < 1900 || y > 2100) return;
            commitISO(newValue.format(ISO_FORMAT));
          }}
          minDate={minDate ? dayjs(minDate, ISO_FORMAT, true) : undefined}
          maxDate={maxDate ? dayjs(maxDate, ISO_FORMAT, true) : undefined}
          slotProps={{
            textField: {
              name,
              required,
              error: Boolean(fieldsError),
              helperText: typeof fieldsError === 'string' ? fieldsError : '',
              fullWidth: true,
              InputProps: {
                sx: {
                  '& .MuiPickersSectionList-root': { py: 1.25 },
                },
              },
            },
          }}
          {...rest}
        />
        <h5>{fieldsError == 'error' ? '' : fieldsError}</h5>
      </div>
    </LocalizationProvider>
  );
}
