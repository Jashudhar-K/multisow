import { useMemo } from 'react';

export interface ROICalculatorInputs {
  acres: number;
  saplingCostPerAcre: number;
  laborCostPerMonth: number;
  fertilizerCostPerMonth: number;
  irrigationCostPerMonth: number;
  landLeasePerAcreYear: number;
  estimatedRevenuePerYear: number;
}

export function useROICalculator(inputs: ROICalculatorInputs) {
  return useMemo(() => {
    const totalSetupCost = inputs.acres * inputs.saplingCostPerAcre;
    
    const monthlyOperatingCost = 
      inputs.laborCostPerMonth + 
      inputs.fertilizerCostPerMonth + 
      inputs.irrigationCostPerMonth;
      
    const annualOperatingCost = (monthlyOperatingCost * 12) + (inputs.landLeasePerAcreYear * inputs.acres);
    
    const grossRevenue = inputs.estimatedRevenuePerYear;
    const netProfit = grossRevenue - annualOperatingCost;
    
    // Payback period in months = Setup Cost / Monthly Net Profit
    const monthlyNetProfit = netProfit / 12;
    const paybackPeriodMonths = monthlyNetProfit > 0 ? totalSetupCost / monthlyNetProfit : Infinity;

    // 5-year cash flow
    let cumulative = -totalSetupCost;
    const cashFlow = Array.from({ length: 6 }, (_, i) => {
      if (i === 0) return { year: 'Year 0', balance: cumulative };
      cumulative += netProfit;
      return { year: `Year ${i}`, balance: cumulative };
    });

    return {
      totalSetupCost,
      annualOperatingCost,
      grossRevenue,
      netProfit,
      paybackPeriodMonths,
      cashFlow
    };
  }, [inputs]);
}
