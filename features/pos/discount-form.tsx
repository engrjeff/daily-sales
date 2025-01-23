'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDiscounts } from '@/hooks/use-discounts';
import { Discount } from '@prisma/client';
import { useState } from 'react';

export type DiscountValue = Pick<
  Discount,
  'discountAmount' | 'discountCode' | 'id'
>;

export function DiscountForm({
  value,
  onValueChange,
}: {
  value: DiscountValue;
  onValueChange: (value: DiscountValue) => void;
}) {
  const discountsQuery = useDiscounts();

  const [discountCode, setDiscountCode] = useState(value.discountCode);
  const [isValid, setIsValid] = useState<boolean | 'indeterminate'>(
    'indeterminate'
  );

  function applyDiscount() {
    const found = discountsQuery.data?.find(
      (d) => d.discountCode === discountCode && d.isValid
    );

    setIsValid(Boolean(found));

    if (found) {
      onValueChange({
        discountCode: found.discountCode,
        discountAmount: found.discountAmount * -1,
        id: found.id,
      });
    }
  }

  function clearDiscount() {
    setIsValid('indeterminate');
    setDiscountCode('');
    onValueChange({
      discountCode: '',
      discountAmount: 0,
      id: '',
    });
  }

  return (
    <>
      <fieldset
        disabled={discountsQuery.isLoading}
        className="flex items-center gap-3 disabled:cursor-not-allowed disabled:opacity-90"
        onChange={() => setIsValid('indeterminate')}
      >
        <Input
          placeholder="Enter discount code"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.currentTarget.value)}
          aria-describedby={!isValid ? 'discount-code-error' : undefined}
          disabled={isValid === true}
          className="bg-muted border-border"
        />
        {isValid === true ? (
          <Button type="button" size="sm" onClick={clearDiscount}>
            Remove
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            disabled={!discountCode}
            onClick={applyDiscount}
          >
            Apply
          </Button>
        )}
      </fieldset>

      {!isValid && (
        <em
          id="discount-code-error"
          className="mt-2 inline-block text-sm not-italic text-red-500"
        >
          Invalid discount code.
        </em>
      )}
      {isValid === true && (
        <em
          id="discount-code-error"
          className="mt-2 inline-block text-sm not-italic text-green-500"
        >
          Discount applied.
        </em>
      )}
    </>
  );
}
