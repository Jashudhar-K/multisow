'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@/components/ui/Icon'
import { AreaChart } from '@/components/charts'
import { useAIFarm } from '@/context/AIFarmContext'
import { useROICalculator } from '@/hooks/useROICalculator'

export default function ResourceCalculator() {
  const { currentFarm, predictions } = useAIFarm()
  const latestPred = predictions[0] ?? null

  const defaultAcres = currentFarm?.acres ?? 2.0
  const defaultRevenue = latestPred 
    ? Object.values(latestPred.layers).reduce((s, l: any) => s + (l.predicted_yield_t_ha ?? 0), 0) * defaultAcres * 1000 * 80
    : 400000;

  const [acres, setAcres] = useState(defaultAcres)
  const [saplingCostPerAcre, setSaplingCost] = useState(25000)
  const [laborCostPerMonth, setLaborCost] = useState(15000)
  const [fertilizerCostPerMonth, setFertilizerCost] = useState(5000)
  const [irrigationCostPerMonth, setIrrigationCost] = useState(3000)
  const [landLeasePerAcreYear, setLandLease] = useState(10000)
  const [estimatedRevenuePerYear, setRevenue] = useState(defaultRevenue)

  const roi = useROICalculator({
    acres,
    saplingCostPerAcre,
    laborCostPerMonth,
    fertilizerCostPerMonth,
    irrigationCostPerMonth,
    landLeasePerAcreYear,
    estimatedRevenuePerYear
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Icon name="calculate" className="text-emerald-400" />
          ROI & Resource Calculator
        </h2>
        <p className="text-sm text-neutral-400 mt-1">
          Calculate your exact payback period and 5-year cash flow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="glass rounded-xl p-5 space-y-4 border border-white/10">
          <h3 className="text-sm font-semibold text-emerald-400 mb-3 border-b border-white/10 pb-2">Inputs</h3>
          
          <div className="space-y-3">
            <InputField label="Farm Area (Acres)" value={acres} onChange={setAcres} min={0.1} step={0.5} />
            <InputField label="Sapling & Setup Cost (₹/Acre)" value={saplingCostPerAcre} onChange={setSaplingCost} step={1000} />
            <InputField label="Labor Cost (₹/Month)" value={laborCostPerMonth} onChange={setLaborCost} step={500} />
            <InputField label="Fertilizer/Compost (₹/Month)" value={fertilizerCostPerMonth} onChange={setFertilizerCost} step={500} />
            <InputField label="Irrigation Power (₹/Month)" value={irrigationCostPerMonth} onChange={setIrrigationCost} step={100} />
            <InputField label="Land Lease (₹/Acre/Year)" value={landLeasePerAcreYear} onChange={setLandLease} step={1000} />
            <InputField label="Est. Annual Revenue (₹/Year)" value={estimatedRevenuePerYear} onChange={setRevenue} step={10000} />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <SummaryCard icon="currency_rupee" label="Total Setup Cost" value={`₹${roi.totalSetupCost.toLocaleString()}`} color="text-yellow-400" />
            <SummaryCard icon="payments" label="Annual Ops Cost" value={`₹${roi.annualOperatingCost.toLocaleString()}`} color="text-orange-400" />
            <SummaryCard icon="account_balance" label="Net Profit (Year 1+)" value={`₹${roi.netProfit.toLocaleString()}`} color={roi.netProfit > 0 ? 'text-green-400' : 'text-red-400'} />
            <SummaryCard icon="schedule" label="Payback Period" value={roi.paybackPeriodMonths === Infinity ? 'Never' : `${Math.ceil(roi.paybackPeriodMonths)} months`} color={roi.paybackPeriodMonths <= 12 ? 'text-green-400' : 'text-yellow-400'} />
          </div>

          <div className="glass rounded-xl p-5 border border-emerald-500/20">
            <h3 className="text-sm font-semibold text-emerald-400 mb-3">5-Year Cash Flow Projection</h3>
            <AreaChart data={roi.cashFlow.map(d => ({ label: d.year, value: d.balance }))} title="Cumulative Cash Flow (₹)" width={400} height={200} color={roi.netProfit > 0 ? "success" : "warning"} />
          </div>
        </div>
      </div>
    </div>
  )
}

function InputField({ label, value, onChange, min = 0, step = 1 }: any) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-xs text-neutral-300 w-1/2">{label}</label>
      <input 
        type="number" 
        value={value} 
        onChange={e => onChange(Number(e.target.value))} 
        min={min} 
        step={step} 
        className="w-1/2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-emerald-500/50 focus:outline-none text-right" 
      />
    </div>
  )
}

function SummaryCard({ icon, label, value, color }: any) {
  return (
    <motion.div className="glass rounded-xl p-4 text-center border border-white/5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Icon name={icon} className={`w-5 h-5 mx-auto mb-2 ${color}`} />
      <div className={`text-lg font-bold ${color}`}>{value}</div>
      <div className="text-xs text-neutral-400 mt-1">{label}</div>
    </motion.div>
  )
}
