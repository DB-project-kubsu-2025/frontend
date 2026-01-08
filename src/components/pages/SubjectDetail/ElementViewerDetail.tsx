import React, { FocusEvent, ChangeEvent } from 'react';
import { formatDate, safeText } from '@/utils/helper';
import DynamicField from '@/components/pages/SubjectDetail/DynamicField';
import { ComponentDetailFields } from '@/types/common';
import { usePrevURL } from '@/hooks/usePrevURL';
import { Typography } from '@mui/material';

interface Props extends ComponentDetailFields {
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement> | string) => void;
  initialList?: string[];
}

export default function ElementViewerDetail(props: Props) {
  const { navigateWithPrev } = usePrevURL();

  const {
    mode,
    value,
    typeVal,
    fieldType,
    setInputsData,
    fieldsError,
    setFieldsError,
    sectionPaths,
    selectValues,
    name,
    maxLength,
    sortName,
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
  } = props;

  if (mode === 'create' || mode === 'edit') {
    return (
      <DynamicField
        mode={mode}
        value={value}
        typeVal={typeVal}
        fieldType={fieldType}
        setInputsData={setInputsData}
        fieldsError={fieldsError}
        setFieldsError={setFieldsError}
        sectionPaths={sectionPaths}
        selectValues={selectValues}
        name={name}
        maxLength={maxLength}
        label={label}
        placeholder={placeholder}
        type={type}
        onFocus={onFocus}
        onBlur={onBlur}
        showDropdown={showDropdown}
        onSelect={onSelect}
        onChange={onChange}
        inputsData={inputsData}
        inputRef={inputRef}
        nextInputRef={nextInputRef}
        mask={mask}
      />
    );
  } else if (mode === 'view') {
    if (fieldType === 'select') {
      const sortNameToShow = sortName ?? 'name';
      if (selectValues?.length) {
        const selectedItem = selectValues.find((item) => item.id === value);
        return selectedItem?.[sortNameToShow] ?? '—';
      }
      return '—';
    } else if (name && inputsData?.[name]) {
      return (
        <Typography
          sx={{ m: 0 }}
          className="a"
          onClick={() =>
            navigateWithPrev(`/${name}s/${inputsData?.[name]?.id}`)
          }
        >
          {inputsData?.[name]}
        </Typography>
      );
    } else if (fieldType === 'date') {
      return safeText(formatDate(String(value)), '—');
    }

    return safeText(value, '—');
  }

  return null;
}
