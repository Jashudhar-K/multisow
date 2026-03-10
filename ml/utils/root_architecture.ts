/**
 * Root Architecture Overlap utilities
 *
 * Models root zone competition between plants based on their
 * circular root spread (radius) and distance apart.
 */

export interface RootZone {
  x: number  // metres from origin
  y: number  // metres from origin
  r: number  // root-spread radius (metres)
}

/**
 * Root Overlap Index (ROI) between two plants.
 * Computed as the area of intersection of two circles divided by the
 * area of the smaller circle (so ROI = 1 when fully overlapping and same size).
 *
 * @param a First plant root zone
 * @param b Second plant root zone
 * @returns ROI in [0, 1]
 */
export function ROI(a: RootZone, b: RootZone): number {
  const dx = a.x - b.x
  const dy = a.y - b.y
  const d = Math.sqrt(dx * dx + dy * dy)

  const r1 = a.r
  const r2 = b.r

  // No overlap
  if (d >= r1 + r2) return 0

  // Fully contained
  if (d <= Math.abs(r1 - r2)) {
    const smaller = Math.min(r1, r2)
    const larger = Math.max(r1, r2)
    // Normalise by the larger area so two identical circles = 1
    return (smaller * smaller) / (larger * larger)
  }

  // Partial overlap — lens area formula
  const d1 = (r1 * r1 - r2 * r2 + d * d) / (2 * d)
  const d2 = d - d1

  const alpha = 2 * Math.acos(Math.max(-1, Math.min(1, d1 / r1)))
  const beta  = 2 * Math.acos(Math.max(-1, Math.min(1, d2 / r2)))

  const intersectionArea =
    0.5 * r1 * r1 * (alpha - Math.sin(alpha)) +
    0.5 * r2 * r2 * (beta  - Math.sin(beta))

  const refArea = Math.PI * Math.min(r1, r2) * Math.min(r1, r2)
  if (refArea <= 0) return 0

  return Math.min(intersectionArea / refArea, 1)
}

/**
 * Nutrient competition score derived from Root Overlap Index.
 * Applies a logistic amplification so small overlaps produce little
 * competition and large overlaps produce near-total competition.
 *
 * @param roi Root Overlap Index in [0, 1]
 * @returns Competition score in [0, 1]
 */
export function nutrient_competition(roi: number): number {
  if (roi <= 0) return 0
  if (roi >= 1) return 1
  // Logistic curve centred at roi = 0.5
  return 1 / (1 + Math.exp(-10 * (roi - 0.5)))
}
