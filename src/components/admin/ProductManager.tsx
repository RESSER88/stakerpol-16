
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Grid, Table as TableIcon, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProductList from './ProductList';
import ProductDetailsModal from './ProductDetailsModal';
import { Product } from '@/types';

interface ProductManagerProps {
  // State
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  productImages: string[];
  setProductImages: (images: string[]) => void;
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;
  products: Product[];
  defaultNewProduct: Product;
  
  // Actions
  handleEdit: (product: Product) => void;
  handleAdd: () => void;
  handleCopy: (product: Product) => void;
  handleDelete: (product: Product) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
}

const ProductManager = ({
  isEditDialogOpen,
  setIsEditDialogOpen,
  selectedProduct,
  productImages,
  setProductImages,
  viewMode,
  setViewMode,
  products,
  defaultNewProduct,
  handleEdit,
  handleAdd,
  handleCopy,
  handleDelete,
  addProduct,
  updateProduct
}: ProductManagerProps) => {
  const { toast } = useToast();

  const handleSave = (product: any, images: string[]) => {
    console.log('=== HANDLE SAVE ===');
    console.log('Selected product:', selectedProduct);
    console.log('Product to save:', product);
    console.log('Images:', images);
    
    const productToSave = {
      ...product,
      images: images,
      image: images[0] || '',
      updatedAt: new Date().toISOString()
    };
    
    try {
      // Sprawdzamy czy to edycja istniejącego produktu
      const isEditingExisting = selectedProduct && 
        selectedProduct.id && 
        products.some(p => p.id === selectedProduct.id);
      
      console.log('Is editing existing?', isEditingExisting);
      
      if (isEditingExisting) {
        // Edycja istniejącego produktu
        console.log('UPDATING existing product');
        updateProduct(productToSave);
        toast({
          title: "Aktualizowanie produktu...",
          description: `Zapisywanie zmian w produkcie ${productToSave.model}`,
          duration: 3000
        });
      } else {
        // Nowy produkt lub kopia
        console.log('ADDING new product');
        const newProduct = {
          ...productToSave,
          id: selectedProduct?.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString()
        };
        addProduct(newProduct);
        toast({
          title: "Dodawanie produktu...",
          description: `Zapisywanie nowego produktu ${newProduct.model}`,
          duration: 3000
        });
      }
      
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error in handleSave:', error);
      toast({
        title: "Błąd",
        description: "Wystąpił błąd podczas zapisywania produktu",
        variant: "destructive"
      });
    }
  };

  const handleRefresh = () => {
    // Force page reload to ensure fresh data
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stakerpol-navy">Zarządzanie Produktami</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Łącznie opublikowanych produktów: <span className="font-semibold text-stakerpol-orange">{products.length}</span>
          </p>
          <p className="text-xs text-blue-600 mt-1">
            ℹ️ Zmiany mogą być widoczne na stronie po maksymalnie 10 sekundach
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="h-8"
            title="Odśwież dane"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8"
            >
              <Grid className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Kafelki</span>
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="h-8"
            >
              <TableIcon className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Tabela</span>
            </Button>
          </div>
          <Button onClick={handleAdd} className="cta-button">
            <Plus className="mr-2 h-4 w-4" /> 
            <span className="hidden sm:inline">Dodaj Produkt</span>
            <span className="sm:hidden">Dodaj</span>
          </Button>
        </div>
      </div>

      <ProductList
        products={products}
        viewMode={viewMode}
        onEdit={handleEdit}
        onCopy={handleCopy}
        onDelete={handleDelete}
      />
      
      <ProductDetailsModal
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        selectedProduct={selectedProduct}
        defaultNewProduct={defaultNewProduct}
        productImages={productImages}
        onImagesChange={setProductImages}
        onSave={handleSave}
        products={products}
      />
    </div>
  );
};

export default ProductManager;
