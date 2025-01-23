'use client';

import { useStoreId } from '@/features/store/hooks';
import { apiClient } from '@/lib/api-client';
import { Discount } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

async function getDiscounts(storeId: string) {
  const response = await apiClient.get<Discount[]>(
    `/stores/${storeId}/discounts`
  );

  return response.data;
}

export function useDiscounts() {
  const storeId = useStoreId();

  return useQuery({
    queryKey: [storeId, 'discounts'],
    queryFn: () => getDiscounts(storeId),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}
