'use client';
import Input from '@/components/UI/Input';
import { useApiRequest } from '@/hooks/useApiRequest';
import { isNonEmptyString, safeText } from '@/utils/helper';
import {
  Box,
  Typography,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { useState } from 'react';
import { MdOutlineVisibility, MdOutlineVisibilityOff } from 'react-icons/md';
import { useSnackbar } from 'notistack';
import Select from '@/components/UI/Select';

const PREDICTION_OPTIONS = [
  { id: 'one_category', name: 'Прогнозирование по одной категории' },
  { id: 'package', name: 'Пакетное прогнозирование' },
];

const CATEGORY_OPTIONS = [
  { id: 'FOODS', name: 'FOODS' },
  { id: 'HOBBIES', name: 'HOBBIES' },
  { id: 'HOUSEHOLD', name: 'HOUSEHOLD' },
];

export default function ForecastsClient() {
  const { request } = useApiRequest();
  const { enqueueSnackbar } = useSnackbar();
  const [inputsData, setInputsData] = useState<Record<string, string>>({});
  const [fieldsError, setFieldsError] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const stateButton =
    isNonEmptyString(inputsData.forecast_days) &&
    isNonEmptyString(inputsData.prediction_type) &&
    isNonEmptyString(inputsData.product_category) &&
    isNonEmptyString(inputsData.shop_id);

  async function handleForecasts(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const errors = {};
    setFieldsError(errors);
    if (Object.keys(errors).length != 0) {
      return;
    }

    setLoading(true);
    try {
      const res = await request('/forecasts', {
        data: inputsData,
      });

      if (res.status === 200) {
        console.log(res);
        setInputsData({});
      }
    } catch (err: any) {
      if (err?.response?.status === 400) {
        setFieldsError(err?.response?.data || {});
        return;
      }
    } finally {
      setLoading(false);
    }
  }

  const onChange = () => {
    setFieldsError({});
  };

  return (
    <Box
      onSubmit={(e) => handleForecasts(e)}
      component="form"
      sx={{
        gap: 2,
        display: 'flex',
        flexDirection: 'column',
        mb: 2,
        backgroundColor: '#fff',
        p: 2,
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Прогнозирование с помощью ML-сервиса
      </Typography>

      <Input
        type="number"
        name="forecast_days"
        value={safeText(inputsData?.forecast_days)}
        sectionPaths={['forecast_days']}
        setInputsData={setInputsData}
        quickSaveValue={true}
        onChange={() => onChange}
        label="Количество дней прогноза"
        shrink={true}
        fieldsError={fieldsError?.forecast_days}
      />

      <Select
        value={inputsData?.prediction_type}
        label="Тип прогноза"
        selectValues={PREDICTION_OPTIONS}
        setInputsData={setInputsData}
        inputsDataPath={['prediction_type']}
        fieldsError={fieldsError?.prediction_type}
      />

      <Select
        value={inputsData?.product_category}
        label="Категория продукта"
        selectValues={CATEGORY_OPTIONS}
        setInputsData={setInputsData}
        inputsDataPath={['product_category']}
        fieldsError={fieldsError?.product_category}
      />

      <Input
        type="number"
        name="shop_id"
        value={safeText(inputsData?.shop_id)}
        sectionPaths={['shop_id']}
        setInputsData={setInputsData}
        quickSaveValue={true}
        onChange={() => onChange}
        label="ID магазина"
        shrink={true}
        fieldsError={fieldsError?.shop_id}
      />

      <Box sx={{ display: 'flex', justifyContent: 'end' }}>
        <Button
          type="submit"
          variant="contained"
          disabled={!stateButton}
          fullWidth
          size="large"
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Прогнозировать'
          )}
        </Button>
      </Box>
    </Box>
  );
}
