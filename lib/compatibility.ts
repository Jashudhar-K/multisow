/**
 * Crop Compatibility Engine
 * Checks for allelopathy, competition, and synergies between crops
 */

export interface CompatibilityWarning {
  plantId1: string;
  plantId2: string;
  species1: string;
  species2: string;
  reason: string;
  severity: 'low' | 'medium' | 'high';
}

// Compatibility matrix (based on agricultural research)
// -1 = incompatible, 0 = neutral, 1 = synergistic
const COMPATIBILITY_MATRIX: Record<string, Record<string, number>> = {
  'coconut': {
    'banana': 1, 'papaya': 1, 'turmeric': 1, 'ginger': 1, 'black pepper': 1,
    'cardamom': 1, 'cocoa': 1, 'pineapple': 0, 'coffee': 0, 'mango': -1,
  },
  'mango': {
    'banana': 1, 'guava': 0, 'ginger': 1, 'turmeric': 1, 'coconut': -1,
    'black pepper': 0, 'papaya': 1, 'groundnut': 1,
  },
  'areca': {
    'banana': 1, 'cocoa': 1, 'cardamom': 1, 'black pepper': 1, 'pineapple': 1,
    'coffee': 1, 'vanilla': 1,
  },
  'silver oak': {
    'coffee': 1, 'cardamom': 1, 'vanilla': 1, 'cocoa': 1, 'pepper': 1,
  },
  'teak': {
    'black pepper': -1, 'turmeric': -1, 'ginger': -1, // allelopathic
  },
  'banana': {
    'turmeric': 1, 'ginger': 1, 'papaya': 0, 'coconut': 1, 'mango': 1,
    'coffee': 0, 'pineapple': -1, // too much competition
  },
  'coffee': {
    'cardamom': 1, 'silver oak': 1, 'banana': 0, 'vanilla': 1, 'cocoa': 0,
  },
  'cocoa': {
    'coconut': 1, 'areca': 1, 'banana': 0, 'cardamom': 1, 'black pepper': 1,
  },
  'cardamom': {
    'areca': 1, 'silver oak': 1, 'coffee': 1, 'cocoa': 1,
  },
  'turmeric': {
    'coconut': 1, 'banana': 1, 'mango': 1, 'teak': -1,
  },
  'ginger': {
    'coconut': 1, 'banana': 1, 'mango': 1, 'teak': -1,
  },
  'black pepper': {
    'coconut': 1, 'areca': 1, 'silver oak': 1, 'mango': 0, 'teak': -1,
  },
  'vanilla': {
    'areca': 1, 'silver oak': 1, 'coffee': 1,
  },
  'pineapple': {
    'areca': 1, 'coconut': 0, 'banana': -1,
  },
  'groundnut': {
    'mango': 1, 'coconut': 0,
  },
};

// Incompatibility reasons
const INCOMPATIBILITY_REASONS: Record<string, string> = {
  'teak-black pepper': 'Teak produces allelopathic compounds that inhibit pepper root growth',
  'teak-turmeric': 'Teak root exudates are toxic to turmeric rhizomes',
  'teak-ginger': 'Allelopathic interference from teak disrupts ginger development',
  'coconut-mango': 'Excessive root competition for water and nutrients; both are heavy feeders',
  'banana-pineapple': 'Similar rooting depth causes severe competition; both deplete soil K rapidly',
};

/**
 * Check compatibility between two crop species
 */
export function checkCompatibility(species1: string, species2: string): {
  compatible: boolean;
  score: number;
  reason?: string;
  severity?: 'low' | 'medium' | 'high';
} {
  const s1 = species1.toLowerCase();
  const s2 = species2.toLowerCase();
  
  // Check both directions
  const score1 = COMPATIBILITY_MATRIX[s1]?.[s2];
  const score2 = COMPATIBILITY_MATRIX[s2]?.[s1];
  const score = score1 !== undefined ? score1 : (score2 !== undefined ? score2 : 0);
  
  if (score < 0) {
    // Incompatible
    const key1 = `${s1}-${s2}`;
    const key2 = `${s2}-${s1}`;
    const reason = INCOMPATIBILITY_REASONS[key1] || INCOMPATIBILITY_REASONS[key2] || 'These crops have known incompatibility issues';
    
    return {
      compatible: false,
      score,
      reason,
      severity: 'high',
    };
  } else if (score > 0) {
    // Synergistic
    return {
      compatible: true,
      score,
      reason: 'These crops have beneficial synergies',
    };
  }
  
  // Neutral
  return {
    compatible: true,
    score: 0,
  };
}

/**
 * Check all plants on a farm for compatibility issues
 */
export function checkFarmCompatibility(
  plants: Array<{
    id: string;
    x: number;
    y: number;
    species: string;
  }>,
  radiusThreshold: number = 3 // meters
): CompatibilityWarning[] {
  const warnings: CompatibilityWarning[] = [];
  
  for (let i = 0; i < plants.length; i++) {
    for (let j = i + 1; j < plants.length; j++) {
      const p1 = plants[i];
      const p2 = plants[j];
      
      // Calculate distance
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Check if within threshold
      if (distance <= radiusThreshold) {
        const compat = checkCompatibility(p1.species, p2.species);
        
        if (!compat.compatible && compat.reason) {
          warnings.push({
            plantId1: p1.id,
            plantId2: p2.id,
            species1: p1.species,
            species2: p2.species,
            reason: compat.reason,
            severity: compat.severity || 'medium',
          });
        }
      }
    }
  }
  
  return warnings;
}

/**
 * Get synergistic crop suggestions for a given species
 */
export function getSynergisticCrops(species: string): string[] {
  const s = species.toLowerCase();
  const matrix = COMPATIBILITY_MATRIX[s];
  
  if (!matrix) return [];
  
  return Object.keys(matrix).filter(crop => matrix[crop] > 0);
}

/**
 * Get incompatible crops for a given species
 */
export function getIncompatibleCrops(species: string): string[] {
  const s = species.toLowerCase();
  const matrix = COMPATIBILITY_MATRIX[s];
  
  if (!matrix) return [];
  
  return Object.keys(matrix).filter(crop => matrix[crop] < 0);
}
