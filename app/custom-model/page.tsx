"use client";

import { useState } from "react";
import Link from "next/link";

interface CustomModel {
  name: string;
  description: string;
  crops: string[];
  soilType: string;
  region: string;
  params: {
    rainfall: string;
    temperature: string;
    irrigation: string;
    size: string;
  };
  notes: string;
}

export default function CustomModelBuilderPage() {
  const [model, setModel] = useState<CustomModel>({
    name: "",
    description: "",
    crops: [],
    soilType: "",
    region: "",
    params: {
      rainfall: "",
      temperature: "",
      irrigation: "",
      size: "",
    },
    notes: "",
  });
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    if (name in model.params) {
      setModel((prev) => ({ ...prev, params: { ...prev.params, [name]: value } }));
    } else {
      setModel((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleCropChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value, checked } = e.target;
    setModel((prev) => ({
      ...prev,
      crops: checked
        ? [...prev.crops, value]
        : prev.crops.filter((c) => c !== value),
    }));
  }

  async function handleSave() {
    setSaving(true);
    // Save to localStorage for demo
    const models = JSON.parse(localStorage.getItem("multisow_custom_models") || "[]");
    models.push(model);
    localStorage.setItem("multisow_custom_models", JSON.stringify(models));
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      window.location.href = "/dashboard";
    }, 1500);
  }

  // UI
  return (
    <div className="min-h-screen bg-[#0A0F0A] flex flex-col items-center justify-center py-8 px-2">
      <div className="w-full max-w-3xl bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 p-6 md:p-10">
        <h2 className="text-2xl font-bold text-green-400 mb-6">Custom Model Builder</h2>
        <div className="flex flex-col gap-6">
          {step === 1 && (
            <div>
              <div className="font-semibold text-green-200 mb-2">Model Details</div>
              <label className="block text-green-50 mb-2">Model Name
                <input name="name" value={model.name} onChange={handleInput} className="input" />
              </label>
              <label className="block text-green-50 mb-2">Description
                <textarea name="description" value={model.description} onChange={handleInput} className="input w-full h-16" />
              </label>
              <button className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl font-semibold mt-2" onClick={() => setStep(2)} disabled={!model.name}>Next</button>
            </div>
          )}
          {step === 2 && (
            <div>
              <div className="font-semibold text-green-200 mb-2">Select Crops</div>
              <div className="flex flex-wrap gap-3 mb-4">
                {["Rice", "Sugarcane", "Jute", "Vegetables", "Cotton", "Soybean", "Pulses", "Groundnut", "Millets", "Potato", "Coconut", "Cashew", "Pineapple", "Bajra", "Guar", "Mustard", "Tea", "Coffee", "Spices"].map((crop) => (
                  <label key={crop} className="flex items-center gap-1 bg-green-900/30 px-2 py-1 rounded">
                    <input type="checkbox" value={crop} checked={model.crops.includes(crop)} onChange={handleCropChange} />
                    <span>{crop}</span>
                  </label>
                ))}
              </div>
              <button className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl font-semibold mr-2" onClick={() => setStep(1)}>Back</button>
              <button className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl font-semibold" onClick={() => setStep(3)} disabled={model.crops.length === 0}>Next</button>
            </div>
          )}
          {step === 3 && (
            <div>
              <div className="font-semibold text-green-200 mb-2">Farm & Environment</div>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-green-50">Soil Type
                  <select name="soilType" value={model.soilType} onChange={handleInput} className="input">
                    <option value="">Select</option>
                    <option>Alluvial</option>
                    <option>Black</option>
                    <option>Red</option>
                    <option>Laterite</option>
                    <option>Desert</option>
                    <option>Mountain</option>
                  </select>
                </label>
                <label className="text-green-50">Region
                  <input name="region" value={model.region} onChange={handleInput} className="input" />
                </label>
                <label className="text-green-50">Rainfall
                  <select name="rainfall" value={model.params.rainfall} onChange={handleInput} className="input">
                    <option value="">Select</option>
                    <option>{"< 600mm"}</option>
                    <option>600–1200mm</option>
                    <option>1200–2000mm</option>
                    <option>{"> 2000mm"}</option>
                  </select>
                </label>
                <label className="text-green-50">Temperature
                  <select name="temperature" value={model.params.temperature} onChange={handleInput} className="input">
                    <option value="">Select</option>
                    <option>{"< 20°C"}</option>
                    <option>20–25°C</option>
                    <option>25–30°C</option>
                    <option>{"> 30°C"}</option>
                  </select>
                </label>
                <label className="text-green-50">Irrigation
                  <select name="irrigation" value={model.params.irrigation} onChange={handleInput} className="input">
                    <option value="">Select</option>
                    <option>Rain-fed</option>
                    <option>Drip</option>
                    <option>Flood</option>
                    <option>Mixed</option>
                  </select>
                </label>
                <label className="text-green-50">Farm Size (acres)
                  <input name="size" value={model.params.size} onChange={handleInput} className="input" type="number" min="0" step="0.1" />
                </label>
              </div>
              <label className="block text-green-50 mt-2">Notes
                <textarea name="notes" value={model.notes} onChange={handleInput} className="input w-full h-16" />
              </label>
              <button className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl font-semibold mr-2 mt-2" onClick={() => setStep(2)}>Back</button>
              <button className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl font-semibold mt-2" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Model"}</button>
              {success && <div className="text-green-400 mt-2 text-center font-bold">Model saved ✅</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// .input { background: #0A0F0A; border: 1px solid #22C55E33; border-radius: 8px; padding: 0.5rem 0.75rem; color: #F0FDF4; margin-top: 0.25rem; width: 100%; }
