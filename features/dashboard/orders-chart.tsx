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

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, toCompact } from '@/lib/utils';
import {
  ChartNoAxesColumnIncreasingIcon,
  ChevronRightIcon,
  SparklesIcon,
} from 'lucide-react';
import { OrdersRangeFilter } from './orders-range-filter';

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
      <CardHeader className="border-b border-neutral-800 flex-row justify-between space-y-0 items-start">
        <div>
          <CardTitle>Orders</CardTitle>
          <CardDescription>January - December 2024</CardDescription>
        </div>
        <div>
          <OrdersRangeFilter />
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-[1fr,320px] gap-4 pr-0 pb-0">
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
        <div className="max-w-xs w-[320px] shrink-0 border-l border-neutral-800 h-full">
          <Tabs defaultValue="sales" className="h-full w-full flex flex-col">
            <TabsList className="h-auto w-full gap-2 max-w-full py-2 justify-start overflow-x-auto overflow-y-hidden rounded-none border-b border-neutral-800 bg-transparent px-2">
              <TabsTrigger
                value="sales"
                className="border-transparent py-1.5 px-2 hover:bg-neutral-800 data-[state=active]:bg-neutral-800 rounded-md data-[state=active]:border-foreground"
              >
                Sales
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="border-transparent py-1.5 px-2 hover:bg-neutral-800 data-[state=active]:bg-neutral-800 rounded-md data-[state=active]:border-foreground"
              >
                Orders
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="sales"
              className="p-4 mt-0 flex flex-col gap-2 flex-1 empty:hidden"
            >
              <p className="text-xl font-bold">{formatCurrency(10500)}</p>

              <div className="flex w-full items-center [&>*]:h-2">
                <div
                  className="relative flex h-2 w-full items-center rounded-full bg-green-100 dark:bg-green-500/30"
                  aria-label="progress bar"
                  aria-valuenow={10500}
                  aria-valuemax={15000}
                >
                  <div
                    className="h-full flex-col rounded-full bg-green-600 dark:bg-green-500"
                    style={{
                      width: `${(10500 / 15000) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="mt-1 flex justify-between">
                <span className="text-xs font-mono text-muted-foreground">
                  0.00
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  {formatCurrency(15000, true)}
                </span>
              </div>

              <p className="text-sm text-muted-foreground">
                In terms of sales, this is your progress towards your goal.
              </p>
              <div className="mt-auto -ml-3 flex flex-col gap-1">
                <Button variant="ghost" className="justify-start">
                  <SparklesIcon
                    size={16}
                    className="text-green-500"
                    aria-hidden="true"
                  />{' '}
                  Show highlights{' '}
                  <ChevronRightIcon size={16} className="size-4 ml-auto" />
                </Button>
                <Button variant="ghost" className="justify-start">
                  <ChartNoAxesColumnIncreasingIcon
                    size={16}
                    className="text-green-500"
                    aria-hidden="true"
                  />{' '}
                  Show all sales
                  <ChevronRightIcon size={16} className="size-4 ml-auto" />
                </Button>
              </div>
            </TabsContent>
            <TabsContent
              value="orders"
              className="p-4 mt-0 flex flex-col gap-2 flex-1 empty:hidden"
            >
              <p className="text-xl font-bold">{5200}</p>

              <div className="flex w-full items-center [&>*]:h-2">
                <div
                  className="relative flex h-2 w-full items-center rounded-full bg-orange-100 dark:bg-orange-500/30"
                  aria-label="progress bar"
                  aria-valuenow={5200}
                  aria-valuemax={8000}
                >
                  <div
                    className="h-full flex-col rounded-full bg-orange-600 dark:bg-orange-500"
                    style={{
                      width: `${(5200 / 8000) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="mt-1 flex justify-between">
                <span className="text-xs font-mono text-muted-foreground">
                  0.00
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  {toCompact(8200)}
                </span>
              </div>

              <p className="text-sm text-muted-foreground">
                In terms of orders, this is your progress towards your goal.
              </p>
              <div className="mt-auto -ml-3 flex flex-col gap-1">
                <Button variant="ghost" className="justify-start">
                  <SparklesIcon
                    size={16}
                    className="text-orange-500"
                    aria-hidden="true"
                  />{' '}
                  Show highlights{' '}
                  <ChevronRightIcon size={16} className="size-4 ml-auto" />
                </Button>
                <Button variant="ghost" className="justify-start">
                  <ChartNoAxesColumnIncreasingIcon
                    size={16}
                    className="text-orange-500"
                    aria-hidden="true"
                  />{' '}
                  Show all orders
                  <ChevronRightIcon size={16} className="size-4 ml-auto" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}