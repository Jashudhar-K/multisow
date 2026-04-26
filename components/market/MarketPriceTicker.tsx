'use client'

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/Icon';

interface PriceData {
  price: number;
  min: number;
  max: number;
  unit: string;
  trend: number;
}

interface MarketData {
  updated_at: string;
  source: string;
  prices: Record<string, PriceData>;
}

import { useLanguage } from '@/context/LanguageContext';

export function MarketPriceTicker() {
  const [data, setData] = useState<MarketData | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    fetch('/api/market-prices')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return null;

  const crops = Object.entries(data.prices);

  return (
    <div className="w-full bg-surface/80 border-b border-border-default overflow-hidden flex items-center h-10 text-xs">
      <div className="px-3 py-1 bg-surface border-r border-border-default h-full flex items-center shrink-0 z-10 shadow-[2px_0_4px_rgba(0,0,0,0.1)]">
        <span className="font-semibold text-primary-400 mr-2 flex items-center gap-1">
          <Icon name="monitoring" size={14} /> {t('dashboard.market_prices')}
        </span>
      </div>
      
      <div className="flex-1 overflow-hidden relative h-full">
        <motion.div
          animate={{ x: [0, -100 * crops.length] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: crops.length * 4
          }}
          className="flex items-center h-full whitespace-nowrap"
        >
          {/* Render twice for continuous loop effect */}
          {[...crops, ...crops].map(([name, info], idx) => (
            <div key={`${name}-${idx}`} className="flex items-center px-4 border-r border-border-subtle h-full">
              <span className="capitalize text-text-secondary mr-2 font-medium">{name}</span>
              <span className="text-text-primary font-bold mr-1">₹{info.price}</span>
              <span className="text-text-muted mr-2">/{info.unit}</span>
              {info.trend > 0 ? (
                <span className="text-success-400 flex items-center text-[10px]">
                  <Icon name="arrow_drop_up" size={16} /> +{info.trend}%
                </span>
              ) : info.trend < 0 ? (
                <span className="text-error-400 flex items-center text-[10px]">
                  <Icon name="arrow_drop_down" size={16} /> {info.trend}%
                </span>
              ) : (
                <span className="text-text-muted flex items-center text-[10px]">
                  <Icon name="remove" size={12} className="mx-0.5" /> 0%
                </span>
              )}
            </div>
          ))}
        </motion.div>
      </div>

      <div className="px-3 h-full flex items-center bg-surface border-l border-border-default shrink-0 z-10 text-[10px] text-text-muted">
        Source: {data.source}
      </div>
    </div>
  );
}
