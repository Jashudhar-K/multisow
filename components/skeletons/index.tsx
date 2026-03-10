'use client'
import { cn } from '@/lib/index'
import type { CSSProperties } from 'react'

// ---------------------------------------------------------------------------
// Base pulse block
// ---------------------------------------------------------------------------
function Pulse({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div
      style={style}
      className={cn(
        'rounded-lg bg-white/5 animate-pulse',
        className
      )}
    />
  )
}

// ---------------------------------------------------------------------------
// Designer left-panel skeleton
// ---------------------------------------------------------------------------
export function DesignerSkeleton() {
  return (
    <div className="flex h-screen w-full bg-[#0A0F0A]">
      {/* Left panel */}
      <div className="w-80 border-r border-white/10 p-4 space-y-4 shrink-0">
        <Pulse className="h-8 w-40" />
        <Pulse className="h-32 w-full" />
        <Pulse className="h-32 w-full" />
        <Pulse className="h-48 w-full" />
      </div>
      {/* Center panel */}
      <div className="flex-1 p-4 space-y-3">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(i => <Pulse key={i} className="h-8 w-24" />)}
        </div>
        <Pulse className="h-[calc(100vh-120px)] w-full" />
      </div>
      {/* Right panel */}
      <div className="w-72 border-l border-white/10 p-4 space-y-4 shrink-0">
        {[1, 2, 3, 4, 5, 6].map(i => <Pulse key={i} className="h-16 w-full" />)}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Chart / recharts area skeleton
// ---------------------------------------------------------------------------
export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-xl border border-white/10 bg-white/5 p-4', className)}>
      <Pulse className="h-5 w-32 mb-4" />
      <div className="flex items-end gap-1 h-32">
        {[60, 80, 50, 90, 70, 100, 65, 85, 55, 75, 95, 80].map((h, i) => (
          <Pulse
            key={i}
            style={{ height: `${h}%` }}
            className="flex-1"
          />
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Prediction result skeleton
// ---------------------------------------------------------------------------
export function PredictionSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      {/* Input panel */}
      <div className="space-y-4">
        <Pulse className="h-7 w-48" />
        {[1, 2, 3, 4, 5].map(i => <Pulse key={i} className="h-12 w-full" />)}
        <Pulse className="h-10 w-full" />
      </div>
      {/* Results panel */}
      <div className="space-y-4">
        <Pulse className="h-7 w-48" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(i => <Pulse key={i} className="h-24" />)}
        </div>
        <ChartSkeleton className="h-40" />
        <Pulse className="h-32 w-full" />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Dashboard skeleton
// ---------------------------------------------------------------------------
export function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <Pulse className="h-9 w-56" />
      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Pulse key={i} className="h-28" />)}
      </div>
      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4">
        <ChartSkeleton className="h-64" />
        <ChartSkeleton className="h-64" />
      </div>
      {/* Table */}
      <Pulse className="h-48 w-full" />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Crop library skeleton
// ---------------------------------------------------------------------------
export function CropLibrarySkeleton() {
  return (
    <div className="p-6 space-y-4">
      <Pulse className="h-9 w-56" />
      <div className="flex gap-2">
        {[1, 2, 3, 4].map(i => <Pulse key={i} className="h-9 w-24" />)}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <Pulse key={i} className="h-36" />
        ))}
      </div>
    </div>
  )
}
