"use client";

import { useState } from "react";
import Link from "next/link";

type SoilType = 'Alluvial' | 'Black' | 'Red' | 'Laterite' | 'Desert' | 'Mountain';

const SOIL_INFO: Record<SoilType, { desc: string; crops: string[] }> = {
  Alluvial: {
    desc: "Fertile, well-drained, suitable for rice, sugarcane, jute, vegetables.",
    crops: ["Rice", "Sugarcane", "Jute", "Vegetables"],
  },
  Black: {
    desc: "Rich in clay, moisture-retentive, ideal for cotton, soybean, pulses.",
    crops: ["Cotton", "Soybean", "Pulses"],
  },
  Red: {
    desc: "Well-drained, low in nitrogen, good for groundnut, millets, potato.",
    crops: ["Groundnut", "Millets", "Potato"],
  },
  Laterite: {
    desc: "Acidic, rich in iron, best for coconut, cashew, pineapple.",
    crops: ["Coconut", "Cashew", "Pineapple"],
  },
  Desert: {
    desc: "Sandy, low fertility, suitable for drought-resistant crops.",
    crops: ["Bajra", "Guar", "Mustard"],
  },
  Mountain: {
    desc: "Loamy, well-drained, supports tea, coffee, spices.",
    crops: ["Tea", "Coffee", "Spices"],
  },
};

