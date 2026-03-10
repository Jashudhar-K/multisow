'use client'
/**
 * PlantingGuide — rich 7-tab planting guide component.
 * Tabs: Timeline | Spacing | Irrigation | Fertilizer | Pest Mgmt | Harvest | Revenue
 *
 * Props:
 *  presetId — used to pull guide data from GUIDE_DB
 */

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@/components/ui/Icon'
import { useAIFarm } from '@/context/AIFarmContext'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface MonthEntry  { month: string; tasks: string[] }
interface SpacingRow { layer: string; crop: string; rowSpacingM: number; plantSpacingM: number; note?: string }
interface IrrigEntry { period: string; method: string; litresPerDayPerAcre: number; note?: string }
interface FertEntry  { when: string; product: string; rateKgPerAcre: number; nutrientFocus: string }
interface PestEntry  { pest: string; symptoms: string; organic: string; chemical?: string }
interface HarvestEntry { crop: string; monthRange: string; yieldRangeKgPerAcre: string; notes?: string }
interface RevenueEntry { crop: string; yieldKgPerAcre: string; pricePerKgINR: string; revenueRange: string }

interface PlantingGuideData {
  title: string
  seasonality: string
  timeline: MonthEntry[]
  spacing: SpacingRow[]
  irrigation: IrrigEntry[]
  fertilizer: FertEntry[]
  pests: PestEntry[]
  harvest: HarvestEntry[]
  revenue: RevenueEntry[]
  totalRevenueSummary: string
}

