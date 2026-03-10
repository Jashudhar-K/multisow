'use client'

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Icon } from '@/components/ui/Icon';
import { generatePlantsFromModel, generateRowsFromModel } from '@/lib/generatePlantsFromModel';

// Dynamically import FarmScene to avoid SSR issues
const FarmScene = dynamic(() => import('@/components/farm/FarmScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0A0F0A]">
      <div className="w-12 h-12 rounded-full border-4 border-green-500/30 border-t-green-500 animate-spin" />
    </div>
  ),
});

// Crop model data
const cropModels = [
  {
    id: 'wayanad-classic',
    name: 'Wayanad Classic',
    description: 'Traditional Kerala multi-tier system optimized for tropical climate.',
    crops: ['Coconut', 'Banana', 'Turmeric'],
    region: 'Wayanad, Kerala',
    difficulty: 'Beginner',
    acres: 2,
    yield: '390 Quintals',
    revenue: '₹13.5L/year',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'karnataka-spice',
    name: 'Karnataka Spice Garden',
    description: 'High-value spice-focused model ideal for coffee-growing regions.',
    crops: ['Silver Oak', 'Papaya', 'Cardamom'],
    region: 'Coorg, Karnataka',
    difficulty: 'Intermediate',
    acres: 3,
    yield: '510 Quintals',
    revenue: '₹7.8L/year',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'maharashtra-coconut',
    name: 'Maharashtra Coconut-Mango',
    description: 'Balanced system with coconut palms and premium fruits.',
    crops: ['Coconut', 'Mango', 'Turmeric'],
    region: 'Konkan, Maharashtra',
    difficulty: 'Intermediate',
    acres: 2.5,
    yield: '520 Quintals',
    revenue: '₹26.2L/year',
    color: 'from-emerald-600 to-teal-600',
  },
  {
    id: 'tamil-tropical',
    name: 'Tamil Nadu Tropical',
    description: 'Optimized for southern coastal climate with high water efficiency.',
    crops: ['Coconut', 'Banana', 'Black Pepper'],
    region: 'Coimbatore, Tamil Nadu',
    difficulty: 'Beginner',
    acres: 2,
    yield: '420 Quintals',
    revenue: '₹11.2L/year',
    color: 'from-red-500 to-rose-500',
  },
  {
    id: 'andhra-commercial',
    name: 'Andhra Commercial',
    description: 'Large-scale commercial model focused on export-quality produce.',
    crops: ['Mango', 'Banana', 'Groundnut'],
    region: 'Godavari, Andhra Pradesh',
    difficulty: 'Advanced',
    acres: 5,
    yield: '780 Quintals',
    revenue: '₹32.5L/year',
    color: 'from-purple-500 to-violet-500',
  },
  {
    id: 'cocoa-premium',
    name: 'Cocoa Premium',
    description: 'Premium cocoa-based system with high market value.',
    crops: ['Coconut', 'Cocoa', 'Vanilla'],
    region: 'Research Model',
    difficulty: 'Advanced',
    acres: 3,
    yield: '340 Quintals',
    revenue: '₹28.8L/year',
    color: 'from-amber-700 to-yellow-700',
  },
];

// Stats data
const stats = [
  { value: '40-70%', label: 'WATER CONSERVED' },
  { value: '300+ Q', label: 'EST. YIELD (2 ACRES)' },
  { value: '₹8-12L', label: 'EST. ANNUAL REVENUE' },
  { value: '88%', label: 'SUNLIGHT CAPTURED' },
];

