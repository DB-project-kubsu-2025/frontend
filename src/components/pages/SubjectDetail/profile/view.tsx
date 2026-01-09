'use client';
import {
  ProductsDetailFormSchema,
  ProductsDetailNormalizedSchema,
} from '@/entities/products';
import { useApiRequest } from '@/hooks/useApiRequest';
import { nameSubjects, SubjectModes } from '@/types/common';
import {
  Box,
  Typography,
  Stack,
  Button,
  IconButton,
  ButtonGroup,
} from '@mui/material';
import { Grid } from '@mui/system';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { MdOutlineEdit } from 'react-icons/md';
import ElementViewerDetail from '@/components/pages/SubjectDetail/ElementViewerDetail';
import { useAppSelector } from '@/store/hooks';
import { ProfileNormalized } from '@/entities/profile';

interface Props {
  mode: SubjectModes;
  nameSubject: nameSubjects;
  detailData: ProfileNormalized;
}

const GENDER_OPTIONS = [
  { id: 'male', name: 'Мужской' },
  { id: 'female', name: 'Женский' },
];

export default function FieldsView({ mode, nameSubject, detailData }: Props) {
  console.log(mode);
  const categories = useAppSelector((s) => s.dicts.categories);
  const units = useAppSelector((s) => s.dicts.units);
  const router = useRouter();
  const { request } = useApiRequest();
  const { enqueueSnackbar } = useSnackbar();
  const [inputsData, setInputsData] = useState<Record<string, any>>(detailData);
  const [fieldsError, setFieldsError] = useState<Record<string, any>>({});

  async function onSave() {
    try {
      setFieldsError({});

      const formParsed = ProductsDetailFormSchema.safeParse(inputsData);
      if (!formParsed.success) {
        const flat = formParsed.error.flatten();
        const fieldErrors = Object.fromEntries(
          Object.entries(flat.fieldErrors).map(([k, v]) => [
            k,
            v?.[0] ?? 'Некорректное значение',
          ]),
        );

        setFieldsError(fieldErrors);
        console.log(fieldErrors);
        enqueueSnackbar('Исправьте ошибки в форме.', { variant: 'warning' });
        return null;
      }

      const normalized = ProductsDetailNormalizedSchema.parse(formParsed.data);
      const isCreate = mode === 'create';
      const endpoint = isCreate
        ? `/api/${nameSubject}`
        : `/api/${nameSubject}/${inputsData.id}`;
      const method = isCreate ? 'POST' : 'PUT';

      const res = await request(endpoint, { method, data: normalized });
      const status: number = res.status;
      const data: any = (res as any).data;

      if (status === 200 || status === 201) {
        enqueueSnackbar(data?.message, { variant: 'success' });

        const id = data?.id ?? inputsData?.id;
        if (!id) {
          console.log('Нет id для навигации');
          return data;
        }

        setTimeout(() => {
          router.push(`/${nameSubject}s/${id}`);
        }, 300);

        return data;
      }

      if (status === 400) {
        const issues = data?.issues;
        const fieldErrorsRaw = issues?.fieldErrors ?? data?.errorInputs;

        if (fieldErrorsRaw && typeof fieldErrorsRaw === 'object') {
          const fieldErrors = Object.fromEntries(
            Object.entries(fieldErrorsRaw).map(([k, v]: any) => [
              k,
              Array.isArray(v) ? v[0] : String(v),
            ]),
          );

          setFieldsError(fieldErrors);
          enqueueSnackbar(data?.message, { variant: 'warning' });
          return null;
        }
      }

      enqueueSnackbar(data?.message ?? 'Ошибка сохранения', {
        variant: 'error',
      });
      return null;
    } catch (err: any) {
      console.error('onSave error:', err);
      enqueueSnackbar('Внутренняя ошибка сервера', { variant: 'error' });
      return null;
    }
  }

  return (
    <Box className="modalViewDetail-block">
      <Grid className="modalViewDetail-head">
        <Typography variant="h4">Профиль</Typography>
      </Grid>
      <Stack spacing={2} className="modalViewDetail-content">
        <Box>
          <Typography variant="body2">Логин</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="username"
              value={inputsData?.username}
              fieldType="text"
              setInputsData={setInputsData}
              sectionPaths={['username']}
              fieldsError={fieldsError?.username}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>
        
        <Box>
          <Typography variant="body2">email</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="email"
              value={inputsData?.email}
              fieldType="text"
              setInputsData={setInputsData}
              sectionPaths={['email']}
              fieldsError={fieldsError?.email}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>
        
        <Box>
          <Typography variant="body2">Фамилия</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="last_name"
              value={inputsData?.last_name}
              fieldType="text"
              setInputsData={setInputsData}
              sectionPaths={['last_name']}
              fieldsError={fieldsError?.last_name}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>
        
        <Box>
          <Typography variant="body2">Имя</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="first_name"
              value={inputsData?.first_name}
              fieldType="text"
              setInputsData={setInputsData}
              sectionPaths={['first_name']}
              fieldsError={fieldsError?.first_name}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>
        
        <Box>
          <Typography variant="body2">Отчество</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="second_name"
              value={inputsData?.second_name}
              fieldType="text"
              setInputsData={setInputsData}
              sectionPaths={['second_name']}
              fieldsError={fieldsError?.second_name}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>
        
        <Box>
          <Typography variant="body2">Пол</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="gender"
              value={inputsData?.gender}
              fieldType="select"
              setInputsData={setInputsData}
              sectionPaths={['gender']}
              selectValues={GENDER_OPTIONS}
              fieldsError={fieldsError?.dashboardData}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>
        
        <Box>
          <Typography variant="body2">Телефон</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="phone"
              value={inputsData?.phone}
              fieldType="text"
              setInputsData={setInputsData}
              sectionPaths={['phone']}
              fieldsError={fieldsError?.phone}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>
        
        <Box>
          <Typography variant="body2">День рождения</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="birth_date"
              value={inputsData?.birth_date}
              fieldType="date"
              setInputsData={setInputsData}
              sectionPaths={['birth_date']}
              fieldsError={fieldsError?.birth_date}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>
        
        <Box>
          <Typography variant="body2">СНИЛС</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="snils"
              value={inputsData?.snils}
              fieldType="number"
              setInputsData={setInputsData}
              sectionPaths={['snils']}
              fieldsError={fieldsError?.snils}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>
        
        <Box>
          <Typography variant="body2">ИНН</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="inn"
              value={inputsData?.inn}
              fieldType="number"
              setInputsData={setInputsData}
              sectionPaths={['inn']}
              fieldsError={fieldsError?.inn}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>
        
        <Box>
          <Typography variant="body2">Рабочий телефон</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="work_phone"
              value={inputsData?.work_phone}
              fieldType="text"
              setInputsData={setInputsData}
              sectionPaths={['work_phone']}
              fieldsError={fieldsError?.work_phone}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>
      </Stack>
      <Grid className="modalViewDetail-foot">
        {mode !== 'view' && (
          <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={() => onSave()}
            >
              {mode === 'create' ? 'Создать' : 'Сохранить'}
            </Button>
          </Box>
        )}
      </Grid>
    </Box>
  );
}
