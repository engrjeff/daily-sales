import { Category } from "@prisma/client"
import { clsx, type ClassValue } from "clsx"
import {
  endOfMonth,
  endOfToday,
  endOfWeek,
  endOfYear,
  endOfYesterday,
  startOfMonth,
  startOfToday,
  startOfWeek,
  startOfYear,
  startOfYesterday,
  subDays,
  subMonths,
  subYears,
} from "date-fns"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(inputStr: string) {
  return inputStr
    .split(" ")
    .map((s) => s.at(0))
    .join("")
}

export const formatCurrency = (amount: number, compact?: boolean) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
    notation: compact ? "compact" : undefined,
  }).format(amount)
}

export const toCompact = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
  }).format(amount)
}

export function getPriceRange(prices: number[]) {
  const min = Math.min(...prices)
  const max = Math.max(...prices)

  if (min === max) return formatCurrency(min)

  return `${formatCurrency(min)} - ${formatCurrency(max)}`
}

export function getUniqueCategoriesFromProducts(categories: Category[]) {
  const uniqueCategories = Array.from(
    new Map(categories.map((c) => [c.id, c])).values()
  )

  return uniqueCategories
}

export function generateOrderNumber() {
  return (
    new Date().toLocaleDateString().replaceAll("/", "") +
    Date.now().toString(36).toUpperCase()
  )
}

export function formatDate(dateString: number | string | Date) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export type DateRangePreset =
  | "today"
  | "yesterday"
  | "this_week"
  | "this_month"
  | "this_year"
  | "last_week"
  | "last_month"
  | "last_year"

export function getDateRange(preset: DateRangePreset): {
  start: Date
  end: Date
} {
  const now = new Date()

  if (preset === "last_year") {
    return {
      start: startOfYear(subYears(now, 1)),
      end: endOfYear(subYears(now, 1)),
    }
  }

  if (preset === "this_week") {
    return {
      start: startOfWeek(now, { weekStartsOn: 1 }),
      end: endOfWeek(now, { weekStartsOn: 1 }),
    }
  }

  if (preset === "last_week") {
    return {
      start: subDays(startOfWeek(now, { weekStartsOn: 1 }), 7),
      end: subDays(endOfWeek(now, { weekStartsOn: 1 }), 7),
    }
  }

  if (preset === "this_month") {
    return {
      start: startOfMonth(now),
      end: endOfMonth(now),
    }
  }

  if (preset === "last_month") {
    return {
      start: startOfMonth(subMonths(now, 1)),
      end: endOfMonth(subMonths(now, 1)),
    }
  }

  if (preset === "this_year") {
    return {
      start: startOfYear(now),
      end: endOfYear(now),
    }
  }

  if (preset === "yesterday") {
    return {
      start: startOfYesterday(),
      end: endOfYesterday(),
    }
  }

  return {
    start: startOfToday(),
    end: endOfToday(),
  }
}

export function calcPercentDiff(v1: number, v2: number) {
  return (Math.abs(v1 - v2) / v2) * 100
}

export function getSkip({ limit, page }: { limit?: number; page?: number }) {
  const _limit = limit ?? 12
  const _page = page ?? 1

  return _limit * (_page - 1)
}
