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

export default function SettingsClient() {
  const { request } = useApiRequest();
  const { enqueueSnackbar } = useSnackbar();
  const [inputsData, setInputsData] = useState<Record<string, string>>({});
  const [fieldsError, setFieldsError] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const stateButton =
    isNonEmptyString(inputsData.old_password) &&
    isNonEmptyString(inputsData.new_password) &&
    isNonEmptyString(inputsData.new_password2) &&
    inputsData.new_password?.trim() === inputsData.new_password2?.trim();

  async function handleChangePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const errors = {};
    setFieldsError(errors);
    if (Object.keys(errors).length != 0) {
      return;
    }

    setLoading(true);
    try {
      const res = await request('/auth/changePassword', {
        method: 'POST',
        data: inputsData,
      });

      if (res.status === 200) {
        enqueueSnackbar('Пароль изменён', { variant: 'success' });
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
      onSubmit={(e) => handleChangePassword(e)}
      component="form"
      sx={{ gap: 2, display: 'flex', flexDirection: 'column', mb: 2, backgroundColor: '#fff', p: 2, borderRadius: 2 }}
    >
      <Typography variant="h4" gutterBottom>
        Смена пароля
      </Typography>

      <Input
        type={showPass ? 'text' : 'password'}
        name="old_password"
        value={safeText(inputsData?.old_password)}
        sectionPaths={['old_password']}
        setInputsData={setInputsData}
        quickSaveValue={true}
        onChange={() => onChange}
        label="Старый пароль"
        shrink={true}
        fieldsError={fieldsError?.old_password}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={showPass ? 'Скрыть пароль' : 'Показать пароль'}
                onClick={() => setShowPass((v) => !v)}
                edge="end"
              >
                {showPass ? (
                  <MdOutlineVisibilityOff />
                ) : (
                  <MdOutlineVisibility />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Input
        type={showPass ? 'text' : 'password'}
        name="new_password"
        value={safeText(inputsData?.new_password)}
        sectionPaths={['new_password']}
        setInputsData={setInputsData}
        quickSaveValue={true}
        onChange={() => onChange}
        label="Новый пароль"
        shrink={true}
        fieldsError={fieldsError?.new_password}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={showPass ? 'Скрыть пароль' : 'Показать пароль'}
                onClick={() => setShowPass((v) => !v)}
                edge="end"
              >
                {showPass ? (
                  <MdOutlineVisibilityOff />
                ) : (
                  <MdOutlineVisibility />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Input
        type={showPass ? 'text' : 'password'}
        name="new_password2"
        value={safeText(inputsData?.new_password2)}
        sectionPaths={['new_password2']}
        setInputsData={setInputsData}
        quickSaveValue={true}
        onChange={() => onChange}
        label="Повторите новый пароль"
        shrink={true}
        fieldsError={fieldsError?.new_password2}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={showPass ? 'Скрыть пароль' : 'Показать пароль'}
                onClick={() => setShowPass((v) => !v)}
                edge="end"
              >
                {showPass ? (
                  <MdOutlineVisibilityOff />
                ) : (
                  <MdOutlineVisibility />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
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
            'Сохранить'
          )}
        </Button>
      </Box>
    </Box>
  );
}
