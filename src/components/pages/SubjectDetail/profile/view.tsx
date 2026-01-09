'use client';
import { useApiRequest } from '@/hooks/useApiRequest';
import { nameSubjects, SubjectModes } from '@/types/common';
import { Box, Typography, Stack, Button } from '@mui/material';
import { Grid } from '@mui/system';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import ElementViewerDetail from '@/components/pages/SubjectDetail/ElementViewerDetail';
import {
  ProfileFormSchema,
  ProfileNormalized,
  ProfileNormalizedSchema,
} from '@/entities/profile';

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
  const { request } = useApiRequest();
  const { enqueueSnackbar } = useSnackbar();
  const [inputsData, setInputsData] = useState<Record<string, any>>(detailData);
  const [fieldsError, setFieldsError] = useState<Record<string, any>>({});

  async function onSave() {
    try {
      setFieldsError({});

      const formParsed = ProfileFormSchema.safeParse(inputsData);
      if (!formParsed.success) {
        const flat = formParsed.error.flatten();
        const fieldErrors = Object.fromEntries(
          Object.entries(flat.fieldErrors).map(([k, v]) => [
            k,
            v?.[0] ?? 'Некорректное значение',
          ]),
        );
        setFieldsError(fieldErrors);
        enqueueSnackbar('Исправьте ошибки в форме.', { variant: 'warning' });
        return null;
      }

      const normalized = ProfileNormalizedSchema.parse(formParsed.data);

      const res = await request(`/${nameSubject}`, {
        method: 'PATCH',
        data: normalized,
      });

      enqueueSnackbar('Данные сотрудника сохранены', {
        variant: 'success',
      });
      return res.data;
    } catch (err: any) {
      const status = err?.response?.status;
      const data = err?.response?.data;

      if (status === 400) {
        const fieldErrorsRaw =
          data?.fieldErrors ??
          data?.errorInputs ??
          (data && typeof data === 'object' ? data : null);

        if (fieldErrorsRaw && typeof fieldErrorsRaw === 'object') {
          const fieldErrors = Object.fromEntries(
            Object.entries(fieldErrorsRaw).map(([k, v]) => [
              k,
              Array.isArray(v) ? String(v[0] ?? '') : String(v ?? ''),
            ]),
          );

          setFieldsError(fieldErrors);
          enqueueSnackbar('Проверьте поля формы', { variant: 'warning' });
          return null;
        }
      }

      enqueueSnackbar(err?.message ?? 'Ошибка соединения с сервером', {
        variant: 'error',
      });
      return null;
    }
  }
  
  return (
    <Box 
      className="modalViewDetail-block"
      sx={{
        backgroundColor: 'transparent',
        '& .modalViewDetail-content': {
          background: 'transparent !important',
          backgroundColor: 'transparent !important',
        },
        '& .MuiTextField-root': {
          '& .MuiInputBase-root': {
            padding: '4px 8px',
            fontSize: '0.75rem',
            height: '28px',
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.75rem',
            transform: 'translate(8px, 8px) scale(1)',
            '&.MuiInputLabel-shrink': {
              transform: 'translate(8px, -9px) scale(0.75)',
            },
          },
        },
        '& .MuiInputBase-root': {
          padding: '4px 8px',
          fontSize: '0.75rem',
          minHeight: '28px',
        },
        '& .MuiSelect-root': {
          padding: '4px 8px',
          fontSize: '0.75rem',
          minHeight: '28px',
        },
        '& .MuiOutlinedInput-root': {
          padding: '4px 8px',
          '& input': {
            padding: '4px 8px',
            fontSize: '0.75rem',
            height: '20px',
          },
        },
        '& .MuiDatePicker-root .MuiTextField-root': {
          '& .MuiInputBase-root': {
            padding: '4px 8px !important',
            fontSize: '0.75rem',
            minHeight: '28px !important',
            height: '28px !important',
          },
          '& .MuiInputBase-input': {
            padding: '4px 8px !important',
            fontSize: '0.75rem',
            height: '20px !important',
            minHeight: '20px !important',
          },
        },
        '& .input-box': {
          '& .MuiTextField-root': {
            '& .MuiInputBase-root': {
              padding: '4px 8px !important',
              fontSize: '0.75rem',
              minHeight: '28px !important',
              height: '28px !important',
            },
            '& .MuiInputBase-input': {
              padding: '4px 8px !important',
              fontSize: '0.75rem',
              height: '20px !important',
            },
          },
        },
      }}
    >
      <Grid className="modalViewDetail-head">
        <Typography variant="h4">Профиль</Typography>
      </Grid>
      <Stack spacing={2} className="modalViewDetail-content">
        <Box sx={{ maxWidth: '50%' }}>
          <Typography variant="body2" sx={{ fontSize: '0.93rem', fontWeight: 500 }}>Логин</Typography>
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

        <Box sx={{ maxWidth: '50%' }}>
          <Typography variant="body2" sx={{ fontSize: '0.93rem', fontWeight: 500 }}>Почта</Typography>
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

        <Box sx={{ maxWidth: '50%' }}>
          <Typography variant="body2" sx={{ fontSize: '0.93rem', fontWeight: 500 }}>Фамилия</Typography>
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

        <Box sx={{ maxWidth: '50%' }}>
          <Typography variant="body2" sx={{ fontSize: '0.93rem', fontWeight: 500 }}>Имя</Typography>
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

        <Box sx={{ maxWidth: '50%' }}>
          <Typography variant="body2" sx={{ fontSize: '0.93rem', fontWeight: 500 }}>Отчество</Typography>
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

        <Box sx={{ maxWidth: '50%' }}>
          <Typography variant="body2" sx={{ fontSize: '0.93rem', fontWeight: 500 }}>Пол</Typography>
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

        <Box sx={{ maxWidth: '50%' }}>
          <Typography variant="body2" sx={{ fontSize: '0.93rem', fontWeight: 500 }}>Телефон</Typography>
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

        <Box sx={{ maxWidth: '50%' }}>
          <Typography variant="body2" sx={{ fontSize: '0.93rem', fontWeight: 500 }}>Дата рождения</Typography>
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

        <Box sx={{ maxWidth: '50%' }}>
          <Typography variant="body2" sx={{ fontSize: '0.93rem', fontWeight: 500 }}>СНИЛС</Typography>
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

        <Box sx={{ maxWidth: '50%' }}>
          <Typography variant="body2" sx={{ fontSize: '0.93rem', fontWeight: 500 }}>ИНН</Typography>
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

        <Box sx={{ maxWidth: '50%' }}>
          <Typography variant="body2" sx={{ fontSize: '0.93rem', fontWeight: 500 }}>Рабочий телефон</Typography>
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
              size="large"
              onClick={() => onSave()}
              sx={{
                backgroundColor: 'rgb(110, 68, 0)',
                color: '#fff',
                '&:hover': {
                  backgroundColor: 'rgb(138, 85, 0)',
                  filter: 'brightness(120%)',
                },
              }}
            >
              {mode === 'create' ? 'Создать' : 'Сохранить'}
            </Button>
          </Box>
        )}
      </Grid>
    </Box>
  );
}
