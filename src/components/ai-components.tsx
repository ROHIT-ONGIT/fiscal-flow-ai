"use client"

import { lazy, Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

// Lazy load AI components only when needed to reduce bundle size
export const LazyAIBudgetingClient = lazy(() => 
  import('@/app/(main)/budgeting/client').then(module => ({ default: module.BudgetingClient }))
)

export const LazyAIForecastingClient = lazy(() => 
  import('@/app/(main)/forecasting/client').then(module => ({ default: module.ForecastingClient }))
)

export const LazyAIInvestmentsClient = lazy(() => 
  import('@/app/(main)/investments/client').then(module => ({ default: module.InvestmentsClient }))
)

export const LazyAIDebtCalculatorClient = lazy(() => 
  import('@/app/(main)/debt-calculator/client').then(module => ({ default: module.DebtCalculatorClient }))
)

// Wrapper component with loading fallback
export function AIComponentWrapper({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode 
}) {
  return (
    <Suspense fallback={fallback || <Skeleton className="h-96 w-full" />}>
      {children}
    </Suspense>
  )
}
