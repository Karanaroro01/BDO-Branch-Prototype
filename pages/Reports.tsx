
import React, { useState, useMemo } from 'react';
import { Card, PageTitle, Button, Table, Badge, RiskBadge, Input, Select } from '../components/ui';
import { useStore } from '../hooks/useStore';
import { formatCurrency, formatDate } from '../lib/utils';
import { BDO_BRANCHES, RELATIONSHIP_MANAGERS } from '../constants';
import { Application, ItemStatus, RiskCategory } from '../types';

const Reports: React.FC = () => {
    const { state } = useStore();
    const { applications, clients } = state;
    const [activeReport, setActiveReport] = useState('transactions');
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        rm: '',
        branch: '',
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const filteredApplications = useMemo(() => {
        return applications.filter(app => {
            const client = clients.find(c => c.clientId === app.clientId);
            if (!client) return false;
            const appDate = new Date(app.submittedAt);
            if (filters.startDate && appDate < new Date(filters.startDate)) return false;
            if (filters.endDate && appDate > new Date(filters.endDate)) return false;
            if (filters.rm && client.relationshipManager !== filters.rm) return false;
            if (filters.branch && client.branchCode !== filters.branch) return false;
            return true;
        });
    }, [applications, clients, filters]);

    const riskMismatchReport = useMemo(() => {
        return applications
            .map(app => ({ app, client: clients.find(c => c.clientId === app.clientId) }))
            .filter(item => {
                if (!item.client) return false;
                const fund = state.accounts.find(a => a.accountId === item.app.accountId);
                if (!fund) return false;
                const riskOrder = { [RiskCategory.CONSERVATIVE]: 1, [RiskCategory.MODERATE]: 2, [RiskCategory.BALANCED]: 2, [RiskCategory.AGGRESSIVE]: 3 };
                return riskOrder[fund.riskLevel] > riskOrder[item.client.riskCategory];
            });
    }, [applications, clients, state.accounts]);
    
    const amlAlerts = useMemo(() => {
       return filteredApplications.filter(app => app.instrumentType === 'Cash' && app.amount > 500000);
    }, [filteredApplications]);

    const exportToCsv = (data: any[], filename: string) => {
        if (data.length === 0) return;
        const headers = Object.keys(data[0]);
        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + data.map(e => headers.map(header => e[header]).join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${filename}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderReport = () => {
        switch (activeReport) {
            case 'transactions':
                return (
                    <Table headers={['Date', 'Client', 'Type', 'Amount', 'Fund', 'Status']}>
                        {filteredApplications.map(app => (
                            <tr key={app.applicationId}>
                                <td className="px-6 py-4">{formatDate(app.submittedAt)}</td>
                                <td className="px-6 py-4">{clients.find(c=>c.clientId === app.clientId)?.lastName}</td>
                                <td className="px-6 py-4"><Badge color={app.type === 'Buy' ? 'blue' : 'yellow'}>{app.type}</Badge></td>
                                <td className="px-6 py-4">{formatCurrency(app.amount)}</td>
                                <td className="px-6 py-4">{app.fund}</td>
                                <td className="px-6 py-4"><Badge color={app.status === ItemStatus.APPROVED ? 'green' : 'yellow'}>{app.status}</Badge></td>
                            </tr>
                        ))}
                    </Table>
                );
            case 'risk':
                return (
                     <Table headers={['Date', 'Client', 'Client Risk', 'Application Risk', 'Amount']}>
                         {riskMismatchReport.map(({ app, client }) => (
                             <tr key={app.applicationId}>
                                 <td className="px-6 py-4">{formatDate(app.submittedAt)}</td>
                                 <td className="px-6 py-4">{client?.lastName}</td>
                                 <td className="px-6 py-4"><RiskBadge risk={client!.riskCategory} /></td>
                                 <td className="px-6 py-4"><RiskBadge risk={state.accounts.find(a=>a.accountId === app.accountId)!.riskLevel} /></td>
                                 <td className="px-6 py-4">{formatCurrency(app.amount)}</td>
                             </tr>
                         ))}
                     </Table>
                );
            case 'aml':
                return (
                     <Table headers={['Date', 'Client', 'Amount', 'Instrument']}>
                         {amlAlerts.map(app => (
                             <tr key={app.applicationId} className="bg-yellow-50">
                                 <td className="px-6 py-4">{formatDate(app.submittedAt)}</td>
                                 <td className="px-6 py-4">{clients.find(c=>c.clientId === app.clientId)?.lastName}</td>
                                 <td className="px-6 py-4 font-bold text-red-600">{formatCurrency(app.amount)}</td>
                                 <td className="px-6 py-4"><Badge color="red">{app.instrumentType}</Badge></td>
                             </tr>
                         ))}
                     </Table>
                );
            default: return null;
        }
    }

    return (
        <div>
            <PageTitle title="Reports & Compliance">
                <Button onClick={() => exportToCsv(filteredApplications, 'application_report')}>Export CSV</Button>
            </PageTitle>

            <Card className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <Input name="startDate" label="Start Date" type="date" value={filters.startDate} onChange={handleFilterChange} />
                    <Input name="endDate" label="End Date" type="date" value={filters.endDate} onChange={handleFilterChange} />
                    <Select name="rm" label="Relationship Manager" value={filters.rm} onChange={handleFilterChange}>
                        <option value="">All</option>
                        {RELATIONSHIP_MANAGERS.map(rm => <option key={rm} value={rm}>{rm}</option>)}
                    </Select>
                     <Select name="branch" label="Branch" value={filters.branch} onChange={handleFilterChange}>
                        <option value="">All</option>
                        {BDO_BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                    </Select>
                </div>
            </Card>

            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveReport('transactions')} className={`${activeReport === 'transactions' ? 'border-bdo-blue text-bdo-blue' : 'border-transparent text-black hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Daily Application Log</button>
                    <button onClick={() => setActiveReport('risk')} className={`${activeReport === 'risk' ? 'border-bdo-blue text-bdo-blue' : 'border-transparent text-black hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Risk Mismatch Report</button>
                    <button onClick={() => setActiveReport('aml')} className={`${activeReport === 'aml' ? 'border-bdo-blue text-bdo-blue' : 'border-transparent text-black hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>AML Alerts</button>
                </nav>
            </div>

            <Card>
                {renderReport()}
            </Card>

        </div>
    );
};

export default Reports;