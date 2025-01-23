'use client';

import { useParams } from 'next/navigation';

export function useStoreId() {
  const params = useParams<{ storeId: string }>();

  return params.storeId;
}
