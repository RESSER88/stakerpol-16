
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { useEffect } from 'react';
import { 
  mapSupabaseProductToProduct,
  SupabaseProduct,
  SupabaseProductImage
} from '@/types/supabase';
import { useErrorHandler } from './useErrorHandler';

export const usePublicSupabaseProducts = () => {
  const { handleError } = useErrorHandler();
  
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

  // Enhanced realtime subscription with retry logic
  useEffect(() => {
    console.log('Setting up realtime subscriptions for public pages...');
    
    let retryCount = 0;
    const maxRetries = 3;
    
    const setupSubscriptions = () => {
      // Products subscription with immediate refetch and debouncing
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
            // Debounce refetch to avoid multiple rapid calls
            setTimeout(() => refetch(), 500);
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('✅ Products realtime subscription active');
            retryCount = 0;
          } else if (status === 'CHANNEL_ERROR') {
            console.error('❌ Products realtime subscription error');
            if (retryCount < maxRetries) {
              retryCount++;
              console.log(`Retrying subscription... (${retryCount}/${maxRetries})`);
              setTimeout(setupSubscriptions, 2000 * retryCount);
            } else {
              handleError(new Error('Products realtime subscription failed'), {
                context: 'Realtime - public products',
                silent: true
              });
            }
          }
        });

      // Images subscription with immediate refetch and debouncing
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
            setTimeout(() => refetch(), 500);
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('✅ Images realtime subscription active');
          } else if (status === 'CHANNEL_ERROR') {
            console.error('❌ Images realtime subscription error');
            handleError(new Error('Images realtime subscription failed'), {
              context: 'Realtime - public images',
              silent: true
            });
          }
        });

      return [productsChannel, imagesChannel];
    };

    const [productsChannel, imagesChannel] = setupSubscriptions();

    return () => {
      console.log('Cleaning up realtime subscriptions...');
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(imagesChannel);
    };
  }, [refetch, handleError]);

  return {
    products,
    isLoading,
    error,
    refetch
  };
};
