/**
 * Preset to Layout Converter
 * Converts regional preset models into 3D plant layouts for the designer
 */

import { StrataLayer } from './spacing';

export interface PlantLayout {
  id: string;
  x: number;          // meters from origin
  y: number;          // meters from origin  
  layer: StrataLayer;
  species: string;
  spacingRadius: number;
  growthStage: number;  // 0–1, full maturity
}

export interface RegionalPreset {
  id: string;
  name: string;
  acres: number;
  cropSchedule: {
    overstory?: { crop: string; spacing: number; plants: number };
    middle?: { crop: string; spacing: number; plants: number };
    understory?: { crop: string; spacing: number; plants: number };
    vertical?: { crop: string; perTree?: number; total: number };
  };
}

/**
 * Convert a preset model to a plant layout
 */
export function presetToLayout(preset: RegionalPreset, targetAcres?: number): PlantLayout[] {
  const acres = targetAcres || preset.acres;
  const scale = Math.sqrt(acres / preset.acres); // Scale factor for area
  
  const layout: PlantLayout[] = [];
  let plantId = 0;
  
  // Calculate farm dimensions (assuming square for simplicity)
  const areaM2 = acres * 4046.86; // 1 acre = 4046.86 m²
  const sideLength = Math.sqrt(areaM2);
  
  // Generate layout based on preset ID
  switch (preset.id) {
    case 'wayanad-classic':
      generateWayanadLayout(layout, preset, sideLength, () => `${preset.id}-${plantId++}`);
      break;
    case 'karnataka-spice':
      generateKarnatakaLayout(layout, preset, sideLength, () => `${preset.id}-${plantId++}`);
      break;
    case 'tamil-nadu-tropical':
      generateTamilNaduLayout(layout, preset, sideLength, () => `${preset.id}-${plantId++}`);
      break;
    case 'andhra-commercial':
      generateAndhraLayout(layout, preset, sideLength, () => `${preset.id}-${plantId++}`);
      break;
    case 'maharashtra-balanced':
      generateMaharashtraLayout(layout, preset, sideLength, () => `${preset.id}-${plantId++}`);
      break;
    case 'coconut-cocoa-premium':
      generateCocoaPremiumLayout(layout, preset, sideLength, () => `${preset.id}-${plantId++}`);
      break;
    default:
      generateGenericLayout(layout, preset, sideLength, () => `${preset.id}-${plantId++}`);
  }
  
  return layout;
}

/**
 * WAYANAD CLASSIC: Coconut + Banana + Turmeric + Black Pepper
 * Pattern: 7.5m × 7.5m coconut grid (triangular offset)
 */
function generateWayanadLayout(
  layout: PlantLayout[],
  preset: RegionalPreset,
  sideLength: number,
  genId: () => string
) {
  const coconutSpacing = 8;
  const bananaSpacing = 3;
  
  // Coconut palms in triangular offset pattern
  for (let y = 0; y < sideLength; y += coconutSpacing) {
    const offset = (Math.floor(y / coconutSpacing) % 2) * (coconutSpacing / 2);
    for (let x = offset; x < sideLength; x += coconutSpacing) {
      const coconutId = genId();
      layout.push({
        id: coconutId,
        x, y,
        layer: 'overstory',
        species: 'Coconut Palm',
        spacingRadius: 4,
        growthStage: 0.8,
      });
      
      // Black pepper climber on each coconut (0.3m offset)
      layout.push({
        id: genId(),
        x: x + 0.3,
        y: y + 0.3,
        layer: 'vertical',
        species: 'Black Pepper',
        spacingRadius: 0.5,
        growthStage: 0.7,
      });
    }
  }
  
  // Banana in alleys between coconut rows
  for (let y = coconutSpacing / 2; y < sideLength; y += coconutSpacing) {
    for (let x = 0; x < sideLength; x += bananaSpacing) {
      layout.push({
        id: genId(),
        x, y,
        layer: 'middle',
        species: 'Banana',
        spacingRadius: 2,
        growthStage: 0.6,
      });
    }
  }
  
  // Turmeric rows (dense understory) - sample every 1m to avoid clutter
  for (let y = 2; y < sideLength; y += 1) {
    for (let x = 2; x < sideLength; x += 1) {
      // Only place turmeric away from tree bases
      const nearTree = layout.some(p => 
        p.layer === 'overstory' && 
        Math.hypot(p.x - x, p.y - y) < 2
      );
      if (!nearTree && Math.random() > 0.7) { // Sparse representation
        layout.push({
          id: genId(),
          x, y,
          layer: 'understory',
          species: 'Turmeric',
          spacingRadius: 0.3,
          growthStage: 0.5,
        });
      }
    }
  }
}

