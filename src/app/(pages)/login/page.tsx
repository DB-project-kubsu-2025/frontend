'use client';

import React, { useState } from 'react';
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
import { useApiRequest } from '@/hooks/useApiRequest';
import Input from '@/components/UI/Input';
import { safeText } from '@/utils/helper';
import Link from 'next/link';

interface InputsData {
  username?: string;
  password?: string;
}

interface ErrorsData extends InputsData {
  message?: string;
}

export default function LoginPage() {
  const { request } = useApiRequest();
  const router = useRouter();
  const [inputsData, setInputsData] = useState<InputsData>({});
  const [fieldsError, setFieldsError] = useState<ErrorsData>({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const username = inputsData.username?.trim();
  const password = inputsData.password?.trim();
  const stateButton = loading || !username || !password;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const errors: ErrorsData = {};
    // if (password != undefined && password.length < 8) {
    //   errors.password = 'Не менее 8 символов';
    // }
    setFieldsError(errors);
    if (Object.keys(errors).length != 0) {
      return;
    }

    setLoading(true);
    try {
      const res = await request('/auth', {
        method: 'POST',
        data: { username, password },
      });

      if (res.status === 200) {
        router.replace('/');
        router.refresh();
      }
    } catch (err: any) {
      // if(err?.response?.status === 401) {
      setFieldsError({ message: 'Неверный логин или пароль' });
      return;
      // }
    } finally {
      setLoading(false);
    }
  }

  const onChange = () => {
    setFieldsError({});
  };

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
        <Card
          sx={{
            width: '100%',
            maxWidth: 640,
            alignContent: 'center',
            borderRadius: 6,
            border: '2px solid',
            borderColor: 'rgb(110, 68, 0, 0.6)',
            boxShadow: '2px 3px 3px rgb(110, 68, 0, 0.3)',
          }}
        >
          <CardHeader
            title={
              <>
                <Typography
                  variant="h5"
                  component="h1"
                  style={{
                    color: 'rgba(128, 79, 0, 1)',
                    letterSpacing: '2px',
                    textAlign: 'center',
                    fontWeight: '750',
                    fontSize: '40px',
                  }}
                >
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
              <Stack spacing={2.5} fontSize={40}>
                <Input
                  type="text"
                  name="username"
                  value={safeText(inputsData?.username)}
                  sectionPaths={['username']}
                  setInputsData={setInputsData}
                  quickSaveValue={true}
                  onChange={() => onChange}
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
                  onChange={() => onChange}
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
                  disabled={stateButton}
                  fullWidth
                  size="large"
                  sx={{
                    textSizeAdjust: 24,
                    backgroundColor: 'rgba(235, 180, 0, 1)',
                  }}
                >
                  {loading ? <CircularProgress /> : 'Войти'}
                </Button>
                <Link
                  href="/registration"
                  style={{
                    color: 'rgba(128, 79, 0, 1)',
                    textDecoration: 'none',
                    fontSize: 20,
                    textAlign: 'center',
                  }}
                >
                  Регистрация
                </Link>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
