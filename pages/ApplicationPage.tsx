
import React, { useState, useEffect } from 'react';
import { Card, Select, Button, PageTitle, Input, Badge } from '../components/ui';
import { useStore } from '../hooks/useStore';
import { Application, ApplicationType, InstrumentType, ItemStatus, RiskCategory } from '../types';
import { generateId, formatCurrency } from '../lib/utils';
import { FUNDS_DATA, OPTIONS } from '../constants';

const ApplicationPage: React.FC = () => {
    const { state, dispatch } = useStore();
    const [txType, setTxType] = useState<ApplicationType>(ApplicationType.BUY);
    const [selectedClient, setSelectedClient] = useState('');
    const [selectedAccount, setSelectedAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [instrumentType, setInstrumentType] = useState<InstrumentType>(InstrumentType.CASA);
    const [waiverAttached, setWaiverAttached] = useState(false);
    const [riskMismatch, setRiskMismatch] = useState(false);
    
    const [cutOff, setCutOff] = useState({ MMF: false, UITF: false });
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const mmfCutoff = new Date();
            mmfCutoff.setHours(11, 30, 0, 0);
            const uitfCutoff = new Date();
            uitfCutoff.setHours(12, 0, 0, 0);

            setCutOff({
                MMF: now > mmfCutoff,
                UITF: now > uitfCutoff
            });
            
            const diff = uitfCutoff.getTime() - now.getTime();
            if (diff > 0) {
                 const hours = Math.floor(diff / (1000 * 60 * 60));
                 const minutes = Math.floor((diff / 1000 / 60) % 60);
                 setTimeLeft(`${hours}h ${minutes}m until UITF cut-off`);
            } else {
                 setTimeLeft('Past cut-off time');
            }

        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const activeClients = state.clients.filter(c => c.status === ItemStatus.ACTIVE);
    const clientAccounts = state.accounts.filter(a => a.clientId === selectedClient && a.status === ItemStatus.ACTIVE);
    const accountDetails = state.accounts.find(a => a.accountId === selectedAccount);
    const clientDetails = state.clients.find(c => c.clientId === selectedClient);

    useEffect(() => {
        if (accountDetails && clientDetails) {
            const fund = FUNDS_DATA.find(f => f.name === accountDetails.fundName);
            if (fund && fund.riskLevel !== clientDetails.riskCategory) {
                const riskOrder = { [RiskCategory.CONSERVATIVE]: 1, [RiskCategory.MODERATE]: 2, [RiskCategory.BALANCED]: 2, [RiskCategory.AGGRESSIVE]: 3 };
                if (riskOrder[fund.riskLevel] > riskOrder[clientDetails.riskCategory]) {
                    setRiskMismatch(true);
                } else {
                    setRiskMismatch(false);
                }
            } else {
                setRiskMismatch(false);
            }
        }
    }, [selectedAccount, selectedClient, state.accounts, state.clients, accountDetails, clientDetails]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fund = FUNDS_DATA.find(f => f.name === accountDetails?.fundName);
        if (!fund) return;
        
        const isMMF = fund.category === 'Money Market';
        const isPastCutoff = isMMF ? cutOff.MMF : cutOff.UITF;
        
        if (isPastCutoff) {
            alert('Application cannot be submitted after cut-off time.');
            return;
        }
        
        if (riskMismatch && !waiverAttached) {
            alert('A waiver is required for applications that exceed the client\'s risk profile.');
            return;
        }

        const newApplication: Application = {
            applicationId: generateId('T'),
            clientId: selectedClient,
            accountId: selectedAccount,
            type: txType,
            amount: parseFloat(amount),
            fund: accountDetails!.fundName,
            instrumentType,
            status: ItemStatus.PENDING,
            submittedBy: state.currentUser.name,
            submittedAt: new Date().toISOString(),
            waiverAttached: riskMismatch && waiverAttached,
        };

        dispatch({ type: 'ADD_APPLICATION', payload: newApplication });
        alert('Application submitted for approval.');
        setSelectedClient('');
        setSelectedAccount('');
        setAmount('');
    };
    
    const isSubmitDisabled = !selectedClient || !selectedAccount || !amount || (riskMismatch && !waiverAttached);

    return (
        <div>
            <PageTitle title="Buy/Sell Application">
                <Badge color={cutOff.UITF ? 'red' : 'green'}>{timeLeft}</Badge>
            </PageTitle>
            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <span className="font-medium">Application Type:</span>
                        <Button type="button" variant={txType === 'Buy' ? 'primary' : 'secondary'} onClick={() => setTxType(ApplicationType.BUY)}>Buy</Button>
                        <Button type="button" variant={txType === 'Sell' ? 'primary' : 'secondary'} onClick={() => setTxType(ApplicationType.SELL)}>Sell</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Select label="Select Client" value={selectedClient} onChange={e => setSelectedClient(e.target.value)} required>
                            <option value="">-- Choose a client --</option>
                            {activeClients.map(c => <option key={c.clientId} value={c.clientId}>{c.lastName}, {c.firstName}</option>)}
                        </Select>

                        <Select label="Select Account" value={selectedAccount} onChange={e => setSelectedAccount(e.target.value)} disabled={!selectedClient} required>
                            <option value="">-- Choose an account --</option>
                            {clientAccounts.map(a => <option key={a.accountId} value={a.accountId}>{a.fundName} ({a.accountId})</option>)}
                        </Select>
                    </div>
                    
                    {accountDetails && (
                        <Card className="bg-gray-50">
                            <h4 className="font-bold mb-2">{accountDetails.fundName}</h4>
                            <div className="flex justify-between text-sm">
                                <p>Current Balance: <span className="font-semibold">{formatCurrency(accountDetails.balance)}</span></p>
                                <p>Fund Risk: <Badge color={accountDetails.riskLevel === 'Conservative' ? 'green' : accountDetails.riskLevel === 'Moderate' ? 'yellow' : 'red'}>{accountDetails.riskLevel}</Badge></p>
                                <p>Client Risk: <Badge color={clientDetails?.riskCategory === 'Conservative' ? 'green' : clientDetails?.riskCategory === 'Moderate' ? 'yellow' : 'red'}>{clientDetails?.riskCategory}</Badge></p>
                            </div>
                        </Card>
                    )}

                    {riskMismatch && (
                        <div className="p-4 bg-red-50 border-l-4 border-red-400">
                            <div className="flex">
                                <div className="flex-shrink-0"><svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg></div>
                                <div className="ml-3"><p className="text-sm text-red-700">Risk Mismatch Detected. Fund risk is higher than client's profile. Waiver is required.</p>
                                <label className="flex items-center mt-2"><input type="checkbox" checked={waiverAttached} onChange={e => setWaiverAttached(e.target.checked)} className="h-4 w-4 text-bdo-blue focus:ring-bdo-light-blue border-gray-300 rounded"/> <span className="ml-2 text-sm text-gray-900">Attach Waiver</span></label>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} required />
                        <Select label="Instrument Type" value={instrumentType} onChange={e => setInstrumentType(e.target.value as InstrumentType)} required>
                            {OPTIONS.instrumentType.map(it => <option key={it} value={it}>{it}</option>)}
                        </Select>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button type="submit" disabled={isSubmitDisabled}>Submit for Approval</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default ApplicationPage;