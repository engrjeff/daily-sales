'use client';

import { useStoreId } from '@/features/store/hooks';
import { apiClient } from '@/lib/api-client';
import { OrderLineItem } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

export type KPIData = {
  sales: {
    today: number;
    todayFormatted: string;
    yesterday: number;
    yesterdayFormatted: string;
    trend: 'equal' | 'up' | 'down';
    percentDiff: number;
  };
  orders: {
    today: number;
    yesterday: number;
    trend: 'equal' | 'up' | 'down';
    percentDiff: number;
    orderItemsCount: number;
    yesterdayOrderItemsCount: number;
  };
  discount: {
    ordersCount: number;
    total: number;
    totalFormatted: string;
  };
  bestSeller: OrderLineItem & {
    orderCount: number;
    attributes: {
      id: string;
      key: string;
      value: string;
      orderLineItemId: string;
    }[];
  };
  topProducts: Array<
    OrderLineItem & {
      attributes: {
        id: string;
        key: string;
        value: string;
        orderLineItemId: string;
      }[];
    }
  >;
};

async function getKPIs(storeId: string) {
  const response = await apiClient.get<KPIData>(
    `/stores/${storeId}/insights/kpi`
  );

  return response.data;
}

export function useKPIs() {
  const storeId = useStoreId();

  return useQuery({
    queryKey: [storeId, 'kpis'],
    queryFn: () => getKPIs(storeId),
    refetchOnWindowFocus: false,
  });
}
