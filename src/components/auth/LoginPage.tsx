import React, { useState } from 'react';
import { Lock, Eye, Globe, BarChart3, Shield, TrendingUp, Users, Award } from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: 'admin' | 'public') => void;
  onPublicAccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onPublicAccess }) => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      onLogin('admin');
    } else {
      setError('Invalid credentials. Use admin/admin123 for demo.');
    }
  };

  if (showAdminLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-neutral-50 to-secondary-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-neutral-200">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-6 relative">
                <img 
                  src="/CAPACITI Logo 3.png" 
                  alt="CAPACITI Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="text-2xl font-bold text-primary-900 mb-2">Admin Access</h2>
              <p className="text-neutral-600">CAPACITI TALENT HUB</p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-primary-900 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent transition-colors"
                  placeholder="Enter username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-900 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-600 focus:border-transparent transition-colors"
                  placeholder="Enter password"
                  required
                />
              </div>

              {error && (
                <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-secondary-600 to-secondary-700 text-white py-3 rounded-lg font-medium hover:from-secondary-700 hover:to-secondary-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Sign In to Dashboard
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAdminLogin(false)}
                className="text-neutral-600 hover:text-primary-900 text-sm transition-colors"
              >
                ← Back to main page
              </button>
            </div>

            <div className="mt-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
              <p className="text-xs text-neutral-600 text-center">
                Demo credentials: admin / admin123
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
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
                <p className="text-sm font-medium text-secondary-600">TALENT HUB</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowAdminLogin(true)}
              className="flex items-center space-x-2 bg-primary-900 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-primary-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Lock className="w-4 h-4" />
              <span>Admin Access</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium mb-6">
              Discover Exceptional Talent
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-primary-900 mb-8 leading-tight">
            Welcome to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-secondary-600 to-accent-500">
              CAPACITI TALENT HUB
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-neutral-600 max-w-4xl mx-auto mb-12 leading-relaxed">
            Explore our comprehensive talent directory featuring skilled developers, data analysts, 
            and tech professionals from our intensive training programs. All candidates are 
            <span className="font-semibold text-primary-900"> verified, skilled, and ready to contribute</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={onPublicAccess}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white px-10 py-5 rounded-xl text-lg font-semibold hover:from-accent-600 hover:to-accent-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <Globe className="w-6 h-6" />
              <span>Browse Talent Directory</span>
            </button>
            
            <div className="flex items-center space-x-2 text-neutral-600">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">150+ verified professionals available</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="group bg-white rounded-2xl p-8 shadow-lg border border-neutral-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-8 h-8 text-secondary-600" />
            </div>
            <h3 className="text-xl font-bold text-primary-900 mb-4">Verified Talent</h3>
            <p className="text-neutral-600 leading-relaxed">
              All candidates have completed rigorous training programs with verified skills, 
              certifications, and peer-reviewed performance metrics.
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-lg border border-neutral-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-100 to-accent-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <BarChart3 className="w-8 h-8 text-accent-600" />
            </div>
            <h3 className="text-xl font-bold text-primary-900 mb-4">Performance Tracked</h3>
            <p className="text-neutral-600 leading-relaxed">
              Detailed performance metrics, challenge results, and comprehensive feedback 
              for informed hiring decisions.
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-lg border border-neutral-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Award className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-primary-900 mb-4">Ready to Hire</h3>
            <p className="text-neutral-600 leading-relaxed">
              Access portfolios, GitHub profiles, and comprehensive candidate information 
              in one centralized platform.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-primary-900 to-secondary-900 rounded-3xl p-12 text-white shadow-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Platform Impact</h2>
            <p className="text-xl text-white/80">Transforming careers and connecting talent with opportunity</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-accent-400 mb-2">150+</div>
              <div className="text-white/80 font-medium">Graduates</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-success-400 mb-2">94%</div>
              <div className="text-white/80 font-medium">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-secondary-400 mb-2">12</div>
              <div className="text-white/80 font-medium">Active Cohorts</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-neutral-300 mb-2">85%</div>
              <div className="text-white/80 font-medium">Hired Within 3 Months</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10">
                <img 
                  src="/CAPACITI Logo 3.png" 
                  alt="CAPACITI Logo" 
                  className="w-full h-full object-contain filter brightness-0 invert"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">CAPACITI</h3>
                <p className="text-sm text-white/70">TALENT HUB</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-white/70 text-sm">
                © 2025 CAPACITI TALENT HUB. Connecting exceptional talent with opportunity.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};