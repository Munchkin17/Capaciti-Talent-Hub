import React, { useState } from 'react';
import { 
  Settings, 
  Database, 
  Upload, 
  Download, 
  Users, 
  BarChart3,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'data', label: 'Data Management', icon: Database },
    { id: 'integration', label: 'Integrations', icon: RefreshCw },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleDataSync = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Panel</h2>
        <p className="text-gray-600">Manage platform settings, data integrations, and system configuration.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-primary-600 text-sm font-medium">System Status</p>
                      <p className="text-2xl font-bold text-primary-900">Healthy</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-primary-600" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-success-50 to-success-100 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-success-600 text-sm font-medium">Last Sync</p>
                      <p className="text-2xl font-bold text-success-900">2h ago</p>
                    </div>
                    <RefreshCw className="w-8 h-8 text-success-600" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-warning-50 to-warning-100 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-warning-600 text-sm font-medium">Pending Reviews</p>
                      <p className="text-2xl font-bold text-warning-900">3</p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-warning-600" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { action: 'New candidate profile created', user: 'Sarah Johnson', time: '2 hours ago' },
                    { action: 'Exam results imported from Google Sheets', user: 'System', time: '4 hours ago' },
                    { action: 'Profile visibility updated', user: 'Marcus Chen', time: '1 day ago' },
                  ].map((activity, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">by {activity.user}</p>
                      </div>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
                <p className="text-gray-600 mb-6">Import, export, and manage candidate data and system information.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Upload className="w-5 h-5 text-primary-600" />
                    <span>Import Data</span>
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload CSV files with candidate information, exam results, or challenge scores.
                  </p>
                  <div className="space-y-3">
                    <button className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                      Import Candidates
                    </button>
                    <button className="w-full bg-secondary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary-700 transition-colors">
                      Import Exam Results
                    </button>
                    <button className="w-full bg-accent-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-700 transition-colors">
                      Import Challenge Scores
                    </button>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Download className="w-5 h-5 text-success-600" />
                    <span>Export Data</span>
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Download platform data for backup, analysis, or external reporting.
                  </p>
                  <div className="space-y-3">
                    <button className="w-full bg-success-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-success-700 transition-colors">
                      Export All Candidates
                    </button>
                    <button className="w-full bg-success-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-success-700 transition-colors">
                      Export Performance Data
                    </button>
                    <button className="w-full bg-success-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-success-700 transition-colors">
                      Export Cohort Reports
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integration' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Integrations</h3>
                <p className="text-gray-600 mb-6">Connect external data sources to automatically update candidate profiles.</p>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: 'Google Sheets', status: 'Connected', lastSync: '2 hours ago', color: 'success' },
                  { name: 'Typeform', status: 'Connected', lastSync: '1 day ago', color: 'success' },
                  { name: 'Airtable', status: 'Disconnected', lastSync: 'Never', color: 'error' },
                  { name: 'Zapier Webhook', status: 'Connected', lastSync: '30 minutes ago', color: 'success' },
                ].map((integration) => (
                  <div key={integration.name} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">{integration.name}</h4>
                        <p className="text-sm text-gray-500">Last sync: {integration.lastSync}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          integration.color === 'success' 
                            ? 'bg-success-100 text-success-700'
                            : 'bg-error-100 text-error-700'
                        }`}>
                          {integration.status}
                        </span>
                        <button
                          onClick={handleDataSync}
                          disabled={isLoading}
                          className="flex items-center space-x-2 bg-primary-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                        >
                          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                          <span>Sync Now</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Settings</h3>
                <p className="text-gray-600 mb-6">Configure platform behavior and user permissions.</p>
              </div>
              
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Profile Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Auto-generate AI summaries</label>
                        <p className="text-xs text-gray-500">Automatically create profile summaries when new data is available</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Enable public directory</label>
                        <p className="text-xs text-gray-500">Allow candidates to be discoverable in the talent directory</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Notification Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email alerts for new data</label>
                        <p className="text-xs text-gray-500">Get notified when new exam scores or feedback is imported</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Weekly performance reports</label>
                        <p className="text-xs text-gray-500">Receive weekly summaries of cohort performance</p>
                      </div>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};