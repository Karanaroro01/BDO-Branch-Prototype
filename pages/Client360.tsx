import React, { useState, useEffect, useMemo } from 'react';
import { Card, Input, PageTitle, Badge, RiskBadge, Table, Button, Select } from '../components/ui';
import { useStore } from '../hooks/useStore';
import { formatCurrency, formatDate } from '../lib/utils';
import { ItemStatus, RiskCategory, Account } from '../types';
import { Chart as ChartJS, ArcElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement);


const SoaOptionsModal: React.FC<{
    account: Account;
    onClose: () => void;
}> = ({ account, onClose }) => {
    const [dateRange, setDateRange] = useState('month');
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');

    const handleDownload = () => {
        let rangeDesc = '';
        switch(dateRange) {
            case 'month': rangeDesc = 'this month'; break;
            case 'quarter': rangeDesc = 'this quarter'; break;
            case 'last_quarter': rangeDesc = 'last quarter'; break;
            case 'year': rangeDesc = 'the financial year (Jan-Dec)'; break;
            case 'custom': 
                if (!customStart || !customEnd) {
                    alert('Please select a start and end date for the custom range.');
                    return;
                }
                rangeDesc = `from ${customStart} to ${customEnd}`;
                break;
        }
        alert(`Downloading Statement of Account for ${account.accountId} for ${rangeDesc}.`);
        onClose();
    };

    const options = [
        { id: 'month', label: 'This Month' },
        { id: 'quarter', label: 'This Quarter' },
        { id: 'last_quarter', label: 'Last Quarter' },
        { id: 'year', label: 'Financial Year (Jan to Dec)' },
        { id: 'custom', label: 'Custom Date Range' },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                <h3 className="text-lg font-bold text-bdo-dark-blue mb-2">Download Statement of Account</h3>
                <p className="text-sm text-black mb-6">Select a date range for account <span className="font-semibold">{account.accountId}</span>.</p>
                <fieldset className="space-y-4">
                    <legend className="sr-only">Date range options</legend>
                    {options.map(option => (
                        <div key={option.id} className="flex items-center">
                            <input
                                id={option.id}
                                name="notification-method"
                                type="radio"
                                checked={dateRange === option.id}
                                onChange={() => setDateRange(option.id)}
                                className="focus:ring-bdo-blue h-4 w-4 text-bdo-blue border-gray-300"
                            />
                            <label htmlFor={option.id} className="ml-3 block text-sm font-medium text-black">{option.label}</label>
                        </div>
                    ))}
                </fieldset>
                {dateRange === 'custom' && (
                    <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-md border">
                        <Input label="Start Date" type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} />
                        <Input label="End Date" type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} />
                    </div>
                )}
                <div className="flex justify-end space-x-4 mt-8">
                    <button className="px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 text-sm font-medium" onClick={onClose}>Cancel</button>
                    <Button onClick={handleDownload}>Download</Button>
                </div>
            </div>
        </div>
    );
}

const RiskProfileVisual: React.FC<{ score: number; category: RiskCategory }> = ({ score, category }) => {
    const chartData = {
        labels: ['Conservative', 'Moderate', 'Aggressive'],
        datasets: [{
          data: [33.3, 33.3, 33.3],
          backgroundColor: ['#4285F4', '#F4B400', '#DB4437'],
          borderWidth: 0,
          circumference: 180,
          rotation: 270,
          cutout: '70%',
        }]
    };
    
    const chartOptions = {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
    };

    const gaugeNeedle = {
        id: 'gaugeNeedle',
        afterDatasetsDraw: (chart: ChartJS) => {
            const { ctx, chartArea: { width } } = chart;
            ctx.save();
            const needleValue = score;
            const maxValue = 120;
            const angle = Math.PI + (needleValue / maxValue) * Math.PI;
            const cx = width / 2;
            const cy = chart.getDatasetMeta(0).data[0].y;
            const needleLength = chart.getDatasetMeta(0).data[0].outerRadius - 15;

            // Draw Needle
            ctx.translate(cx, cy);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(0, -4);
            ctx.lineTo(needleLength, 0);
            ctx.lineTo(0, 4);
            ctx.fillStyle = '#222';
            ctx.fill();
            ctx.restore();

            // Draw center dot
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, 8, 0, 2 * Math.PI);
            ctx.fillStyle = '#222';
            ctx.fill();
            ctx.restore();
        }
    };

    return (
        <div className="relative w-full max-w-xs mx-auto">
             <Doughnut data={chartData} options={chartOptions} plugins={[gaugeNeedle]} />
             <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                 <p className="text-4xl font-bold text-bdo-dark-blue">{score}</p>
                 <RiskBadge risk={category} />
            </div>
            <div className="flex justify-between mt-2 text-xs font-medium px-2">
                <span style={{color:'#4285F4'}}>Conservative</span>
                <span style={{color:'#F4B400'}}>Moderate</span>
                <span style={{color:'#DB4437'}}>Aggressive</span>
            </div>
        </div>
    );
};


