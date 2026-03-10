/**
 * units.ts — Indian Agricultural Measurement Conversions
 *
 * PRIMARY UNIT SYSTEM FOR INDIAN FARMERS:
 *   1 acre  = 100 cents
 *   1 cent  = 40.4686 m²
 *   1 acre  = 4046.86 m²
 *   1 cent  = 6.3615m × 6.3615m (square equivalent)
 *
 * DISPLAY RULES:
 *   - Area:   always show "X acres (Y cents)"
 *   - Yield:  always show "X tonnes per acre" or "X tonnes total"
 *   - Spacing: "X meters" for < 100 cents, add cents context for clarity
 *   - Money:  always ₹, use lakhs (1 lakh = ₹1,00,000)
 */

// === AREA CONVERSIONS ===

export const CENTS_PER_ACRE = 100
export const M2_PER_CENT = 40.4686
export const M2_PER_ACRE = 4046.86

/** Convert acres to cents */
export function acresToCents(acres: number): number {
  return Math.round(acres * CENTS_PER_ACRE)
}

/** Convert cents to acres */
export function centsToAcres(cents: number): number {
  return cents / CENTS_PER_ACRE
}

/** Convert acres to square meters */
export function acresToM2(acres: number): number {
  return acres * M2_PER_ACRE
}

/** Convert cents to square meters */
export function centsToM2(cents: number): number {
  return cents * M2_PER_CENT
}

/**
 * Convert acres to farm dimensions in meters (square farm).
 * Returns widthM and lengthM for Three.js rendering.
 */
export function acresToFarmDimensions(acres: number): {
  widthM: number
  lengthM: number
  areaM2: number
  cents: number
} {
  const areaM2 = acresToM2(acres)
  const side = Math.sqrt(areaM2)
  return {
    widthM: parseFloat(side.toFixed(3)),
    lengthM: parseFloat(side.toFixed(3)),
    areaM2: parseFloat(areaM2.toFixed(2)),
    cents: acresToCents(acres),
  }
}

/** How many cents fit in a given meter length (one dimension) */
export function metersToCents1D(meters: number): number {
  return meters / Math.sqrt(M2_PER_CENT)
}

// === YIELD CONVERSIONS ===

/**
 * Convert t/ha (backend unit) to tonnes per acre (display unit).
 * 1 hectare = 2.47105 acres
 */
export function thaToTonnesPerAcre(t_ha: number): number {
  return parseFloat((t_ha * 0.404686).toFixed(3))
}

/** Convert t/ha to total farm yield in tonnes */
export function thaToTotalTonnes(t_ha: number, acres: number): number {
  return parseFloat((t_ha * acres * 0.404686).toFixed(2))
}

// === DISPLAY FORMATTERS (farmer-friendly) ===

/**
 * Format area for display to Indian farmers.
 * Example: formatArea(2.5) → "2.5 acres (250 cents)"
 */
export function formatArea(acres: number): string {
  const cents = acresToCents(acres)
  if (acres < 1) {
    return `${cents} cents`
  }
  return `${acres} acres (${cents} cents)`
}

/**
 * Format yield for display. Always in acres/tonnes.
 * Example: formatYield(8.7, 2.5) → "about 8.8 tonnes from your 2.5 acre farm"
 */
export function formatYield(t_ha: number, acres: number): string {
  const totalTonnes = thaToTotalTonnes(t_ha, acres)
  if (totalTonnes < 1) {
    return `about ${(totalTonnes * 1000).toFixed(0)} kg from your ${formatArea(acres)}`
  }
  return `about ${totalTonnes.toFixed(1)} tonnes from your ${formatArea(acres)}`
}

/**
 * Format money in Indian system (lakhs).
 * Example: formatMoney(250000) → "₹2.5 lakhs"
 */
export function formatMoney(rupees: number): string {
  if (rupees >= 10000000) {
    return `₹${(rupees / 10000000).toFixed(1)} crores`
  }
  if (rupees >= 100000) {
    return `₹${(rupees / 100000).toFixed(1)} lakhs`
  }
  if (rupees >= 1000) {
    return `₹${(rupees / 1000).toFixed(0)}K`
  }
  return `₹${rupees.toFixed(0)}`
}

/**
 * Format spacing for display to farmers.
 * Example: formatSpacing(8) → "8.0 meters apart"
 */
export function formatSpacing(meters: number): string {
  if (meters < 1) {
    return `${(meters * 100).toFixed(0)} cm apart`
  }
  if (meters >= 6.36) {
    const cents = (meters / 6.3615).toFixed(1)
    return `${meters.toFixed(1)} meters apart (~${cents} cents)`
  }
  return `${meters.toFixed(1)} meters apart`
}

/**
 * Format LER in farmer-friendly language.
 * Example: formatLER(1.68) → "68% more productive than single-crop farming 🌿"
 */
export function formatLER(ler: number): string {
  if (ler > 1) {
    const pct = Math.round((ler - 1) * 100)
    return `${pct}% more productive than single-crop farming 🌿`
  }
  if (ler === 1) {
    return 'Same as single-crop farming'
  }
  return 'Below single-crop farming — needs improvement'
}

/** Grid label helper — how many cents per grid line */
export function getGridLabelCents(farmAcres: number): {
  metersPerLine: number
  label: string
} {
  const cents = acresToCents(farmAcres)
  if (cents <= 50) {
    return { metersPerLine: Math.sqrt(M2_PER_CENT * 10), label: '10 cents' }
  }
  if (cents <= 200) {
    return { metersPerLine: Math.sqrt(M2_PER_CENT * 25), label: '25 cents' }
  }
  return { metersPerLine: Math.sqrt(M2_PER_CENT * 50), label: '50 cents' }
}
