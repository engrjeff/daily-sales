"use client"

import { useStoreId } from "@/features/store/hooks"
import { Category } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"

async function getCategories(storeId: string) {
  const response = await apiClient.get<Category[]>(
    `/stores/${storeId}/categories`
  )

  return response.data
}

export function useCategories() {
  const storeId = useStoreId()

  return useQuery({
    queryKey: [storeId, "categories"],
    queryFn: () => getCategories(storeId),
    refetchOnWindowFocus: false,
  })
}
