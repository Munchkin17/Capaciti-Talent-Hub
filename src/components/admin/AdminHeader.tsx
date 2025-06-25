import React from 'react';
import { User, BarChart3, Settings, LogOut, Calendar, Users, MessageSquare } from 'lucide-react';

interface AdminHeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ currentView, onViewChange, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'candidates', label: 'Candidates', icon: User },
    { id: 'cohorts', label: 'Cohorts', icon: Calendar },
    { id: 'feedback', label: 'Tech Feedback', icon: MessageSquare },
    { id: 'admin', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="bg-white shadow-lg border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12">
                <img 
                  src="/CAPACITI Logo 3.png" 
                  alt="CAPACITI Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary-900">CAPACITI</h1>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-secondary-600">TALENT HUB</span>
                  <span className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full font-medium">Admin</span>
                </div>
              </div>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentView === item.id
                      ? 'bg-gradient-to-r from-secondary-600 to-secondary-700 text-white shadow-lg'
                      : 'text-neutral-600 hover:text-primary-900 hover:bg-neutral-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary-700" />
              </div>
              <div className="hidden sm:block">
                <span className="text-sm font-medium text-primary-900">Tech Mentor</span>
                <p className="text-xs text-neutral-600">Administrator</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 text-neutral-600 hover:text-accent-600 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};