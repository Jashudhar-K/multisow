/**
 * Generate 3D plant layout from a crop model.
 *
 * Coordinate contract:
 *   - Origin (0,0) = SW corner of the field
 *   - 1 unit = 1 metre
 *   - x grows East, y grows North
 *   - All positions lie within [0, fieldSize] × [0, fieldSize]
 */

import type { PlantInstance, StrataLayerId } from '@/types/farm';

export interface CropModelConfig {
  id: string;
  name: string;
  crops: string[];
  acres: number;
}

// Species configurations with proper spacing (metres)
const speciesConfig: Record<string, {
  layer: StrataLayerId;
  spacing: number;
  rowSpacing: number;
  heightRange: [number, number];
}> = {
  // Canopy layer
  'Coconut': { layer: 'canopy', spacing: 8, rowSpacing: 8, heightRange: [15, 25] },
  'Silver Oak': { layer: 'canopy', spacing: 10, rowSpacing: 10, heightRange: [20, 30] },
  'Mango': { layer: 'canopy', spacing: 10, rowSpacing: 10, heightRange: [10, 15] },
  'Teak': { layer: 'canopy', spacing: 12, rowSpacing: 12, heightRange: [20, 30] },

  // Middle layer
  'Banana': { layer: 'middle', spacing: 3, rowSpacing: 3.5, heightRange: [3, 6] },
  'Papaya': { layer: 'middle', spacing: 2.5, rowSpacing: 3, heightRange: [4, 8] },
  'Coffee': { layer: 'middle', spacing: 2.5, rowSpacing: 3, heightRange: [2, 4] },
  'Cocoa': { layer: 'middle', spacing: 3, rowSpacing: 3, heightRange: [4, 8] },

  // Understory layer
  'Cardamom': { layer: 'understory', spacing: 2, rowSpacing: 2, heightRange: [1, 3] },
  'Black Pepper': { layer: 'understory', spacing: 2, rowSpacing: 2, heightRange: [1, 3] },
  'Vanilla': { layer: 'understory', spacing: 1.5, rowSpacing: 2, heightRange: [2, 4] },
  'Ginger': { layer: 'understory', spacing: 0.5, rowSpacing: 0.3, heightRange: [0.5, 1] },

  // Root layer
  'Turmeric': { layer: 'root', spacing: 0.3, rowSpacing: 0.4, heightRange: [0.3, 0.6] },
  'Groundnut': { layer: 'root', spacing: 0.15, rowSpacing: 0.3, heightRange: [0.3, 0.5] },
};

// Map crop names to species IDs used in FarmScene
const cropToSpeciesId: Record<string, string> = {
  'Coconut': 'coconut',
  'Banana': 'banana',
  'Turmeric': 'turmeric',
  'Ginger': 'ginger',
  'Mango': 'coconut',
  'Silver Oak': 'coconut',
  'Papaya': 'banana',
  'Cardamom': 'ginger',
  'Coffee': 'banana',
  'Cocoa': 'banana',
  'Black Pepper': 'ginger',
  'Vanilla': 'ginger',
  'Groundnut': 'turmeric',
  'Teak': 'coconut',
};

// Simple seeded pseudo-random for deterministic layouts
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Performance caps per layer
const MAX_PLANTS: Record<StrataLayerId, number> = {
  canopy: 30,
  middle: 60,
  understory: 100,
  root: 50,
};

/**
 * Generate plant positions for a crop model.
 * All coordinates in metres with origin at SW corner.
 */
export function generatePlantsFromModel(model: CropModelConfig): PlantInstance[] {
  const plants: PlantInstance[] = [];

  const acresInSqM = model.acres * 4046.86;
  const fieldSize = Math.sqrt(acresInSqM); // metres per side (square field)

  // Scale down for visual performance — keep 1:1 below 100 m, compress above
  const scale = fieldSize <= 100 ? 1 : 100 / fieldSize;
  const visSize = fieldSize * scale;

  let plantId = 0;

  model.crops.forEach((cropName, cropIndex) => {
    const config = speciesConfig[cropName];
    if (!config) return;

    const speciesId = cropToSpeciesId[cropName] || 'coconut';
    const rng = seededRandom(cropIndex * 9973 + cropName.length);

    const sp = config.spacing * scale;
    const rsp = config.rowSpacing * scale;
    const maxPlants = MAX_PLANTS[config.layer];

    // Inset half-spacing so plants don't sit on the boundary
    const margin = Math.max(sp, rsp) * 0.5;

    const numCols = Math.max(1, Math.floor((visSize - 2 * margin) / sp) + 1);
    const numRows = Math.max(1, Math.floor((visSize - 2 * margin) / rsp) + 1);

    let count = 0;
    for (let row = 0; row < numRows && count < maxPlants; row++) {
      for (let col = 0; col < numCols && count < maxPlants; col++) {
        // Grid position with small jitter (±10% of spacing)
        const jitterX = (rng() - 0.5) * sp * 0.2;
        const jitterY = (rng() - 0.5) * rsp * 0.2;

        const x = margin + col * sp + jitterX;
        const y = margin + row * rsp + jitterY;

        // Clamp inside field
        const cx = Math.max(0, Math.min(visSize, x));
        const cy = Math.max(0, Math.min(visSize, y));

        // Probabilistic thinning for dense layers to look natural
        if (config.layer === 'understory' && rng() > 0.7) continue;
        if (config.layer === 'root' && rng() > 0.6) continue;

        plants.push({
          id: `plant-${plantId++}`,
          speciesId,
          layer: config.layer,
          position: { x: cx, y: cy },
          plantedDate: new Date(),
          currentHeight: config.spacing * (0.6 + rng() * 0.4),
        });

        count++;
      }
    }
  });

  return plants;
}

/**
 * Generate row data from a crop model (for row visualization).
 * Rows run West→East (constant y), spaced along North axis.
 */
export function generateRowsFromModel(model: CropModelConfig) {
  const rows: {
    id: string;
    start: [number, number];
    end: [number, number];
    spacing: number;
    speciesId: string;
    layer: StrataLayerId;
  }[] = [];

  const acresInSqM = model.acres * 4046.86;
  const fieldSize = Math.sqrt(acresInSqM);
  const scale = fieldSize <= 100 ? 1 : 100 / fieldSize;
  const visSize = fieldSize * scale;

  let rowId = 0;

  model.crops.forEach((cropName) => {
    const config = speciesConfig[cropName];
    if (!config || config.layer !== 'canopy') return;

    const speciesId = cropToSpeciesId[cropName] || 'coconut';
    const rsp = config.rowSpacing * scale;
    const sp = config.spacing * scale;
    const numRows = Math.min(5, Math.max(1, Math.floor(visSize / rsp)));
    const margin = rsp * 0.5;

    for (let i = 0; i < numRows; i++) {
      const y = margin + i * rsp;
      rows.push({
        id: `row-${rowId++}`,
        start: [margin, y],
        end: [visSize - margin, y],
        spacing: sp,
        speciesId,
        layer: config.layer,
      });
    }
  });

  return rows;
}

/**
 * Compute the visual field size for a given acreage.
 * Useful for setting farmBounds on FarmScene.
 */
export function getVisualFieldSize(acres: number): number {
  const fieldSize = Math.sqrt(acres * 4046.86);
  return fieldSize <= 100 ? fieldSize : 100;
}
