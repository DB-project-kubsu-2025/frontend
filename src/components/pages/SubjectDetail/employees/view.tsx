'use client';
import {
  EmployeesDetailFormSchema,
  EmployeesDetailNormalized,
  EmployeesDetailNormalizedSchema,
} from '@/entities/employees';
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
import { MdDeleteOutline, MdOutlineEdit } from 'react-icons/md';
import ElementViewerDetail from '@/components/pages/SubjectDetail/ElementViewerDetail';
import { IoClose } from 'react-icons/io5';
import { useDeleteEntity } from '@/hooks/useDeleteEntity';

interface Props {
  mode: SubjectModes;
  nameSubject: nameSubjects;
  detailData: EmployeesDetailNormalized;
}

const GENDER_OPTIONS = [
  { id: 'male', name: 'Мужской' },
  { id: 'female', name: 'Женский' },
];

export default function FieldsView({ mode, nameSubject, detailData }: Props) {
  const router = useRouter();
  const { request } = useApiRequest();
  const { enqueueSnackbar } = useSnackbar();
  const [inputsData, setInputsData] = useState<Record<string, any>>(detailData);
  const [fieldsError, setFieldsError] = useState<Record<string, any>>({});
  const deleteEntity = useDeleteEntity({
    request,
    refresh: () => router.refresh(),
    notify: (msg, variant) => enqueueSnackbar(msg, { variant }),
  });

  async function onSave() {
    try {
      setFieldsError({});

      const formParsed = EmployeesDetailFormSchema.safeParse(inputsData);
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

      const normalized = EmployeesDetailNormalizedSchema.parse(formParsed.data);
      const isCreate = mode === 'create';
      const endpoint = isCreate
        ? `/${nameSubject}`
        : `/${nameSubject}/${inputsData.id}`;
      const method = isCreate ? 'POST' : 'PUT';
      const res = await request(endpoint, { method, data: normalized });

      enqueueSnackbar(res?.data?.message ?? 'Сохранено', {
        variant: 'success',
      });

      const id = res?.data?.id ?? inputsData?.id;
      if (id) {
        setTimeout(() => router.push(`/${nameSubject}/${id}`), 300);
      }
      if (isCreate) {
        setTimeout(() => router.push(`/${nameSubject}/`), 300);
      }

      return res.data;
    } catch (err: any) {
      const status = err?.response?.status;
      const data = err?.response?.data;

      if (status === 400) {
        const payload = data?.data ?? data;
        const fieldErrorsRaw =
          payload?.fieldErrors ??
          payload?.errorInputs ??
          payload?.issues?.fieldErrors ??
          payload?.issues?.errorInputs ??
          (payload && typeof payload === 'object' ? payload : null);

        if (fieldErrorsRaw && typeof fieldErrorsRaw === 'object') {
          const fieldErrors = Object.fromEntries(
            Object.entries(fieldErrorsRaw).map(([k, v]) => [
              k,
              Array.isArray(v) ? String(v[0] ?? '') : String(v ?? ''),
            ]),
          );

          setFieldsError(fieldErrors);
          enqueueSnackbar(data?.message ?? 'Проверьте поля формы', {
            variant: 'warning',
          });
          return null;
        }
      }

      console.error('onSave error:', err);
      enqueueSnackbar(
        data?.message ?? err?.message ?? 'Ошибка соединения с сервером',
        { variant: 'error' },
      );
      return null;
    }
  }

  const handleDelete = async () => {
    await deleteEntity({
      subject: 'employees',
      id: inputsData?.id,
      message: 'Сотрудник удалён',
    });
    setTimeout(() => router.push(`/${nameSubject}/`), 300);
  };

  return (
    <Box className="modalViewDetail-block">
      <Grid className="modalViewDetail-head">
        <Typography variant="h4">Сотрудник</Typography>
        {mode == 'view' ? (
          <Stack direction="row" spacing={1}>
            <IconButton
              size="medium"
              color="default"
              onClick={() =>
                router.push(`/${nameSubject}/${inputsData?.id}/edit`)
              }
            >
              <MdOutlineEdit />
            </IconButton>
            <IconButton
              size="medium"
              color="default"
              onClick={() => handleDelete()}
            >
              <MdDeleteOutline />
            </IconButton>
            <IconButton
              size="medium"
              color="default"
              onClick={() => router.push(`/${nameSubject}/`)}
            >
              <IoClose />
            </IconButton>
          </Stack>
        ) : mode == 'edit' ? (
          <Stack direction="row" spacing={1}>
            <ButtonGroup variant="outlined" size="small">
              <Button
                variant="contained"
                color="info"
                onClick={() => router.push(`/${nameSubject}/${inputsData?.id}`)}
              >
                Отмена
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => onSave()}
              >
                Сохранить
              </Button>
            </ButtonGroup>
          </Stack>
        ) : (
          ''
        )}
      </Grid>
      <Stack spacing={2} className="modalViewDetail-content">
        <Box>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500 }}
          >
            Логин
          </Typography>
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
          <Typography
            variant="body2"
            sx={{ fontWeight: 500 }}
          >
            Фамилия
          </Typography>
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
          <Typography
            variant="body2"
            sx={{ fontWeight: 500 }}
          >
            Имя
          </Typography>
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
          <Typography
            variant="body2"
            sx={{ fontWeight: 500 }}
          >
            Отчество
          </Typography>
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
          <Typography
            variant="body2"
            sx={{ fontWeight: 500 }}
          >
            Почта
          </Typography>
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
          <Typography
            variant="body2"
            sx={{ fontWeight: 500 }}
          >
            Дата рождения
          </Typography>
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
          <Typography
            variant="body2"
            sx={{ fontWeight: 500 }}
          >
            Пол
          </Typography>
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
          <Typography
            variant="body2"
            sx={{ fontWeight: 500 }}
          >
            СНИЛС
          </Typography>
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
          <Typography
            variant="body2"
            sx={{ fontWeight: 500 }}
          >
            ИНН
          </Typography>
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
          <Typography
            variant="body2"
            sx={{ fontWeight: 500 }}
          >
            Телефон
          </Typography>
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
          <Typography
            variant="body2"
            sx={{ fontWeight: 500 }}
          >
            Рабочий телефон
          </Typography>
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

        <Box>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500 }}
          >
            Рабочее место
          </Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="workplace"
              value={inputsData?.workplace}
              fieldType="number"
              setInputsData={setInputsData}
              sectionPaths={['workplace']}
              fieldsError={fieldsError?.workplace}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>
        
        <Box>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500 }}
          >
            Паспорт
          </Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="passport"
              value={inputsData?.passport}
              fieldType="text"
              setInputsData={setInputsData}
              sectionPaths={['passport']}
              fieldsError={fieldsError?.passport}
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
