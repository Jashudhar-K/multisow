import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function PresetsPanel() {
  const [presets, setPresets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/presets")
      .then(res => res.json())
      .then(setPresets)
      .catch(() => setError("Failed to load presets."))
      .finally(() => setLoading(false));
  }, []);
  
  const handleUseModel = (preset: any) => {
    // Store preset in sessionStorage for designer to pick up
    sessionStorage.setItem('pendingPreset', JSON.stringify(preset));
    // Navigate to designer
    router.push('/designer');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-glass rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Preset Plans</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {presets.map(preset => (
          <div key={preset.id} className="bg-white/70 rounded-lg p-4 border shadow hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-lg mb-1" style={{ color: preset.color }}>{preset.name}</h3>
            <div className="text-sm mb-2">{preset.description}</div>
            <div className="text-xs text-gray-600 mb-2">Region: {preset.region} | Soil: {preset.soilType} | Difficulty: {preset.difficulty}</div>
            <div className="text-xs mb-3">Yield: {preset.estimatedYield} | Revenue: {preset.estimatedRevenue}</div>
            <div className="mb-3">
              <span className="font-medium text-xs">Crops:</span>
              <ul className="list-disc ml-6 text-xs">
                {Object.entries(preset.cropSchedule).map(([tier, info]: any) => (
                  <li key={tier}>{tier}: {info.crop} ({info.plants || info.total} plants)</li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => handleUseModel(preset)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Use This Model →</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
