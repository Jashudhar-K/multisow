import warningsData from '@/data/crop-compatibility-warnings.json';

export type WarningType = 'good' | 'warning' | 'pest' | 'disease';

export interface CompatibilityWarning {
  crop1: string;
  crop2: string;
  type: WarningType;
  note: string;
}

export function checkCompatibility(crops: string[]): CompatibilityWarning[] {
  const warnings: CompatibilityWarning[] = [];
  const db = warningsData as Record<string, { type: WarningType, note: string }>;

  // Check every pair
  for (let i = 0; i < crops.length; i++) {
    for (let j = i + 1; j < crops.length; j++) {
      const c1 = crops[i].toLowerCase();
      const c2 = crops[j].toLowerCase();
      
      const key1 = `${c1}+${c2}`;
      const key2 = `${c2}+${c1}`;
      
      if (db[key1]) {
        warnings.push({ crop1: c1, crop2: c2, type: db[key1].type, note: db[key1].note });
      } else if (db[key2]) {
        warnings.push({ crop1: c1, crop2: c2, type: db[key2].type, note: db[key2].note });
      }
    }
  }

  return warnings;
}
