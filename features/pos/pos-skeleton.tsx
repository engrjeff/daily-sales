import { Skeleton } from "@/components/ui/skeleton"

export function POSSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex w-max items-center gap-3">
        <Skeleton className="bg-secondary h-8 w-10 rounded-full border" />
        <Skeleton className="bg-secondary h-8 w-16 rounded-full border" />
        <Skeleton className="bg-secondary h-8 w-16 rounded-full border" />
        <Skeleton className="bg-secondary h-8 w-16 rounded-full border" />
        <Skeleton className="bg-secondary h-8 w-16 rounded-full border" />
      </div>

      <div className="flex items-start">
        <div className="h-[85vh] flex-1 overflow-hidden rounded-lg pr-4">
          <div className="grid grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))] gap-3">
            {[1, 2, 3, 4, 5, 6].map((v) => (
              <Skeleton key={v} className="bg-secondary aspect-square w-full" />
            ))}
          </div>
        </div>

        <Skeleton className="bg-secondary sticky top-0 size-full max-w-sm shrink-0 rounded-lg" />
      </div>
    </div>
  )
}
