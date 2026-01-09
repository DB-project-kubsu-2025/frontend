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
      storages,
      products,
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
      dictsApi.getStorages(),
      dictsApi.getProducts(),
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
      storages,
      products,
    });
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message || 'Failed to load dicts' },
      { status: 500 },
    );
  }
}
