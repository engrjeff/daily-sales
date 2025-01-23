import { ScrollArea } from '@/components/ui/scroll-area';
import { ProductItem } from '@/hooks/use-products';
import { POSProductCard } from './pos-product-card';

export function POSProducts({ products }: { products: ProductItem[] }) {
  return (
    <ScrollArea className="h-[85vh] flex-1 rounded-lg pr-4">
      {/* <ul className="grid gap-3 grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))]"> */}
      <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
        {products?.map((product) => (
          <li key={`pos-product-${product.id}`}>
            <POSProductCard product={product} />
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}