const Client360: React.FC = () => {
    const { state } = useStore();
    const [selectedClientId, setSelectedClientId] = useState<string>(state.clients[0]?.clientId || '');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isSoaModalOpen, setIsSoaModalOpen] = useState(false);
    const [selectedAccountForSoa, setSelectedAccountForSoa] = useState<Account | null>(null);

    const client = state.clients.find(c => c.clientId === selectedClientId);

    useEffect(() => {
        if (client) {
            setSearchQuery(`${client.lastName}, ${client.firstName}`);
        }
    }, [client]);

    const handleOpenSoaModal = (account: Account) => {
        setSelectedAccountForSoa(account);
        setIsSoaModalOpen(true);
    };

    const filteredClients = useMemo(() => {
        if (searchQuery === '%%%') {
            return state.clients;
        }
        if (!searchQuery || (client && `${client.lastName}, ${client.firstName}` === searchQuery)) {
             return [];
        }
        return state.clients.filter(c => 
            `${c.lastName}, ${c.firstName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.clientId.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, state.clients, client]);

    const accounts = state.accounts.filter(a => a.clientId === selectedClientId);
    const applications = state.applications.filter(t => t.clientId === selectedClientId).sort((a,b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    const sipPlans = state.sipPlans.filter(s => s.clientId === selectedClientId);

    const requiredDocs = ['Valid ID', 'Proof of Address', 'Signature Card'];
    const clientDocs = client?.documents.map(d => d.name) || [];
    const missingDocs = requiredDocs.filter(d => !clientDocs.includes(d));
    
    const getStatusColor = (status: ItemStatus) => {
        switch (status) {
            case ItemStatus.ACTIVE: return 'green';
            case ItemStatus.PENDING: return 'yellow';
            case ItemStatus.REJECTED: return 'red';
            case ItemStatus.CLOSED: return 'gray';
            case ItemStatus.APPROVED: return 'green';
            default: return 'gray';
        }
    }


    return (
        <div>
            <PageTitle title="Client 360 View">
                 <div className="relative w-72">
                    <Input 
                        type="search" 
                        placeholder="Search Client Name or ID... (or %%%)" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                        label=""
                    />
                    {isSearchFocused && filteredClients.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                            {filteredClients.map(c => (
                                <li 
                                    key={c.clientId} 
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                    onMouseDown={() => {
                                        setSelectedClientId(c.clientId);
                                        setIsSearchFocused(false);
                                    }}
                                >
                                    {c.lastName}, {c.firstName} <span className="text-gray-700">({c.clientId})</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </PageTitle>

            {!client ? (
                <Card><p>Please select a client to view their details, or search with '%%%' to see all clients.</p></Card>
            ) : (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Card title="CIF Info" className="lg:col-span-2">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                <div><p className="text-black">Name</p><p className="font-semibold text-black">{client.firstName} {client.lastName}</p></div>
                                <div><p className="text-black">Email</p><p className="font-semibold text-black">{client.email}</p></div>
                                <div><p className="text-black">Phone</p><p className="font-semibold text-black">{client.phone}</p></div>
                                <div><p className="text-black">DOB</p><p className="font-semibold text-black">{formatDate(client.dob)}</p></div>
                                <div><p className="text-black">TIN</p><p className="font-semibold text-black">{client.tin}</p></div>
                                <div><p className="text-black">Branch</p><p className="font-semibold text-black">{client.branchCode}</p></div>
                                <div className="col-span-full"><p className="text-black">Address</p><p className="font-semibold text-black">{client.address}</p></div>
                            </div>
                        </Card>
                        <div className="space-y-8">
                            <Card title="Risk Profile">
                                <RiskProfileVisual score={client.riskProfileScore} category={client.riskCategory} />
                            </Card>
                             <Card title="Document Checklist">
                                <ul className="space-y-2 text-sm">
                                    {requiredDocs.map(doc => (
                                        <li key={doc} className={`flex items-center ${clientDocs.includes(doc) ? 'text-black' : 'text-gray-500'}`}>
                                            {clientDocs.includes(doc) ? 
                                                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> :
                                                <svg className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                            }
                                            {doc}
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </div>
                    </div>
                    
                    <Card title="Account List">
                        <Table headers={['Account ID', 'Fund Name', 'Category', 'Balance', 'Status', 'Actions']}>
                        {accounts.map(acc => (
                            <tr key={acc.accountId}>
                                <td className="px-6 py-4 text-sm text-black">{acc.accountId}</td>
                                <td className="px-6 py-4 text-sm text-black">{acc.fundName} <RiskBadge risk={acc.riskLevel}/></td>
                                <td className="px-6 py-4 text-sm text-black">{acc.fundCategory}</td>
                                <td className="px-6 py-4 text-sm text-black text-right">{formatCurrency(acc.balance)}</td>
                                <td className="px-6 py-4 text-sm text-black"><Badge color={getStatusColor(acc.status)}>{acc.status}</Badge></td>
                                <td className="px-6 py-4 text-sm text-black"><Button variant="secondary" className="text-xs" onClick={() => handleOpenSoaModal(acc)}>Download SOA</Button></td>
                            </tr>
                        ))}
                        </Table>
                    </Card>

                    <Card title="Applications">
                        <Table headers={['Date', 'Type', 'Amount', 'Fund', 'Status', 'Actions']}>
                        {applications.slice(0, 5).map(tx => (
                            <tr key={tx.applicationId}>
                                <td className="px-6 py-4 text-sm text-black">{formatDate(tx.submittedAt)}</td>
                                <td className="px-6 py-4 text-sm"><Badge color={tx.type === 'Buy' ? 'blue' : 'yellow'}>{tx.type}</Badge></td>
                                <td className="px-6 py-4 text-sm text-black text-right">{formatCurrency(tx.amount)}</td>
                                <td className="px-6 py-4 text-sm text-black">{tx.fund}</td>
                                <td className="px-6 py-4 text-sm"><Badge color={getStatusColor(tx.status)}>{tx.status}</Badge></td>
                                <td className="px-6 py-4 text-sm"><Button variant="secondary" className="text-xs">Download COP</Button></td>
                            </tr>
                        ))}
                        </Table>
                    </Card>

                     <Card title="SIP/SWP Plans">
                        <Table headers={['Plan Type', 'Amount', 'Frequency', 'Start Date', 'Next SIP Date', 'Last Executed SIP Date', 'Status']}>
                         {sipPlans.map(sip => (
                            <tr key={sip.sipId}>
                                <td className="px-6 py-4 text-sm text-black">{sip.type}</td>
                                <td className="px-6 py-4 text-sm text-black text-right">{formatCurrency(sip.amount)}</td>
                                <td className="px-6 py-4 text-sm text-black">{sip.frequency}</td>
                                <td className="px-6 py-4 text-sm text-black">{formatDate(sip.startDate)}</td>
                                <td className="px-6 py-4 text-sm text-black">{formatDate(new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString())}</td> 
                                <td className="px-6 py-4 text-sm text-black">{formatDate(new Date().toISOString())}</td>
                                <td className="px-6 py-4 text-sm"><Badge color={getStatusColor(sip.status)}>{sip.status}</Badge></td>
                            </tr>
                        ))}
                        </Table>
                    </Card>
                </div>
            )}
            {isSoaModalOpen && selectedAccountForSoa && (
                <SoaOptionsModal 
                    account={selectedAccountForSoa}
                    onClose={() => setIsSoaModalOpen(false)}
                />
            )}
        </div>
    );
};

export default Client360;