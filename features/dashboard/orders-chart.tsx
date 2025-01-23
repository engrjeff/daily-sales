'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { Button, buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCurrentStore } from '@/hooks/use-current-store';
import { cn, formatCurrency, toCompact } from '@/lib/utils';
import {
  ChartNoAxesColumnIncreasingIcon,
  ChevronRightIcon,
  SparklesIcon,
} from 'lucide-react';
import Link from 'next/link';
import { RangePresetFilter } from '../order/range-preset-filters';

const chartData = [
  { month: 'January', orders: 186 },
  { month: 'February', orders: 305 },
  { month: 'March', orders: 237 },
  { month: 'April', orders: 73 },
  { month: 'May', orders: 209 },
  { month: 'June', orders: 214 },
  { month: 'July', orders: 220 },
  { month: 'August', orders: 176 },
  { month: 'September', orders: 120 },
  { month: 'October', orders: 150 },
  { month: 'November', orders: 98 },
  { month: 'December', orders: 180 },
];

const chartConfig = {
  desktop: {
    label: 'Orders',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function OrdersChart() {
  const barWidth =
    chartData.length === 12 ? 20 : 20 * (1 + chartData.length / 3);

  return (
    <Card className="bg-muted/80 border-neutral-800">
      <CardHeader className="flex-row items-start justify-between space-y-0 border-b border-neutral-800">
        <div>
          <CardTitle>Orders</CardTitle>
          <CardDescription>January - December 2024</CardDescription>
        </div>
        <div>
          <RangePresetFilter />
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-[1fr,320px] gap-4 pb-0 pr-0">
        <ChartContainer config={chartConfig} className="py-6">
          <BarChart accessibilityLayer data={chartData} margin={{ left: -20 }}>
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <YAxis
              dataKey="orders"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="orders"
              fill="var(--color-desktop)"
              radius={4}
              barSize={barWidth}
            />
          </BarChart>
        </ChartContainer>

        {/* aside */}
        <StoreGoalsMetrics />
      </CardContent>
    </Card>
  );
}

function StoreGoalsMetrics() {
  const storeQuery = useCurrentStore();

  if (storeQuery.isLoading)
    return (
      <Skeleton className="bg-muted h-full w-[320px] max-w-xs shrink-0 animate-pulse border-l" />
    );

  const store = storeQuery.data?.store;

  const salesGoalValue = store?.salesGoalValue ?? 0;
  const ordersGoalValue = store?.ordersGoalValue ?? 0;

  return (
    <div className="h-full w-[320px] max-w-xs shrink-0 border-l">
      <Tabs defaultValue="sales" className="flex size-full flex-col">
        <TabsList className="h-auto w-full max-w-full justify-start gap-2 overflow-x-auto overflow-y-hidden rounded-none border-b border-neutral-800 bg-transparent p-2">
          <TabsTrigger
            value="sales"
            className="data-[state=active]:border-foreground rounded-md border-transparent px-2 py-1.5 hover:bg-neutral-800 data-[state=active]:bg-neutral-800"
          >
            Sales
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="data-[state=active]:border-foreground rounded-md border-transparent px-2 py-1.5 hover:bg-neutral-800 data-[state=active]:bg-neutral-800"
          >
            Orders
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="sales"
          className="mt-0 flex flex-1 flex-col gap-2 p-4 empty:hidden"
        >
          {!salesGoalValue ? (
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <p className="text-muted-foreground text-center text-sm">
                No goal for Sales was set.
              </p>

              <Link
                href={`/${store?.id}/settings?tab=goals`}
                className={buttonVariants({ size: 'sm' })}
              >
                Set Goal Now
              </Link>
            </div>
          ) : (
            <>
              <p className="text-xl font-bold">{formatCurrency(10500)}</p>

              <div className="flex w-full items-center [&>*]:h-2">
                <div
                  className="relative flex h-2 w-full items-center rounded-full bg-green-100 dark:bg-green-500/30"
                  aria-label="progress bar"
                  aria-valuenow={10500}
                  aria-valuemax={salesGoalValue}
                >
                  <div
                    className="h-full flex-col rounded-full bg-green-600 dark:bg-green-500"
                    style={{
                      width: `${(10500 / salesGoalValue) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="mt-1 flex justify-between">
                <span className="text-muted-foreground font-mono text-xs">
                  0.00
                </span>
                <span className="text-muted-foreground font-mono text-xs">
                  {formatCurrency(salesGoalValue, true)}
                </span>
              </div>

              <p className="text-muted-foreground text-sm">
                In terms of sales, this is your progress towards your goal.
              </p>
              <div className="-ml-3 mt-auto flex flex-col gap-1">
                <Button variant="ghost" className="justify-start">
                  <SparklesIcon
                    size={16}
                    className="text-green-500"
                    aria-hidden="true"
                  />{' '}
                  Show highlights{' '}
                  <ChevronRightIcon size={16} className="ml-auto size-4" />
                </Button>
                <Link
                  href={`/${store?.id}/sales`}
                  className={cn(
                    buttonVariants({ size: 'sm', variant: 'ghost' }),
                    'justify-start'
                  )}
                >
                  <ChartNoAxesColumnIncreasingIcon
                    size={16}
                    className="text-green-500"
                    aria-hidden="true"
                  />{' '}
                  Show all sales
                  <ChevronRightIcon size={16} className="ml-auto size-4" />
                </Link>
              </div>
            </>
          )}
        </TabsContent>
        <TabsContent
          value="orders"
          className="mt-0 flex flex-1 flex-col gap-2 p-4 empty:hidden"
        >
          {!ordersGoalValue ? (
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <p className="text-muted-foreground text-center text-sm">
                No goal for Orders was set.
              </p>

              <Link
                href={`/${store?.id}/settings?tab=goals`}
                className={buttonVariants({ size: 'sm' })}
              >
                Set Goal Now
              </Link>
            </div>
          ) : (
            <>
              <p className="text-xl font-bold">{5200}</p>

              <div className="flex w-full items-center [&>*]:h-2">
                <div
                  className="relative flex h-2 w-full items-center rounded-full bg-orange-100 dark:bg-orange-500/30"
                  aria-label="progress bar"
                  aria-valuenow={5200}
                  aria-valuemax={ordersGoalValue}
                >
                  <div
                    className="h-full flex-col rounded-full bg-orange-600 dark:bg-orange-500"
                    style={{
                      width: `${(5200 / ordersGoalValue) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="mt-1 flex justify-between">
                <span className="text-muted-foreground font-mono text-xs">
                  0.00
                </span>
                <span className="text-muted-foreground font-mono text-xs">
                  {toCompact(ordersGoalValue)}
                </span>
              </div>

              <p className="text-muted-foreground text-sm">
                In terms of orders, this is your progress towards your goal.
              </p>
              <div className="-ml-3 mt-auto flex flex-col gap-1">
                <Button variant="ghost" className="justify-start">
                  <SparklesIcon
                    size={16}
                    className="text-orange-500"
                    aria-hidden="true"
                  />{' '}
                  Show highlights{' '}
                  <ChevronRightIcon size={16} className="ml-auto size-4" />
                </Button>
                <Link
                  href={`/${store?.id}/orders`}
                  className={cn(
                    buttonVariants({ size: 'sm', variant: 'ghost' }),
                    'justify-start'
                  )}
                >
                  <ChartNoAxesColumnIncreasingIcon
                    size={16}
                    className="text-orange-500"
                    aria-hidden="true"
                  />{' '}
                  Show all orders
                  <ChevronRightIcon size={16} className="ml-auto size-4" />
                </Link>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