/**
 * KARNATAKA SPICE GARDEN: Silver Oak + Papaya + Cardamom + Vanilla
 */
function generateKarnatakaLayout(
  layout: PlantLayout[],
  preset: RegionalPreset,
  sideLength: number,
  genId: () => string
) {
  const oakSpacing = 10;
  const papayaSpacing = 2.5;
  
  // Silver Oak shade trees (12m × 12m grid)
  for (let y = 5; y < sideLength; y += oakSpacing) {
    for (let x = 5; x < sideLength; x += oakSpacing) {
      layout.push({
        id: genId(),
        x, y,
        layer: 'overstory',
        species: 'Silver Oak',
        spacingRadius: 6,
        growthStage: 0.9,
      });
      
      // Vanilla climbing on oak stems
      layout.push({
        id: genId(),
        x: x + 0.4,
        y: y + 0.4,
        layer: 'vertical',
        species: 'Vanilla',
        spacingRadius: 0.8,
        growthStage: 0.6,
      });
    }
  }
  
  // Papaya in middle layer
  for (let y = 0; y < sideLength; y += papayaSpacing) {
    for (let x = 0; x < sideLength; x += papayaSpacing) {
      const nearOak = layout.some(p => 
        p.layer === 'overstory' && 
        Math.hypot(p.x - x, p.y - y) < 3
      );
      if (!nearOak) {
        layout.push({
          id: genId(),
          x, y,
          layer: 'middle',
          species: 'Papaya',
          spacingRadius: 1.5,
          growthStage: 0.7,
        });
      }
    }
  }
  
  // Cardamom understory (sparse representation)
  for (let y = 1; y < sideLength; y += 1.5) {
    for (let x = 1; x < sideLength; x += 1.5) {
      if (Math.random() > 0.6) {
        layout.push({
          id: genId(),
          x, y,
          layer: 'understory',
          species: 'Cardamom',
          spacingRadius: 0.4,
          growthStage: 0.5,
        });
      }
    }
  }
}

/**
 * TAMIL NADU TROPICAL: Mango + Guava + Ginger + Betel Leaf
 */
function generateTamilNaduLayout(
  layout: PlantLayout[],
  preset: RegionalPreset,
  sideLength: number,
  genId: () => string
) {
  const mangoSpacing = 9;
  const guavaSpacing = 4;
  
  // Mango trees (9m × 9m)
  for (let y = 4; y < sideLength; y += mangoSpacing) {
    for (let x = 4; x < sideLength; x += mangoSpacing) {
      layout.push({
        id: genId(),
        x, y,
        layer: 'overstory',
        species: 'Mango',
        spacingRadius: 5,
        growthStage: 0.8,
      });
      
      // Betel leaf climber
      layout.push({
        id: genId(),
        x: x + 0.5,
        y: y + 0.5,
        layer: 'vertical',
        species: 'Betel Leaf',
        spacingRadius: 0.6,
        growthStage: 0.6,
      });
    }
  }
  
  // Guava in middle layer
  for (let y = 0; y < sideLength; y += guavaSpacing) {
    for (let x = 0; x < sideLength; x += guavaSpacing) {
      const nearMango = layout.some(p => 
        p.layer === 'overstory' && 
        Math.hypot(p.x - x, p.y - y) < 3.5
      );
      if (!nearMango) {
        layout.push({
          id: genId(),
          x, y,
          layer: 'middle',
          species: 'Guava',
          spacingRadius: 2.5,
          growthStage: 0.7,
        });
      }
    }
  }
  
  // Ginger understory
  for (let y = 1; y < sideLength; y += 1.2) {
    for (let x = 1; x < sideLength; x += 1.2) {
      if (Math.random() > 0.65) {
        layout.push({
          id: genId(),
          x, y,
          layer: 'understory',
          species: 'Ginger',
          spacingRadius: 0.3,
          growthStage: 0.5,
        });
      }
    }
  }
}

