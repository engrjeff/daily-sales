import { EmptyView } from '@/components/empty-view';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { getDiscounts } from '../store/queries';
import { DiscountForm } from './discount-form';

export async function DiscountsTable({ storeId }: { storeId: string }) {
  const discounts = await getDiscounts(storeId);

  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Discounts</p>
          <p className="text-muted-foreground text-sm">
            Set store discount codes.
          </p>
        </div>
        <DiscountForm />
      </div>
      <Table containerClass="border rounded-lg flex-nonel">
        <TableHeader>
          <TableRow>
            <TableHead className="w-9 text-center">#</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="text-center">Is active?</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!discounts.length ? (
            <TableRow>
              <TableCell colSpan={5} className="p-0">
                <EmptyView />
              </TableCell>
            </TableRow>
          ) : (
            discounts.map((code, n) => (
              <TableRow key={`discount-${code.id}`}>
                <TableCell className="text-center">{n + 1}</TableCell>
                <TableCell>
                  <Badge className="font-mono">{code.discountCode}</Badge>
                </TableCell>
                <TableCell>{formatCurrency(code.discountAmount)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center space-x-2">
                    <Switch
                      id="discount-active"
                      className="data-[state=unchecked]:bg-border"
                      defaultChecked={code.isValid}
                    />
                    <Label htmlFor="discount-active" className="sr-only">
                      Is valid?
                    </Label>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Button size="sm" variant="link" className="text-blue-500">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}
