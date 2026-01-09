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
import {
  formatDate,
  isNonEmptyString,
  isValidDate,
  isValidNumberString,
  safeText,
} from '@/utils/helper';
import Select from '@/components/UI/Select';
import DateInput from '@/components/UI/DateInput';

interface InputsData {
  username?: string;
  email?: string;
  last_name?: string;
  first_name?: string;
  second_name?: string;
  gender?: 'male' | 'female';
  phone?: string;
  birth_date?: Date;
  snils?: number;
  inn?: number;
  work_phone?: string;
  type?: string;
  series?: number;
  number?: number;
  issue_date?: string;
  issued_by?: string;
  authority_code?: string;
  registration_address?: string;
  residential_address?: string;
  password?: string;
  password2?: string;
}

interface ErrorsData extends InputsData {
  message?: string;
}

const GENDER_OPTIONS = [
  { id: 'male', name: 'Мужской' },
  { id: 'female', name: 'Женский' },
];

const PASSPORT_TYPE = [
  { id: 'simple', name: 'Обычный' },
  { id: 'foreign', name: 'Заграничный' },
];

export default function LoginPage() {
  const { request } = useApiRequest();
  const router = useRouter();
  const [inputsData, setInputsData] = useState<InputsData>({});
  const [fieldsError, setFieldsError] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const requiredOk = true;
  const ee =
    isNonEmptyString(inputsData.username) &&
    isNonEmptyString(inputsData.last_name) &&
    isNonEmptyString(inputsData.first_name) &&
    isNonEmptyString(inputsData.second_name) &&
    (inputsData.gender === 'male' || inputsData.gender === 'female') &&
    isValidNumberString(inputsData.phone, 11, 11) &&
    isValidDate(inputsData.birth_date) &&
    isValidNumberString(inputsData.snils, 11, 11) &&
    isValidNumberString(inputsData.inn, 10, 12) &&
    isValidNumberString(inputsData.work_phone, 11, 11) &&
    isValidNumberString(inputsData.series, 4, 4) &&
    isValidNumberString(inputsData.number, 6, 6) &&
    isValidDate(inputsData.issue_date) &&
    isNonEmptyString(inputsData.issued_by) &&
    isValidNumberString(inputsData.authority_code, 6, 6) &&
    isNonEmptyString(inputsData.registration_address) &&
    isNonEmptyString(inputsData.residential_address) &&
    isNonEmptyString(inputsData.password) &&
    isNonEmptyString(inputsData.password2) &&
    inputsData.password?.trim() === inputsData.password2?.trim();

  const stateButton = loading || !requiredOk;

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
      const res = await request('/registration', {
        method: 'POST',
        data: inputsData,
      });

      if (res.status === 200) {
        router.replace('/');
        router.refresh();
      }
    } catch (err: any) {
      if (err?.response?.status === 400) {
        setFieldsError(err?.response?.data?.message || {});
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
        <Card sx={{ width: '100%', maxWidth: 480 }}>
          <CardHeader
            title={
              <>
                <Typography variant="h5" component="h1">
                  Регистрация
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
                  onChange={() => onChange}
                  label="Логин"
                  shrink={true}
                  fieldsError={fieldsError?.username}
                />
                <Input
                  type="text"
                  name="email"
                  value={safeText(inputsData?.email)}
                  sectionPaths={['email']}
                  setInputsData={setInputsData}
                  quickSaveValue={true}
                  onChange={() => onChange}
                  label="email"
                  shrink={true}
                  fieldsError={fieldsError?.email}
                />
                <Input
                  type="text"
                  name="last_name"
                  value={safeText(inputsData?.last_name)}
                  sectionPaths={['last_name']}
                  setInputsData={setInputsData}
                  quickSaveValue={true}
                  onChange={() => onChange}
                  label="Фамилия"
                  shrink={true}
                  fieldsError={fieldsError?.last_name}
                />

                <Input
                  type="text"
                  name="first_name"
                  value={safeText(inputsData?.first_name)}
                  sectionPaths={['first_name']}
                  setInputsData={setInputsData}
                  quickSaveValue={true}
                  onChange={() => onChange}
                  label="Имя"
                  shrink={true}
                  fieldsError={fieldsError?.first_name}
                />

                <Input
                  type="text"
                  name="second_name"
                  value={safeText(inputsData?.second_name)}
                  sectionPaths={['second_name']}
                  setInputsData={setInputsData}
                  quickSaveValue={true}
                  onChange={() => onChange}
                  label="Отчество"
                  shrink={true}
                  fieldsError={fieldsError?.second_name}
                />

                <Select
                  value={inputsData?.gender}
                  label="Пол"
                  selectValues={GENDER_OPTIONS}
                  setInputsData={setInputsData}
                  inputsDataPath={['gender']}
                  fieldsError={fieldsError?.gender}
                />

                <Input
                  type="text"
                  name="phone"
                  value={safeText(inputsData?.phone)}
                  sectionPaths={['phone']}
                  setInputsData={setInputsData}
                  quickSaveValue={true}
                  onChange={() => onChange}
                  label="Телефон"
                  shrink={true}
                  fieldsError={fieldsError?.phone}
                />

                <DateInput
                  name="birth_date"
                  label="Дата рождения"
                  value={formatDate(inputsData?.birth_date, 'ymd')}
                  sectionPaths={['birth_date']}
                  setInputsData={setInputsData}
                  fieldsError={fieldsError?.birth_date}
                />

                <Input
                  type="number"
                  name="snils"
                  value={safeText(inputsData?.snils)}
                  sectionPaths={['snils']}
                  setInputsData={setInputsData}
                  quickSaveValue={true}
                  onChange={() => onChange}
                  label="СНИЛС"
                  shrink={true}
                  fieldsError={fieldsError?.snils}
                />

                <Input
                  type="number"
                  name="inn"
                  value={safeText(inputsData?.inn)}
                  sectionPaths={['inn']}
                  setInputsData={setInputsData}
                  quickSaveValue={true}
                  onChange={() => onChange}
                  label="ИНН"
                  shrink={true}
                  fieldsError={fieldsError?.inn}
                />

                <Input
                  type="text"
                  name="work_phone"
                  value={safeText(inputsData?.work_phone)}
                  sectionPaths={['work_phone']}
                  setInputsData={setInputsData}
                  quickSaveValue={true}
                  onChange={() => onChange}
                  label="Рабочий телефон"
                  shrink={true}
                  fieldsError={fieldsError?.work_phone}
                  maxLength={11}
                />

                <Select
                  value={inputsData?.type}
                  label="Тип паспорта"
                  selectValues={PASSPORT_TYPE}
                  setInputsData={setInputsData}
                  inputsDataPath={['type']}
                  fieldsError={fieldsError?.type}
                />

                <Input
                  type="number"
                  name="series"
                  value={safeText(inputsData?.series)}
                  sectionPaths={['series']}
                  setInputsData={setInputsData}
                  quickSaveValue={true}
                  onChange={() => onChange}
                  label="Серия"
                  shrink={true}
                  fieldsError={fieldsError?.series}
                  maxLength={4}
                />

                <Input
                  type="number"
                  name="number"
                  value={safeText(inputsData?.number)}
                  sectionPaths={['number']}
                  setInputsData={setInputsData}
                  quickSaveValue={true}
                  onChange={() => onChange}
                  label="Номер"
                  shrink={true}
                  fieldsError={fieldsError?.number}
                  maxLength={6}
                />

                <DateInput
                  name="issue_date"
                  label="Дата получения"
                  value={formatDate(inputsData?.issue_date ?? '', 'ymd')}
                  sectionPaths={['issue_date']}
                  setInputsData={setInputsData}
                  fieldsError={fieldsError?.issue_date}
                />

                <Input
                  type="text"
                  name="issued_by"
                  value={safeText(inputsData?.issued_by)}
                  sectionPaths={['issued_by']}
                  setInputsData={setInputsData}
                  quickSaveValue={true}
                  onChange={() => onChange}
                  label="Выдан"
                  shrink={true}
                  fieldsError={fieldsError?.issued_by}
                />

                <Input
                  type="text"
                  name="authority_code"
                  value={safeText(inputsData?.authority_code)}
                  sectionPaths={['authority_code']}
                  setInputsData={setInputsData}
                  quickSaveValue={true}
                  onChange={() => onChange}
                  label="Код подразделения"
                  shrink={true}
                  fieldsError={fieldsError?.authority_code}
                  maxLength={7}
                />

                <Input
                  type="text"
                  name="registration_address"
                  value={safeText(inputsData?.registration_address)}
                  sectionPaths={['registration_address']}
                  setInputsData={setInputsData}
                  quickSaveValue={true}
                  onChange={() => onChange}
                  label="Адрес регистрации"
                  shrink={true}
                  fieldsError={fieldsError?.registration_address}
                />

                <Input
                  type="text"
                  name="residential_address"
                  value={safeText(inputsData?.residential_address)}
                  sectionPaths={['residential_address']}
                  setInputsData={setInputsData}
                  quickSaveValue={true}
                  onChange={() => onChange}
                  label="Прописка"
                  shrink={true}
                  fieldsError={fieldsError?.residential_address}
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
                  fieldsError={
                    fieldsError?.password ?? fieldsError?.non_field_errors
                  }
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

                <Input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={safeText(inputsData?.password2)}
                  sectionPaths={['password2']}
                  setInputsData={setInputsData}
                  quickSaveValue={true}
                  onChange={() => onChange}
                  label="Повторите пароль"
                  shrink={true}
                  fieldsError={fieldsError?.password2}
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
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Регистрация'
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
