
import Layout from '@/components/layout/Layout';
import AdminLogin from '@/components/admin/AdminLogin';
import ProductManager from '@/components/admin/ProductManager';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2, Wifi, WifiOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { user, loading, isAdmin, signOut } = useSupabaseAuth();
  const supabaseHook = useSupabaseProducts();
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'syncing'>('connected');

  // State management for ProductManager
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Monitor connection status
  useEffect(() => {
    if (supabaseHook.isAddingProduct || supabaseHook.isUpdatingProduct || supabaseHook.isDeletingProduct) {
      setConnectionStatus('syncing');
    } else if (supabaseHook.error) {
      setConnectionStatus('disconnected');
    } else {
      setConnectionStatus('connected');
    }
  }, [supabaseHook.isAddingProduct, supabaseHook.isUpdatingProduct, supabaseHook.isDeletingProduct, supabaseHook.error]);

  const defaultNewProduct: Product = {
    id: '',
    model: '',
    image: '',
    images: [],
    shortDescription: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    specs: {
      productionYear: '',
      mastLiftingCapacity: '',
      preliminaryLiftingCapacity: '',
      workingHours: '',
      liftHeight: '',
      minHeight: '',
      preliminaryLifting: '',
      battery: '',
      condition: '',
      serialNumber: '',
      driveType: '',
      mast: '',
      freeStroke: '',
      dimensions: '',
      wheels: '',
      operatorPlatform: '',
      additionalOptions: '',
      additionalDescription: '',
      capacity: '',
      charger: ''
    }
  };

  const handleEdit = (product: Product) => {
    console.log('Editing product:', product);
    setSelectedProduct(product);
    setProductImages(product.images || [product.image].filter(Boolean));
    setIsEditDialogOpen(true);
  };
  
  const handleAdd = () => {
    console.log('Adding new product');
    setSelectedProduct(null);
    setProductImages([]);
    setIsEditDialogOpen(true);
  };

  const handleCopy = (product: Product) => {
    const timestamp = new Date().toISOString();
    const uniqueId = `copy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const copiedProduct = {
      ...product,
      id: uniqueId,
      model: `${product.model} (kopia)`,
      specs: {
        ...product.specs,
        serialNumber: product.specs.serialNumber ? `${product.specs.serialNumber}-COPY` : `COPY-${Date.now()}`
      },
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    console.log('Copying product:', copiedProduct);
    setSelectedProduct(copiedProduct);
    setProductImages(product.images || [product.image].filter(Boolean));
    setIsEditDialogOpen(true);
  };

  const handleDelete = (product: Product) => {
    if (confirm(`Czy na pewno chcesz usunąć produkt ${product.model} z bazy danych? Ta operacja jest nieodwracalna.`)) {
      console.log('Deleting product:', product.id);
      supabaseHook.deleteProduct(product.id);
      toast({
        title: "Usuwanie produktu...",
        description: `Produkt ${product.model} zostanie usunięty z bazy danych w ciągu kilku sekund.`,
        duration: 4000
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stakerpol-orange mx-auto mb-4"></div>
            <p className="text-muted-foreground">Ładowanie panelu administracyjnego...</p>
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
    try {
      await signOut();
      toast({
        title: "Wylogowano",
        description: "Zostałeś pomyślnie wylogowany z panelu administracyjnego",
        duration: 3000
      });
    } catch (error) {
      toast({
        title: "Błąd wylogowania",
        description: "Wystąpił problem podczas wylogowywania",
        variant: "destructive"
      });
    }
  };

  // Props for ProductManager
  const productManagerProps = {
    // State
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedProduct,
    productImages,
    setProductImages,
    viewMode,
    setViewMode,
    products: supabaseHook.products,
    defaultNewProduct,
    
    // Actions
    handleEdit,
    handleAdd,
    handleCopy,
    handleDelete,
    addProduct: (product: any) => {
      const images = product.images || [];
      supabaseHook.addProduct(product, images);
    },
    updateProduct: (product: any) => {
      const images = product.images || [];
      supabaseHook.updateProduct(product, images);
    }
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'syncing':
        return <Loader2 className="h-3 w-3 animate-spin text-blue-600" />;
      case 'disconnected':
        return <WifiOff className="h-3 w-3 text-red-600" />;
      default:
        return <Wifi className="h-3 w-3 text-green-600" />;
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case 'syncing':
        return 'Synchronizacja w toku...';
      case 'disconnected':
        return 'Brak połączenia z bazą danych';
      default:
        return `Połączono z bazą danych (${supabaseHook.products.length} produktów)`;
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
            <div className="flex items-center gap-2 mt-2">
              {getConnectionIcon()}
              <p className="text-xs" style={{ color: connectionStatus === 'disconnected' ? '#dc2626' : connectionStatus === 'syncing' ? '#2563eb' : '#16a34a' }}>
                {getConnectionText()}
              </p>
            </div>
            {connectionStatus === 'connected' && (
              <p className="text-xs text-blue-600 mt-1">
                ⚡ Zmiany będą widoczne na stronie publicznej w czasie rzeczywistym
              </p>
            )}
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
        
        {(supabaseHook.isAddingProduct || supabaseHook.isUpdatingProduct || supabaseHook.isDeletingProduct) && (
          <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-blue-200">
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin text-stakerpol-orange" />
              <span>
                {supabaseHook.isAddingProduct && 'Dodawanie produktu do bazy danych...'}
                {supabaseHook.isUpdatingProduct && 'Aktualizowanie produktu w bazie danych...'}
                {supabaseHook.isDeletingProduct && 'Usuwanie produktu z bazy danych...'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Zmiany będą widoczne na stronie w ciągu kilku sekund
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Admin;
