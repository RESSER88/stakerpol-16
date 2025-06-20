
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import AdminLogin from '@/components/admin/AdminLogin';
import ProductManagerWithSupabase from '@/components/admin/ProductManagerWithSupabase';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin-authenticated') === 'true';
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('admin-authenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin-authenticated');
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <AdminLogin onLogin={handleLogin} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-custom py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-stakerpol-navy">Panel Administracyjny</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-muted-foreground hover:text-stakerpol-orange transition-colors"
          >
            Wyloguj
          </button>
        </div>
        
        <ProductManagerWithSupabase />
      </div>
    </Layout>
  );
};

export default Admin;