export default function FarmDataEntryPage() {
  // State for all form fields
  const [farm, setFarm] = useState({
    name: "",
    owner: "",
    location: "",
    region: "",
    size: "",
    irrigation: "",
    experience: "",
    soilType: "" as SoilType | "",
    soilDesc: "",
    recommendedCrops: [] as string[],
    pH: 6.5,
    N: "",
    P: "",
    K: "",
    organicCarbon: "",
    hasSoilCard: false,
    soilCardText: "",
    season: "",
    rainfall: "",
    temperature: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [autoFillLoading, setAutoFillLoading] = useState(false);
  const [autoFillLang, setAutoFillLang] = useState("EN");
  const [autoFillFields, setAutoFillFields] = useState<string[]>([]);

  // Handlers
  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    const isCheckbox = target instanceof HTMLInputElement && target.type === 'checkbox';
    const checked = isCheckbox ? (target as HTMLInputElement).checked : false;
    
    setFarm((prev) => {
      const newValue = isCheckbox ? checked : value;
      const soilUpdate = name === "soilType" && value in SOIL_INFO
        ? {
            soilDesc: SOIL_INFO[value as SoilType].desc,
            recommendedCrops: SOIL_INFO[value as SoilType].crops,
          }
        : {};
      
      return {
        ...prev,
        [name]: newValue,
        ...soilUpdate,
      };
    });
  }

  async function handleSoilCardParse() {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setFarm((prev) => ({
        ...prev,
        N: "120",
        P: "28",
        K: "0.9",
        pH: 6.2,
        organicCarbon: "0.8",
      }));
      setLoading(false);
    }, 1200);
  }

  async function handleSave() {
    setLoading(true);
    // Save to localStorage
    localStorage.setItem("multisow_farm_profile", JSON.stringify(farm));
    // Simulate API call
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      window.location.href = "/dashboard";
    }, 1500);
  }

  async function handleAutoFill() {
    setAutoFillLoading(true);
    // Simulate API call
    setTimeout(() => {
      setFarm((prev) => ({
        ...prev,
        name: "Wayanad Demo Farm",
        location: "Wayanad, Kerala",
        region: "Kerala",
        size: "3",
        soilType: "Laterite",
        soilDesc: SOIL_INFO["Laterite"].desc,
        recommendedCrops: SOIL_INFO["Laterite"].crops,
        irrigation: "Rain-fed",
        experience: "Beginner",
        pH: 6.1,
        N: "110",
        P: "25",
        K: "0.8",
        organicCarbon: "0.7",
        season: "Kharif",
        rainfall: "> 2000mm",
        temperature: "25–30°C",
      }));
      setAutoFillFields([
        "name",
        "location",
        "region",
        "size",
        "soilType",
        "irrigation",
        "experience",
        "pH",
        "N",
        "P",
        "K",
        "organicCarbon",
        "season",
        "rainfall",
        "temperature",
      ]);
      setAutoFillLoading(false);
    }, 1200);
  }

  // UI
  return (
    <div className="min-h-screen bg-[#0A0F0A] flex flex-col items-center justify-center py-8 px-2">
      <div className="w-full max-w-5xl bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 p-6 md:p-10 flex flex-col md:flex-row gap-8">
        {/* LEFT: My Farm Profile */}
        <div className="flex-1 space-y-6">
          <h2 className="text-2xl font-bold text-green-400 mb-2">My Farm Profile</h2>
          {/* Basic Farm Details */}
          <div className="glass-card p-4 rounded-xl border border-green-700/30 mb-4">
            <div className="font-semibold text-green-200 mb-2">Basic Farm Details</div>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-green-50">Farm Name
                <input name="name" value={farm.name} onChange={handleInput} className="input" />
              </label>
              <label className="text-green-50">Owner Name
                <input name="owner" value={farm.owner} onChange={handleInput} className="input" />
              </label>
              <label className="text-green-50">Location
                <input name="location" value={farm.location} onChange={handleInput} className="input" placeholder="District, State" />
              </label>
              <label className="text-green-50">Region
                <select name="region" value={farm.region} onChange={handleInput} className="input">
                  <option value="">Select</option>
                  <option>Kerala</option>
                  <option>Karnataka</option>
                  <option>Tamil Nadu</option>
                  <option>Andhra Pradesh</option>
                  <option>Maharashtra</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="text-green-50">Farm Size (acres)
                <input name="size" value={farm.size} onChange={handleInput} className="input" type="number" min="0" step="0.1" />
                <span className="text-xs text-green-300 ml-2">{farm.size ? `≈ ${(parseFloat(farm.size) * 0.4047).toFixed(2)} ha` : ""}</span>
              </label>
              <label className="text-green-50">Irrigation Type
                <div className="flex gap-2 mt-1">
                  {["Rain-fed", "Drip", "Flood", "Mixed"].map((type) => (
                    <label key={type} className="flex items-center gap-1">
                      <input type="radio" name="irrigation" value={type} checked={farm.irrigation === type} onChange={handleInput} />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </label>
              <label className="text-green-50">Experience Level
                <select name="experience" value={farm.experience} onChange={handleInput} className="input">
                  <option value="">Select</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Expert</option>
                </select>
              </label>
            </div>
          </div>

          {/* Soil Information */}
          <div className="glass-card p-4 rounded-xl border border-green-700/30 mb-4">
            <div className="font-semibold text-green-200 mb-2">Soil Information</div>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-green-50">Soil Type
                <select name="soilType" value={farm.soilType} onChange={handleInput} className="input">
                  <option value="">Select</option>
                  {Object.keys(SOIL_INFO).map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </label>
              <div className="col-span-1 flex flex-col justify-end">
                {farm.soilType && (
                  <div className="text-xs text-green-300 mt-1">{farm.soilDesc}</div>
                )}
                {farm.recommendedCrops.length > 0 && (
                  <div className="text-xs text-green-400 mt-1">Recommended: {farm.recommendedCrops.join(", ")}</div>
                )}
              </div>
              <label className="text-green-50">pH Level
                <input name="pH" type="range" min="4" max="9" step="0.1" value={farm.pH} onChange={handleInput} className="w-full" />
                <span className={`ml-2 text-xs font-bold ${farm.pH < 5.5 ? "text-red-400" : farm.pH > 7 ? "text-amber-400" : "text-green-400"}`}>{farm.pH}</span>
              </label>
              <label className="text-green-50">Nitrogen (N) mg/kg
                <input name="N" value={farm.N} onChange={handleInput} className="input" type="number" />
              </label>
              <label className="text-green-50">Phosphorus (P) mg/kg
                <input name="P" value={farm.P} onChange={handleInput} className="input" type="number" />
              </label>
              <label className="text-green-50">Potassium (K) cmol/kg
                <input name="K" value={farm.K} onChange={handleInput} className="input" type="number" />
              </label>
              <label className="text-green-50">Organic Carbon %
                <input name="organicCarbon" value={farm.organicCarbon} onChange={handleInput} className="input" type="number" step="0.01" />
              </label>
              <label className="flex items-center gap-2 mt-2">
                <input type="checkbox" name="hasSoilCard" checked={farm.hasSoilCard} onChange={handleInput} />
                <span className="text-green-50">I have a soil health card</span>
              </label>
              {farm.hasSoilCard && (
                <div className="col-span-2">
                  <textarea name="soilCardText" value={farm.soilCardText} onChange={handleInput} className="input w-full h-16" placeholder="Paste soil card text here..." />
                  <button type="button" onClick={handleSoilCardParse} className="mt-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl font-semibold" disabled={loading}>{loading ? "Parsing..." : "Parse Card"}</button>
                </div>
              )}
            </div>
          </div>

          {/* Climate & Season */}
          <div className="glass-card p-4 rounded-xl border border-green-700/30 mb-4">
            <div className="font-semibold text-green-200 mb-2">Climate & Season</div>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-green-50">Primary Season
                <select name="season" value={farm.season} onChange={handleInput} className="input">
                  <option value="">Select</option>
                  <option>Kharif</option>
                  <option>Rabi</option>
                  <option>Zaid</option>
                  <option>Year-round</option>
                </select>
              </label>
              <label className="text-green-50">Annual Rainfall
                <select name="rainfall" value={farm.rainfall} onChange={handleInput} className="input">
                  <option value="">Select</option>
                  <option>{"< 600mm"}</option>
                  <option>600–1200mm</option>
                  <option>1200–2000mm</option>
                  <option>{"> 2000mm"}</option>
                </select>
              </label>
              <label className="text-green-50">Avg. Temperature
                <select name="temperature" value={farm.temperature} onChange={handleInput} className="input">
                  <option value="">Select</option>
                  <option>{"< 20°C"}</option>
                  <option>20–25°C</option>
                  <option>25–30°C</option>
                  <option>{"> 30°C"}</option>
                </select>
              </label>
            </div>
          </div>

          <button type="button" onClick={handleSave} className="w-full bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-semibold mt-4" disabled={loading}>{loading ? "Saving..." : "Save Farm Profile"}</button>
          {success && <div className="text-green-400 mt-2 text-center font-bold">Farm profile saved ✅</div>}
        </div>

        {/* RIGHT: NLP Quick Fill */}
        <div className="flex-1 space-y-6">
          <h2 className="text-2xl font-bold text-green-400 mb-2">NLP Quick Fill</h2>
          <div className="glass-card p-4 rounded-xl border border-green-700/30 mb-4">
            <div className="font-semibold text-green-200 mb-2">Describe your farm in plain words</div>
            <textarea
              className="input w-full h-32"
              placeholder="Example: I have 3 acres of laterite soil in Wayanad Kerala. Mainly rain-fed. Want to grow coconut with intercropping for good monthly income."
              value={farm.soilCardText}
              onChange={handleInput}
              name="soilCardText"
            />
            <div className="flex items-center gap-2 mt-2">
              <button type="button" onClick={handleAutoFill} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl font-semibold" disabled={autoFillLoading}>{autoFillLoading ? "Filling..." : "Auto-Fill from Description"}</button>
              <span className="text-green-200 text-xs">Language:</span>
              {["EN", "தமிழ்", "മലയ", "తెలు"].map((lang) => (
                <button key={lang} type="button" className={`px-2 py-1 rounded ${autoFillLang === lang ? "bg-green-500 text-white" : "bg-white/10 text-green-200"}`} onClick={() => setAutoFillLang(lang)}>{lang}</button>
              ))}
            </div>
            {autoFillFields.length > 0 && (
              <div className="mt-2 text-green-400 text-xs">Fields auto-filled: {autoFillFields.join(", ")}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Add some basic styles for glass-card and input
// .glass-card { background: rgba(255,255,255,0.05); backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
// .input { background: #0A0F0A; border: 1px solid #22C55E33; border-radius: 8px; padding: 0.5rem 0.75rem; color: #F0FDF4; margin-top: 0.25rem; width: 100%; }
