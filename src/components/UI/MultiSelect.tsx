import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { employeesList } from '@/types/common';
import { SxProps, Theme } from '@mui/material';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function MultiSelect({
  options,
  value,
  onChange,
  sx,
}: {
  options: employeesList[];
  value: employeesList[];
  onChange: (value: employeesList[]) => void;
  sx?: SxProps<Theme>;
}) {
  return (
    <Autocomplete
      multiple
      size="small"
      value={value}
      onChange={(e, newValue) => onChange(newValue)}
      sx={sx}
      options={options}
      disableCloseOnSelect
      getOptionLabel={(option) => option.name}
      renderOption={(props, option, { selected }) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.name}
          </li>
        );
      }}
      renderValue={(selected) => `Выбрано: ${selected.length}`}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Сотрудники"
          InputLabelProps={{ shrink: true }}
        />
      )}
    />
  );
}
