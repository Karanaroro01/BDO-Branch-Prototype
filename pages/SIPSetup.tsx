
import React, { useState, useMemo } from 'react';
import { Card, Select, Button, PageTitle, Input } from '../components/ui';
import { useStore } from '../hooks/useStore';
import { SIPPlan, SIPType, Frequency, ItemStatus } from '../types';
import { generateId, calculateSip, formatCurrency } from '../lib/utils';
import { OPTIONS } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SIPSetup: React.FC = () => {
    const { state, dispatch } = useStore();
    const [selectedClient, setSelectedClient] = useState('');
    const [selectedAccount, setSelectedAccount] = useState('');
    const [plan, setPlan] = useState<Omit<SIPPlan, 'sipId' | 'clientId' | 'accountId' | 'status' | 'createdBy' | 'submittedAt'>>({
        type: SIPType.SIP,
        amount: 10000,
        frequency: Frequency.MONTHLY,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 10)).toISOString().split('T')[0],
        stepUpEnabled: true,
        stepUpPercent: 10,
        expectedReturn: 8,
    });

    const activeClients = state.clients.filter(c => c.status === ItemStatus.ACTIVE);
    const clientAccounts = state.accounts.filter(a => a.clientId === selectedClient && a.status === ItemStatus.ACTIVE);

    const handlePlanChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setPlan({ ...plan, [name]: checked });
        } else {
            setPlan({ ...plan, [name]: type === 'number' ? parseFloat(value) || 0 : value });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClient || !selectedAccount) {
            alert('Please select a client and account.');
            return;
        }

        const newSipPlan: SIPPlan = {
            ...plan,
            sipId: generateId('SIP'),
            clientId: selectedClient,
            accountId: selectedAccount,
            status: ItemStatus.PENDING,
            createdBy: state.currentUser.name,
            submittedAt: new Date().toISOString(),
        };

        dispatch({ type: 'ADD_SIP_PLAN', payload: newSipPlan });
        alert('New SIP Plan submitted for approval.');
    };

    const chartData = useMemo(() => calculateSip(plan), [plan]);
    const finalData = chartData[chartData.length - 1];

    return (
        <div>
            <PageTitle title="Systematic Investment/Withdrawal Plan Setup" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1" title="Plan Details">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Select label="Client" value={selectedClient} onChange={e => setSelectedClient(e.target.value)} required>
                             <option value="">-- Choose a client --</option>
                             {activeClients.map(c => <option key={c.clientId} value={c.clientId}>{c.lastName}, {c.firstName}</option>)}
                        </Select>
                        <Select label="Account" value={selectedAccount} onChange={e => setSelectedAccount(e.target.value)} required disabled={!selectedClient}>
                             <option value="">-- Choose an account --</option>
                             {clientAccounts.map(a => <option key={a.accountId} value={a.accountId}>{a.fundName}</option>)}
                        </Select>
                        <Select name="type" label="Plan Type" value={plan.type} onChange={handlePlanChange}>
                            <option value={SIPType.SIP}>SIP (Systematic Investment Plan)</option>
                            <option value={SIPType.SWP}>SWP (Systematic Withdrawal Plan)</option>
                        </Select>
                        <Input name="amount" label="Amount" type="number" value={plan.amount} onChange={handlePlanChange} />
                        <Select name="frequency" label="Frequency" value={plan.frequency} onChange={handlePlanChange}>
                            {OPTIONS.frequency.map(f => <option key={f} value={f}>{f}</option>)}
                        </Select>
                        <div className="grid grid-cols-2 gap-4">
                           <Input name="startDate" label="Start Date" type="date" value={plan.startDate} onChange={handlePlanChange} />
                           <Input name="endDate" label="End Date" type="date" value={plan.endDate} onChange={handlePlanChange} />
                        </div>
                        <Input name="expectedReturn" label="Expected Return (% p.a.)" type="number" value={plan.expectedReturn} onChange={handlePlanChange} />

                        <div className="flex items-center space-x-4 pt-2">
                             <label className="flex items-center"><input type="checkbox" name="stepUpEnabled" checked={plan.stepUpEnabled} onChange={handlePlanChange} className="h-4 w-4 text-bdo-blue rounded"/> <span className="ml-2">Enable Step-Up</span></label>
                             {plan.stepUpEnabled && (
                                 <Input name="stepUpPercent" label="Step-Up %" type="number" value={plan.stepUpPercent} onChange={handlePlanChange} />
                             )}
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button type="submit">Create Plan</Button>
                        </div>
                    </form>
                </Card>

                <div className="lg:col-span-2">
                    <Card title="Projected Growth">
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" label={{ value: 'Months', position: 'insideBottom', offset: -5 }}/>
                                <YAxis tickFormatter={(value) => `₱${(Number(value)/1000).toFixed(0)}k`} />
                                <Tooltip formatter={(value:number) => formatCurrency(value)} />
                                <Legend />
                                <Line type="monotone" dataKey="standardValue" name="Standard SIP" stroke="#8884d8" activeDot={{ r: 8 }} />
                                {plan.stepUpEnabled && <Line type="monotone" dataKey="stepUpValue" name="Step-Up SIP" stroke="#82ca9d" />}
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                    {finalData && (
                        <Card className="mt-8" title="Final Corpus Summary">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-indigo-50 p-4 rounded-lg">
                                    <h4 className="font-bold text-indigo-800">Standard SIP</h4>
                                    <p className="text-2xl font-bold text-indigo-900">{formatCurrency(finalData.standardValue)}</p>
                                    <p className="text-sm text-gray-600 mt-1">Total Investment: {formatCurrency(finalData.totalStandardInvestment)}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h4 className="font-bold text-green-800">Step-Up SIP</h4>
                                    <p className="text-2xl font-bold text-green-900">{formatCurrency(finalData.stepUpValue)}</p>
                                    <p className="text-sm text-gray-600 mt-1">Total Investment: {formatCurrency(finalData.totalStepUpInvestment)}</p>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SIPSetup;
