import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mapSupabaseProductToProduct } from '@/types/supabase';
import type { Product } from '@/types';

export const useProductByUuid = (uuid: string | undefined) => {
  return useQuery({
    queryKey: ['product-by-uuid', uuid],
    queryFn: async (): Promise<Product | null> => {
      if (!uuid) return null;

      console.log('Fetching product by UUID:', uuid);

      // Fetch by UUID (id field)
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', uuid)
        .maybeSingle();

      if (productError) {
        console.error('Error fetching product by UUID:', productError);
        throw new Error(`Failed to fetch product: ${productError.message}`);
      }

      if (!productData) {
        console.log('Product not found by UUID:', uuid);
        return null;
      }

      // Fetch associated images
      const { data: imagesData, error: imagesError } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productData.id)
        .order('display_order', { ascending: true });

      if (imagesError) {
        console.error('Error fetching product images:', imagesError);
        // Continue without images rather than failing completely
      }

      const mappedProduct = mapSupabaseProductToProduct(productData, imagesData || []);
      console.log('Successfully mapped product:', mappedProduct.model);
      
      return mappedProduct;
    },
    enabled: !!uuid,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry for 404-like errors (product not found)
      if (error?.message?.includes('not found')) {
        return false;
      }
      return failureCount < 2;
    },
  });
};