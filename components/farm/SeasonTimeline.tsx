/**
 * Season Timeline Component
 * Slider for visualizing crop growth over time
 */

import { useState } from 'react';

interface SeasonTimelineProps {
  season?: number; // Controlled value
  onSeasonChange?: (month: number) => void;
  mode?: 'monthly' | 'yearly';
}

export function SeasonTimeline({ season, onSeasonChange, mode = 'monthly' }: SeasonTimelineProps) {
  const [internalValue, setInternalValue] = useState(mode === 'monthly' ? 6 : 3);
  
  // Use controlled value if provided, otherwise internal state
  const value = season !== undefined ? season : internalValue;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (season === undefined) {
      setInternalValue(val);
    }
    onSeasonChange?.(val);
  };
  
  const labels = mode === 'monthly'
    ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    : ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
  
  const max = mode === 'monthly' ? 11 : 4;
  const currentLabel = labels[value];
  
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 bg-glass backdrop-blur-md rounded-full px-6 py-3 shadow-xl border border-white/20 min-w-[400px]">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-600">Season Timeline</span>
          <span className="text-sm font-bold text-emerald-700">{currentLabel}</span>
        </div>
        
        <div className="relative">
          <input
            type="range"
            min={0}
            max={max}
            value={value}
            onChange={handleChange}
            title="Season timeline"
            aria-label="Season timeline"
            className="w-full h-2 bg-emerald-100 rounded-full appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #10b981 0%, #10b981 ${(value / max) * 100}%, #d1fae5 ${(value / max) * 100}%, #d1fae5 100%)`,
            }}
          />
          
          {/* Month/year markers */}
          <div className="flex justify-between mt-1 px-1">
            {labels.map((label, idx) => (
              <div
                key={idx}
                className={`text-[10px] ${idx === value ? 'text-emerald-700 font-bold' : 'text-gray-400'}`}
                style={{ width: `${100 / labels.length}%`, textAlign: 'center' }}
              >
                {idx % (mode === 'monthly' ? 3 : 1) === 0 ? label : ''}
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-[10px] text-gray-500 text-center mt-1">
          Drag to visualize crop growth over time
        </div>
      </div>
      
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          border: 2px solid white;
        }
        
        .slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          border: 2px solid white;
        }
      `}</style>
    </div>
  );
}
