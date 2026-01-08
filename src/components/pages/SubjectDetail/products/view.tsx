'use client';
import {
  ProductsDetailFormSchema,
  ProductsDetailNormalized,
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

interface Props {
  mode: SubjectModes;
  nameSubject: nameSubjects;
  detailData: ProductsDetailNormalized;
}

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
        <Typography variant="h4">Товар</Typography>
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
          <Typography variant="body2">Единица измерения</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="unit"
              value={inputsData?.unit}
              fieldType="select"
              setInputsData={setInputsData}
              sectionPaths={['unit']}
              selectValues={units}
              fieldsError={fieldsError?.dashboardData}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="body2">Категория</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="category"
              value={inputsData?.category}
              fieldType="select"
              setInputsData={setInputsData}
              sectionPaths={['category']}
              selectValues={categories}
              fieldsError={fieldsError?.dashboardData}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="body2">Название</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="name"
              value={inputsData?.name}
              fieldType="text"
              setInputsData={setInputsData}
              sectionPaths={['name']}
              fieldsError={fieldsError?.name}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="body2">Описание</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="description"
              value={inputsData?.description}
              fieldType="text"
              setInputsData={setInputsData}
              sectionPaths={['description']}
              fieldsError={fieldsError?.description}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="body2">Срок годности</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              value={inputsData?.expiration_days}
              fieldType="number"
              setInputsData={setInputsData}
              sectionPaths={['expiration_days']}
              fieldsError={fieldsError?.dashboardData}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="body2">Производитель</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="producer_name"
              value={inputsData?.producer_name}
              fieldType="text"
              setInputsData={setInputsData}
              sectionPaths={['producer_name']}
              fieldsError={fieldsError?.producer_name}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="body2">Код производителя</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="producer_code"
              value={inputsData?.producer_code}
              fieldType="text"
              setInputsData={setInputsData}
              sectionPaths={['producer_code']}
              fieldsError={fieldsError?.producer_code}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="body2">Страна происхождения</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="country_name"
              value={inputsData?.country_name}
              fieldType="text"
              setInputsData={setInputsData}
              sectionPaths={['country_name']}
              fieldsError={fieldsError?.country_name}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="body2">Дополнительная информация</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="additional_info"
              value={inputsData?.additional_info}
              fieldType="text"
              setInputsData={setInputsData}
              sectionPaths={['additional_info']}
              fieldsError={fieldsError?.additional_info}
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
