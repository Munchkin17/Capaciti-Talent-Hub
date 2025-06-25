import React, { useState } from 'react';
import { AdminHeader } from './AdminHeader';
import { Dashboard } from '../Dashboard';
import { CandidateManagement } from './CandidateManagement';
import { CohortManagement } from './CohortManagement';
import { TechnicalFeedbackManagement } from './TechnicalFeedbackManagement';
import { AdminPanel } from '../AdminPanel';

interface AdminAppProps {
  onLogout: () => void;
}

export const AdminApp: React.FC<AdminAppProps> = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'candidates':
        return <CandidateManagement />;
      case 'cohorts':
        return <CohortManagement />;
      case 'feedback':
        return <TechnicalFeedbackManagement />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminHeader 
        currentView={currentView} 
        onViewChange={setCurrentView}
        onLogout={onLogout}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};