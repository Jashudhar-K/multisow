'use client'
/**
 * useAIAdvisor — wraps the backend NLP /api/nlp/chat endpoint.
 *
 * Features:
 * - Automatically injects current farm context into every request
 * - Maintains rolling message history (last 20 turns)
 * - Debounced auto-suggestions on farm-state changes
 * - Graceful fallback when API unavailable
 */

import { useState, useCallback, useRef } from 'react'
import { useAIFarm, type AdvisoryMessage } from '@/context/AIFarmContext'

interface UseAIAdvisorReturn {
  messages: AdvisoryMessage[]
  isLoading: boolean
  sendMessage: (text: string) => Promise<void>
  triggerAutoSuggestion: (reason: string) => void
  clearHistory: () => void
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ''

// Rule-based fallback responses when NLP is unavailable
const FALLBACK_RULES: Array<{ pattern: RegExp; response: string }> = [
  {
    pattern: /ler|land equivalent/i,
    response:
      'LER (Land Equivalent Ratio) measures how efficiently intercropping uses land compared to monoculture. LER > 1 means intercropping is more productive. Your current system LER is shown in the dashboard metrics.',
  },
  {
    pattern: /water|irrigat/i,
    response:
      'Canopy layers intercept rainfall and reduce evaporation for understory crops. Ensure drip irrigation targets each root zone independently for optimal water use.',
  },
  {
    pattern: /soil|fertiliz|npk/i,
    response:
      'Layered systems benefit from nitrogen-fixing groundcovers. Space fertilizer applications by layer — canopy trees need deep feeding, understory herbs need surface dressings.',
  },
  {
    pattern: /yield|harvest|produc/i,
    response:
      'Layer-specific yields depend on light distribution. Canopy LAI directly governs understory yield via Beer-Lambert shading. Reducing canopy density by 10% can increase understory yield by up to 18%.',
  },
  {
    pattern: /pest|disease|protect/i,
    response:
      'Multi-tier systems naturally reduce pest pressure through habitat diversity. Aromatic understory herbs (ginger, turmeric) act as natural repellents for canopy pests.',
  },
  {
    pattern: /suggest|recommend|best|what should/i,
    response:
      'Based on your soil type and acreage, focus on establishing the canopy layer first (year 1), add midstory in year 2, and fill understory / groundcover by year 3 as shade levels stabilize.',
  },
]

function getRuleBasedResponse(question: string): string {
  for (const rule of FALLBACK_RULES) {
    if (rule.pattern.test(question)) return rule.response
  }
  return 'I can help with crop selection, spacing, irrigation schedules, and yield analysis. What aspect of your intercropping system would you like to explore?'
}

export function useAIAdvisor(): UseAIAdvisorReturn {
  const { currentFarm, selectedModel, advisoryMessages, addAdvisoryMessage, clearAdvisory, setIsAIProcessing } =
    useAIFarm()
  const [isLoading, setIsLoading] = useState(false)
  const autoSuggestTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const buildFarmContext = useCallback(() => {
    if (!currentFarm) {
      return 'No farm configured yet.'
    }
    return (
      `Farm: ${currentFarm.name || 'Unnamed'}, ` +
      `${currentFarm.acres} acres, ${currentFarm.soilType} soil, ` +
      `Region: ${currentFarm.region || 'India'}, ` +
      `Goal: ${currentFarm.goal}` +
      (selectedModel ? `, Model: ${selectedModel.name}` : '')
    )
  }, [currentFarm, selectedModel])

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return

      // Add user message immediately
      addAdvisoryMessage({ role: 'user', content: text })
      setIsLoading(true)
      setIsAIProcessing(true)

      // Build history to send (last 20 messages, excluding just-added user msg)
      const history = advisoryMessages
        .slice(-20)
        .map(m => ({ role: m.role, content: m.content }))

      try {
        const res = await fetch(`${API_BASE}/api/nlp/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            farm_context: buildFarmContext(),
            history,
            language: 'en',
          }),
          signal: AbortSignal.timeout(20_000),
        })

        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json() as { answer: string; source?: string; confidence?: number }

        addAdvisoryMessage({
          role: 'assistant',
          content: data.answer,
          source: (data.source as AdvisoryMessage['source']) ?? 'fallback',
          confidence: data.confidence,
        })
      } catch {
        // Graceful fallback
        addAdvisoryMessage({
          role: 'assistant',
          content: getRuleBasedResponse(text),
          source: 'rule-based',
          confidence: 0.6,
        })
      } finally {
        setIsLoading(false)
        setIsAIProcessing(false)
      }
    },
    [advisoryMessages, buildFarmContext, addAdvisoryMessage, setIsAIProcessing]
  )

  /**
   * Auto-trigger an unsolicited suggestion based on the current farm state.
   * Debounced to avoid spamming when multiple state changes happen quickly.
   */
  const triggerAutoSuggestion = useCallback(
    (reason: string) => {
      if (autoSuggestTimerRef.current) {
        clearTimeout(autoSuggestTimerRef.current)
      }
      autoSuggestTimerRef.current = setTimeout(() => {
        void sendMessage(
          `Based on the latest change (${reason}), give me one specific actionable suggestion for my farm.`
        )
      }, 2500)
    },
    [sendMessage]
  )

  return {
    messages: advisoryMessages,
    isLoading,
    sendMessage,
    triggerAutoSuggestion,
    clearHistory: clearAdvisory,
  }
}
