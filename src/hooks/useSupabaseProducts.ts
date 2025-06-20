
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';
import { 
  mapSupabaseProductToProduct,
  mapProductToSupabaseInsert,
  mapProductToSupabaseUpdate,
  SupabaseProduct,
  SupabaseProductImage
} from '@/types/supabase';

export const useSupabaseProducts = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Pobieranie wszystkich produktów z optymalizacją
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['supabase-products'],
    queryFn: async () => {
      console.log('Fetching products from Supabase...');
      const startTime = performance.now();
      
      // Pobieranie produktów z paginacją dla lepszej wydajności
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100); // Limit dla wydajności

      if (productsError) {
        console.error('Error fetching products:', productsError);
        throw productsError;
      }

      // Pobieranie zdjęć dla produktów
      const { data: imagesData, error: imagesError } = await supabase
        .from('product_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (imagesError) {
        console.error('Error fetching images:', imagesError);
        // Nie blokujemy, jeśli zdjęcia się nie pobiorą
      }

      // Mapowanie produktów z zdjęciami
      const mappedProducts = (productsData || []).map((product: SupabaseProduct) => {
        const productImages = (imagesData || []).filter(
          (img: SupabaseProductImage) => img.product_id === product.id
        );
        return mapSupabaseProductToProduct(product, productImages);
      });

      const endTime = performance.now();
      console.log(`Fetched ${mappedProducts.length} products in ${(endTime - startTime).toFixed(2)}ms`);
      
      return mappedProducts;
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minut cache
    gcTime: 10 * 60 * 1000, // 10 minut w pamięci
  });

  // Dodawanie produktu z optymalizacją
  const addProductMutation = useMutation({
    mutationFn: async ({ product, images }: { product: any; images: string[] }) => {
      console.log('Adding product to Supabase:', product.model);
      const startTime = performance.now();
      
      // Dodaj produkt
      const supabaseProduct = mapProductToSupabaseInsert(product);
      const { data: newProduct, error: productError } = await supabase
        .from('products')
        .insert([supabaseProduct])
        .select()
        .single();

      if (productError) {
        console.error('Error adding product:', productError);
        throw productError;
      }

      // Dodaj zdjęcia jeśli są
      if (images.length > 0 && newProduct) {
        const imageInserts = images.map((imageUrl, index) => ({
          product_id: newProduct.id,
          image_url: imageUrl,
          display_order: index + 1,
          alt_text: `${product.model} - zdjęcie ${index + 1}`
        }));

        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(imageInserts);

        if (imagesError) {
          console.error('Error adding images:', imagesError);
        }
      }

      const endTime = performance.now();
      console.log(`Added product in ${(endTime - startTime).toFixed(2)}ms`);
      
      return newProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supabase-products'] });
      toast({
        title: "Produkt dodany",
        description: "Produkt został pomyślnie dodany do bazy danych"
      });
    },
    onError: (error) => {
      console.error('Add product error:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się dodać produktu do bazy danych",
        variant: "destructive"
      });
    }
  });

  // Aktualizacja produktu z optymalizacją
  const updateProductMutation = useMutation({
    mutationFn: async ({ product, images }: { product: any; images: string[] }) => {
      console.log('Updating product in Supabase:', product.model);
      const startTime = performance.now();
      
      // Aktualizuj produkt
      const supabaseProduct = mapProductToSupabaseUpdate(product);
      const { data: updatedProduct, error: productError } = await supabase
        .from('products')
        .update(supabaseProduct)
        .eq('id', product.id)
        .select()
        .single();

      if (productError) {
        console.error('Error updating product:', productError);
        throw productError;
      }

      // Aktualizuj zdjęcia - usuń stare i dodaj nowe
      const { error: deleteImagesError } = await supabase
        .from('product_images')
        .delete()
        .eq('product_id', product.id);

      if (deleteImagesError) {
        console.error('Error deleting old images:', deleteImagesError);
      }

      // Dodaj nowe zdjęcia
      if (images.length > 0) {
        const imageInserts = images.map((imageUrl, index) => ({
          product_id: product.id,
          image_url: imageUrl,
          display_order: index + 1,
          alt_text: `${product.model} - zdjęcie ${index + 1}`
        }));

        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(imageInserts);

        if (imagesError) {
          console.error('Error adding new images:', imagesError);
        }
      }

      const endTime = performance.now();
      console.log(`Updated product in ${(endTime - startTime).toFixed(2)}ms`);
      
      return updatedProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supabase-products'] });
      toast({
        title: "Produkt zaktualizowany",
        description: "Produkt został pomyślnie zaktualizowany w bazie danych"
      });
    },
    onError: (error) => {
      console.error('Update product error:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się zaktualizować produktu w bazie danych",
        variant: "destructive"
      });
    }
  });

  // Usuwanie produktu z optymalizacją
  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      console.log('Deleting product from Supabase:', productId);
      const startTime = performance.now();
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        console.error('Error deleting product:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log(`Deleted product in ${(endTime - startTime).toFixed(2)}ms`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supabase-products'] });
      toast({
        title: "Produkt usunięty",
        description: "Produkt został pomyślnie usunięty z bazy danych"
      });
    },
    onError: (error) => {
      console.error('Delete product error:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się usunąć produktu z bazy danych",
        variant: "destructive"
      });
    }
  });

  return {
    products,
    isLoading,
    error,
    addProduct: (product: any, images: string[] = []) => 
      addProductMutation.mutate({ product, images }),
    updateProduct: (product: any, images: string[] = []) => 
      updateProductMutation.mutate({ product, images }),
    deleteProduct: (productId: string) => 
      deleteProductMutation.mutate(productId),
    isAddingProduct: addProductMutation.isPending,
    isUpdatingProduct: updateProductMutation.isPending,
    isDeletingProduct: deleteProductMutation.isPending
  };
};
