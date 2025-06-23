import React, { useState } from 'react';
import { AdminApp } from './components/admin/AdminApp';
import { PublicApp } from './components/public/PublicApp';
import { LoginPage } from './components/auth/LoginPage';

type UserRole = 'admin' | 'public' | null;

function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUserRole(null);
    setIsAuthenticated(false);
  };

  const handlePublicAccess = () => {
    setUserRole('public');
    setIsAuthenticated(true);
  };

  // Show login page for admin access or landing page
  if (!isAuthenticated) {
    return (
      <LoginPage 
        onLogin={handleLogin}
        onPublicAccess={handlePublicAccess}
      />
    );
  }

  // Render appropriate app based on user role
  if (userRole === 'admin') {
    return <AdminApp onLogout={handleLogout} />;
  }

  if (userRole === 'public') {
    return <PublicApp onBackToHome={() => setIsAuthenticated(false)} />;
  }

  return null;
}

export default App;