/**
 * Smart Spacing Engine
 * Calculates optimal plant spacing based on species, layer, and target density
 */

export type StrataLayer = 'overstory' | 'middle' | 'understory' | 'vertical';
export type TargetDensity = 'low' | 'medium' | 'high';

export interface SpacingResult {
  rowSpacing: number;        // meters between rows
  inRowSpacing: number;      // meters between plants in row
  plantsPerHectare: number;  // computed count
  coveragePercent: number;   // estimated canopy coverage at maturity
  lightTransmission: number; // Beer-Lambert computed value (0-1)
}

// Crop spacing database (based on agricultural research + ai_advisor.py)
const SPACING_DATABASE: Record<string, {
  minSpacing: number;
  optimalSpacing: number;
  maxSpacing: number;
  canopyRadius: number; // at maturity
  extinctionCoefficient: number; // for Beer-Lambert law
}> = {
  // Overstory crops
  'coconut': { minSpacing: 7, optimalSpacing: 8, maxSpacing: 10, canopyRadius: 4.5, extinctionCoefficient: 0.4 },
  'areca': { minSpacing: 6, optimalSpacing: 7, maxSpacing: 9, canopyRadius: 3.5, extinctionCoefficient: 0.5 },
  'mango': { minSpacing: 8, optimalSpacing: 10, maxSpacing: 12, canopyRadius: 5, extinctionCoefficient: 0.6 },
  'silver oak': { minSpacing: 9, optimalSpacing: 12, maxSpacing: 15, canopyRadius: 6, extinctionCoefficient: 0.7 },
  'teak': { minSpacing: 4, optimalSpacing: 5, maxSpacing: 6, canopyRadius: 3, extinctionCoefficient: 0.5 },
  'jackfruit': { minSpacing: 8, optimalSpacing: 10, maxSpacing: 12, canopyRadius: 5, extinctionCoefficient: 0.6 },
  
  // Middle layer crops
  'banana': { minSpacing: 2, optimalSpacing: 3, maxSpacing: 4, canopyRadius: 2, extinctionCoefficient: 0.5 },
  'papaya': { minSpacing: 2, optimalSpacing: 2.5, maxSpacing: 3.5, canopyRadius: 1.5, extinctionCoefficient: 0.4 },
  'coffee': { minSpacing: 2, optimalSpacing: 3, maxSpacing: 4, canopyRadius: 1.8, extinctionCoefficient: 0.45 },
  'cocoa': { minSpacing: 2.5, optimalSpacing: 3, maxSpacing: 4, canopyRadius: 2, extinctionCoefficient: 0.5 },
  'guava': { minSpacing: 3, optimalSpacing: 4, maxSpacing: 5, canopyRadius: 2.5, extinctionCoefficient: 0.5 },
  
  // Understory crops
  'turmeric': { minSpacing: 0.3, optimalSpacing: 0.5, maxSpacing: 0.8, canopyRadius: 0.3, extinctionCoefficient: 0.3 },
  'ginger': { minSpacing: 0.3, optimalSpacing: 0.5, maxSpacing: 0.8, canopyRadius: 0.3, extinctionCoefficient: 0.3 },
  'cardamom': { minSpacing: 0.3, optimalSpacing: 0.4, maxSpacing: 0.6, canopyRadius: 0.4, extinctionCoefficient: 0.35 },
  'pineapple': { minSpacing: 0.3, optimalSpacing: 0.4, maxSpacing: 0.6, canopyRadius: 0.4, extinctionCoefficient: 0.4 },
  'groundnut': { minSpacing: 0.2, optimalSpacing: 0.3, maxSpacing: 0.5, canopyRadius: 0.2, extinctionCoefficient: 0.25 },
  
  // Vertical/climber crops
  'black pepper': { minSpacing: 2, optimalSpacing: 3, maxSpacing: 4, canopyRadius: 1, extinctionCoefficient: 0.3 },
  'vanilla': { minSpacing: 2, optimalSpacing: 2.5, maxSpacing: 3.5, canopyRadius: 0.8, extinctionCoefficient: 0.25 },
  'betel leaf': { minSpacing: 1.5, optimalSpacing: 2, maxSpacing: 3, canopyRadius: 0.6, extinctionCoefficient: 0.3 },
  'passion fruit': { minSpacing: 2.5, optimalSpacing: 3, maxSpacing: 4, canopyRadius: 1.5, extinctionCoefficient: 0.35 },
};

/**
 * Calculate optimal spacing for a crop species
 */
