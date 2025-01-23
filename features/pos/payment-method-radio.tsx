import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BanIcon, BanknoteIcon, WalletIcon } from 'lucide-react';

export function PaymentMethodRadio({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <div className="pt-4">
      <p className="mb-2 text-sm font-medium">Payment Method</p>
      <RadioGroup
        className="grid-cols-3"
        defaultValue="unpaid"
        value={value}
        onValueChange={onValueChange}
      >
        <label className="bg-background/60 border-input has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-background has-[:focus-visible]:outline-primary/70 relative flex cursor-pointer flex-col items-center gap-3 rounded-lg border px-2 py-3 text-center shadow-sm shadow-black/5 outline-offset-2 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2">
          <RadioGroupItem
            id="radio-unpaid"
            value="unpaid"
            className="sr-only after:absolute after:inset-0"
          />
          <BanIcon size={20} aria-hidden="true" className="text-red-500" />
          <p className="text-foreground text-xs font-medium leading-none">
            Unpaid
          </p>
        </label>
        <label className="bg-background/60 border-input has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-background has-[:focus-visible]:outline-primary/70 relative flex cursor-pointer flex-col items-center gap-3 rounded-lg border px-2 py-3 text-center shadow-sm shadow-black/5 outline-offset-2 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2">
          <RadioGroupItem
            id="radio-cash"
            value="cash"
            className="sr-only after:absolute after:inset-0"
          />
          <BanknoteIcon
            size={20}
            aria-hidden="true"
            className="text-green-500"
          />
          <p className="text-foreground text-xs font-medium leading-none">
            Cash
          </p>
        </label>
        <label className="bg-background/60 border-input has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-background has-[:focus-visible]:outline-primary/70 relative flex cursor-pointer flex-col items-center gap-3 rounded-lg border px-2 py-3 text-center shadow-sm shadow-black/5 outline-offset-2 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2">
          <RadioGroupItem
            id="radio-gcash"
            value="gcash"
            className="sr-only after:absolute after:inset-0"
          />
          <WalletIcon size={20} aria-hidden="true" className="text-blue-500" />
          <p className="text-foreground text-xs font-medium leading-none">
            GCash
          </p>
        </label>
      </RadioGroup>
    </div>
  );
}
