
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';
import { useEffect } from 'react';
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

  // Pobieranie wszystkich produktów z realtime synchronizacją
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['supabase-products'],
    queryFn: async () => {
      console.log('Fetching products from Supabase...');
      const startTime = performance.now();
      
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Error fetching products:', productsError);
        throw productsError;
      }

      const { data: imagesData, error: imagesError } = await supabase
        .from('product_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (imagesError) {
        console.error('Error fetching images:', imagesError);
      }

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
    staleTime: 1000, // Zmniejszone cache dla natychmiastowych aktualizacji
    gcTime: 2 * 60 * 1000, // Skrócony czas w pamięci
  });

  // Realtime subscription dla synchronizacji danych
  useEffect(() => {
    console.log('Setting up realtime subscriptions...');
    
    // Subscription dla produktów
    const productsChannel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('Products realtime update:', payload);
          // Invalidate queries to force refresh
          queryClient.invalidateQueries({ queryKey: ['supabase-products'] });
        }
      )
      .subscribe();

    // Subscription dla zdjęć produktów
    const imagesChannel = supabase
      .channel('product-images-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'product_images'
        },
        (payload) => {
          console.log('Product images realtime update:', payload);
          queryClient.invalidateQueries({ queryKey: ['supabase-products'] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up realtime subscriptions...');
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(imagesChannel);
    };
  }, [queryClient]);

  // Dodawanie produktu z ulepszonym debugowaniem
  const addProductMutation = useMutation({
    mutationFn: async ({ product, images }: { product: any; images: string[] }) => {
      console.log('=== ADDING PRODUCT ===');
      console.log('Product data:', product);
      console.log('Images:', images);
      const startTime = performance.now();
      
      // Validate required fields
      if (!product.model || !product.specs.serialNumber) {
        throw new Error('Model i numer seryjny są wymagane');
      }
      
      const supabaseProduct = mapProductToSupabaseInsert(product);
      console.log('Mapped to Supabase format:', supabaseProduct);
      
      const { data: newProduct, error: productError } = await supabase
        .from('products')
        .insert([supabaseProduct])
        .select()
        .single();

      if (productError) {
        console.error('Error adding product:', productError);
        throw productError;
      }

      console.log('Product added successfully:', newProduct);

      // Dodaj zdjęcia jeśli są
      if (images.length > 0 && newProduct) {
        const imageInserts = images.map((imageUrl, index) => ({
          product_id: newProduct.id,
          image_url: imageUrl,
          display_order: index + 1,
          alt_text: `${product.model} - zdjęcie ${index + 1}`
        }));

        console.log('Adding images:', imageInserts);
        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(imageInserts);

        if (imagesError) {
          console.error('Error adding images:', imagesError);
        } else {
          console.log('Images added successfully');
        }
      }

      const endTime = performance.now();
      console.log(`=== PRODUCT ADDED in ${(endTime - startTime).toFixed(2)}ms ===`);
      
      return newProduct;
    },
    onSuccess: () => {
      // Force immediate refresh
      queryClient.invalidateQueries({ queryKey: ['supabase-products'] });
      toast({
        title: "Produkt dodany",
        description: "Produkt został pomyślnie dodany do bazy danych. Zmiany będą widoczne na stronie w ciągu kilku sekund.",
        duration: 5000
      });
    },
    onError: (error: any) => {
      console.error('Add product error:', error);
      toast({
        title: "Błąd",
        description: `Nie udało się dodać produktu: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Aktualizacja produktu z ulepszonym debugowaniem
  const updateProductMutation = useMutation({
    mutationFn: async ({ product, images }: { product: any; images: string[] }) => {
      console.log('=== UPDATING PRODUCT ===');
      console.log('Product ID:', product.id);
      console.log('Product data:', product);
      console.log('Images:', images);
      const startTime = performance.now();
      
      // Validate product ID exists
      if (!product.id) {
        throw new Error('ID produktu jest wymagane do aktualizacji');
      }
      
      const supabaseProduct = mapProductToSupabaseUpdate(product);
      console.log('Mapped for update:', supabaseProduct);
      
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

      console.log('Product updated successfully:', updatedProduct);

      // Update images - delete old and add new
      const { error: deleteImagesError } = await supabase
        .from('product_images')
        .delete()
        .eq('product_id', product.id);

      if (deleteImagesError) {
        console.error('Error deleting old images:', deleteImagesError);
      }

      if (images.length > 0) {
        const imageInserts = images.map((imageUrl, index) => ({
          product_id: product.id,
          image_url: imageUrl,
          display_order: index + 1,
          alt_text: `${product.model} - zdjęcie ${index + 1}`
        }));

        console.log('Updating images:', imageInserts);
        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(imageInserts);

        if (imagesError) {
          console.error('Error adding new images:', imagesError);
        } else {
          console.log('Images updated successfully');
        }
      }

      const endTime = performance.now();
      console.log(`=== PRODUCT UPDATED in ${(endTime - startTime).toFixed(2)}ms ===`);
      
      return updatedProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supabase-products'] });
      toast({
        title: "Produkt zaktualizowany",
        description: "Produkt został pomyślnie zaktualizowany. Zmiany będą widoczne na stronie w ciągu kilku sekund.",
        duration: 5000
      });
    },
    onError: (error: any) => {
      console.error('Update product error:', error);
      toast({
        title: "Błąd",
        description: `Nie udało się zaktualizować produktu: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Usuwanie produktu z ulepszonym debugowaniem
  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      console.log('=== DELETING PRODUCT ===');
      console.log('Product ID:', productId);
      const startTime = performance.now();
      
      if (!productId) {
        throw new Error('ID produktu jest wymagane do usunięcia');
      }
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        console.error('Error deleting product:', error);
        throw error;
      }

      const endTime = performance.now();
      console.log(`=== PRODUCT DELETED in ${(endTime - startTime).toFixed(2)}ms ===`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supabase-products'] });
      toast({
        title: "Produkt usunięty",
        description: "Produkt został pomyślnie usunięty z bazy danych. Zmiany będą widoczne na stronie w ciągu kilku sekund.",
        duration: 5000
      });
    },
    onError: (error: any) => {
      console.error('Delete product error:', error);
      toast({
        title: "Błąd",
        description: `Nie udało się usunąć produktu: ${error.message}`,
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
