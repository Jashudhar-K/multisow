// DesignerSidebar.tsx
// Right panel for farm designer (Phase 2 + Phase 7/8/9)
'use client';

import React, { useState } from 'react';
import type { PlantInstance } from '@/types/farm';
import type { CompatibilityWarning } from '@/lib/compatibility';
import { CompatibilitySummary } from '@/components/farm';
import PlantingGuidePanel from '@/components/designer/PlantingGuidePanel';
import { useLanguage } from '@/context/LanguageContext';

type SidebarTab = 'status' | 'compatibility' | 'overlays' | 'guide';

interface DesignerSidebarProps {
  compatibilityWarnings?: CompatibilityWarning[];
  plants?: PlantInstance[];
  season?: number;
  overlays?: {
    sunlight: boolean;
    rootCompetition: boolean;
    waterZones: boolean;
  };
  selectedPresetId?: string | null;
}

const DesignerSidebar: React.FC<DesignerSidebarProps> = ({
  compatibilityWarnings = [],
  plants = [],
  season = 0,
  overlays = { sunlight: false, rootCompetition: false, waterZones: false },
  selectedPresetId = null,
}) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('status');
  const { t } = useLanguage();

  const TAB_ITEMS: { key: SidebarTab; label: string; icon: string }[] = [
    { key: 'status', label: t('designer.status') || 'Status', icon: '📊' },
    { key: 'compatibility', label: t('designer.check') || 'Check', icon: '✅' },
    { key: 'overlays', label: t('designer.layers') || 'Layers', icon: '🗺️' },
    { key: 'guide', label: t('designer.guide') || 'Guide', icon: '📚' },
  ];

  return (
    <aside className="w-80 shrink-0 bg-[#0F1A0F] border-l border-green-900/30 h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-green-900/30">
        {TAB_ITEMS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-2 py-3 text-xs font-medium transition-colors flex flex-col items-center gap-1 ${
              activeTab === tab.key
                ? 'text-green-400 bg-green-900/20 border-b-2 border-green-400'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
            }`}
          >
            <span className="text-base">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Status Tab */}
        {activeTab === 'status' && (
          <div className="p-4 space-y-6">
            <div className="text-green-400 font-bold text-lg">Farm Status</div>

            {/* Farm Info */}
            <div>
              <h3 className="text-white text-sm font-semibold mb-3">Statistics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-neutral-300">
                  <span>Total Plants:</span>
                  <span className="font-mono text-green-400">{plants.length}</span>
                </div>
                <div className="flex justify-between text-neutral-300">
                  <span>Current Season:</span>
                  <span className="font-mono text-green-400">
                    {season < 12 ? `Month ${season + 1}` : `Year ${Math.floor(season / 12) + 1}`}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-300">
                  <span>Active Overlays:</span>
                  <span className="font-mono text-green-400">
                    {Object.values(overlays).filter(Boolean).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Plant Breakdown by Layer */}
            {plants.length > 0 && (
              <div>
                <h3 className="text-white text-sm font-semibold mb-3">Layer Distribution</h3>
                <div className="space-y-2">
                  {['canopy', 'midstory', 'understory', 'groundcover'].map((layer) => {
                    const count = plants.filter((p) => p.layer === layer).length;
                    const percentage = plants.length > 0 ? Math.round((count / plants.length) * 100) : 0;
                    return (
                      <div key={layer} className="text-xs">
                        <div className="flex justify-between text-gray-400 mb-1">
                          <span className="capitalize">{layer}</span>
                          <span>{count} ({percentage}%)</span>
                        </div>
                        <div className="h-1.5 bg-gray-800 rounded overflow-hidden">
                          <div
                            className={`h-full rounded ${
                              layer === 'canopy'
                                ? 'bg-green-500'
                                : layer === 'midstory'
                                ? 'bg-yellow-500'
                                : layer === 'understory'
                                ? 'bg-orange-500'
                                : 'bg-amber-700'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="pt-4 border-t border-green-900/30">
              <h4 className="text-green-400 text-xs font-semibold mb-2">Quick Tips</h4>
              <ul className="text-xs text-neutral-400 space-y-1">
                <li>• Use Ctrl+Z / Ctrl+Y to undo/redo</li>
                <li>• Toggle overlays to analyze farm conditions</li>
                <li>• Season timeline shows growth stages</li>
                <li>• Check compatibility before planting</li>
              </ul>
            </div>
          </div>
        )}

        {/* Compatibility Tab */}
        {activeTab === 'compatibility' && (
          <div className="p-4 space-y-4">
            <div className="text-green-400 font-bold text-lg">Compatibility</div>
            
            {plants.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="text-4xl mb-3">🌱</div>
                <p className="text-sm text-gray-400">
                  Add plants to see compatibility analysis
                </p>
              </div>
            ) : (
              <CompatibilitySummary
                warnings={compatibilityWarnings}
                totalPlants={plants.length}
              />
            )}

            {/* Compatibility Legend */}
            <div className="mt-6 pt-4 border-t border-green-900/30">
              <h4 className="text-xs font-semibold text-gray-400 mb-3">Warning Types</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-red-400">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span>Critical - Immediate action needed</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-400">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span>Warning - Review recommended</span>
                </div>
                <div className="flex items-center gap-2 text-blue-400">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Info - Optional optimization</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Overlays Tab */}
        {activeTab === 'overlays' && (
          <div className="p-4 space-y-4">
            <div className="text-green-400 font-bold text-lg">Analysis Layers</div>
            
            {/* Active Overlays */}
            <div className="space-y-2">
              <div
                className={`px-3 py-3 rounded border ${
                  overlays.sunlight
                    ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300'
                    : 'bg-gray-800/30 border-gray-700/30 text-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">☀️</span>
                    <span className="text-sm font-medium">Sunlight Map</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    overlays.sunlight ? 'bg-yellow-600/50' : 'bg-gray-700/50'
                  }`}>
                    {overlays.sunlight ? 'ON' : 'OFF'}
                  </span>
                </div>
                <p className="text-xs mt-1 opacity-70">Shows light intensity and shade zones</p>
              </div>

              <div
                className={`px-3 py-3 rounded border ${
                  overlays.rootCompetition
                    ? 'bg-orange-500/20 border-orange-500/40 text-orange-300'
                    : 'bg-gray-800/30 border-gray-700/30 text-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🌱</span>
                    <span className="text-sm font-medium">Root Competition</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    overlays.rootCompetition ? 'bg-orange-600/50' : 'bg-gray-700/50'
                  }`}>
                    {overlays.rootCompetition ? 'ON' : 'OFF'}
                  </span>
                </div>
                <p className="text-xs mt-1 opacity-70">Visualizes underground root spread</p>
              </div>

              <div
                className={`px-3 py-3 rounded border ${
                  overlays.waterZones
                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                    : 'bg-gray-800/30 border-gray-700/30 text-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💧</span>
                    <span className="text-sm font-medium">Water Zones</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    overlays.waterZones ? 'bg-blue-600/50' : 'bg-gray-700/50'
                  }`}>
                    {overlays.waterZones ? 'ON' : 'OFF'}
                  </span>
                </div>
                <p className="text-xs mt-1 opacity-70">Displays irrigation coverage</p>
              </div>
            </div>

            {/* Usage hint */}
            <div className="pt-4 border-t border-green-900/30">
              <p className="text-xs text-gray-400">
                💡 Toggle overlays from the left panel for detailed visualization.
              </p>
            </div>
          </div>
        )}

        {/* Planting Guide Tab */}
        {activeTab === 'guide' && (
          <PlantingGuidePanel presetId={selectedPresetId} />
        )}
      </div>
    </aside>
  );
};

export default DesignerSidebar;
