import React, { useMemo } from 'react';
import { TextField, MenuItem } from '@mui/material';
import { UISelectProps } from '@/types/common';

const WaybillSelect: React.FC<UISelectProps> = ({
  value,
  label,
  selectValues,
  sortName = 'name',
  setInputsData,
  fieldsError = null,
  inputsDataPath,
}) => {
  // console.log('UI select', value, selectValues, sortName, inputsData, inputsDataPath);
  const selectedId = useMemo(() => {
    const found = selectValues?.find(item => item.id === value);
    return found?.id ?? '';
  }, [value, selectValues]);

  const updateInputsData = (path: string[], newValue: string | number) => {
    setInputsData(prev => {
      const updated = { ...prev };
      let current = updated;

      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        current[key] = { ...current[key] };
        current = current[key];
      }

      current[path[path.length - 1]] = newValue;
      console.log('UI select update', updated);
      return updated;
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newId = event.target.value;
    updateInputsData(inputsDataPath, newId);
  };

  return (
    <div className={`input-box ${fieldsError ? 'error' : ''}`} style={{ width: '100%' }}>
      <TextField
        select
        fullWidth
        label={label}
        value={selectedId}
        onChange={handleChange}
        variant="outlined"
        error={Boolean(fieldsError)}
        sx={{
          '& .MuiSelect-root': {
            pr: 3
          }
          // pr: 3
        }}
      >
        {selectValues && selectValues.length > 0 ? (
          selectValues.map(item => (
            <MenuItem key={item.id} value={item.id}>
              {item[sortName]}
            </MenuItem>
          ))
        ) : (
          <MenuItem value="">Нет доступных опций</MenuItem>
        )}
      </TextField>
      <h5>{fieldsError == 'error' ? '' : fieldsError}</h5>
    </div>
  );
};

export default WaybillSelect;
