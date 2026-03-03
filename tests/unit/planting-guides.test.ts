import { plantingGuides } from '@/data/planting-guides';
import { describe, it, expect } from 'vitest';

describe('Planting Guides', () => {
  it('All 6 presets have a planting guide entry', () => {
    expect(plantingGuides.length).toBe(6);
  });

  it('Each guide has non-empty plantingSequence array', () => {
    for (const guide of plantingGuides) {
      expect(Array.isArray(guide.plantingSequence)).toBe(true);
      expect(guide.plantingSequence.length).toBeGreaterThan(0);
    }
  });

  it('harvestCalendar entries have valid firstHarvest strings', () => {
    for (const guide of plantingGuides) {
      for (const entry of guide.harvestCalendar) {
        expect(typeof entry.firstHarvest).toBe('string');
        expect(entry.firstHarvest.length).toBeGreaterThan(0);
      }
    }
  });

  it('fertilizerSchedule month values are 1–12', () => {
    for (const guide of plantingGuides) {
      for (const fert of guide.fertilizerSchedule) {
        expect(fert.month).toBeGreaterThanOrEqual(1);
        expect(fert.month).toBeLessThanOrEqual(12);
      }
    }
  });
});
