'use client';

import { useStoreId } from '@/features/store/hooks';
import { apiClient } from '@/lib/api-client';
import {
  Attribute,
  AttributeValue,
  Category,
  Product,
  ProductAttributeValue,
  ProductVariant,
} from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

export interface ProductItem extends Product {
  category: Category;
  attributes: Array<Attribute & { values: AttributeValue[] }>;
  variants: Array<
    ProductVariant & {
      productAttributeValues: Array<
        ProductAttributeValue & {
          attributeValue: AttributeValue & {
            attribute: Attribute;
          };
        }
      >;
    }
  >;
}

async function getProducts(storeId: string) {
  const response = await apiClient.get<ProductItem[]>(
    `/stores/${storeId}/products`
  );

  return response.data;
}

export function useProducts() {
  const storeId = useStoreId();

  return useQuery({
    queryKey: [storeId, 'products'],
    queryFn: () => getProducts(storeId),
  });
}
