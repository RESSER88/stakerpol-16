
import Layout from '@/components/layout/Layout';
import AdminLogin from '@/components/admin/AdminLogin';
import ProductManager from '@/components/admin/ProductManager';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const Admin = () => {
  const { user, loading, isAdmin, signOut } = useSupabaseAuth();
  const supabaseHook = useSupabaseProducts();

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stakerpol-orange mx-auto mb-4"></div>
            <p className="text-muted-foreground">Ładowanie...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <AdminLogin />
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-stakerpol-navy mb-4">Brak uprawnień</h1>
            <p className="text-muted-foreground mb-4">
              Nie masz uprawnień administratora do dostępu do tego panelu.
            </p>
            <Button onClick={signOut} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Wyloguj się
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleLogout = async () => {
    await signOut();
  };

  // Adapter dla ProductManager - mapowanie funkcji Supabase na oczekiwany interfejs
  const productManagerProps = {
    products: supabaseHook.products,
    addProduct: (product: any) => {
      const images = product.images || [];
      supabaseHook.addProduct(product, images);
    },
    updateProduct: (product: any) => {
      const images = product.images || [];
      supabaseHook.updateProduct(product, images);
    },
    handleDelete: (product: any) => {
      if (confirm(`Czy na pewno chcesz usunąć produkt ${product.model} z bazy danych?`)) {
        supabaseHook.deleteProduct(product.id);
      }
    }
  };

  return (
    <Layout>
      <div className="container-custom py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stakerpol-navy">Panel Administracyjny</h1>
            <p className="text-sm text-muted-foreground">
              Zalogowany jako: <span className="font-semibold">{user.email}</span>
            </p>
            <p className="text-xs text-green-600 mt-1">
              ✓ Połączono z bazą danych Supabase ({supabaseHook.products.length} produktów)
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-sm"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Wyloguj
          </Button>
        </div>
        
        <ProductManager {...productManagerProps} />
        
        {supabaseHook.isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stakerpol-orange mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Ładowanie produktów z bazy danych...</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Admin;