// ---------------------------------------------------------------------------
// Guide database (keyed by presetId)
// ---------------------------------------------------------------------------
const GUIDE_DB: Record<string, PlantingGuideData> = {
  wayanad: {
    title: 'Wayanad Classic — Multi-Tier Intercropping',
    seasonality: 'South-West monsoon June–September; dry Dec–Feb',
    timeline: [
      { month: 'January',   tasks: ['Pruning of coconut lower fronds', 'Shade regulation for coffee','Apply mulch around ginger beds'] },
      { month: 'February',  tasks: ['Soil testing','Pre-monsoon fertiliser application','Irrigation 2× week'] },
      { month: 'March',     tasks: ['Land preparation for ginger planting','Compost pit turning'] },
      { month: 'April',     tasks: ['Ginger seed rhizome preparation','Teak pruning for form control'] },
      { month: 'May',       tasks: ['Ginger planting (first rains)','Intercrop banana sucker transplanting'] },
      { month: 'June',      tasks: ['Monsoon onset: stop irrigation','Black pepper pole-tying','Canopy gap assessment'] },
      { month: 'July',      tasks: ['Weed management in understory','Monitor for pink disease in coconut'] },
      { month: 'August',    tasks: ['Top-dress nitrogen on banana','Coffee flowering stage monitoring'] },
      { month: 'September', tasks: ['Second black pepper shoot training','Major pest scouting round'] },
      { month: 'October',   tasks: ['Post-monsoon fertiliser','Ginger earth-up if not done'] },
      { month: 'November',  tasks: ['Coffee berry harvesting begins','Coconut twice-per-month harvest'] },
      { month: 'December',  tasks: ['Ginger harvest (10–11 months)','Black pepper harvest','Annual yield recording'] },
    ],
    spacing: [
      { layer: 'Canopy',      crop: 'Coconut',      rowSpacingM: 7.5, plantSpacingM: 7.5, note: '1 × 7.5 m triangular gives 178 palms/ha' },
      { layer: 'Canopy',      crop: 'Teak',         rowSpacingM: 5,   plantSpacingM: 5,   note: 'Remove 50% at yr-10 thinning' },
      { layer: 'Midstory',    crop: 'Banana',        rowSpacingM: 3,   plantSpacingM: 3 },
      { layer: 'Midstory',    crop: 'Coffee',        rowSpacingM: 2,   plantSpacingM: 2,   note: 'Arabica: shaded; Robusta: semi-open' },
      { layer: 'Understory',  crop: 'Ginger',        rowSpacingM: 0.5, plantSpacingM: 0.25 },
      { layer: 'Groundcover', crop: 'Black Pepper',  rowSpacingM: 3,   plantSpacingM: 2,   note: 'Train on coconut base as living standard' },
    ],
    irrigation: [
      { period: 'Dry (Jan–May)',    method: 'Drip',         litresPerDayPerAcre: 1200, note: '4 L/palm/day + 2 L/coffee bush/day' },
      { period: 'Monsoon (Jun–Sep)',method: 'Rain-fed only', litresPerDayPerAcre: 0,   note: 'Ensure good drainage in ginger beds' },
      { period: 'Post-monsoon',     method: 'Drip + flood',  litresPerDayPerAcre: 800 },
    ],
    fertilizer: [
      { when: 'Pre-monsoon (May)',  product: 'FYM or compost',       rateKgPerAcre: 2000, nutrientFocus: 'Organic base' },
      { when: 'June',              product: 'Urea',                  rateKgPerAcre: 25,   nutrientFocus: 'N boosting' },
      { when: 'August',            product: 'NPK 14-14-14',          rateKgPerAcre: 50,   nutrientFocus: 'Balanced' },
      { when: 'October',           product: 'Muriate of potash',     rateKgPerAcre: 30,   nutrientFocus: 'K for fruiting' },
      { when: 'January (coffee)',  product: 'Coffee-specific blend',  rateKgPerAcre: 80,   nutrientFocus: 'N-P-K-Mg' },
    ],
    pests: [
      { pest: 'Rhinoceros Beetle',   symptoms: 'Crown damage in coconut, V-shaped notches on fronds', organic: 'Metarhizium anisopliae biopesticide in crown', chemical: 'Carbofuran 3G granules in crown (restricted use)' },
      { pest: 'Coffee Berry Borer',  symptoms: 'Pin-hole in coffee berry, premature red berries', organic: 'Beauveria bassiana spray, shade regulation', chemical: 'Endosulfan (check local ban status)' },
      { pest: 'Ginger Rhizome Rot',  symptoms: 'Yellowing, wilting, water-soaked rhizome', organic: 'Trichoderma harzianum soil drench, raised beds', chemical: 'Metalaxyl 1 g/L drenching' },
      { pest: 'Banana Wilt (Foc)',   symptoms: 'Yellow, wilted lower leaves, brown vascular staining', organic: 'Remove and burn wilted plants; use certified suckers', chemical: 'No chemical cure; prevention is key' },
    ],
    harvest: [
      { crop: 'Coconut',      monthRange: 'Year-round (every 45 days)', yieldRangeKgPerAcre: '4,000–6,000 nuts/yr', notes: 'Harvest at husk-colour change (green→yellow-brown)' },
      { crop: 'Teak',         monthRange: 'Year 15–25',                  yieldRangeKgPerAcre: '5,000–8,000 kg timber' },
      { crop: 'Banana',       monthRange: 'Month 12–14',                  yieldRangeKgPerAcre: '10,000–14,000' },
      { crop: 'Coffee',       monthRange: 'Nov–Jan (biennial peak)',       yieldRangeKgPerAcre: '800–1,200 green bean' },
      { crop: 'Ginger',       monthRange: 'Dec (9–10 months)',             yieldRangeKgPerAcre: '2,500–3,500' },
      { crop: 'Black Pepper', monthRange: 'Jan–Feb',                       yieldRangeKgPerAcre: '400–600', notes: 'Dry on vine for 7 days before picking' },
    ],
    revenue: [
      { crop: 'Coconut',      yieldKgPerAcre: '4,000–6,000 nuts',   pricePerKgINR: '₹15–20/nut',     revenueRange: '₹60,000–₹1,20,000' },
      { crop: 'Coffee',       yieldKgPerAcre: '800–1,200 kg',        pricePerKgINR: '₹150–250',        revenueRange: '₹1,20,000–₹3,00,000' },
      { crop: 'Ginger',       yieldKgPerAcre: '2,500–3,500 kg',      pricePerKgINR: '₹60–120',         revenueRange: '₹1,50,000–₹4,20,000' },
      { crop: 'Black Pepper', yieldKgPerAcre: '400–600 kg',           pricePerKgINR: '₹500–700',        revenueRange: '₹2,00,000–₹4,20,000' },
      { crop: 'Banana',       yieldKgPerAcre: '10–14 t',              pricePerKgINR: '₹12–18',          revenueRange: '₹1,20,000–₹2,52,000' },
    ],
    totalRevenueSummary: '₹6.5L – ₹15.1L per acre per year (varies by market prices)',
  },
  karnataka: {
    title: 'Karnataka Spice Garden',
    seasonality: 'North-East monsoon Oct–Dec; two dry windows',
    timeline: [
      { month: 'January',   tasks: ['Coffee pruning & de-suckering', 'Cocoa pod counting, thin excess'] },
      { month: 'March',     tasks: ['Cardamom panicle emergence monitoring'] },
      { month: 'May',       tasks: ['Inter-row cultivation', 'Cardamom rainy season prep'] },
      { month: 'June',      tasks: ['Monsoon onset: weeding under silver oak', 'Coffee shade regulation'] },
      { month: 'August',    tasks: ['Turmeric second earthing-up','Top dressing N on coffee'] },
      { month: 'October',   tasks: ['Coffee berry borer scouting', 'Cocoa pod borer check'] },
      { month: 'November',  tasks: ['Coffee harvesting begins', 'Cardamom harvest'] },
      { month: 'December',  tasks: ['Turmeric harvest', 'Black pepper ripe-berry picking'] },
    ],
    spacing: [
      { layer: 'Canopy',     crop: 'Silver Oak',  rowSpacingM: 6, plantSpacingM: 5, note: 'Pollard at 6 m for shade balance' },
      { layer: 'Midstory',   crop: 'Coffee',      rowSpacingM: 2.5, plantSpacingM: 2 },
      { layer: 'Midstory',   crop: 'Cocoa',       rowSpacingM: 3, plantSpacingM: 3 },
      { layer: 'Understory', crop: 'Cardamom',    rowSpacingM: 1.5, plantSpacingM: 1.5 },
      { layer: 'Understory', crop: 'Turmeric',    rowSpacingM: 0.5, plantSpacingM: 0.25 },
      { layer: 'Groundcover',crop: 'Black Pepper',rowSpacingM: 3, plantSpacingM: 2 },
    ],
    irrigation: [
      { period: 'Dry (Feb–May)',    method: 'Sprinkler', litresPerDayPerAcre: 900 },
      { period: 'Monsoon (Jun–Sep)',method: 'Rain-fed', litresPerDayPerAcre: 0 },
    ],
    fertilizer: [
      { when: 'May',    product: 'Compost',    rateKgPerAcre: 1500, nutrientFocus: 'Organic SOM' },
      { when: 'June',   product: 'NPK 15-15-15',rateKgPerAcre: 60,  nutrientFocus: 'Balanced' },
      { when: 'October',product: 'SSP',        rateKgPerAcre: 80,   nutrientFocus: 'P-K for fruiting' },
    ],
    pests: [
      { pest: 'Coffee Berry Borer', symptoms: 'Pin-holes in berries', organic: 'B. bassiana + shade regulation' },
      { pest: 'Cardamom Katte Mosaic', symptoms: 'Mosaic leaves, stunted growth', organic: 'Remove infected plants, control aphid vectors' },
      { pest: 'Cocoa Capsid Bug', symptoms: 'Black lesions on pods/shoots', organic: 'Neem oil 3%' },
    ],
    harvest: [
      { crop: 'Coffee (Arabica)', monthRange: 'Nov–Jan', yieldRangeKgPerAcre: '600–900 green bean' },
      { crop: 'Cocoa',            monthRange: 'Oct–March', yieldRangeKgPerAcre: '700–1,000 dry beans' },
      { crop: 'Cardamom',         monthRange: 'Sept–Dec', yieldRangeKgPerAcre: '200–350' },
      { crop: 'Turmeric',         monthRange: 'Dec–Jan', yieldRangeKgPerAcre: '2,000–3,000' },
      { crop: 'Black Pepper',     monthRange: 'Jan–Feb', yieldRangeKgPerAcre: '400–550' },
    ],
    revenue: [
      { crop: 'Coffee',           yieldKgPerAcre: '600–900 kg', pricePerKgINR: '₹200–350', revenueRange: '₹1,20,000–₹3,15,000' },
      { crop: 'Cocoa',            yieldKgPerAcre: '700–1,000 kg',pricePerKgINR: '₹180–260', revenueRange: '₹1,26,000–₹2,60,000' },
      { crop: 'Cardamom',         yieldKgPerAcre: '200–350 kg', pricePerKgINR: '₹1,200–2,000', revenueRange: '₹2,40,000–₹7,00,000' },
      { crop: 'Turmeric',         yieldKgPerAcre: '2,000–3,000 kg',pricePerKgINR: '₹80–140', revenueRange: '₹1,60,000–₹4,20,000' },
      { crop: 'Black Pepper',     yieldKgPerAcre: '400–550 kg', pricePerKgINR: '₹500–700', revenueRange: '₹2,00,000–₹3,85,000' },
    ],
    totalRevenueSummary: '₹8.5L – ₹20.8L per acre per year',
  },
}

