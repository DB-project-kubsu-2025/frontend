'use client';
import {
  CouponsDetailFormSchema,
  CouponsDetailNormalized,
  CouponsDetailNormalizedSchema,
} from '@/entities/coupons';
import { useApiRequest } from '@/hooks/useApiRequest';
import { nameSubjects, SubjectModes } from '@/types/common';
import {
  Box,
  Typography,
  Stack,
  Button,
  IconButton,
  ButtonGroup,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Grid } from '@mui/system';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import { MdOutlineEdit } from 'react-icons/md';
import ElementViewerDetail from '@/components/pages/SubjectDetail/ElementViewerDetail';
import { useAppSelector } from '@/store/hooks';

interface Props {
  mode: SubjectModes;
  nameSubject: nameSubjects;
  detailData: CouponsDetailNormalized;
}

type DictItem = { id: number; name: string };

export default function FieldsView({ mode, nameSubject, detailData }: Props) {
  const discountTypes = useAppSelector((s) => s.dicts.couponsDiscountsTypes);
  const router = useRouter();
  const { request } = useApiRequest();
  const { enqueueSnackbar } = useSnackbar();
  
  console.log(nameSubject);
  const initialData = {
    ...detailData,
    product: detailData?.product || 0,
  };
  const [inputsData, setInputsData] = useState<Record<string, any>>(initialData);
  const [fieldsError, setFieldsError] = useState<Record<string, any>>({});
  const [storages, setStorages] = useState<DictItem[]>([]);
  const [products, setProducts] = useState<DictItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Получаем токен из cookie для прямого запроса к backend
        const getCookie = (name: string) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop()?.split(';').shift();
          return null;
        };
        
        const token = getCookie('token');
        const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8070/api';
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const [storagesResponse, productsResponse] = await Promise.all([
          fetch(`${baseURL}/shops/storages/`, {
            method: 'GET',
            headers,
            credentials: 'include',
          }).catch(e => {
            console.error('[CouponsForm] Storages fetch error:', e);
            throw e;
          }),
          fetch(`${baseURL}/shops/products/`, {
            method: 'GET',
            headers,
            credentials: 'include',
          }).catch(e => {
            console.error('[CouponsForm] Products fetch error:', e);
            throw e;
          }),
        ]);
        
        // Обрабатываем ответы, даже если они не ok
        let storagesRes: any[] = [];
        let productsRes: any[] = [];
        
        if (storagesResponse.ok) {
          try {
            storagesRes = await storagesResponse.json();
            storagesRes = Array.isArray(storagesRes) ? storagesRes : [];
          } catch (e) {
            console.error('[CouponsForm] Error parsing storages response:', e);
          }
        } else {
          const errorText = await storagesResponse.text().catch(() => '');
          console.error('[CouponsForm] Storages response error:', storagesResponse.status, errorText.substring(0, 200));
          enqueueSnackbar(`Ошибка загрузки хранилищ: ${storagesResponse.status}`, { variant: 'warning' });
        }
        
        if (productsResponse.ok) {
          try {
            productsRes = await productsResponse.json();
            productsRes = Array.isArray(productsRes) ? productsRes : [];
          } catch (e) {
            console.error('[CouponsForm] Error parsing products response:', e);
          }
        } else {
          const errorText = await productsResponse.text().catch(() => '');
          console.error('[CouponsForm] Products response error:', productsResponse.status, errorText.substring(0, 200));
          enqueueSnackbar(`Ошибка загрузки продуктов: ${productsResponse.status}`, { variant: 'warning' });
        }
        
        const storagesList = Array.isArray(storagesRes) ? storagesRes : [];
        const productsList = Array.isArray(productsRes) ? productsRes : [];
        
        setStorages(
          storagesList.map((s: any) => ({
            id: s.id,
            name: s.cadastral_number || `Хранилище ${s.id}`,
          }))
        );
        
        setProducts(
          productsList.map((p: any) => ({
            id: p.id,
            name: p.name,
          }))
        );
      } catch (error: any) {
        console.error('[CouponsForm] Error loading data:', error);
        const errorMsg = error?.message || 'Ошибка загрузки данных';
        enqueueSnackbar(errorMsg, { variant: 'error' });
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [enqueueSnackbar]);

  async function onSave() {
    try {
      setFieldsError({});

      const formParsed = CouponsDetailFormSchema.safeParse(inputsData);
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

      const normalized = CouponsDetailNormalizedSchema.parse(formParsed.data);
      const isCreate = mode === 'create';
      const endpoint = isCreate
        ? `/api/coupons`
        : `/api/coupons/${inputsData.id}`;
      const method = isCreate ? 'POST' : 'PUT';

      // Преобразуем данные для отправки (убираем поля с _name и обрабатываем product)
      const productValue = normalized.product && normalized.product > 0 ? normalized.product : null;
      
      const dataToSend = {
        storage: normalized.storage,
        product: productValue,
        discount_type: normalized.discount_type,
        value: normalized.value,
        valid_from: normalized.valid_from,
        valid_to: normalized.valid_to,
        min_quantity: normalized.min_quantity && normalized.min_quantity > 0 ? normalized.min_quantity : null,
        is_active: normalized.is_active,
      };

      const res = await request(endpoint, { method, data: dataToSend });
      const status: number = res.status;
      const data: any = (res as any).data;

      if (status === 200 || status === 201) {
        enqueueSnackbar('Купон успешно сохранен', { variant: 'success' });

        const id = data?.id ?? inputsData?.id;
        if (!id) {
          console.log('Нет id для навигации');
          return data;
        }

        setTimeout(() => {
          router.push(`/coupons`);
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

  if (loading) {
    return <Box>Загрузка...</Box>;
  }

  return (
    <Box className="modalViewDetail-block">
      <Grid className="modalViewDetail-head">
        <Typography variant="h4">Купон</Typography>
        {mode == 'view' ? (
          <Stack direction="row" spacing={1}>
            <IconButton
              size="medium"
              color="default"
              onClick={() =>
                router.push(`/coupons/${inputsData?.id}/edit`)
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
                onClick={() => router.push(`/coupons`)}
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
          <Typography variant="body2">Хранилище *</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="storage"
              value={inputsData?.storage}
              fieldType="select"
              setInputsData={setInputsData}
              sectionPaths={['storage']}
              selectValues={storages}
              fieldsError={fieldsError?.storage}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="body2">Продукт</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="product"
              value={inputsData?.product || 0}
              fieldType="select"
              setInputsData={setInputsData}
              sectionPaths={['product']}
              selectValues={[{ id: 0, name: 'Все продукты' }, ...products]}
              fieldsError={fieldsError?.product}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="body2">Тип скидки *</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="discount_type"
              value={inputsData?.discount_type}
              fieldType="select"
              setInputsData={setInputsData}
              sectionPaths={['discount_type']}
              selectValues={discountTypes}
              fieldsError={fieldsError?.discount_type}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="body2">Размер скидки *</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="value"
              value={inputsData?.value}
              fieldType="number"
              setInputsData={setInputsData}
              sectionPaths={['value']}
              fieldsError={fieldsError?.value}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="body2">Дата начала действия *</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="valid_from"
              value={inputsData?.valid_from}
              fieldType="date"
              setInputsData={setInputsData}
              sectionPaths={['valid_from']}
              fieldsError={fieldsError?.valid_from}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="body2">Дата окончания действия *</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="valid_to"
              value={inputsData?.valid_to}
              fieldType="date"
              setInputsData={setInputsData}
              sectionPaths={['valid_to']}
              fieldsError={fieldsError?.valid_to}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="body2">Мин. кол-во в чеке для применения скидки</Typography>
          <Box>
            <ElementViewerDetail
              mode={mode}
              name="min_quantity"
              value={inputsData?.min_quantity}
              fieldType="number"
              setInputsData={setInputsData}
              sectionPaths={['min_quantity']}
              fieldsError={fieldsError?.min_quantity}
              setFieldsError={setFieldsError}
            />
          </Box>
        </Box>

        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={inputsData?.is_active ?? false}
                onChange={(e) =>
                  setInputsData((prev) => ({
                    ...prev,
                    is_active: e.target.checked,
                  }))
                }
                disabled={mode === 'view'}
              />
            }
            label="Активен"
          />
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
