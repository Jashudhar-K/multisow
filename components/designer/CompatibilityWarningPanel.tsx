import React, { useMemo } from 'react';
import { useDesignerState } from '@/hooks/useDesignerState';
import { checkCompatibility } from '@/lib/compatibilityEngine';
import { Icon } from '@/components/ui/Icon';

export function CompatibilityWarningPanel() {
  const { state } = useDesignerState();
  
  const currentCrops = useMemo(() => {
    if (!state?.layers) return [];
    return Object.values(state.layers)
      .flat()
      .map(c => c.name);
  }, [state?.layers]);

  const warnings = useMemo(() => {
    return checkCompatibility(currentCrops);
  }, [currentCrops]);

  if (warnings.length === 0) return null;

  const typeConfig = {
    good: { icon: 'check_circle', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    warning: { icon: 'warning', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    pest: { icon: 'bug_report', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
    disease: { icon: 'coronavirus', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' }
  };

  return (
    <div className="mt-4 space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2 px-1">
        Interactions
      </h3>
      {warnings.map((w, idx) => {
        const config = typeConfig[w.type];
        return (
          <div key={idx} className={`p-3 rounded-lg border ${config.bg} ${config.border} flex gap-3 items-start`}>
            <Icon name={config.icon} className={`w-4 h-4 mt-0.5 shrink-0 ${config.color}`} />
            <div>
              <div className="text-xs font-semibold text-white/80 capitalize flex items-center gap-1">
                {w.crop1} <Icon name="sync_alt" size={12} className="text-white/40" /> {w.crop2}
              </div>
              <p className={`text-[10px] mt-0.5 ${config.color} opacity-80 leading-relaxed`}>
                {w.note}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
