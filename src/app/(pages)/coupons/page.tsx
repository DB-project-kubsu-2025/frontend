import { apiFetch } from '@/utils/apiFetch';
import CouponsClient from './client';

export default async function CouponsPage() {
  try {
    console.log('[CouponsPage] Starting to fetch coupons...');
    const res: any = await apiFetch('/shops/coupons/');
    
    console.log('[CouponsPage] API response received:', {
      type: typeof res,
      isArray: Array.isArray(res),
      keys: res ? Object.keys(res) : null,
      length: Array.isArray(res) ? res.length : null,
      firstItem: Array.isArray(res) && res.length > 0 ? res[0] : null,
    });
    
    let couponsData: any[] = [];
    
    if (Array.isArray(res)) {
      couponsData = res;
      console.log('[CouponsPage] Response is array, using directly. Count:', couponsData.length);
    } else if (res && Array.isArray(res.results)) {
      couponsData = res.results;
      console.log('[CouponsPage] Response has results array. Count:', couponsData.length);
    } else if (res && Array.isArray(res.data)) {
      couponsData = res.data;
      console.log('[CouponsPage] Response has data array. Count:', couponsData.length);
    } else {
      console.warn('[CouponsPage] Unexpected response format:', res);
      couponsData = [];
    }
    
    console.log('[CouponsPage] Final couponsData count:', couponsData.length);
    
    return <CouponsClient initData={couponsData} />;
  } catch (error: any) {
    console.error('[CouponsPage] Error fetching coupons:', error);
    console.error('[CouponsPage] Error details:', {
      message: error?.message,
      status: error?.status,
      response: error?.response,
      stack: error?.stack,
    });
    const errorMessage = error?.message || 'Неизвестная ошибка';
    const errorStatus = error?.status;
    
    return (
      <div style={{ padding: '20px' }}>
        {errorStatus === 403 && (
          <div style={{ 
            padding: '15px', 
            marginBottom: '20px', 
            backgroundColor: '#fff3cd', 
            border: '1px solid #ffc107',
            borderRadius: '4px'
          }}>
            <strong>Ошибка доступа:</strong> У вас нет прав для просмотра купонов. 
            Требуется группа main_office_group.
          </div>
        )}
        {errorStatus === 401 && (
          <div style={{ 
            padding: '15px', 
            marginBottom: '20px', 
            backgroundColor: '#f8d7da', 
            border: '1px solid #dc3545',
            borderRadius: '4px'
          }}>
            <strong>Ошибка авторизации:</strong> Пожалуйста, войдите в систему.
          </div>
        )}
        {errorStatus && errorStatus !== 403 && errorStatus !== 401 && (
          <div style={{ 
            padding: '15px', 
            marginBottom: '20px', 
            backgroundColor: '#f8d7da', 
            border: '1px solid #dc3545',
            borderRadius: '4px'
          }}>
            <strong>Ошибка загрузки:</strong> {errorMessage}
          </div>
        )}
        <CouponsClient initData={[]} />
      </div>
    );
  }
}