// Fallback for unknown presets
const FALLBACK_GUIDE: PlantingGuideData = {
  title: 'Custom Multi-Tier Plan',
  seasonality: 'Varies by region',
  timeline: [
    { month: 'Month 1–2',   tasks: ['Land preparation', 'Compost application', 'Irrigation setup'] },
    { month: 'Month 3–4',   tasks: ['Canopy species planting', 'Shade setup'] },
    { month: 'Month 5–6',   tasks: ['Midstory planting', 'Weed management'] },
    { month: 'Month 7–9',   tasks: ['Understory & groundcover planting'] },
    { month: 'Month 10–12', tasks: ['First harvest monitoring', 'Record yield data'] },
  ],
  spacing: [
    { layer: 'Canopy',     crop: 'Primary shade tree', rowSpacingM: 7,   plantSpacingM: 7 },
    { layer: 'Midstory',   crop: 'Fruit / spice',      rowSpacingM: 3,   plantSpacingM: 2.5 },
    { layer: 'Understory', crop: 'Spice / herb',        rowSpacingM: 0.75, plantSpacingM: 0.5 },
  ],
  irrigation: [
    { period: 'Dry season', method: 'Drip', litresPerDayPerAcre: 1000 },
  ],
  fertilizer: [
    { when: 'Pre-planting', product: 'Compost', rateKgPerAcre: 2000, nutrientFocus: 'Organic SOM' },
    { when: 'Growing season', product: 'NPK blend', rateKgPerAcre: 60, nutrientFocus: 'Balanced' },
  ],
  pests: [
    { pest: 'Generic fungal diseases', symptoms: 'Leaf spots, wilting', organic: 'Copper oxychloride spray, improved drainage' },
  ],
  harvest: [
    { crop: 'Canopy trees', monthRange: 'Year 3+', yieldRangeKgPerAcre: 'Varies by species' },
  ],
  revenue: [],
  totalRevenueSummary: 'Run Full Analysis to get revenue projections for your specific plan.',
}

