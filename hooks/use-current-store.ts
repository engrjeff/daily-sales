'use client';

import { useStoreId } from '@/features/store/hooks';
import { apiClient } from '@/lib/api-client';
import { Store } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

async function getStore(storeId: string) {
  const response = await apiClient.get<{ store: Store | null }>(
    `/stores/${storeId}`
  );

  return response.data;
}

export function useCurrentStore() {
  const storeId = useStoreId();

  return useQuery({
    queryKey: [storeId, 'store'],
    queryFn: () => getStore(storeId),
  });
}
