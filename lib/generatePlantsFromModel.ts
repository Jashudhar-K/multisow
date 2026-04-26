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

export interface CropConfig {
  id: string;
  name: string;
  spacingM: number;
  layer: string;
}

export interface CropModelConfig {
  id: string;
  name: string;
  crops: CropConfig[];
  acres: number;
}

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
const MAX_PLANTS: Record<string, number> = {
  canopy: 100,
  midstory: 200,
  understory: 300,
  groundcover: 300,
};

/**
 * Generate plant positions for a crop model.
 * All coordinates in metres with origin at SW corner.
 */
export function generatePlantsFromModel(model: CropModelConfig): PlantInstance[] {
  const plants: PlantInstance[] = [];

  const acresInSqM = model.acres * 4046.86;
  const fieldSize = Math.sqrt(acresInSqM); // metres per side (square field)

  let plantId = 0;

  model.crops.forEach((crop, cropIndex) => {
    const speciesId = cropToSpeciesId[crop.name] || 'coconut';
    const rng = seededRandom(cropIndex * 9973 + crop.name.length);

    const sp = Math.max(0.2, crop.spacingM);
    const rsp = sp; // using square spacing
    const maxPlants = MAX_PLANTS[crop.layer] || 200;

    // Inset half-spacing so plants don't sit on the boundary
    const margin = Math.max(sp, rsp) * 0.5;

    let renderSpacingX = sp;
    let renderSpacingY = rsp;

    const totalIdealPlants = Math.ceil((fieldSize - 2 * margin) / sp) * Math.ceil((fieldSize - 2 * margin) / rsp);
    if (totalIdealPlants > maxPlants) {
        const scale = Math.sqrt(totalIdealPlants / maxPlants);
        renderSpacingX *= scale;
        renderSpacingY *= scale;
    }

    const numCols = Math.max(1, Math.floor((fieldSize - 2 * margin) / renderSpacingX) + 1);
    const numRows = Math.max(1, Math.floor((fieldSize - 2 * margin) / renderSpacingY) + 1);

    let count = 0;
    for (let row = 0; row < numRows && count < maxPlants; row++) {
      for (let col = 0; col < numCols && count < maxPlants; col++) {
        // Grid position with small jitter (±10% of spacing)
        const jitterX = (rng() - 0.5) * renderSpacingX * 0.2;
        const jitterY = (rng() - 0.5) * renderSpacingY * 0.2;

        const x = margin + col * renderSpacingX + jitterX;
        const y = margin + row * renderSpacingY + jitterY;

        // Clamp inside field
        const cx = Math.max(0, Math.min(fieldSize, x));
        const cy = Math.max(0, Math.min(fieldSize, y));

        // Probabilistic thinning for dense layers to look natural
        if (crop.layer === 'understory' && rng() > 0.7) continue;
        if (crop.layer === 'groundcover' && rng() > 0.6) continue;

        plants.push({
          id: `plant-${plantId++}`,
          speciesId,
          layer: crop.layer as StrataLayerId,
          position: { x: cx, y: cy },
          plantedDate: new Date(),
          currentHeight: sp * (0.6 + rng() * 0.4),
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

  let rowId = 0;

  model.crops.forEach((crop) => {
    if (crop.layer !== 'canopy') return;

    const speciesId = cropToSpeciesId[crop.name] || 'coconut';
    const rsp = Math.max(0.2, crop.spacingM);
    const sp = rsp;
    const numRows = Math.max(1, Math.floor((fieldSize - rsp) / rsp) + 1);
    const margin = rsp * 0.5;

    for (let i = 0; i < numRows; i++) {
      const y = margin + i * rsp;
      rows.push({
        id: `row-${rowId++}`,
        start: [margin, y],
        end: [fieldSize - margin, y],
        spacing: sp,
        speciesId,
        layer: crop.layer as StrataLayerId,
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
  return Math.sqrt(acres * 4046.86);
}