export function calculateOptimalSpacing(
  species: string,
  layer: StrataLayer,
  farmArea: number,
  targetDensity: TargetDensity = 'medium'
): SpacingResult {
  const speciesKey = species.toLowerCase();
  const data = SPACING_DATABASE[speciesKey];
  
  if (!data) {
    // Fallback for unknown species
    return getFallbackSpacing(layer, targetDensity);
  }
  
  // Select spacing based on target density
  let spacing: number;
  switch (targetDensity) {
    case 'low':
      spacing = data.maxSpacing;
      break;
    case 'high':
      spacing = data.minSpacing;
      break;
    case 'medium':
    default:
      spacing = data.optimalSpacing;
      break;
  }
  
  // Calculate row and in-row spacing (usually same for square grid)
  const rowSpacing = spacing;
  const inRowSpacing = spacing;
  
  // Plants per hectare (10,000 m²)
  const plantsPerHectare = Math.floor(10000 / (rowSpacing * inRowSpacing));
  
  // Coverage percent at maturity
  const plantFootprint = Math.PI * Math.pow(data.canopyRadius, 2);
  const availableSpace = rowSpacing * inRowSpacing;
  const coveragePercent = Math.min((plantFootprint / availableSpace) * 100, 100);
  
  // Light transmission using Beer-Lambert law
  // I = I₀ * e^(-k * LAI)
  // Simplified: LAI ≈ coverage/100 * 4 (typical LAI for full canopy)
  const LAI = (coveragePercent / 100) * 4;
  const lightTransmission = Math.exp(-data.extinctionCoefficient * LAI);
  
  return {
    rowSpacing,
    inRowSpacing,
    plantsPerHectare,
    coveragePercent: Math.round(coveragePercent * 10) / 10,
    lightTransmission: Math.round(lightTransmission * 1000) / 1000,
  };
}

/**
 * Fallback spacing for unknown species
 */
function getFallbackSpacing(layer: StrataLayer, density: TargetDensity): SpacingResult {
  const spacingMap: Record<StrataLayer, Record<TargetDensity, number>> = {
    overstory: { low: 12, medium: 9, high: 7 },
    middle: { low: 4, medium: 3, high: 2 },
    understory: { low: 0.6, medium: 0.4, high: 0.3 },
    vertical: { low: 4, medium: 3, high: 2 },
  };
  
  const spacing = spacingMap[layer][density];
  const plantsPerHectare = Math.floor(10000 / (spacing * spacing));
  
  return {
    rowSpacing: spacing,
    inRowSpacing: spacing,
    plantsPerHectare,
    coveragePercent: 50,
    lightTransmission: 0.5,
  };
}

/**
 * Calculate spacing for all crops in a strata configuration
 */
export function calculateStrataSpacing(
  crops: Array<{ species: string; layer: StrataLayer; count: number }>,
  farmArea: number
): Record<string, SpacingResult> {
  const results: Record<string, SpacingResult> = {};
  
  for (const crop of crops) {
    // Infer density from count vs farm area
    const density = inferDensity(crop.count, farmArea, crop.layer);
    results[crop.species] = calculateOptimalSpacing(
      crop.species,
      crop.layer,
      farmArea,
      density
    );
  }
  
  return results;
}

function inferDensity(count: number, farmArea: number, layer: StrataLayer): TargetDensity {
  const perHectare = (count / farmArea) * 10000;
  
  // Rough thresholds by layer
  if (layer === 'overstory') {
    if (perHectare < 80) return 'low';
    if (perHectare > 150) return 'high';
    return 'medium';
  } else if (layer === 'middle') {
    if (perHectare < 300) return 'low';
    if (perHectare > 800) return 'high';
    return 'medium';
  } else if (layer === 'understory') {
    if (perHectare < 5000) return 'low';
    if (perHectare > 20000) return 'high';
    return 'medium';
  }
  
  return 'medium';
}

/**
 * Get crop data for compatibility and spacing checks
 */
export function getCropData(species: string) {
  return SPACING_DATABASE[species.toLowerCase()] || null;
}

// ---------------------------------------------------------------------------
// Standalone helper functions (used by tests and external modules)
// ---------------------------------------------------------------------------

/**
 * Calculate plants-per-hectare for a given spacing grid.
 * An optional density modifier tightens ('high') or loosens ('low') the grid.
 *
 * @param rowSpacingM     Row spacing in metres
 * @param inRowSpacingM   In-row (plant) spacing in metres
 * @param density         Optional density adjustment
 */
export function plantsPerHectare(
  rowSpacingM: number,
  inRowSpacingM: number,
  density?: TargetDensity
): number {
  const factor =
    density === 'high' ? 0.8 :
    density === 'low'  ? 1.2 : 1.0;
  const r = rowSpacingM * factor;
  const c = inRowSpacingM * factor;
  if (r <= 0 || c <= 0) return 0;
  return Math.floor(10000 / (r * c));
}

/**
 * Return the recommended row spacing for a species / layer combination.
 *
 * @param species  Crop name (case-insensitive)
 * @param layer    Strata layer
 * @param density  Target density (default: 'medium')
 */
export function rowSpacing(
  species: string,
  layer: StrataLayer,
  density: TargetDensity = 'medium'
): number {
  return calculateOptimalSpacing(species, layer, 10000, density).rowSpacing;
}

/**
 * Return the recommended in-row spacing for a species / layer combination.
 *
 * @param species  Crop name (case-insensitive)
 * @param layer    Strata layer
 * @param density  Target density (default: 'medium')
 */
export function inRowSpacing(
  species: string,
  layer: StrataLayer,
  density: TargetDensity = 'medium'
): number {
  return calculateOptimalSpacing(species, layer, 10000, density).inRowSpacing;
}
