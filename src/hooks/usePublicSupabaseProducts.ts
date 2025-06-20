
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
  // Fetch products with optimized caching for public pages
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
    staleTime: 30 * 1000, // 30 seconds cache for public pages
    gcTime: 5 * 60 * 1000, // 5 minutes in memory
    retry: 2,
  });

  // Realtime subscription for automatic updates
  useEffect(() => {
    console.log('Setting up realtime subscriptions for public pages...');
    
    // Products subscription
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
          console.log('Public products realtime update:', payload);
          refetch();
        }
      )
      .subscribe();

    // Images subscription
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
          console.log('Public product images realtime update:', payload);
          refetch();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up realtime subscriptions for public pages...');
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(imagesChannel);
    };
  }, [refetch]);

  return {
    products,
    isLoading,
    error
  };
};
