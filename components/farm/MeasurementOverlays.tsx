/**
 * Measurement Overlays
 * Sunlight map, root competition, water zones
 */

interface OverlayType {
  type: 'sunlight' | 'root-competition' | 'water-zones';
  enabled: boolean;
}

interface MeasurementOverlaysProps {
  overlays: OverlayType[];
  onToggle: (type: OverlayType['type']) => void;
  plants?: Array<{ x: number; y: number; species: string; layer: string }>;
  farmBounds?: { width: number; height: number };
}

export function MeasurementOverlays({
  overlays,
  onToggle,
  plants = [],
  farmBounds = { width: 100, height: 100 },
}: MeasurementOverlaysProps) {
  const sunlightOverlay = overlays.find(o => o.type === 'sunlight');
  const rootOverlay = overlays.find(o => o.type === 'root-competition');
  const waterOverlay = overlays.find(o => o.type === 'water-zones');
  
  return (
    <div className="bg-black/90 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden w-[280px]">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b border-white/10">
        <div className="w-2 h-2 rounded-full bg-green-400" />
        <h3 className="font-bold text-sm text-white">Measurement Overlays</h3>
      </div>
      
      <div className="p-3 space-y-2">
        {/* Sunlight Map */}
        <label className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
          <input
            type="checkbox"
            checked={sunlightOverlay?.enabled || false}
            onChange={() => onToggle('sunlight')}
            className="w-4 h-4 rounded accent-green-500"
          />
          <div className="flex-1">
            <div className="font-medium text-xs text-white">Sunlight Map</div>
            <div className="text-xs text-neutral-400">PAR heatmap (Beer-Lambert)</div>
          </div>
          <div className="w-6 h-6 rounded" style={{ background: 'linear-gradient(to bottom, #fef3c7, #065f46)' }} />
        </label>
        
        {/* Root Competition */}
        <label className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
          <input
            type="checkbox"
            checked={rootOverlay?.enabled || false}
            onChange={() => onToggle('root-competition')}
            className="w-4 h-4 rounded accent-green-500"
          />
          <div className="flex-1">
            <div className="font-medium text-xs text-white">Root Competition</div>
            <div className="text-xs text-neutral-400">ROI intensity zones</div>
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-6 rounded bg-green-400" />
            <div className="w-2 h-6 rounded bg-amber-400" />
            <div className="w-2 h-6 rounded bg-red-400" />
          </div>
        </label>
        
        {/* Water Zones */}
        <label className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
          <input
            type="checkbox"
            checked={waterOverlay?.enabled || false}
            onChange={() => onToggle('water-zones')}
            className="w-4 h-4 rounded accent-green-500"
          />
          <div className="flex-1">
            <div className="font-medium text-xs text-white">Water Zones</div>
            <div className="text-xs text-neutral-400">Irrigation coverage</div>
          </div>
          <div className="w-6 h-6 rounded-full bg-blue-200 border-2 border-blue-400" />
        </label>
      </div>
      
      {/* Legend */}
      {sunlightOverlay?.enabled && (
        <div className="px-3 pb-3">
          <div className="p-2 rounded-lg bg-white/5 border border-white/5">
            <div className="text-xs font-medium mb-2 text-white">Sunlight Legend</div>
            <div className="flex justify-between text-xs text-neutral-400 mb-1">
              <span>Full Sun</span>
              <span>Deep Shade</span>
            </div>
            <div className="h-3 rounded mt-1" style={{ background: 'linear-gradient(to right, #fef3c7, #84cc16, #065f46)' }} />
            <div className="flex justify-between text-xs text-neutral-500 mt-1">
              <span>&gt;80%</span>
              <span>20–50%</span>
              <span>&lt;20%</span>
            </div>
          </div>
        </div>
      )}
      
      {rootOverlay?.enabled && (
        <div className="px-3 pb-3">
          <div className="p-2 rounded-lg bg-white/5 border border-white/5">
            <div className="text-xs font-medium mb-2 text-white">Root Competition (ROI)</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-neutral-400">Low (&lt;0.3) — Optimal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="text-neutral-400">Medium (0.3–0.6) — Acceptable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <span className="text-neutral-400">High (&gt;0.6) — Excessive</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Render sunlight heatmap as SVG overlay
 */
export function SunlightHeatmap({
  plants,
  farmBounds,
  gridSize = 5, // meters per cell
}: {
  plants: Array<{ x: number; y: number; species: string; layer: string }>;
  farmBounds: { width: number; height: number };
  gridSize?: number;
}) {
  const cells: Array<{ x: number; y: number; light: number }> = [];
  
  // Calculate light at each grid cell using Beer-Lambert law
  for (let y = 0; y < farmBounds.height; y += gridSize) {
    for (let x = 0; x < farmBounds.width; x += gridSize) {
      let accumulatedShade = 0;
      
      // Check all overstory plants for shading
      plants.forEach(plant => {
        if (plant.layer === 'overstory') {
          const dist = Math.hypot(plant.x - x, plant.y - y);
          const shadeRadius = 6; // approximate canopy radius
          
          if (dist < shadeRadius) {
            // Exponential decay based on distance
            const shadeFactor = Math.exp(-(dist / shadeRadius));
            accumulatedShade += shadeFactor * 0.7; // 70% max shade
          }
        }
      });
      
      const light = Math.max(0, 1 - accumulatedShade);
      cells.push({ x, y, light });
    }
  }
  
  return (
    <g className="sunlight-heatmap" opacity={0.5}>
      {cells.map((cell, idx) => {
        const color = getLightColor(cell.light);
        return (
          <rect
            key={idx}
            x={cell.x}
            y={cell.y}
            width={gridSize}
            height={gridSize}
            fill={color}
            opacity={0.6}
          />
        );
      })}
    </g>
  );
}

function getLightColor(light: number): string {
  // Gradient: yellow (full sun) → lime → dark green (shade)
  if (light > 0.8) return '#fef3c7';
  if (light > 0.6) return '#fef08a';
  if (light > 0.4) return '#bef264';
  if (light > 0.2) return '#84cc16';
  return '#065f46';
}

/**
 * Render root competition overlay
 */
export function RootCompetitionOverlay({
  plants,
  farmBounds,
  gridSize = 5,
}: {
  plants: Array<{ x: number; y: number; species: string; layer: string }>;
  farmBounds: { width: number; height: number };
  gridSize?: number;
}) {
  const cells: Array<{ x: number; y: number; roi: number }> = [];
  
  // Calculate root overlap index at each grid cell
  for (let y = 0; y < farmBounds.height; y += gridSize) {
    for (let x = 0; x < farmBounds.width; x += gridSize) {
      let totalCompetition = 0;
      
      plants.forEach(plant => {
        const rootRadius = plant.layer === 'overstory' ? 5 : plant.layer === 'middle' ? 2.5 : 1;
        const dist = Math.hypot(plant.x - x, plant.y - y);
        
        if (dist < rootRadius) {
          const competitionFactor = 1 - (dist / rootRadius);
          totalCompetition += competitionFactor;
        }
      });
      
      // ROI ranges from 0 (no competition) to 1+ (high competition)
      const roi = Math.min(totalCompetition / 2, 1);
      cells.push({ x, y, roi });
    }
  }
  
  return (
    <g className="root-competition-overlay" opacity={0.5}>
      {cells.map((cell, idx) => {
        const color = getROIColor(cell.roi);
        return (
          <rect
            key={idx}
            x={cell.x}
            y={cell.y}
            width={gridSize}
            height={gridSize}
            fill={color}
            opacity={0.6}
          />
        );
      })}
    </g>
  );
}

function getROIColor(roi: number): string {
  if (roi < 0.3) return '#86efac'; // green
  if (roi < 0.6) return '#fbbf24'; // amber
  return '#f87171'; // red
}
