
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { useEffect } from 'react';
import { 
  mapSupabaseProductToProduct,
  SupabaseProduct,
  SupabaseProductImage
} from '@/types/supabase';

export const usePublicSupabaseProducts = () => {
  // Fetch products with aggressive caching strategy for public pages
  const { data: products = [], isLoading, error, refetch } = useQuery({
    queryKey: ['public-products'],
    queryFn: async () => {
      console.log('Fetching products for public pages...');
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
      console.log(`Fetched ${mappedProducts.length} products for public pages in ${(endTime - startTime).toFixed(2)}ms`);
      
      return mappedProducts;
    },
    staleTime: 10 * 1000, // 10 seconds cache for faster sync with admin changes
    gcTime: 60 * 1000, // 1 minute in memory for better performance
    retry: 3,
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchInterval: 15 * 1000, // Auto-refetch every 15 seconds for real-time sync
  });

  // Enhanced realtime subscription for immediate sync with admin panel
  useEffect(() => {
    console.log('Setting up enhanced realtime subscriptions for public pages...');
    
    // Products subscription with immediate refetch
    const productsChannel = supabase
      .channel('public-products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('Public products realtime update detected:', payload);
          // Force immediate refetch for instant sync
          refetch();
        }
      )
      .subscribe();

    // Images subscription with immediate refetch
    const imagesChannel = supabase
      .channel('public-product-images-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'product_images'
        },
        (payload) => {
          console.log('Public product images realtime update detected:', payload);
          // Force immediate refetch for instant sync
          refetch();
        }
      )
      .subscribe();

    // Additional periodic sync to ensure data consistency
    const syncInterval = setInterval(() => {
      console.log('Performing periodic sync check...');
      refetch();
    }, 30 * 1000); // Every 30 seconds

    return () => {
      console.log('Cleaning up realtime subscriptions and sync interval...');
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(imagesChannel);
      clearInterval(syncInterval);
    };
  }, [refetch]);

  return {
    products,
    isLoading,
    error,
    refetch // Expose refetch for manual sync
  };
};
