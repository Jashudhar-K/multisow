'use client';

import React, { useState, useRef } from 'react';
import {
  PlantingGuide,
  getPlantingGuide,
  PlantingSequenceStep,
  SpacingGuide,
  IrrigationSchedule,
  FertilizerSchedule,
  PestManagement,
  HarvestCalendar,
  RevenueProjection,
} from '@/data/planting-guides';

// ═══════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════

interface PlantingGuidePanelProps {
  presetId: string | null;
}

type TabKey =
  | 'overview'
  | 'timeline'
  | 'spacing'
  | 'irrigation'
  | 'fertiliser'
  | 'pest'
  | 'harvest';

interface TabConfig {
  key: TabKey;
  label: string;
  icon: string;
}

// ═══════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════

const TABS: TabConfig[] = [
  { key: 'overview', label: 'Overview', icon: '📋' },
  { key: 'timeline', label: 'Timeline', icon: '📅' },
  { key: 'spacing', label: 'Spacing', icon: '📏' },
  { key: 'irrigation', label: 'Irrigation', icon: '💧' },
  { key: 'fertiliser', label: 'Fertiliser', icon: '🌱' },
  { key: 'pest', label: 'Pest Mgmt', icon: '🐛' },
  { key: 'harvest', label: 'Harvest', icon: '🌾' },
];

// ═══════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════

function InfoCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: string;
}) {
  return (
    <div className="bg-green-900/30 rounded-lg p-3 border border-green-700/30">
      <div className="text-xs text-green-400/70 mb-1">
        {icon && <span className="mr-1">{icon}</span>}
        {label}
      </div>
      <div className="text-sm text-white font-medium">{value}</div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-sm font-semibold text-green-300 mb-2 flex items-center gap-2">
      {children}
    </h4>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="text-xs text-gray-300 space-y-1">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-2">
          <span className="text-green-500 mt-0.5">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// TAB CONTENT COMPONENTS
// ═══════════════════════════════════════════════════════════════════════

function OverviewTab({ guide }: { guide: PlantingGuide }) {
  return (
    <div className="space-y-4">
      {/* Key Info Cards */}
      <div className="grid grid-cols-2 gap-2">
        <InfoCard label="Best Season" value={guide.bestSeason} icon="🗓️" />
        <InfoCard label="Region" value={guide.region} icon="📍" />
        <InfoCard label="Climate" value={guide.climateZone} icon="🌡️" />
        <InfoCard label="Rainfall" value={guide.annualRainfall} icon="🌧️" />
        <InfoCard label="Altitude" value={guide.altitude} icon="⛰️" />
        <InfoCard
          label="States"
          value={guide.suitableStates.slice(0, 2).join(', ')}
          icon="🗺️"
        />
      </div>

      {/* Soil Requirements */}
      <div>
        <SectionTitle>🪨 Soil Requirements</SectionTitle>
        <BulletList items={guide.soilRequirements} />
      </div>

      {/* Soil Preparation */}
      <div>
        <SectionTitle>🚜 Soil Preparation</SectionTitle>
        <BulletList items={guide.soilPrep.slice(0, 5)} />
        {guide.soilPrep.length > 5 && (
          <p className="text-xs text-green-500/70 mt-1 italic">
            +{guide.soilPrep.length - 5} more steps...
          </p>
        )}
      </div>

      {/* Nursery Work */}
      <div>
        <SectionTitle>🌿 Nursery Work</SectionTitle>
        <BulletList items={guide.nurseryWork.slice(0, 4)} />
        {guide.nurseryWork.length > 4 && (
          <p className="text-xs text-green-500/70 mt-1 italic">
            +{guide.nurseryWork.length - 4} more items...
          </p>
        )}
      </div>

      {/* Revenue Projection Summary */}
      <div>
        <SectionTitle>💰 Revenue Projection</SectionTitle>
        <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-lg p-3 border border-green-600/30">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Year 5 Projected</span>
            <span className="text-lg font-bold text-green-400">
              {guide.revenueProjection[4]?.revenue || 'N/A'}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Primary: {guide.revenueProjection[4]?.primaryCrop || 'Full System'}
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineTab({ guide }: { guide: PlantingGuide }) {
  return (
    <div className="space-y-3">
      <SectionTitle>📅 Planting Sequence</SectionTitle>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-green-700/50" />

        {guide.plantingSequence.map((step: PlantingSequenceStep, idx: number) => (
          <div key={idx} className="relative pl-10 pb-4">
            {/* Timeline dot */}
            <div
              className={`absolute left-2.5 w-3 h-3 rounded-full border-2 ${
                step.layer === 'overstory'
                  ? 'bg-green-600 border-green-400'
                  : step.layer === 'middle'
                  ? 'bg-yellow-600 border-yellow-400'
                  : step.layer === 'understory'
                  ? 'bg-orange-600 border-orange-400'
                  : 'bg-purple-600 border-purple-400'
              }`}
            />

            {/* Content */}
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-medium text-green-400">
                  Week {step.week}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded uppercase ${
                    step.layer === 'overstory'
                      ? 'bg-green-900/50 text-green-400'
                      : step.layer === 'middle'
                      ? 'bg-yellow-900/50 text-yellow-400'
                      : step.layer === 'understory'
                      ? 'bg-orange-900/50 text-orange-400'
                      : 'bg-purple-900/50 text-purple-400'
                  }`}
                >
                  {step.layer}
                </span>
              </div>
              <div className="text-sm text-white mb-1">{step.activity}</div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-green-500">{step.species}</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-400">{step.notes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpacingTab({ guide }: { guide: PlantingGuide }) {
  return (
    <div className="space-y-3">
      <SectionTitle>📏 Spacing Guide</SectionTitle>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-green-400/70 border-b border-gray-700">
              <th className="pb-2 pr-2">Species</th>
              <th className="pb-2 pr-2">Row</th>
              <th className="pb-2 pr-2">Plant</th>
              <th className="pb-2 pr-2">Depth</th>
              <th className="pb-2">Method</th>
            </tr>
          </thead>
          <tbody>
            {guide.spacingGuide.map((row: SpacingGuide, idx: number) => (
              <tr
                key={idx}
                className="border-b border-gray-800/50 text-gray-300"
              >
                <td className="py-2 pr-2 font-medium text-white">
                  {row.species}
                </td>
                <td className="py-2 pr-2">{row.rowSpacing}</td>
                <td className="py-2 pr-2">{row.plantSpacing}</td>
                <td className="py-2 pr-2">{row.depth}</td>
                <td className="py-2 capitalize text-green-400">{row.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Visual spacing diagram hint */}
      <div className="bg-green-900/20 rounded-lg p-3 border border-green-700/30">
        <p className="text-xs text-gray-400">
          💡 <span className="text-green-400">Tip:</span> Use the measurement
          overlay tool in the designer to visualize actual spacing on your farm
          layout.
        </p>
      </div>
    </div>
  );
}

function IrrigationTab({ guide }: { guide: PlantingGuide }) {
  return (
    <div className="space-y-3">
      <SectionTitle>💧 Irrigation Schedule</SectionTitle>
      {guide.irrigationSchedule.map((item: IrrigationSchedule, idx: number) => (
        <div
          key={idx}
          className="bg-blue-900/20 rounded-lg p-3 border border-blue-700/30"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-blue-300">
              {item.stage}
            </span>
            <span className="text-xs bg-blue-800/50 text-blue-300 px-2 py-0.5 rounded">
              {item.frequency}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500">Method:</span>{' '}
              <span className="text-gray-300">{item.method}</span>
            </div>
            <div>
              <span className="text-gray-500">Amount:</span>{' '}
              <span className="text-gray-300">{item.amount}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FertiliserTab({ guide }: { guide: PlantingGuide }) {
  // Group by month for better organization
  const sorted = [...guide.fertilizerSchedule].sort(
    (a, b) => a.month - b.month
  );

  return (
    <div className="space-y-3">
      <SectionTitle>🌱 Fertiliser Schedule</SectionTitle>
      <div className="space-y-2">
        {sorted.map((item: FertilizerSchedule, idx: number) => (
          <div
            key={idx}
            className="bg-amber-900/20 rounded-lg p-3 border border-amber-700/30"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-amber-300">
                Month {item.month}
              </span>
              <span className="text-xs bg-amber-800/50 text-amber-300 px-2 py-0.5 rounded">
                {item.method}
              </span>
            </div>
            <div className="text-xs text-white mb-1">{item.fertilizer}</div>
            <div className="text-xs text-gray-400">Qty: {item.quantity}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PestTab({ guide }: { guide: PlantingGuide }) {
  return (
    <div className="space-y-3">
      <SectionTitle>🐛 Pest Management</SectionTitle>
      {guide.pestManagement.map((item: PestManagement, idx: number) => (
        <div
          key={idx}
          className="bg-red-900/20 rounded-lg p-3 border border-red-700/30"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-red-300">{item.pest}</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div>
              <span className="text-gray-500">Symptom:</span>{' '}
              <span className="text-gray-300">{item.symptom}</span>
            </div>
            <div>
              <span className="text-red-400">Treatment:</span>{' '}
              <span className="text-gray-300">{item.treatment}</span>
            </div>
            <div>
              <span className="text-green-400">Preventive:</span>{' '}
              <span className="text-gray-300">{item.preventive}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function HarvestTab({ guide }: { guide: PlantingGuide }) {
  return (
    <div className="space-y-4">
      {/* Harvest Calendar */}
      <div>
        <SectionTitle>🌾 Harvest Calendar</SectionTitle>
        {guide.harvestCalendar.map((item: HarvestCalendar, idx: number) => (
          <div
            key={idx}
            className="bg-emerald-900/20 rounded-lg p-3 border border-emerald-700/30 mb-2"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-emerald-300">
                {item.species}
              </span>
              <span className="text-xs bg-emerald-800/50 text-emerald-300 px-2 py-0.5 rounded">
                First: {item.firstHarvest}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Peak:</span>{' '}
                <span className="text-gray-300">{item.peakSeason}</span>
              </div>
              <div>
                <span className="text-gray-500">Yield:</span>{' '}
                <span className="text-green-400">{item.yield}</span>
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Method: {item.method}
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Projection */}
      <div>
        <SectionTitle>💰 5-Year Revenue Projection</SectionTitle>
        <div className="space-y-2">
          {guide.revenueProjection.map((item: RevenueProjection, idx: number) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-gray-800/50 rounded-lg p-2 border border-gray-700/30"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">Year {item.year}</span>
                <span className="text-xs text-gray-400">{item.primaryCrop}</span>
              </div>
              <span className="text-sm font-medium text-green-400">
                {item.revenue}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export function PlantingGuidePanel({ presetId }: PlantingGuidePanelProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const contentRef = useRef<HTMLDivElement>(null);

  const guide = presetId ? getPlantingGuide(presetId) : null;

  // ─────────────────────────────────────────────────────────────────────
  // Print / Export Handler
  // ─────────────────────────────────────────────────────────────────────
  const handlePrint = () => {
    if (!guide) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Generate printable HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${guide.title} - Planting Guide</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            padding: 20px; 
            max-width: 800px; 
            margin: 0 auto;
            color: #333;
          }
          h1 { color: #166534; border-bottom: 2px solid #166534; padding-bottom: 10px; }
          h2 { color: #15803d; margin-top: 24px; }
          h3 { color: #166534; margin-top: 16px; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background: #f0fdf4; }
          .info-box { background: #f0fdf4; padding: 12px; border-radius: 8px; margin: 10px 0; }
          .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
          ul { padding-left: 20px; }
          li { margin-bottom: 4px; }
          .section { page-break-inside: avoid; margin-bottom: 20px; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>🌿 ${guide.title}</h1>
        
        <div class="info-box">
          <div class="info-grid">
            <div><strong>Region:</strong> ${guide.region}</div>
            <div><strong>Best Season:</strong> ${guide.bestSeason}</div>
            <div><strong>Climate:</strong> ${guide.climateZone}</div>
            <div><strong>Annual Rainfall:</strong> ${guide.annualRainfall}</div>
            <div><strong>Altitude:</strong> ${guide.altitude}</div>
            <div><strong>Suitable States:</strong> ${guide.suitableStates.join(', ')}</div>
          </div>
        </div>

        <div class="section">
          <h2>🪨 Soil Requirements</h2>
          <ul>${guide.soilRequirements.map((s) => `<li>${s}</li>`).join('')}</ul>
        </div>

        <div class="section">
          <h2>🚜 Soil Preparation</h2>
          <ul>${guide.soilPrep.map((s) => `<li>${s}</li>`).join('')}</ul>
        </div>

        <div class="section">
          <h2>🌿 Nursery Work</h2>
          <ul>${guide.nurseryWork.map((s) => `<li>${s}</li>`).join('')}</ul>
        </div>

        <div class="section">
          <h2>📅 Planting Sequence</h2>
          <table>
            <tr><th>Week</th><th>Activity</th><th>Layer</th><th>Species</th><th>Notes</th></tr>
            ${guide.plantingSequence
              .map(
                (s) =>
                  `<tr><td>${s.week}</td><td>${s.activity}</td><td>${s.layer}</td><td>${s.species}</td><td>${s.notes}</td></tr>`
              )
              .join('')}
          </table>
        </div>

        <div class="section">
          <h2>📏 Spacing Guide</h2>
          <table>
            <tr><th>Species</th><th>Row Spacing</th><th>Plant Spacing</th><th>Depth</th><th>Method</th></tr>
            ${guide.spacingGuide
              .map(
                (s) =>
                  `<tr><td>${s.species}</td><td>${s.rowSpacing}</td><td>${s.plantSpacing}</td><td>${s.depth}</td><td>${s.method}</td></tr>`
              )
              .join('')}
          </table>
        </div>

        <div class="section">
          <h2>💧 Irrigation Schedule</h2>
          <table>
            <tr><th>Stage</th><th>Frequency</th><th>Method</th><th>Amount</th></tr>
            ${guide.irrigationSchedule
              .map(
                (s) =>
                  `<tr><td>${s.stage}</td><td>${s.frequency}</td><td>${s.method}</td><td>${s.amount}</td></tr>`
              )
              .join('')}
          </table>
        </div>

        <div class="section">
          <h2>🌱 Fertiliser Schedule</h2>
          <table>
            <tr><th>Month</th><th>Fertilizer</th><th>Quantity</th><th>Method</th></tr>
            ${guide.fertilizerSchedule
              .map(
                (s) =>
                  `<tr><td>${s.month}</td><td>${s.fertilizer}</td><td>${s.quantity}</td><td>${s.method}</td></tr>`
              )
              .join('')}
          </table>
        </div>

        <div class="section">
          <h2>🐛 Pest Management</h2>
          <table>
            <tr><th>Pest</th><th>Symptom</th><th>Treatment</th><th>Preventive</th></tr>
            ${guide.pestManagement
              .map(
                (s) =>
                  `<tr><td>${s.pest}</td><td>${s.symptom}</td><td>${s.treatment}</td><td>${s.preventive}</td></tr>`
              )
              .join('')}
          </table>
        </div>

        <div class="section">
          <h2>🌾 Harvest Calendar</h2>
          <table>
            <tr><th>Species</th><th>First Harvest</th><th>Peak Season</th><th>Method</th><th>Expected Yield</th></tr>
            ${guide.harvestCalendar
              .map(
                (s) =>
                  `<tr><td>${s.species}</td><td>${s.firstHarvest}</td><td>${s.peakSeason}</td><td>${s.method}</td><td>${s.yield}</td></tr>`
              )
              .join('')}
          </table>
        </div>

        <div class="section">
          <h2>💰 Revenue Projection (5-Year)</h2>
          <table>
            <tr><th>Year</th><th>Primary Crop</th><th>Projected Revenue</th></tr>
            ${guide.revenueProjection
              .map(
                (s) =>
                  `<tr><td>Year ${s.year}</td><td>${s.primaryCrop}</td><td>${s.revenue}</td></tr>`
              )
              .join('')}
          </table>
        </div>

        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
          Generated by MultiSow - Multi-Tier Crop System Designer
        </p>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  // ─────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────

  if (!presetId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <div className="text-4xl mb-3">📚</div>
        <p className="text-sm text-gray-400">
          Select a preset to view its planting guide
        </p>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <div className="text-4xl mb-3">🔍</div>
        <p className="text-sm text-gray-400">
          No planting guide available for this preset
        </p>
        <p className="text-xs text-gray-500 mt-1">Preset ID: {presetId}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with Print Button */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-green-400 truncate">
          {guide.title}
        </h3>
        <button
          onClick={handlePrint}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-green-800 hover:bg-green-700 text-white rounded transition-colors"
          title="Print / Export PDF"
        >
          <span>🖨️</span>
          <span>Export</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto border-b border-gray-700 bg-gray-900/50">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-shrink-0 px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? 'text-green-400 border-b-2 border-green-400 bg-green-900/20'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-gray-700"
      >
        {activeTab === 'overview' && <OverviewTab guide={guide} />}
        {activeTab === 'timeline' && <TimelineTab guide={guide} />}
        {activeTab === 'spacing' && <SpacingTab guide={guide} />}
        {activeTab === 'irrigation' && <IrrigationTab guide={guide} />}
        {activeTab === 'fertiliser' && <FertiliserTab guide={guide} />}
        {activeTab === 'pest' && <PestTab guide={guide} />}
        {activeTab === 'harvest' && <HarvestTab guide={guide} />}
      </div>
    </div>
  );
}

export default PlantingGuidePanel;
