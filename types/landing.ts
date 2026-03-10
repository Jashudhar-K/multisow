export interface StrataLayer {
  id: string
  name: string
  label: string
  heightRange: string
  title: string
  description: string
  icon: string
  gradientFrom: string
  gradientTo: string
  statLabel: string
  statValue: number
  statUnit: string
  chipText: string
  animDirection: "left" | "right"
}

export interface FohemCard {
  icon: string
  color: string
  title: string
  body: string
  statBadge: string
  weight: number
}

export interface RegionalPreset {
  id?: string
  emoji: string
  name: string
  state: string
  crops: string
  ler: string
  revenue: string
}

export interface ShapFeature {
  name: string
  value: number
  isPositive: boolean
}

export interface MetricStat {
  value: string
  numericValue: number
  suffix: string
  prefix: string
  label: string
}

export interface ProcessStep {
  number: number
  title: string
  icon: string
  body: string
}

export interface ResearchBadge {
  emoji: string
  label: string
}
