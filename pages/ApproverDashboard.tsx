
import React from 'react';
import { Card, Button, PageTitle, Badge, Table } from '../components/ui';
import { useStore } from '../hooks/useStore';
import { ApprovalItem, ApprovalType, Client, Account, Application, SIPPlan } from '../types';
import { formatDate, formatCurrency } from '../lib/utils';

const ItemDetails: React.FC<{ item: ApprovalItem }> = ({ item }) => {
    const data = item.data;
    switch (item.type) {
        case ApprovalType.CLIENT:
            const client = data as Client;
            return <p>Email: {client.email}, Branch: {client.branchCode}</p>;
        case ApprovalType.ACCOUNT:
            const account = data as Account;
            return <p>Fund: {account.fundName}, Type: {account.accountType}</p>;
        case ApprovalType.APPLICATION:
            const app = data as Application;
            return <p>Amount: {formatCurrency(app.amount)}, Instrument: {app.instrumentType}</p>;
        case ApprovalType.SIP:
            const sip = data as SIPPlan;
            return <p>Amount: {formatCurrency(sip.amount)} / {sip.frequency}</p>;
        default:
            return null;
    }
}

const ApproverDashboard: React.FC = () => {
    const { state, dispatch } = useStore();
    const { approvals, currentUser } = state;

    const handleApprove = (approvalId: string) => {
        if (window.confirm('Are you sure you want to approve this item?')) {
            dispatch({ type: 'APPROVE_ITEM', payload: { approvalId, approver: currentUser.name } });
        }
    };
    
    const handleReject = (approvalId: string) => {
        if (window.confirm('Are you sure you want to reject this item?')) {
            const reason = prompt("Please provide a reason for rejection:");
            dispatch({ type: 'REJECT_ITEM', payload: { approvalId, approver: currentUser.name } });
        }
    };

    return (
        <div>
            <PageTitle title="Approver Dashboard" />
            <Card>
                {approvals.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <h3 className="mt-2 text-sm font-medium text-black">All caught up!</h3>
                        <p className="mt-1 text-sm text-black">There are no pending items for approval.</p>
                    </div>
                ) : (
                    <Table headers={['Details', 'Type', 'Submitted By', 'Submitted At', 'Status', 'Actions']}>
                        {approvals.map((item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-black">{item.details}</div>
                                    <div className="text-sm text-gray-700"><ItemDetails item={item} /></div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{item.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{item.submittedBy}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{formatDate(item.submittedAt)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge color="yellow">{item.status}</Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <Button onClick={() => handleApprove(item.id)} variant="primary" className="text-xs">Approve</Button>
                                    <Button onClick={() => handleReject(item.id)} variant="danger" className="text-xs">Reject</Button>
                                </td>
                            </tr>
                        ))}
                    </Table>
                )}
            </Card>
        </div>
    );
};

export default ApproverDashboard;