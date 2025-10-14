'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import { MdOutlineVisibility } from 'react-icons/md';
import { MdOutlineVisibilityOff } from 'react-icons/md';
import { useApiRequest } from '@/hooks/apiRequest';
import { setCookie } from 'cookies-next/client';
import Input from '@/components/UI/Input';
import { safeText } from '@/utils/helper';

interface InputsData {
  username?: string;
  password?: string;
}

interface ErrorsData extends InputsData {
  message?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { request } = useApiRequest();
  const [inputsData, setInputsData] = useState<InputsData>({});
  const [fieldsError, setFieldsError] = useState<ErrorsData>({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const errors: ErrorsData = {};
    if (!inputsData.username?.trim()) {
      errors.username = 'Введите логин';
    }
    if (!inputsData.password?.trim()) {
      errors.password = 'Введите пароль';
    } else if (inputsData.password.length < 8) {
      errors.password = 'Не менее 8 символов';
    }

    setFieldsError(errors);
    if (Object.keys(errors).length != 0) {
      return;
    }

    setLoading(true);
    try {
      const res = await request('/auth/login', {
        method: 'POST',
        data: { inputsData },
      });

      const token = res?.data?.token;
      if (!token) {
        throw new Error('Токен не получен. Проверьте серверный ответ.');
      }

      setCookie('token', token, { path: '/' });
      router.push('/');
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || 'Ошибка входа';
      setFieldsError({ message: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 420 }}>
          <CardHeader
            title={
              <>
                <Typography variant="h5" component="h1">
                  Вход в систему
                </Typography>
                <Typography component="h6" className="field-message-error">
                  {fieldsError.message}
                </Typography>
              </>
            }
          />
          <CardContent>
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <Input
                  type="text"
                  name="username"
                  value={safeText(inputsData?.username)}
                  sectionPaths={['username']}
                  setInputsData={setInputsData}
                  quickSaveValue={true}
                  onChange={() => setFieldsError({})}
                  label="Логин"
                  shrink={true}
                  fieldsError={fieldsError?.username}
                />
                <Input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={safeText(inputsData?.password)}
                  sectionPaths={['password']}
                  setInputsData={setInputsData}
                  quickSaveValue={true}
                  onChange={() => setFieldsError({})}
                  label="Пароль"
                  shrink={true}
                  fieldsError={fieldsError?.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPass ? 'Скрыть пароль' : 'Показать пароль'
                          }
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

                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  fullWidth
                  size="large"
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Войти'
                  )}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