// ---------------------------------------------------------------------------
// Tab definitions
// ---------------------------------------------------------------------------
const TABS = [
  { id: 'timeline',    label: 'Timeline',     icon: 'calendar_month' },
  { id: 'spacing',     label: 'Spacing',      icon: 'open_with' },
  { id: 'irrigation',  label: 'Irrigation',   icon: 'water_drop' },
  { id: 'fertilizer',  label: 'Fertilizer',   icon: 'eco' },
  { id: 'pests',       label: 'Pest Mgmt',    icon: 'bug_report' },
  { id: 'harvest',     label: 'Harvest',      icon: 'content_cut' },
  { id: 'revenue',     label: 'Revenue',      icon: 'currency_rupee' },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function PlantingGuide({ presetId }: { presetId: string }) {
  const [activeTab, setActiveTab] = useState('timeline')
  const { currentFarm } = useAIFarm()

  const guide = useMemo<PlantingGuideData>(() => {
    if (presetId && GUIDE_DB[presetId]) return GUIDE_DB[presetId]
    return FALLBACK_GUIDE
  }, [presetId])

  const acreMultiplier = currentFarm?.acres ?? 1

  return (
    <div className="w-full text-white">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-xl font-bold text-white">{guide.title}</h2>
        <p className="text-sm text-white/50 mt-1">{guide.seasonality}</p>
        {acreMultiplier !== 1 && (
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-xs text-green-400">
            Scaled for {acreMultiplier} acres · quantities are per-acre unless noted
          </div>
        )}
      </div>

      {/* Tab bar */}
      <div className="flex flex-wrap gap-1 mb-6 bg-white/5 rounded-xl p-1.5">
        {TABS.map(tab => {
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${activeTab === tab.id
                  ? 'bg-green-600 text-white shadow-md shadow-green-600/30'
                  : 'text-white/50 hover:text-white hover:bg-white/10'}`}>
              <Icon name={tab.icon} size={12} /> {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}>

          {/* Timeline */}
          {activeTab === 'timeline' && (
            <div className="space-y-3">
              {guide.timeline.map(m => (
                <div key={m.month} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold text-green-400 mb-2">{m.month}</div>
                  <ul className="space-y-1">
                    {m.tasks.map((t, i) => (
                      <li key={i} className="text-sm text-white/75 flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500/60 shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Spacing */}
          {activeTab === 'spacing' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-white/40 text-xs uppercase tracking-wide">
                    <th className="pb-3 pr-4">Layer</th>
                    <th className="pb-3 pr-4">Crop</th>
                    <th className="pb-3 pr-4">Row Spacing</th>
                    <th className="pb-3 pr-4">Plant Spacing</th>
                    <th className="pb-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {guide.spacing.map((r, i) => (
                    <tr key={i}>
                      <td className="py-3 pr-4"><span className="px-2 py-0.5 rounded-full bg-white/10 text-xs">{r.layer}</span></td>
                      <td className="py-3 pr-4 font-medium">{r.crop}</td>
                      <td className="py-3 pr-4 text-green-400">{r.rowSpacingM} m</td>
                      <td className="py-3 pr-4 text-green-400">{r.plantSpacingM} m</td>
                      <td className="py-3 text-white/50 text-xs">{r.note ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Irrigation */}
          {activeTab === 'irrigation' && (
            <div className="space-y-3">
              {guide.irrigation.map((ir, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium text-white">{ir.period}</div>
                    <div className="text-sm text-white/50 mt-0.5">Method: <span className="text-white/75">{ir.method}</span></div>
                    {ir.note && <div className="text-xs text-white/40 mt-1">{ir.note}</div>}
                  </div>
                  <div className="text-right shrink-0">
                    {ir.litresPerDayPerAcre > 0 ? (
                      <>
                        <div className="text-2xl font-bold text-blue-400">
                          {(ir.litresPerDayPerAcre * acreMultiplier).toLocaleString()}
                        </div>
                        <div className="text-xs text-white/40">L/day</div>
                      </>
                    ) : <div className="text-white/30 text-sm">Rain-fed</div>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Fertilizer */}
          {activeTab === 'fertilizer' && (
            <div className="space-y-3">
              {guide.fertilizer.map((f, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-white">{f.product}</span>
                    <span className="text-green-400 font-bold">{(f.rateKgPerAcre * acreMultiplier).toLocaleString()} kg</span>
                  </div>
                  <div className="text-xs text-white/40 flex items-center gap-3">
                    <span>When: {f.when}</span>
                    <span className="px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">{f.nutrientFocus}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pest Management */}
          {activeTab === 'pests' && (
            <div className="space-y-4">
              {guide.pests.map((p, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="font-semibold text-red-400 mb-1">{p.pest}</div>
                  <div className="text-sm text-white/60 mb-3">Symptoms: {p.symptoms}</div>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 shrink-0 mt-0.5">Organic</span>
                      <span className="text-sm text-white/75">{p.organic}</span>
                    </div>
                    {p.chemical && (
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0 mt-0.5">Chemical</span>
                        <span className="text-sm text-white/75">{p.chemical}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Harvest Calendar */}
          {activeTab === 'harvest' && (
            <div className="space-y-3">
              {guide.harvest.map((h, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-medium text-white">{h.crop}</div>
                    <div className="text-sm text-white/50">{h.monthRange}</div>
                    {h.notes && <div className="text-xs text-white/35 mt-1">{h.notes}</div>}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold text-green-400">{h.yieldRangeKgPerAcre}</div>
                    <div className="text-xs text-white/30">kg/acre</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Revenue Projection */}
          {activeTab === 'revenue' && (
            <div className="space-y-4">
              {guide.revenue.length > 0 ? (
                <>
                  {guide.revenue.map((r, i) => (
                    <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-white">{r.crop}</span>
                        <span className="text-lg font-bold text-green-400">{r.revenueRange}</span>
                      </div>
                      <div className="text-xs text-white/40 flex items-center gap-4">
                        <span>Yield: {r.yieldKgPerAcre}</span>
                        <span>Price: {r.pricePerKgINR}</span>
                      </div>
                    </div>
                  ))}
                  <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 mt-4">
                    <div className="text-sm text-white/60 mb-1">Total Estimated Revenue</div>
                    <div className="text-xl font-bold text-green-400">{guide.totalRevenueSummary}</div>
                    <p className="text-xs text-white/35 mt-2">
                      Prices as of mid-2024. Actual revenue varies by market access, post-harvest losses, and crop disease.
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center text-white/40 py-12">
                  <Icon name="currency_rupee" size={32} className="mx-auto mb-3 opacity-30" />
                  <p>{guide.totalRevenueSummary}</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
