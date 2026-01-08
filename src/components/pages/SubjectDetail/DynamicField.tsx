'use client';
import React, { FocusEvent, ChangeEvent } from 'react';
import Input from '@/components/UI/Input';
import Select from '@/components/UI/Select';
import { safeText } from '@/utils/helper';
import DateInput from '@/components/UI/DateInput';
import { ComponentDetailFields } from '@/types/common';

interface DynamicFieldProps extends ComponentDetailFields {
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement> | string) => void;
}

const validNames = ['organization', 'driver', 'auto'] as const;
export type shortNameSubjectsArr = (typeof validNames)[number];

function isNameFinder(x: unknown): x is shortNameSubjectsArr {
  return typeof x === 'string' && (validNames as readonly string[]).includes(x);
}

const DynamicField: React.FC<DynamicFieldProps> = ({
  mode,
  fieldType,
  name,
  value,
  typeVal,
  maxLength,
  sectionPaths,
  selectValues,
  setInputsData,
  fieldsError,
  setFieldsError,
  label,
  placeholder,
  type,
  onFocus,
  onBlur,
  showDropdown,
  onSelect,
  onChange,
  inputsData,
  inputRef,
  nextInputRef,
  mask,
}) => {
  const flatPath = !Array.isArray(sectionPaths?.[0]) ? (sectionPaths as string[]) : [];

  switch (fieldType) {
    case 'text':
      return (
        <Input
          name={safeText(name)}
          value={safeText(value)}
          placeholder={placeholder}
          typeVal={typeVal}
          sectionPaths={flatPath}
          setInputsData={setInputsData}
          maxLength={maxLength}
          fieldsError={fieldsError}
          setFieldsError={setFieldsError}
        />
      );

    case 'number':
      return (
        <Input
          name={safeText(name)}
          typeVal="integer"
          value={safeText(value)}
          placeholder={placeholder}
          sectionPaths={flatPath}
          setInputsData={setInputsData}
          fieldsError={fieldsError}
          setFieldsError={setFieldsError}
          maxLength={maxLength}
        />
      );

    case 'date':
      return (
        <DateInput
          mode={mode}
          name={safeText(name)}
          typeVal="integer"
          value={safeText(value)}
          onChange={onChange}
          sectionPaths={flatPath}
          setInputsData={setInputsData}
          fieldsError={fieldsError}
          setFieldsError={setFieldsError}
          maxLength={maxLength}
        />
      );

    case 'select':
      return (
        <Select
          value={safeText(value)}
          selectValues={selectValues}
          setInputsData={setInputsData}
          fieldsError={fieldsError}
          setFieldsError={setFieldsError}
          inputsDataPath={flatPath}
        />
      );

    default:
      return null;
  }
};

export default DynamicField;
