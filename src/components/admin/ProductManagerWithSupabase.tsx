
import { useProductStoreConfig } from '@/stores/productStoreWithSupabase';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';
import { useProductManager } from '@/hooks/useProductManager';
import ProductManager from './ProductManager';
import SupabaseToggle from './SupabaseToggle';

const ProductManagerWithSupabase = () => {
  const { useSupabase } = useProductStoreConfig();
  const supabaseHook = useSupabaseProducts();
  const localHook = useProductManager();

  // Wybierz odpowiedni hook w zależności od konfiguracji
  const currentHook = useSupabase ? {
    ...localHook,
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
  } : localHook;

  return (
    <div>
      <SupabaseToggle />
      <ProductManager {...currentHook} />
      
      {useSupabase && supabaseHook.isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stakerpol-orange mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Ładowanie produktów z bazy danych...</p>
        </div>
      )}
    </div>
  );
};

export default ProductManagerWithSupabase;
