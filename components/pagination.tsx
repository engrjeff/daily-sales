'use client';

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import { PageInfo } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import { parseAsInteger, useQueryState } from 'nuqs';

export function Pagination({ pageInfo }: { pageInfo: PageInfo }) {
  const [page, setPage] = usePageState(pageInfo.page);

  if (pageInfo.total === 0) return null;

  const start = (pageInfo.page - 1) * pageInfo.pageSize + 1;
  const end = start + pageInfo.itemCount - 1;

  return (
    <div className="flex items-center justify-between">
      <div className="text-muted-foreground flex-1 text-sm">
        Showing{' '}
        <span className="text-foreground">
          {start}-{end}
        </span>{' '}
        of <span className="text-foreground">{pageInfo.total}</span>{' '}
        {pageInfo.total > 1 ? 'items' : 'item'}.
      </div>

      {pageInfo.totalPages > 1 ? (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            disabled={!pageInfo.page || pageInfo.page === 1}
            onClick={() => setPage(1)}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            disabled={!pageInfo.page || pageInfo.page === 1}
            onClick={() => setPage(page - 1)}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            disabled={pageInfo.page === pageInfo.totalPages}
            onClick={() => setPage(page + 1)}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            disabled={pageInfo.page === pageInfo.totalPages}
            onClick={() => setPage(pageInfo.totalPages)}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function usePageState(initialPage?: number) {
  const searchParams = useSearchParams();

  const pageQuery = searchParams.get('page');

  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger
      .withDefault(
        initialPage ? initialPage : pageQuery ? Number(pageQuery) : 1
      )
      .withOptions({ shallow: false })
  );

  return [page, setPage] as const;
}
