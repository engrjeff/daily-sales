'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { SheetClose } from '@/components/ui/sheet';
import { useProducts } from '@/hooks/use-products';

import { ClientSearchField } from '@/components/ui/client-search-field';
import { getUniqueCategoriesFromProducts } from '@/lib/utils';
import { useState } from 'react';
import { OrderSummary } from './order-summary';
import { POSProducts } from './pos-products';
import { POSSkeleton } from './pos-skeleton';

export function POS() {
  const [selectedCategory, setSelectedCategory] = useState<string>();

  const [searchQuery, setSearchQuery] = useState('');

  const productsQuery = useProducts();

  if (productsQuery.isLoading) return <POSSkeleton />;

  const categories = getUniqueCategoriesFromProducts(
    productsQuery.data?.map((c) => c.category) ?? []
  );

  let productsToDisplay = selectedCategory
    ? productsQuery.data?.filter((p) => p.categoryId === selectedCategory)
    : productsQuery.data;

  productsToDisplay = searchQuery
    ? productsToDisplay?.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : productsToDisplay;

  return (
    <div className="p-4 flex flex-col gap-4">
      <SheetClose asChild>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="absolute top-1 right-1 hover:bg-secondary z-10"
        >
          Close
        </Button>
      </SheetClose>
      <ScrollArea className="max-w-full">
        <div className="flex w-max items-center gap-3 p-0.5">
          <Button
            variant={selectedCategory === undefined ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
            onClick={() => setSelectedCategory(undefined)}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={`pos-category-${category.id}`}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              className="rounded-full"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}

          <ClientSearchField
            className="rounded-full"
            placeholder="Search products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            onClearClick={() => setSearchQuery('')}
            autoComplete="off"
            name="pos products search"
            aria-label="Search Products"
          />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="flex items-start">
        <POSProducts products={productsToDisplay ?? []} />
        <OrderSummary />
      </div>
    </div>
  );
}