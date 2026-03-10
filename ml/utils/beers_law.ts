/**
 * Beer-Lambert Law utilities for light interception modelling
 * I = I₀ · e^(-k · LAI)
 * where k = extinction coefficient, LAI = Leaf Area Index
 */

/**
 * Fraction of incident PAR intercepted by a canopy layer
 * @param k   Extinction coefficient (Beer-Lambert k, typically 0.2–0.7)
 * @param LAI Leaf Area Index (m² leaf / m² ground)
 */
export function f_intercepted(k: number, LAI: number): number {
  if (k <= 0 || LAI < 0) return 0
  return 1 - Math.exp(-k * LAI)
}

/**
 * Fraction of incident PAR transmitted through a canopy layer
 * @param k   Extinction coefficient
 * @param LAI Leaf Area Index
 */
export function f_transmitted(k: number, LAI: number): number {
  if (k <= 0 || LAI < 0) return 1
  return Math.exp(-k * LAI)
}

/**
 * Cumulative light interception for multiple stacked canopy layers
 * Each layer receives the transmitted fraction from layers above it.
 *
 * @param layers Array of { k, LAI } objects ordered from top to bottom
 * @returns Array of { intercepted, transmitted, incoming } per layer
 */
export interface LayerLight {
  intercepted: number
  transmitted: number
  incoming: number
}

export function multilayer_light(
  layers: Array<{ k: number; LAI: number }>
): LayerLight[] {
  let incoming = 1.0
  return layers.map(({ k, LAI }) => {
    const intercepted = incoming * f_intercepted(k, LAI)
    const transmitted = incoming * f_transmitted(k, LAI)
    const result: LayerLight = { intercepted, transmitted, incoming }
    incoming = transmitted
    return result
  })
}