/**
 * ANDHRA COMMERCIAL: Areca Nut + Jackfruit + Pineapple + Passion Fruit
 */
function generateAndhraLayout(
  layout: PlantLayout[],
  preset: RegionalPreset,
  sideLength: number,
  genId: () => string
) {
  const arecaSpacing = 7;
  const jackfruitSpacing = 3.5;
  
  // Areca nut palms
  for (let y = 3.5; y < sideLength; y += arecaSpacing) {
    for (let x = 3.5; x < sideLength; x += arecaSpacing) {
      layout.push({
        id: genId(),
        x, y,
        layer: 'overstory',
        species: 'Areca Nut',
        spacingRadius: 3.5,
        growthStage: 0.8,
      });
      
      // Passion fruit climber
      layout.push({
        id: genId(),
        x: x + 0.4,
        y: y + 0.4,
        layer: 'vertical',
        species: 'Passion Fruit',
        spacingRadius: 1.5,
        growthStage: 0.6,
      });
    }
  }
  
  // Jackfruit middle layer
  for (let y = 0; y < sideLength; y += jackfruitSpacing) {
    for (let x = 0; x < sideLength; x += jackfruitSpacing) {
      const nearAreca = layout.some(p => 
        p.layer === 'overstory' && 
        Math.hypot(p.x - x, p.y - y) < 2.5
      );
      if (!nearAreca) {
        layout.push({
          id: genId(),
          x, y,
          layer: 'middle',
          species: 'Jackfruit',
          spacingRadius: 3,
          growthStage: 0.7,
        });
      }
    }
  }
  
  // Pineapple understory
  for (let y = 1; y < sideLength; y += 1) {
    for (let x = 1; x < sideLength; x += 1) {
      if (Math.random() > 0.7) {
        layout.push({
          id: genId(),
          x, y,
          layer: 'understory',
          species: 'Pineapple',
          spacingRadius: 0.4,
          growthStage: 0.5,
        });
      }
    }
  }
}

/**
 * MAHARASHTRA BALANCED: Coconut + Mango + Turmeric + Black Pepper
 */
function generateMaharashtraLayout(
  layout: PlantLayout[],
  preset: RegionalPreset,
  sideLength: number,
  genId: () => string
) {
  const treeSpacing = 8;
  
  // Interleaved coconut and mango (offset grid)
  for (let y = 0; y < sideLength; y += treeSpacing) {
    const isCoconutRow = Math.floor(y / treeSpacing) % 2 === 0;
    for (let x = 0; x < sideLength; x += treeSpacing) {
      const species = isCoconutRow ? 'Coconut Palm' : 'Mango';
      layout.push({
        id: genId(),
        x, y,
        layer: 'overstory',
        species,
        spacingRadius: 4.5,
        growthStage: 0.8,
      });
      
      // Black pepper on coconut only
      if (isCoconutRow) {
        layout.push({
          id: genId(),
          x: x + 0.3,
          y: y + 0.3,
          layer: 'vertical',
          species: 'Black Pepper',
          spacingRadius: 0.5,
          growthStage: 0.7,
        });
      }
    }
  }
  
  // Turmeric understory
  for (let y = 2; y < sideLength; y += 1) {
    for (let x = 2; x < sideLength; x += 1) {
      if (Math.random() > 0.7) {
        layout.push({
          id: genId(),
          x, y,
          layer: 'understory',
          species: 'Turmeric',
          spacingRadius: 0.3,
          growthStage: 0.5,
        });
      }
    }
  }
}

