"use client"

import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"

// Simple lazy wrapper for chart components
export const LazyChartWrapper = ({ children, fallback }: { 
  children: React.ReactNode
  fallback?: React.ReactNode 
}) => (
  <React.Suspense fallback={fallback || <Skeleton className="h-[350px] w-full" />}>
    {children}
  </React.Suspense>
)