// 3D Preview Modal Component
function Model3DPreview({ model, onClose }: { model: typeof cropModels[0]; onClose: () => void }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [key, setKey] = useState(0);

  // Generate plants and rows from the model
  const plants = useMemo(() => generatePlantsFromModel({
    id: model.id,
    name: model.name,
    crops: model.crops,
    acres: model.acres,
  }), [model]);

  const rows = useMemo(() => generateRowsFromModel({
    id: model.id,
    name: model.name,
    crops: model.crops,
    acres: model.acres,
  }), [model]);

  const resetView = () => setKey(prev => prev + 1);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isFullscreen ? '' : 'p-8'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative bg-[#0A0F0A] rounded-2xl overflow-hidden border border-green-500/30 shadow-2xl flex flex-col ${
        isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-5xl h-[80vh]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/50">
          <div>
            <h3 className="text-xl font-bold text-white">{model.name}</h3>
            <p className="text-sm text-neutral-400">{model.crops.join(' · ')} — {model.acres} acres</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetView}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Reset View"
            >
              <Icon name="refresh" size={20} />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              <Icon name="fullscreen" size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Close"
            >
              <Icon name="close" size={20} />
            </button>
          </div>
        </div>

        {/* 3D Scene */}
        <div className="flex-1 relative">
          <FarmScene
            key={key}
            plants={plants}
            rows={rows}
            showGrid={true}
            showStats={true}
            fieldSize={120}
          />
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md rounded-lg p-4 border border-white/10">
            <h4 className="text-sm font-semibold text-green-400 mb-2">Crop Layers</h4>
            <div className="space-y-1.5 text-xs">
              {model.crops.map((crop, i) => (
                <div key={crop} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    i === 0 ? 'bg-green-600' : i === 1 ? 'bg-emerald-500' : 'bg-amber-500'
                  }`} />
                  <span className="text-neutral-300">{crop}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Controls hint */}
          <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md rounded-lg px-3 py-2 border border-white/10">
            <p className="text-xs text-neutral-400">
              🖱️ Drag to rotate · Scroll to zoom · Right-click to pan
            </p>
          </div>
        </div>

        {/* Footer with actions */}
        <div className="p-4 border-t border-white/10 bg-black/50 flex items-center justify-between">
          <div className="text-sm text-neutral-400">
            <span className="text-green-400 font-semibold">{plants.length}</span> plants generated · 
            <span className="text-green-400 font-semibold ml-1">{rows.length}</span> rows
          </div>
          <div className="flex gap-3">
            <Link
              href={`/designer?model=${encodeURIComponent(model.id)}`}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-500 transition-colors"
            >
              Edit in Designer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StrataContent() {
  const searchParams = useSearchParams();
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [previewModel, setPreviewModel] = useState<typeof cropModels[0] | null>(null);

  useEffect(() => {
    const model = searchParams.get('model');
    if (model) {
      setSelectedModel(model);
      // Auto-open preview if model is specified in URL
      const foundModel = cropModels.find(m => m.name === model || m.id === model);
      if (foundModel) {
        setPreviewModel(foundModel);
      }
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#0A0F0A] p-0 sm:p-8">
      {/* 3D Preview Modal */}
      {previewModel && (
        <Model3DPreview model={previewModel} onClose={() => setPreviewModel(null)} />
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold bg-gradient-to-br from-green-400 to-green-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
          <span className="">🌿</span> Strata System Designer
        </h1>
        <p className="text-green-50 mt-2 text-lg">
          AI-powered multi-tier crop layout
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-2xl p-6 text-center glass-card border border-green-700/30 text-green-400 bg-white/5 backdrop-blur-md"
          >
            <div className="text-2xl font-bold text-green-400">{stat.value}</div>
            <div className="text-xs text-green-50 mt-1 uppercase tracking-wide">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recommended Crop Models */}
      <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-green-50 flex items-center gap-2">
          <span>✨</span> Recommended Crop Models
        </h2>
        <Link
          href="/designer"
          className="bg-green-600 hover:bg-green-500 text-white px-5 py-2.5 rounded-xl font-semibold border border-white/10 shadow-md transition-colors"
        >
          Create Custom Model
        </Link>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cropModels.map((model, idx) => {
          // Color code by tier for border/background
          let borderColor = 'border-green-700';
          let bgColor = 'bg-green-900/20';
          if (idx === 1) { borderColor = 'border-emerald-700'; bgColor = 'bg-emerald-900/20'; }
          if (idx === 2) { borderColor = 'border-teal-700'; bgColor = 'bg-teal-900/20'; }
          if (idx === 3) { borderColor = 'border-amber-700'; bgColor = 'bg-amber-900/20'; }
          if (idx === 4) { borderColor = 'border-purple-700'; bgColor = 'bg-purple-900/20'; }
          if (idx === 5) { borderColor = 'border-yellow-700'; bgColor = 'bg-yellow-900/20'; }
          return (
            <div
              key={model.id}
              className={`rounded-2xl overflow-hidden glass-card shadow-sm border ${borderColor} ${bgColor} hover:shadow-lg transition-shadow ${
                selectedModel === model.name ? 'ring-2 ring-green-500' : ''
              }`}
            >
              {/* Colored Header */}
              <div className={`h-28 bg-gradient-to-br ${model.color} p-4 flex items-end justify-between`}>
                <div className="flex items-center gap-2">
                  <span className="text-green-50/90 text-sm font-medium">
                    {model.crops.join(' · ')}
                  </span>
                </div>
                <div className="text-green-50/80 text-2xl">🌳</div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-green-50 mb-1">{model.name}</h3>
                <p className="text-sm text-green-200 mb-4">{model.description}</p>

                {/* Details */}
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-green-200 flex items-center gap-1">
                      <span className="text-green-400">📍</span> Region:
                    </span>
                    <span className="text-green-50 font-medium">{model.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-200 flex items-center gap-1">
                      <span className="text-green-400">⚙️</span> Difficulty:
                    </span>
                    <span className="text-green-50 font-medium">{model.difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-200 flex items-center gap-1">
                      <span className="text-green-400">📐</span> Acres:
                    </span>
                    <span className="text-green-50 font-medium">{model.acres}</span>
                  </div>
                </div>

                {/* Yield & Revenue */}
                <div className="flex justify-between border-t border-green-700/30 pt-4 mb-4">
                  <div>
                    <div className="text-xs text-green-400 uppercase">Yield</div>
                    <div className="text-green-50 font-bold">{model.yield}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-green-400 uppercase">Revenue</div>
                    <div className="text-green-400 font-bold">{model.revenue}</div>
                  </div>
                </div>

                {/* View 3D Button */}
                <button
                  onClick={() => setPreviewModel(model)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl font-semibold transition-colors"
                >
                  <Icon name="visibility" size={18} />
                  View 3D Model
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function StrataDesignerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <StrataContent />
    </Suspense>
  );
}
