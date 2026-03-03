'use client'

// FarmCanvas.tsx
// 3D farm designer canvas

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for 3D scene (R3F)
const FarmScene = dynamic(() => import('../farm/FarmScene'), { ssr: false });

// Types for props
import type { PlantInstance, StrataLayerId } from '@/types/farm';

interface Row {
  id: string;
  start: [number, number];
  end: [number, number];
  spacing: number;
  speciesId: string;
  layer: StrataLayerId;
}

interface FarmCanvasProps {
  plants: PlantInstance[];
  rows: Row[];
  visibleLayers: StrataLayerId[];
  flyoverActive?: boolean;
  farmBounds?: { x: number; y: number; width: number; height: number };
  onPlantClick?: (plantId: string) => void;
  selectedPlantId?: string;
}

// Main FarmCanvas - 3D Only
const FarmCanvas: React.FC<FarmCanvasProps> = ({
  plants,
  rows,
  visibleLayers,
  flyoverActive = false,
  farmBounds = { x: 0, y: 0, width: 100, height: 100 },
  onPlantClick,
  selectedPlantId,
}) => {
  return (
    <div className="w-full h-full bg-[#0A0F0A] rounded-2xl overflow-hidden">
      <FarmScene
        plants={plants.filter((p) => visibleLayers.includes(p.layer))}
        rows={rows.filter((r) => visibleLayers.includes(r.layer))}
        showGrid={true}
        showStats={true}
        fieldSize={Math.max(farmBounds.width, farmBounds.height)}
        flyoverActive={flyoverActive}
        farmBounds={farmBounds}
        onPlantClick={onPlantClick}
        selectedPlantId={selectedPlantId}
      />
    </div>
  );
};

export default FarmCanvas;
