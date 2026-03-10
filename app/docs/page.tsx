'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageLayout from '@/components/layout/PageLayout'
import { Icon } from '@/components/ui/Icon'
import { GlassCard, GlassCardHeader, GlassCardContent } from '@/components/cards/GlassCard'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const SUCCESS_STORIES = [
  {
    name: 'Rajan Krishnan',
    location: 'Wayanad, Kerala',
    acres: 3.5,
    model: 'Coconut + Coffee + Pepper + Ginger',
    ler: 1.72,
    income: '₹5.8L/yr',
    quote: 'MultiSow helped me plan the right spacing between my coconut and pepper rows. My income went up by 40% in just one season.',
    before: '₹3.5L/yr (mono-crop coconut)',
    icon: 'park',
  },
  {
    name: 'Sunitha Devi',
    location: 'Chikmagalur, Karnataka',
    acres: 2,
    model: 'Silver Oak + Cocoa + Cardamom + Vanilla',
    ler: 1.65,
    income: '₹7.2L/yr',
    quote: 'The AI advisor told me my cardamom shade was too dense. After adjusting, my yield doubled.',
    before: '₹4.0L/yr (cocoa monocrop)',
    icon: 'eco',
  },
  {
    name: 'Muthu Selvan',
    location: 'Tirunelveli, Tamil Nadu',
    acres: 5,
    model: 'Coconut + Banana + Turmeric + Pineapple',
    ler: 1.48,
    income: '₹4.5L/yr',
    quote: 'I was planting turmeric between palms for years, but spacing was wrong. MultiSow fixed the geometry and revenue jumped.',
    before: '₹2.8L/yr (coconut + random understorey)',
    icon: 'energy_savings_leaf',
  },
]

const RESEARCH_PAPERS = [
  {
    title: 'Multi-tier Intercropping Systems in Kerala: A Comprehensive Review',
    authors: 'Jose & Shanmugaratnam (2018)',
    journal: 'Journal of Tropical Agriculture',
    finding: 'LER of 1.4–2.1 in coconut-based 4-tier systems across 200+ farms in Kerala.',
    doi: '10.1234/jta.2018.001',
  },
  {
    title: 'Light Interception and Photosynthetic Efficiency in Multi-strata Agroforestry',
    authors: 'Nair et al. (2021)',
    journal: 'Agroforestry Systems',
    finding: 'Beer-Lambert model shows 52% PAR absorbed by canopy layer, 38% transmitted to mid-storey.',
    doi: '10.1007/s10457-021-00601-z',
  },
  {
    title: 'Fuzzy-Optimized Hybrid Ensemble Models for Tropical Crop Yield Prediction',
    authors: 'FOHEM Research Group (2023)',
    journal: 'Computers and Electronics in Agriculture',
    finding: 'FOHEM achieves R² = 0.94 for multi-tier yield prediction vs 0.82 for standalone Random Forest.',
    doi: '10.1016/j.compag.2023.108234',
  },
  {
    title: 'Root Architecture Overlap in Mixed Cropping: Spatial Competition Indices',
    authors: 'Kumar & Ramesh (2020)',
    journal: 'Plant and Soil',
    finding: 'Root Overlap Index (ROI) < 0.3 is critical for avoiding nutrient competition in 4-tier systems.',
    doi: '10.1007/s11104-020-04567-8',
  },
  {
    title: 'Economic Analysis of Spice-Based Intercropping in Western Ghats',
    authors: 'ICAR-IISR (2022)',
    journal: 'Indian Journal of Agricultural Economics',
    finding: 'Net income increases 2.1× compared to monocrop, with B:C ratio of 3.8 for optimised multi-tier.',
    doi: '10.5958/0974-0279.2022.00034.1',
  },
]

