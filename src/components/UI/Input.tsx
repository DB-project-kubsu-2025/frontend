import React, { useState, useRef, useEffect, ChangeEvent, FocusEvent } from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { updateInputsData } from '@/utils/updateInputsData';
import { safeText } from '@/utils/helper';

interface InputProps {
  type?: string;
  typeVal?: 'float' | 'slash' | 'integer';
  name?: string;
  value?: string;
  label?: string;
  placeholder?: string;
  sectionPaths?: [string[], string] | string[];
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  quickSaveValue?: boolean;
  setInputsData?: React.Dispatch<React.SetStateAction<any>>;
  appointVal?: 'suffixer';
  suffix?: string;
  shrink?: boolean;
  maxLength?: number;
  required?: boolean;
  variant?: 'outlined' | 'filled' | 'standard';
  fieldsError?: string | null;
  setFieldsError?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  clearFieldError?: (section: string, name: string) => void;
  inputRef?: React.RefObject<HTMLInputElement> | null;
  localInputValue?: string;
  setLocalInputValue?: React.Dispatch<React.SetStateAction<string>>;
  InputProps?: TextFieldProps['InputProps'];
  inputProps?: TextFieldProps['inputProps'];
}
const Input: React.FC<InputProps> = ({
  type = 'text',
  typeVal,
  name,
  value = '',
  label,
  placeholder,
  sectionPaths,
  onChange,
  onClick,
  onFocus,
  onBlur,
  onKeyDown,
  quickSaveValue = false,
  setInputsData,
  appointVal,
  suffix = '',
  shrink = undefined,
  maxLength = undefined,
  required = false,
  variant = 'outlined',
  fieldsError = null,
  inputRef,
  setFieldsError,
  clearFieldError,
  localInputValue,
  setLocalInputValue,
  InputProps: muiInputProps,
  inputProps: muiInnerInputProps,
}) => {
  const [localValue, setLocalValue] = useState<string>(value);
  const inputElement = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (localInputValue !== undefined) {
      setLocalValue(localInputValue);
    } else {
      setLocalValue(value);
    }
  }, [value, localInputValue]);

  const formatPrice = (value: string): string => {
    if (!value) return '';
    const price = safeText(value.replace(/[^0-9.]/g, ''));
    return price ? `${price} ${suffix}` : '';
  };

  const cleanPrice = (value: string): string => {
    const regex = new RegExp(`\\s|${suffix}`, 'g');
    return value.replace(regex, '');
  };

  const onChanges = (e: ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    if (typeVal === 'float' || typeVal === 'slash' || appointVal === 'suffixer') {
      let parts: string[] = [];
      let repTo = '';

      if (typeVal === 'float' || appointVal === 'suffixer') {
        repTo = '.';
        inputValue = inputValue.replace(',', '.').replace(/[^0-9.]/g, '');
      } else if (typeVal === 'slash') {
        repTo = '/';
        inputValue = inputValue.replace('.', '/').replace(/[^0-9/]/g, '');
      }

      if (inputValue.startsWith(repTo)) {
        inputValue = inputValue.slice(1);
      }

      parts = inputValue.split(repTo);

      if (parts.length > 2) {
        inputValue = `${parts[0]}${repTo}${parts[1]}`;
      }

      if (parts[1]?.length > 2) {
        inputValue = `${parts[0]}${repTo}${parts[1].slice(0, 2)}`;
      }

      if (maxLength && inputValue.length > maxLength) {
        inputValue = inputValue.slice(0, maxLength);
      }

      e.target.value = inputValue;
    }

    if (typeVal === 'integer') {
      inputValue = inputValue.replace(/[^0-9/]/g, '');
    }

    if (appointVal === 'suffixer') {
      const inputField = e.target;
      const cursorStart = inputField.selectionStart || 0;
      let cleaned = cleanPrice(inputField.value);

      if (maxLength && cleaned.length > maxLength) {
        cleaned = cleaned.slice(0, maxLength);
      }

      const newFormatted = formatPrice(cleaned);
      const digitsBeforeCursor = cleaned.slice(0, cursorStart).length;

      let newCursorPos = 0;
      let digitCount = 0;
      for (let i = 0; i < newFormatted.length; i++) {
        if (/[0-9.]/.test(newFormatted[i])) {
          digitCount++;
        }
        if (digitCount === digitsBeforeCursor) {
          newCursorPos = i + 1;
          break;
        }
      }
      setTimeout(() => {
        const finalPos = newCursorPos || 0;
        inputElement.current?.setSelectionRange(finalPos, finalPos);
      });
      inputField.value = newFormatted;
      inputValue = formatPrice(newFormatted);
      e.target.value = formatPrice(newFormatted);
    }

    if (setLocalInputValue) {
      setLocalInputValue(inputValue);
    } else {
      setLocalValue(inputValue);
    }

    if (clearFieldError && sectionPaths && name) {
      clearFieldError(sectionPaths[0][0], name);
    }

    if (setFieldsError && name) {
      setFieldsError(prev => {
        if (!prev || !(name in prev)) return prev;
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }

    if (quickSaveValue && sectionPaths && setInputsData) {
      const raw = e.target.value;
      setInputsData((prev: any) => updateInputsData(type, raw, sectionPaths, prev));
    }
    onChange?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (
      !quickSaveValue &&
      sectionPaths &&
      setInputsData
    ) { // && !['viewerFindListSelect', 'viewerFindList'].includes(type)
      const raw = e.target.value;
      setInputsData((prev: any) => updateInputsData(type, raw, sectionPaths, prev));
    }

    const section = sectionPaths?.[0] as string;
    if (clearFieldError && name && section) {
      clearFieldError(section, name);
    }
    onBlur?.(e);
  };

  return (
    <div className={`input-box ${fieldsError ? 'error' : ''}`} style={{ width: '100%' }}>
      <TextField
        inputRef={inputRef || inputElement}
        variant={variant}
        type={type}
        name={name}
        value={localValue}
        label={label}
        placeholder={placeholder}
        onChange={onChanges}
        onFocus={onFocus}
        onBlur={handleBlur}
        onClick={onClick}
        onKeyDown={onKeyDown}
        InputLabelProps={{ shrink }}
        inputProps={{ maxLength: maxLength ?? undefined }}
        required={required}
        error={Boolean(fieldsError)}
        autoComplete="off"
        InputProps={muiInputProps}
        fullWidth
      />
      <h5>{fieldsError ?? ''}</h5>
    </div>
  );
};

export default React.memo(Input);
