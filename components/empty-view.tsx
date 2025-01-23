import { ChartNoAxesColumn } from 'lucide-react';

export function EmptyView({ entity = 'data' }: { entity?: string }) {
  return (
    <div className="flex h-[300px] flex-col items-center justify-center gap-3">
      <div className="text-muted-foreground flex">
        <ChartNoAxesColumn size={24} />
        <ChartNoAxesColumn size={24} className="-ml-1.5" />
      </div>
      <p className="text-foreground text-center text-base font-semibold">
        No {entity}
      </p>
      <p className="text-muted-foreground text-center text-sm">
        No {entity} here yet. New and existing data will be displayed here.
      </p>
    </div>
  );
}
