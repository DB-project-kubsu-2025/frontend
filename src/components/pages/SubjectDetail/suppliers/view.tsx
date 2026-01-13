'use client';
import {
  SuppliersDetailFormSchema,
  SuppliersDetailNormalized,
  SuppliersDetailNormalizedSchema,
} from '@/entities/suppliers';
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
  detailData: SuppliersDetailNormalized;
}

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

      const formParsed = SuppliersDetailFormSchema.safeParse(inputsData);
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

      const normalized = SuppliersDetailNormalizedSchema.parse(formParsed.data);
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
      subject: 'suppliers',
      id: inputsData?.id,
      message: 'Поставщик удалён',
    });
    setTimeout(() => router.push(`/${nameSubject}/`), 300);
  };

  return (
    <Box className="modalViewDetail-block">
      <Grid className="modalViewDetail-head">
        <Typography variant="h4">Поставщик</Typography>
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
          <Typography variant="body2">Адрес</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="address"
              value={inputsData?.address}
              fieldType="text"
              setInputsData={setInputsData}
              sectionPaths={['address']}
              fieldsError={fieldsError?.address}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="body2">ОГРН</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="ogrn"
              value={inputsData?.ogrn}
              fieldType="text"
              setInputsData={setInputsData}
              sectionPaths={['ogrn']}
              fieldsError={fieldsError?.ogrn}
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
              fieldType="text"
              setInputsData={setInputsData}
              sectionPaths={['inn']}
              fieldsError={fieldsError?.inn}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="body2">КПП</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="kpp"
              value={inputsData?.kpp}
              fieldType="text"
              setInputsData={setInputsData}
              sectionPaths={['kpp']}
              fieldsError={fieldsError?.kpp}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="body2">Наименование банка</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="bank_name"
              value={inputsData?.bank_name}
              fieldType="text"
              setInputsData={setInputsData}
              sectionPaths={['bank_name']}
              fieldsError={fieldsError?.bank_name}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="body2">БИК</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="bik"
              value={inputsData?.bik}
              fieldType="text"
              setInputsData={setInputsData}
              sectionPaths={['bik']}
              fieldsError={fieldsError?.bik}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="body2">Корреспондентский счет</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="corr_account"
              value={inputsData?.corr_account}
              fieldType="text"
              setInputsData={setInputsData}
              sectionPaths={['corr_account']}
              fieldsError={fieldsError?.corr_account}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="body2">Расчетный счет</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="checking_account"
              value={inputsData?.checking_account}
              fieldType="text"
              setInputsData={setInputsData}
              sectionPaths={['checking_account']}
              fieldsError={fieldsError?.checking_account}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="body2">SWIFT</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="swift"
              value={inputsData?.swift}
              fieldType="text"
              setInputsData={setInputsData}
              sectionPaths={['swift']}
              fieldsError={fieldsError?.swift}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="body2">IBAN</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="iban"
              value={inputsData?.iban}
              fieldType="text"
              setInputsData={setInputsData}
              sectionPaths={['iban']}
              fieldsError={fieldsError?.iban}
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
