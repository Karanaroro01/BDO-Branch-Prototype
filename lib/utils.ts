
import { SIPPlan, Frequency } from '../types';

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(value);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const generateId = (prefix: string) => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export interface SipCalculationResult {
    month: number;
    standardValue: number;
    stepUpValue: number;
    totalStandardInvestment: number;
    totalStepUpInvestment: number;
}

export const calculateSip = (
    plan: Omit<SIPPlan, 'sipId' | 'clientId' | 'accountId' | 'status' | 'createdBy' | 'submittedAt' >
) => {
    const { amount, frequency, startDate, endDate, stepUpEnabled, stepUpPercent, expectedReturn } = plan;
    const data: SipCalculationResult[] = [];
    
    const monthlyRate = expectedReturn / 100 / 12;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

    let currentStandardValue = 0;
    let currentStepUpValue = 0;
    let totalStandardInvestment = 0;
    let totalStepUpInvestment = 0;
    let monthlyAmountStepUp = amount;

    for (let month = 1; month <= totalMonths; month++) {
        // Standard SIP
        currentStandardValue = (currentStandardValue + amount) * (1 + monthlyRate);
        totalStandardInvestment += amount;

        // Step-up SIP
        if (stepUpEnabled && month > 1 && (month - 1) % 12 === 0) {
            monthlyAmountStepUp *= (1 + stepUpPercent / 100);
        }
        currentStepUpValue = (currentStepUpValue + monthlyAmountStepUp) * (1 + monthlyRate);
        totalStepUpInvestment += monthlyAmountStepUp;
        
        data.push({
            month,
            standardValue: Number(currentStandardValue.toFixed(2)),
            stepUpValue: stepUpEnabled ? Number(currentStepUpValue.toFixed(2)) : Number(currentStandardValue.toFixed(2)),
            totalStandardInvestment: totalStandardInvestment,
            totalStepUpInvestment: stepUpEnabled ? totalStepUpInvestment : totalStandardInvestment,
        });
    }
    
    return data;
};
