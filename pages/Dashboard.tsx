
import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { Card, PageTitle } from '../components/ui';
import { DASHBOARD_QUICK_LINKS } from '../constants';
import { Link } from 'react-router-dom';
import { ApprovalType, ItemStatus } from '../types';

const ChainIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
    </svg>
);

const Dashboard: React.FC = () => {
    const { state } = useStore();
    const { clients, accounts, applications, approvals } = state;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const stats = [
        { name: 'Total Clients', value: clients.length },
        { name: 'Total Accounts', value: accounts.length },
        { name: 'Pending Approvals', value: approvals.length, color: 'text-red-500' },
        { name: 'Recent Applications (7d)', value: applications.filter(t => new Date(t.submittedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length },
    ];

    return (
        <div>
            <PageTitle title="Welcome, Maker Juan!" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map(stat => (
                    <Card key={stat.name}>
                        <p className="text-sm font-medium text-black truncate">{stat.name}</p>
                        <p className={`mt-1 text-3xl font-semibold ${stat.color || 'text-black'}`}>{stat.value}</p>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card title="Quick Actions" className="lg:col-span-1">
                    <div className="grid grid-cols-2 gap-4">
                        {DASHBOARD_QUICK_LINKS.map(link => (
                            <button onClick={() => setIsModalOpen(true)} key={link.name} className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-bdo-gold/20 rounded-lg text-center transition">
                                <link.icon className="h-8 w-8 text-bdo-blue mb-2" />
                                <span className="text-sm font-medium text-bdo-dark-blue">{link.name}</span>
                            </button>
                        ))}
                    </div>
                </Card>

                <Card title="Pending Approvals" className="lg:col-span-2">
                    {approvals.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {approvals.slice(0, 5).map(item => (
                                <li key={item.id} className="py-3 flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium text-black">{item.details}</p>
                                        <p className="text-sm text-gray-700">
                                            {item.type} - Submitted by {item.submittedBy} on {new Date(item.submittedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className="text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">{item.status}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-black py-8">No pending approvals. Great job!</p>
                    )}
                </Card>
            </div>
            {isModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true">
                    <div className="bg-white p-8 rounded-lg shadow-xl text-center w-full max-w-md">
                         <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                             <ChainIcon className="h-6 w-6 text-bdo-blue" />
                         </div>
                         <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Redirect to iWF Application</h3>
                         <p className="text-sm text-gray-700 mb-6 px-4">
                             To continue with this action, you will be redirected to the iWF Main Application. For example, to add a client, please continue in iWF App.
                         </p>
                         <div className="flex justify-center space-x-4">
                             <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300">Cancel</button>
                             <a href="https://bdo.com.ph/iwf-placeholder" target="_blank" rel="noopener noreferrer" onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-bdo-blue text-white rounded-md hover:bg-bdo-dark-blue">Continue</a>
                         </div>
                     </div>
                 </div>
            )}
        </div>
    );
};

export default Dashboard;