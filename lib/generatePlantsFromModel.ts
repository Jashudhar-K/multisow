/**
 * Generate 3D plant layout from a crop model
 * Creates realistic plant positions based on spacing guidelines
 */

import type { PlantInstance, StrataLayerId } from '@/types/farm';

export interface CropModelConfig {
  id: string;
  name: string;
  crops: string[];
  acres: number;
}

// Species configurations with proper spacing
const speciesConfig: Record<string, {
  layer: StrataLayerId;
  spacing: number; // meters between plants
  rowSpacing: number; // meters between rows
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
  'Mango': 'coconut', // Use coconut as fallback for canopy
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

/**
 * Generate plant positions for a crop model
 */
export function generatePlantsFromModel(model: CropModelConfig): PlantInstance[] {
  const plants: PlantInstance[] = [];
  
  // Calculate field dimensions (assuming square field)
  const acresInSquareMeters = model.acres * 4046.86; // 1 acre = 4046.86 sq meters
  const fieldSize = Math.sqrt(acresInSquareMeters);
  const halfField = fieldSize / 2;
  
  // Scale down for 3D visualization (use 1m = 1 unit, but limit total size)
  const scaleFactor = Math.min(1, 50 / halfField); // Max 50 units from center
  const visualFieldSize = halfField * scaleFactor;
  
  let plantId = 0;
  
  model.crops.forEach((cropName, cropIndex) => {
    const config = speciesConfig[cropName];
    if (!config) return;
    
    const speciesId = cropToSpeciesId[cropName] || 'coconut';
    
    // Scale spacing for visualization
    const spacing = config.spacing * scaleFactor;
    const rowSpacing = config.rowSpacing * scaleFactor;
    
    // Generate plants in a grid pattern with some randomization
    // Each layer gets offset to avoid overlap
    const layerOffset = cropIndex * 0.5;
    
    // Calculate how many plants fit
    const numRows = Math.floor((visualFieldSize * 2) / rowSpacing);
    const numPerRow = Math.floor((visualFieldSize * 2) / spacing);
    
    // Limit plants for performance
    const maxPlantsPerCrop = config.layer === 'root' ? 50 : config.layer === 'understory' ? 100 : config.layer === 'canopy' ? 30 : 60;
    let plantCount = 0;
    
    for (let row = 0; row < numRows && plantCount < maxPlantsPerCrop; row++) {
      for (let col = 0; col < numPerRow && plantCount < maxPlantsPerCrop; col++) {
        // Calculate position with some randomization
        const x = -visualFieldSize + col * spacing + (Math.random() - 0.5) * spacing * 0.2 + layerOffset;
        const z = -visualFieldSize + row * rowSpacing + (Math.random() - 0.5) * rowSpacing * 0.2 + layerOffset;
        
        // Skip some positions randomly for natural look (especially for understory)
        if (config.layer === 'understory' && Math.random() > 0.7) continue;
        if (config.layer === 'root' && Math.random() > 0.6) continue;
        
        plants.push({
          id: `plant-${plantId++}`,
          speciesId,
          layer: config.layer,
          position: { x, y: z },
          plantedDate: new Date(),
          currentHeight: config.spacing * (0.6 + Math.random() * 0.4), // Approximate height
        });
        
        plantCount++;
      }
    }
  });
  
  return plants;
}

/**
 * Generate row data from a crop model (for row visualization)
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
  
  // Calculate field dimensions
  const acresInSquareMeters = model.acres * 4046.86;
  const fieldSize = Math.sqrt(acresInSquareMeters);
  const halfField = fieldSize / 2;
  const scaleFactor = Math.min(1, 50 / halfField);
  const visualFieldSize = halfField * scaleFactor;
  
  let rowId = 0;
  
  // Only generate rows for canopy plants (primary structure)
  model.crops.forEach((cropName) => {
    const config = speciesConfig[cropName];
    if (!config || config.layer !== 'canopy') return;
    
    const speciesId = cropToSpeciesId[cropName] || 'coconut';
    const rowSpacing = config.rowSpacing * scaleFactor;
    const numRows = Math.min(5, Math.floor((visualFieldSize * 2) / rowSpacing));
    
    for (let i = 0; i < numRows; i++) {
      const z = -visualFieldSize + i * rowSpacing + visualFieldSize * 0.1;
      rows.push({
        id: `row-${rowId++}`,
        start: [-visualFieldSize * 0.9, z],
        end: [visualFieldSize * 0.9, z],
        spacing: config.spacing * scaleFactor,
        speciesId,
        layer: config.layer,
      });
    }
  });
  
  return rows;
}
