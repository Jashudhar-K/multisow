/**
 * Enhanced Designer Integration
 * Integrates all Phase 7 and 8 features into the designer
 */

import { useState, useEffect, useCallback } from 'react';
import { presetToLayout, PlantLayout, RegionalPreset } from '@/lib/presetToLayout';
import { checkFarmCompatibility, CompatibilityWarning } from '@/lib/compatibility';
import { calculateOptimalSpacing, StrataLayer } from '@/lib/spacing';
import { useUndoRedo } from '@/hooks/useUndoRedo';

export interface DesignerState {
  plants: PlantLayout[];
  farmBounds: { x: number; y: number; width: number; height: number };
  season: number; // 0-11 for months or 0-4 for years
  overlays: {
    sunlight: boolean;
    rootCompetition: boolean;
    waterZones: boolean;
  };
  flyoverActive: boolean;
}

// Demo plants for initial state
const demoPlants: PlantLayout[] = [
  { id: 'demo-1', x: 20, y: 20, layer: 'overstory', species: 'coconut', spacingRadius: 8, growthStage: 1 },
  { id: 'demo-2', x: 50, y: 20, layer: 'overstory', species: 'coconut', spacingRadius: 8, growthStage: 0.8 },
  { id: 'demo-3', x: 80, y: 20, layer: 'overstory', species: 'coconut', spacingRadius: 8, growthStage: 0.9 },
  { id: 'demo-4', x: 35, y: 50, layer: 'middle', species: 'banana', spacingRadius: 4, growthStage: 1 },
  { id: 'demo-5', x: 65, y: 50, layer: 'middle', species: 'banana', spacingRadius: 4, growthStage: 0.7 },
  { id: 'demo-6', x: 20, y: 70, layer: 'understory', species: 'ginger', spacingRadius: 1, growthStage: 1 },
  { id: 'demo-7', x: 40, y: 70, layer: 'understory', species: 'ginger', spacingRadius: 1, growthStage: 0.9 },
  { id: 'demo-8', x: 60, y: 70, layer: 'understory', species: 'turmeric', spacingRadius: 1, growthStage: 1 },
  { id: 'demo-9', x: 80, y: 70, layer: 'understory', species: 'turmeric', spacingRadius: 1, growthStage: 0.8 },
];

const initialState: DesignerState = {
  plants: demoPlants,
  farmBounds: { x: 0, y: 0, width: 100, height: 100 },
  season: 6,
  overlays: {
    sunlight: false,
    rootCompetition: false,
    waterZones: false,
  },
  flyoverActive: false,
};

export function useEnhancedDesigner() {
  const {
    state: designerState,
    set: setDesignerState,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    undoCount,
    redoCount,
  } = useUndoRedo<DesignerState>(initialState);
  
  const [compatibilityWarnings, setCompatibilityWarnings] = useState<CompatibilityWarning[]>([]);
  const [selectedWarning, setSelectedWarning] = useState<CompatibilityWarning | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  
  // Check for pending preset from sessionStorage
  useEffect(() => {
    const pendingPresetStr = sessionStorage.getItem('pendingPreset');
    if (pendingPresetStr) {
      try {
        const preset: RegionalPreset = JSON.parse(pendingPresetStr);
        loadPreset(preset);
        sessionStorage.removeItem('pendingPreset');
      } catch (err) {
        console.error('Failed to load pending preset:', err);
      }
    }
  }, []);
  
  // Update compatibility warnings when plants change
  useEffect(() => {
    const warnings = checkFarmCompatibility(
      designerState.plants.map(p => ({
        id: p.id,
        x: p.x,
        y: p.y,
        species: p.species,
      })),
      3 // 3m radius threshold
    );
    setCompatibilityWarnings(warnings);
  }, [designerState.plants]);
  
  const loadPreset = useCallback((preset: RegionalPreset) => {
    // Convert preset to layout
    const layout = presetToLayout(preset, 2); // Default 2 acres
    
    // Calculate farm bounds from layout
    const maxX = Math.max(...layout.map(p => p.x), 100);
    const maxY = Math.max(...layout.map(p => p.y), 100);
    
    const newState: DesignerState = {
      ...designerState,
      plants: layout,
      farmBounds: { x: 0, y: 0, width: maxX + 10, height: maxY + 10 },
      flyoverActive: true,
    };
    
    setDesignerState(newState);
    setSelectedPresetId(preset.id);
    
    // Show toast notification
    showToast(`✅ ${preset.name} loaded — ${layout.length} plants placed`);
    
    // Disable flyover after animation completes
    setTimeout(() => {
      setDesignerState({
        ...newState,
        flyoverActive: false,
      });
    }, 4500); // 4s animation + 0.5s delay
  }, [designerState, setDesignerState]);
  
  const addPlant = useCallback((plant: Omit<PlantLayout, 'id'>) => {
    const newPlant: PlantLayout = {
      ...plant,
      id: `plant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    setDesignerState({
      ...designerState,
      plants: [...designerState.plants, newPlant],
    });
  }, [designerState, setDesignerState]);
  
  const removePlant = useCallback((plantId: string) => {
    setDesignerState({
      ...designerState,
      plants: designerState.plants.filter(p => p.id !== plantId),
    });
  }, [designerState, setDesignerState]);
  
  const updatePlant = useCallback((plantId: string, updates: Partial<PlantLayout>) => {
    setDesignerState({
      ...designerState,
      plants: designerState.plants.map(p =>
        p.id === plantId ? { ...p, ...updates } : p
      ),
    });
  }, [designerState, setDesignerState]);
  
  const toggleOverlay = useCallback((type: 'sunlight' | 'rootCompetition' | 'waterZones') => {
    setDesignerState({
      ...designerState,
      overlays: {
        ...designerState.overlays,
        [type]: !designerState.overlays[type],
      },
    });
  }, [designerState, setDesignerState]);
  
  const setseason = useCallback((season: number) => {
    setDesignerState({
      ...designerState,
      season,
    });
  }, [designerState, setDesignerState]);
  
  const getPlantGrowthScale = useCallback((plant: PlantLayout) => {
    // Calculate growth scale based on season
    // For perennials, use year-based growth
    // For annuals, use month-based growth
    
    const monthProgress = designerState.season / 11; // 0-1
    const baseGrowth = plant.growthStage || 0.7;
    
    // Scale growth from 0.3 to 1.0 based on season
    return Math.min(baseGrowth * (0.3 + monthProgress * 0.7), 1.0);
  }, [designerState.season]);
  
  const calculateSpacing = useCallback((species: string, layer: StrataLayer, targetDensity: 'low' | 'medium' | 'high' = 'medium') => {
    const farmArea = (designerState.farmBounds.width * designerState.farmBounds.height) / 4046.86; // Convert m² to acres
    return calculateOptimalSpacing(species, layer, farmArea, targetDensity);
  }, [designerState.farmBounds]);
  
  return {
    designerState,
    setDesignerState,
    compatibilityWarnings,
    selectedWarning,
    setSelectedWarning,
    selectedPresetId,
    
    // Actions
    loadPreset,
    addPlant,
    removePlant,
    updatePlant,
    toggleOverlay,
    setseason,
    
    // Undo/Redo
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    undoCount,
    redoCount,
    
    // Utilities
    getPlantGrowthScale,
    calculateSpacing,
  };
}

function showToast(message: string) {
  // Simple toast implementation
  const toast = document.createElement('div');
  toast.className = 'fixed top-20 right-4 z-50 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-xl font-medium';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
