/**
 * Compatibility Warning Overlays
 * Shows warning dots on incompatible plant pairs
 */

import { CompatibilityWarning } from '@/lib/compatibility';

interface CompatibilityWarningsProps {
  warnings: CompatibilityWarning[];
  plants: Array<{ id: string; x: number; y: number; species: string }>;
  onWarningClick?: (warning: CompatibilityWarning) => void;
}

export function CompatibilityWarnings({
  warnings,
  plants,
  onWarningClick,
}: CompatibilityWarningsProps) {
  if (warnings.length === 0) return null;
  
  // Create a map of plant IDs to positions
  const plantMap = new Map(plants.map(p => [p.id, p]));
  
  return (
    <g className="compatibility-warnings">
      {warnings.map((warning, idx) => {
        const p1 = plantMap.get(warning.plantId1);
        const p2 = plantMap.get(warning.plantId2);
        
        if (!p1 || !p2) return null;
        
        // Draw line between incompatible plants
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        
        return (
          <g key={idx}>
            {/* Warning line */}
            <line
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="#f59e0b"
              strokeWidth={0.3}
              strokeDasharray="1,1"
              opacity={0.6}
            />
            
            {/* Warning icon at midpoint */}
            <g
              transform={`translate(${midX}, ${midY})`}
              onClick={() => onWarningClick?.(warning)}
              className="cursor-pointer hover:opacity-100 transition-opacity"
              opacity={0.9}
            >
              <circle
                r={0.8}
                fill="#fbbf24"
                stroke="#f59e0b"
                strokeWidth={0.15}
              />
              <text
                textAnchor="middle"
                dy="0.4"
                fontSize="1.2"
                fill="#78350f"
                fontWeight="bold"
              >
                ⚠
              </text>
            </g>
          </g>
        );
      })}
    </g>
  );
}

/**
 * Compatibility Warning Tooltip
 */
interface WarningTooltipProps {
  warning: CompatibilityWarning | null;
  position?: { x: number; y: number };
  onClose: () => void;
}

export function WarningTooltip({ warning, position, onClose }: WarningTooltipProps) {
  if (!warning || !position) return null;
  
  const severityColors = {
    low: 'bg-yellow-50 border-yellow-300',
    medium: 'bg-orange-50 border-orange-300',
    high: 'bg-red-50 border-red-300',
  };
  
  const severityText = {
    low: 'Minor Issue',
    medium: 'Moderate Concern',
    high: 'Critical Incompatibility',
  };
  
  return (
    <div
      className={`absolute z-50 p-4 rounded-lg shadow-xl border-2 ${severityColors[warning.severity]} max-w-xs`}
      style={{
        left: position.x + 20,
        top: position.y - 20,
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚠️</span>
          <span className="font-bold text-sm">{severityText[warning.severity]}</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-lg leading-none"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-semibold">Incompatible Crops:</span>
          <div className="ml-2 text-xs">
            • {warning.species1}<br />
            • {warning.species2}
          </div>
        </div>
        
        <div>
          <span className="font-semibold">Reason:</span>
          <p className="text-xs mt-1 text-gray-700">{warning.reason}</p>
        </div>
        
        <div className="pt-2 border-t border-gray-300">
          <span className="font-semibold text-xs">Recommendation:</span>
          <p className="text-xs mt-1 text-gray-700">
            {warning.severity === 'high'
              ? 'Consider replacing one of these crops or increasing spacing to >10m.'
              : 'Monitor plant health closely and adjust if needed.'}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Compatibility Summary Panel
 */
interface CompatibilitySummaryProps {
  warnings: CompatibilityWarning[];
  totalPlants: number;
}

export function CompatibilitySummary({ warnings, totalPlants }: CompatibilitySummaryProps) {
  const highSeverity = warnings.filter(w => w.severity === 'high').length;
  const mediumSeverity = warnings.filter(w => w.severity === 'medium').length;
  const lowSeverity = warnings.filter(w => w.severity === 'low').length;
  
  const totalIssues = warnings.length;
  const compatibilityScore = Math.max(0, 100 - (highSeverity * 20 + mediumSeverity * 10 + lowSeverity * 5));
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border">
      <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Compatibility Check
      </h3>
      
      <div className="space-y-3">
        {/* Score */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium">Compatibility Score</span>
            <span className={`text-lg font-bold ${compatibilityScore >= 80 ? 'text-green-600' : compatibilityScore >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
              {compatibilityScore}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${compatibilityScore >= 80 ? 'bg-green-500' : compatibilityScore >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${compatibilityScore}%` }}
            />
          </div>
        </div>
        
        {/* Issues breakdown */}
        {totalIssues > 0 ? (
          <div className="space-y-1 text-xs">
            <div className="font-medium">Issues Found:</div>
            {highSeverity > 0 && (
              <div className="flex items-center gap-2 text-red-600">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                {highSeverity} Critical
              </div>
            )}
            {mediumSeverity > 0 && (
              <div className="flex items-center gap-2 text-orange-600">
                <span className="w-3 h-3 rounded-full bg-orange-500" />
                {mediumSeverity} Moderate
              </div>
            )}
            {lowSeverity > 0 && (
              <div className="flex items-center gap-2 text-yellow-600">
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                {lowSeverity} Minor
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            All crops compatible!
          </div>
        )}
        
        <div className="text-xs text-gray-500 pt-2 border-t">
          Checked {totalPlants} plants for allelopathy and competition issues
        </div>
      </div>
    </div>
  );
}
