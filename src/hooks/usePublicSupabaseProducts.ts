
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
  // Fetch products with optimized caching strategy for public pages
  const { data: products = [], isLoading, error, refetch } = useQuery({
    queryKey: ['public-products'],
    queryFn: async () => {
      console.log('Fetching products for public pages...');
      const startTime = performance.now();
      
      // Fetch products - accessible to all users thanks to "Anyone can view products" RLS policy
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Error fetching products:', productsError);
        throw productsError;
      }

      // Fetch product images - accessible to all users thanks to "Anyone can view product images" RLS policy
      const { data: imagesData, error: imagesError } = await supabase
        .from('product_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (imagesError) {
        console.error('Error fetching images:', imagesError);
        // Don't throw here, images are optional
      }

      const mappedProducts = (productsData || []).map((product: SupabaseProduct) => {
        const productImages = (imagesData || []).filter(
          (img: SupabaseProductImage) => img.product_id === product.id
        );
        return mapSupabaseProductToProduct(product, productImages);
      });

      const endTime = performance.now();
      console.log(`✅ Successfully fetched ${mappedProducts.length} products for public pages in ${(endTime - startTime).toFixed(2)}ms`);
      
      return mappedProducts;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 10 * 60 * 1000, // 10 minutes in memory
    retry: 3,
    refetchOnWindowFocus: true,
    refetchInterval: 30 * 1000, // Auto-refetch every 30 seconds for real-time sync
  });

  // Enhanced realtime subscription for immediate sync with admin panel
  useEffect(() => {
    console.log('Setting up realtime subscriptions for public pages...');
    
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
          refetch();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up realtime subscriptions...');
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(imagesChannel);
    };
  }, [refetch]);

  return {
    products,
    isLoading,
    error,
    refetch
  };
};
