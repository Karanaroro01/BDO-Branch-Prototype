
import React, { useState } from 'react';
import { Card, Select, Button, PageTitle } from '../components/ui';
import { useStore } from '../hooks/useStore';
import { Account, AccountType, HoldingType, ItemStatus } from '../types';
import { generateId } from '../lib/utils';
import { FUNDS_DATA } from '../constants';

const AccountSetup: React.FC = () => {
    const { state, dispatch } = useStore();
    const [selectedClient, setSelectedClient] = useState('');
    const [accountType, setAccountType] = useState<AccountType>(AccountType.UITF);
    const [holdingType, setHoldingType] = useState<HoldingType>(HoldingType.SINGLE);
    const [selectedFund, setSelectedFund] = useState('');

    const activeClients = state.clients.filter(c => c.status === ItemStatus.ACTIVE);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClient || !selectedFund) {
            alert('Please select a client and a fund.');
            return;
        }

        const fundDetails = FUNDS_DATA.find(f => f.name === selectedFund);
        if (!fundDetails) {
            alert('Invalid fund selected.');
            return;
        }

        const newAccount: Account = {
            accountId: generateId('UA'),
            clientId: selectedClient,
            accountType: fundDetails.type,
            holdingType,
            fundName: fundDetails.name,
            fundCategory: fundDetails.category,
            riskLevel: fundDetails.riskLevel,
            balance: 0,
            openDate: new Date().toISOString(),
            status: ItemStatus.PENDING,
            submittedBy: state.currentUser.name,
            submittedAt: new Date().toISOString(),
        };

        dispatch({ type: 'ADD_ACCOUNT', payload: newAccount });
        alert('New account application submitted for approval.');
        // Reset form
        setSelectedClient('');
        setSelectedFund('');
    };

    const availableFunds = FUNDS_DATA.filter(f => f.type === accountType);

    return (
        <div>
            <PageTitle title="Account Setup" />
            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Select
                        label="Select Client"
                        value={selectedClient}
                        onChange={e => setSelectedClient(e.target.value)}
                        required
                    >
                        <option value="">-- Choose a client --</option>
                        {activeClients.map(c => (
                            <option key={c.clientId} value={c.clientId}>
                                {c.lastName}, {c.firstName} ({c.clientId})
                            </option>
                        ))}
                    </Select>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Select
                            label="Account Type"
                            value={accountType}
                            onChange={e => setAccountType(e.target.value as AccountType)}
                            required
                        >
                            <option value={AccountType.UITF}>UITF</option>
                            <option value={AccountType.IMA}>IMA</option>
                        </Select>
                        <Select
                            label="Holding Type"
                            value={holdingType}
                            onChange={e => setHoldingType(e.target.value as HoldingType)}
                            required
                        >
                            <option value={HoldingType.SINGLE}>Single</option>
                            <option value={HoldingType.JOINT}>Joint</option>
                            <option value={HoldingType.IN_TRUST}>In Trust For</option>
                        </Select>
                    </div>

                    <Select
                        label="Select Fund"
                        value={selectedFund}
                        onChange={e => setSelectedFund(e.target.value)}
                        required
                    >
                        <option value="">-- Choose a fund --</option>
                        {availableFunds.map(fund => (
                            <option key={fund.name} value={fund.name}>
                                {fund.name} ({fund.riskLevel})
                            </option>
                        ))}
                    </Select>

                    <div className="pt-4 flex justify-end">
                        <Button type="submit">Submit for Approval</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default AccountSetup;
