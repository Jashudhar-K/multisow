'use client'

import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { useAIFarm } from '@/context/AIFarmContext';
import { useSensorData } from '@/hooks/useSensorData';
import { Icon } from '@/components/ui/Icon';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function SensorsDashboardPage() {
  const { currentFarm } = useAIFarm();
  const farmId = currentFarm?.name ?? 'default-farm';
  const { t } = useLanguage();
  
  const { readings, isSimulated, loading } = useSensorData(farmId);

  return (
    <PageLayout title={t('sensors.title')}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-400">
            {t('sensors.subtitle')}
          </p>
          <div className="flex items-center gap-2">
            {isSimulated && (
              <span className="px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs rounded font-medium flex items-center gap-1">
                <Icon name="science" size={14} /> {t('sensors.simulated')}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {t('sensors.live')}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass rounded-xl p-5 h-28 animate-pulse flex items-center justify-center">
                <Icon name="sensors" className="text-white/10" size={32} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(readings).map(([key, data], idx) => {
              const IconName = getIconForSensor(key);
              const isWarning = data.status === 'warning';
              const isCritical = data.status === 'critical';
              
              let colorClass = 'text-emerald-400';
              let bgClass = 'bg-emerald-500/10';
              let borderClass = 'border-emerald-500/20';
              
              if (isWarning) {
                colorClass = 'text-yellow-400';
                bgClass = 'bg-yellow-500/10';
                borderClass = 'border-yellow-500/20';
              } else if (isCritical) {
                colorClass = 'text-red-400';
                bgClass = 'bg-red-500/10';
                borderClass = 'border-red-500/20';
              }

              return (
                <motion.div 
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`glass rounded-xl p-5 border ${borderClass} relative overflow-hidden`}
                >
                  <div className={`absolute top-0 right-0 w-16 h-16 ${bgClass} rounded-bl-full -mr-4 -mt-4 transition-colors`} />
                  
                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <div className="flex items-center gap-2">
                      <Icon name={IconName} className={colorClass} size={20} />
                      <h3 className="text-sm font-semibold text-white/80">{data.sensor_type}</h3>
                    </div>
                    {isWarning && <Icon name="warning" className="text-yellow-400" size={16} />}
                    {isCritical && <Icon name="error" className="text-red-400" size={16} />}
                  </div>
                  
                  <div className="flex items-baseline gap-1 mt-4 relative z-10">
                    <span className={`text-3xl font-bold ${colorClass}`}>{data.value}</span>
                    <span className="text-sm text-neutral-400">{data.unit}</span>
                  </div>
                  
                  <div className="mt-3 text-[10px] text-neutral-500 flex justify-between">
                    <span>Node ID: SENS-{idx+1}0{idx}</span>
                    <span>Updated: {new Date(data.timestamp).toLocaleTimeString()}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

function getIconForSensor(key: string): string {
  if (key.includes('moisture')) return 'water_drop';
  if (key.includes('temperature') || key.includes('temp')) return 'thermostat';
  if (key.includes('light')) return 'light_mode';
  if (key.includes('npk')) return 'science';
  return 'sensors';
}
