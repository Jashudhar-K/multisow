'use client'

import React from "react";
import { useState } from "react";

export function AIAdvisorPanel() {
  const [acres, setAcres] = useState(1);
  const [soilType, setSoilType] = useState("");
  const [budget, setBudget] = useState(100000);
  const [goal, setGoal] = useState("maximize_profit");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handlePlan(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acres, soil_type: soilType, budget_inr: budget, goal }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "Failed to fetch plan." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-glass rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">AI Plan Generator</h2>
      <form onSubmit={handlePlan} className="space-y-4">
        <div>
          <label className="block font-medium">Acres</label>
          <input type="number" min={0.1} step={0.1} value={acres} onChange={e => setAcres(Number(e.target.value))} className="input input-bordered w-full" required title="Acres" placeholder="Enter acres" />
        </div>
        <div>
          <label className="block font-medium">Soil Type</label>
          <input type="text" value={soilType} onChange={e => setSoilType(e.target.value)} className="input input-bordered w-full" placeholder="e.g. laterite, black, red, alluvial" required />
        </div>
        <div>
          <label className="block font-medium">Budget (INR)</label>
          <input type="number" min={10000} step={1000} value={budget} onChange={e => setBudget(Number(e.target.value))} className="input input-bordered w-full" required title="Budget (INR)" placeholder="Enter budget" />
        </div>
        <div>
          <label className="block font-medium">Goal</label>
          <select value={goal} onChange={e => setGoal(e.target.value)} className="input input-bordered w-full" title="Goal">
            <option value="maximize_profit">Maximize Profit</option>
            <option value="maximize_yield">Maximize Yield</option>
            <option value="low_risk">Low Risk</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>{loading ? "Generating..." : "Generate Plan"}</button>
      </form>
      {result && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Result</h3>
          <pre className="bg-gray-100 rounded p-4 overflow-x-auto text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
