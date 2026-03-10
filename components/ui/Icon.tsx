/**
 * Icon — Google Material Symbols wrapper.
 * Replaces all lucide-react icons with Material Symbols.
 * Usage: <Icon name="agriculture" size={24} filled />
 */
import type { CSSProperties } from 'react'

interface IconProps {
  name: string
  size?: number
  filled?: boolean
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700
  className?: string
  style?: CSSProperties
}

export function Icon({
  name,
  size = 24,
  filled = false,
  weight = 400,
  className = '',
  style,
}: IconProps) {
  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      style={{
        fontSize: size,
        lineHeight: 1,
        fontVariationSettings:
          `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
        ...style,
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  )
}
