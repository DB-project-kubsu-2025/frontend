import { NextResponse } from 'next/server';
import dictsApi from '@/shared/dictsApi';

export async function GET() {
  try {
    const [
      couponsDiscountsTypes,
      movementsTypes,
      priceListsBases,
      priceListsTypes,
      stockTakesTypes,
      storagesSpacesTypes,
      storagesTypes,
      writeoffsReasons,
      paymentMethods,
      categories,
      units,
    ] = await Promise.all([
      dictsApi.getCouponsDiscountsTypes(),
      dictsApi.getMovementsTypes(),
      dictsApi.getPriceListsBases(),
      dictsApi.getPriceListsTypes(),
      dictsApi.getStockTakesTypes(),
      dictsApi.getStoragesSpacesTypes(),
      dictsApi.getStoragesTypes(),
      dictsApi.getWriteoffsReasons(),
      dictsApi.getPaymentMethods(),
      dictsApi.getCategories(),
      dictsApi.getUnits(),
    ]);
    
    return NextResponse.json({
      couponsDiscountsTypes,
      movementsTypes,
      priceListsBases,
      priceListsTypes,
      stockTakesTypes,
      storagesSpacesTypes,
      storagesTypes,
      writeoffsReasons,
      paymentMethods,
      categories,
      units,
    });
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message || 'Failed to load dicts' },
      { status: 500 },
    );
  }
}