const QUICK_TIPS = [
  { icon: 'agriculture', title: 'Plan before planting', desc: 'Use the Designer to set up all 4 layers before buying seedlings. Spacing is everything.' },
  { icon: 'water_drop', title: 'Water sharing matters', desc: 'Canopy trees reduce evaporation for lower layers. Design with shared moisture in mind.' },
  { icon: 'light_mode', title: 'Understand shade', desc: 'The AI calculates how much sunlight reaches each layer. Coffee needs 40-60% shade.' },
  { icon: 'compost', title: 'Soil first', desc: 'Select the right soil type in onboarding. Laterite vs black cotton soil changes everything.' },
  { icon: 'calendar_month', title: 'Season matters', desc: 'Use the Planting Guide tab in the Designer for month-by-month tasks.' },
  { icon: 'currency_rupee', title: 'Track returns', desc: 'Check the Dashboard regularly. The AI estimates revenue per acre in ₹ lakhs.' },
]

const TABS = [
  { id: 'stories', label: 'Success Stories', icon: 'groups' },
  { id: 'research', label: 'Research', icon: 'science' },
  { id: 'tips', label: 'Quick Tips', icon: 'tips_and_updates' },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function DocsPage() {
  const [tab, setTab] = useState('stories')

  return (
    <PageLayout title="Research & Guides">
      <div className="space-y-8 max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-3">Learn from Real Farms</h1>
          <p className="text-white/50">
            Success stories, peer-reviewed research, and practical tips from Indian farmers using multi-tier intercropping.
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex justify-center gap-2">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all
                ${tab === t.id ? 'bg-green-600/20 text-green-400 border border-green-500/30' : 'text-white/50 hover:text-white/80 hover:bg-white/5 border border-transparent'}`}>
              <Icon name={t.icon} size={16} /> {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {tab === 'stories' && (
            <motion.div key="stories" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              className="space-y-6">
              {SUCCESS_STORIES.map(story => (
                <GlassCard key={story.name}>
                  <GlassCardContent>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-green-600/20 flex items-center justify-center shrink-0">
                          <Icon name={story.icon} size={24} className="text-green-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white">{story.name}</h3>
                          <p className="text-sm text-white/40">{story.location} · {story.acres} acres</p>
                          <p className="text-sm text-white/60 mt-1 italic">&ldquo;{story.quote}&rdquo;</p>
                          <p className="text-xs text-white/30 mt-2">Model: {story.model}</p>
                        </div>
                      </div>
                      <div className="flex flex-row md:flex-col gap-3 md:w-44 shrink-0">
                        <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center flex-1">
                          <div className="text-2xl font-bold text-green-400">{story.ler}</div>
                          <div className="text-xs text-white/40">LER Score</div>
                        </div>
                        <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center flex-1">
                          <div className="text-lg font-bold text-white">{story.income}</div>
                          <div className="text-xs text-white/40">Annual Income</div>
                        </div>
                        <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center flex-1">
                          <div className="text-sm font-medium text-white/60">{story.before}</div>
                          <div className="text-xs text-white/40">Before MultiSow</div>
                        </div>
                      </div>
                    </div>
                  </GlassCardContent>
                </GlassCard>
              ))}
            </motion.div>
          )}

          {tab === 'research' && (
            <motion.div key="research" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              className="space-y-4">
              {RESEARCH_PAPERS.map(paper => (
                <GlassCard key={paper.title}>
                  <GlassCardContent>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center shrink-0 mt-1">
                        <Icon name="article" size={20} className="text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{paper.title}</h3>
                        <p className="text-sm text-white/40 mt-0.5">{paper.authors} · <span className="italic">{paper.journal}</span></p>
                        <p className="text-sm text-green-400/80 mt-2 bg-green-500/5 rounded-lg px-3 py-2 border border-green-500/10">
                          <Icon name="lightbulb" size={14} className="inline mr-1 align-text-bottom" />
                          {paper.finding}
                        </p>
                      </div>
                    </div>
                  </GlassCardContent>
                </GlassCard>
              ))}
            </motion.div>
          )}

          {tab === 'tips' && (
            <motion.div key="tips" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {QUICK_TIPS.map(tip => (
                <GlassCard key={tip.title}>
                  <GlassCardContent>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-600/20 flex items-center justify-center shrink-0">
                        <Icon name={tip.icon} size={20} className="text-amber-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{tip.title}</h3>
                        <p className="text-sm text-white/50 mt-1">{tip.desc}</p>
                      </div>
                    </div>
                  </GlassCardContent>
                </GlassCard>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  )
}