/**
 * COCONUT-COCOA PREMIUM: Coconut + Cocoa + Cardamom + Black Pepper + Vanilla
 */
function generateCocoaPremiumLayout(
  layout: PlantLayout[],
  preset: RegionalPreset,
  sideLength: number,
  genId: () => string
) {
  const coconutSpacing = 8;
  const cocoaSpacing = 3;
  
  // Coconut palms
  for (let y = 0; y < sideLength; y += coconutSpacing) {
    for (let x = 0; x < sideLength; x += coconutSpacing) {
      layout.push({
        id: genId(),
        x, y,
        layer: 'overstory',
        species: 'Coconut Palm',
        spacingRadius: 4.5,
        growthStage: 0.8,
      });
      
      // Black pepper + vanilla climbers (alternating)
      const climber = Math.random() > 0.5 ? 'Black Pepper' : 'Vanilla';
      layout.push({
        id: genId(),
        x: x + 0.3,
        y: y + 0.3,
        layer: 'vertical',
        species: climber,
        spacingRadius: 0.5,
        growthStage: 0.7,
      });
    }
  }
  
  // Cocoa middle layer (between coconuts)
  for (let y = cocoaSpacing; y < sideLength; y += cocoaSpacing) {
    for (let x = cocoaSpacing; x < sideLength; x += cocoaSpacing) {
      const nearCoconut = layout.some(p => 
        p.layer === 'overstory' && 
        Math.hypot(p.x - x, p.y - y) < 2
      );
      if (!nearCoconut) {
        layout.push({
          id: genId(),
          x, y,
          layer: 'middle',
          species: 'Cocoa',
          spacingRadius: 2,
          growthStage: 0.7,
        });
      }
    }
  }
  
  // Cardamom understory
  for (let y = 1.5; y < sideLength; y += 1.5) {
    for (let x = 1.5; x < sideLength; x += 1.5) {
      if (Math.random() > 0.65) {
        layout.push({
          id: genId(),
          x, y,
          layer: 'understory',
          species: 'Cardamom',
          spacingRadius: 0.4,
          growthStage: 0.5,
        });
      }
    }
  }
}

/**
 * Generic layout for unknown presets
 */
function generateGenericLayout(
  layout: PlantLayout[],
  preset: RegionalPreset,
  sideLength: number,
  genId: () => string
) {
  const schedule = preset.cropSchedule;
  
  // Place overstory
  if (schedule.overstory) {
    const spacing = schedule.overstory.spacing;
    for (let y = spacing / 2; y < sideLength; y += spacing) {
      for (let x = spacing / 2; x < sideLength; x += spacing) {
        layout.push({
          id: genId(),
          x, y,
          layer: 'overstory',
          species: schedule.overstory.crop,
          spacingRadius: spacing / 2,
          growthStage: 0.8,
        });
      }
    }
  }
  
  // Place middle
  if (schedule.middle) {
    const spacing = schedule.middle.spacing;
    for (let y = 0; y < sideLength; y += spacing) {
      for (let x = 0; x < sideLength; x += spacing) {
        layout.push({
          id: genId(),
          x, y,
          layer: 'middle',
          species: schedule.middle.crop,
          spacingRadius: spacing / 2,
          growthStage: 0.7,
        });
      }
    }
  }
  
  // Place understory (sparse)
  if (schedule.understory) {
    for (let y = 1; y < sideLength; y += 1.5) {
      for (let x = 1; x < sideLength; x += 1.5) {
        if (Math.random() > 0.7) {
          layout.push({
            id: genId(),
            x, y,
            layer: 'understory',
            species: schedule.understory.crop,
            spacingRadius: 0.3,
            growthStage: 0.5,
          });
        }
      }
    }
  }
}
