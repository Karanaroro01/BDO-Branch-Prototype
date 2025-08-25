
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ClientOnboarding from './pages/ClientOnboarding';
import AccountSetup from './pages/AccountSetup';
import ApplicationPage from './pages/ApplicationPage';
import SIPSetup from './pages/SIPSetup';
import ApproverDashboard from './pages/ApproverDashboard';
import Client360 from './pages/Client360';
import Reports from './pages/Reports';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/client-onboarding" element={<ClientOnboarding />} />
          <Route path="/account-setup" element={<AccountSetup />} />
          <Route path="/applications" element={<ApplicationPage />} />
          <Route path="/sip-swp" element={<SIPSetup />} />
          <Route path="/approvals" element={<ApproverDashboard />} />
          <Route path="/client-360" element={<Client360 />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;