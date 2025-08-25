
import React from 'react';
import { RiskCategory, AccountType, CivilStatus, Frequency, InstrumentType } from './types';

// Heroicons (https://heroicons.com/)
const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);
const UserPlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.5 21h-5a12.318 12.318 0 01-3.25-1.765z" />
  </svg>
);
const LibraryIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
  </svg>
);
const ArrowsUpDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
  </svg>
);
const ChartBarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);
const CheckBadgeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const UserCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const DocumentTextIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

export const NAV_LINKS = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Client 360', href: '/client-360', icon: UserCircleIcon },
];

export const DASHBOARD_QUICK_LINKS = [
    { name: 'Client Onboarding', href: '/client-onboarding', icon: UserPlusIcon },
    { name: 'Account Setup', href: '/account-setup', icon: LibraryIcon },
    { name: 'Applications', href: '/applications', icon: ArrowsUpDownIcon },
    { name: 'SIP/SWP', href: '/sip-swp', icon: ChartBarIcon },
    { name: 'Approvals', href: '/approvals', icon: CheckBadgeIcon },
    { name: 'Reports', href: '/reports', icon: DocumentTextIcon },
];


export const BDO_BRANCHES = [
  "BR001 - Makati Main",
  "BR002 - Ortigas Center",
  "BR003 - Cebu Business Park",
  "BR004 - BGC High Street",
  "BR005 - Alabang Town Center"
];

export const RELATIONSHIP_MANAGERS = [
  "Maria Santos",
  "John Reyes",
  "Anna Lim",
  "Peter Garcia"
];

export const FUNDS_DATA = [
    { name: "BDO Peso Bond Fund", category: "Fixed Income", riskLevel: RiskCategory.CONSERVATIVE, type: AccountType.UITF },
    { name: "BDO Balanced Fund", category: "Balanced", riskLevel: RiskCategory.BALANCED, type: AccountType.UITF },
    { name: "BDO Equity Fund", category: "Equity", riskLevel: RiskCategory.AGGRESSIVE, type: AccountType.UITF },
    { name: "BDO Money Market Fund", category: "Money Market", riskLevel: RiskCategory.CONSERVATIVE, type: AccountType.UITF },
    { name: "BDO Global Equity Index Feeder Fund", category: "Equity", riskLevel: RiskCategory.AGGRESSIVE, type: AccountType.UITF },
    { name: "IMA - Philippine Equities", category: "Equity", riskLevel: RiskCategory.AGGRESSIVE, type: AccountType.IMA },
    { name: "IMA - Fixed Income Securities", category: "Fixed Income", riskLevel: RiskCategory.MODERATE, type: AccountType.IMA },
];

export const RISK_PROFILING_QUESTIONS = [
    {
        id: 1,
        question: "What is your primary investment objective?",
        options: [
            { text: "Capital preservation", score: 10 },
            { text: "Income generation with some growth", score: 20 },
            { text: "Balanced growth and income", score: 30 },
            { text: "Long-term capital growth", score: 40 },
        ],
    },
    {
        id: 2,
        question: "How long is your investment time horizon?",
        options: [
            { text: "Less than 1 year", score: 5 },
            { text: "1 to 3 years", score: 15 },
            { text: "3 to 5 years", score: 25 },
            { text: "More than 5 years", score: 35 },
        ],
    },
    {
        id: 3,
        question: "How would you react to a 20% drop in your portfolio's value in a single year?",
        options: [
            { text: "Sell all investments immediately", score: 0 },
            { text: "Sell some investments", score: 10 },
            { text: "Hold and wait for recovery", score: 20 },
            { text: "Invest more to average down", score: 30 },
        ],
    },
     {
        id: 4,
        question: "What is your level of financial knowledge?",
        options: [
            { text: "Beginner", score: 5 },
            { text: "Intermediate", score: 10 },
            { text: "Advanced", score: 15 },
        ],
    }
];

export const getRiskCategoryFromScore = (score: number): RiskCategory => {
    if (score <= 35) return RiskCategory.CONSERVATIVE;
    if (score <= 70) return RiskCategory.MODERATE;
    return RiskCategory.AGGRESSIVE;
};

export const OPTIONS = {
    civilStatus: Object.values(CivilStatus),
    frequency: Object.values(Frequency),
    instrumentType: Object.values(InstrumentType),
}