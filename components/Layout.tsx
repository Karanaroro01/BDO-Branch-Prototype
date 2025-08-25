
import React, { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import { useStore } from '../hooks/useStore';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { state } = useStore();

  return (
    <div className="w-64 bg-bdo-dark-blue text-white flex flex-col">
      <div className="h-16 flex items-center justify-center px-4 border-b border-bdo-blue">
        <h1 className="text-xl font-bold text-bdo-gold">BDO Trust</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {NAV_LINKS.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-bdo-blue text-white'
                  : 'text-gray-300 hover:bg-bdo-blue hover:text-white'
              }`
            }
          >
            <item.icon className="mr-3 flex-shrink-0 h-6 w-6" aria-hidden="true" />
            {item.name}
            {item.name === 'Approvals' && state.approvals.length > 0 && (
                <span className="ml-auto inline-block py-0.5 px-3 text-xs rounded-full bg-bdo-gold text-bdo-dark-blue">
                    {state.approvals.length}
                </span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

const Header: React.FC = () => {
    const { state } = useStore();
    return (
        <header className="bg-white shadow-sm h-16 flex items-center justify-end px-6">
            <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                    {state.currentUser.role}: {state.currentUser.name}
                </span>
                <div className="h-8 w-8 rounded-full bg-bdo-blue text-white flex items-center justify-center font-bold">
                    {state.currentUser.name.charAt(0)}
                </div>
            </div>
        </header>
    );
}

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen flex overflow-hidden bg-bdo-gray">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
            {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
