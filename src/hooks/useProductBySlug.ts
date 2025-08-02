import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mapSupabaseProductToProduct } from '@/types/supabase';
import type { Product } from '@/types';
import type { Database } from '@/integrations/supabase/types';

export const useProductBySlug = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['product-by-slug', slug],
    queryFn: async (): Promise<Product | null> => {
      if (!slug) return null;

      console.log('Fetching product by slug:', slug);

      // For now, fetch by name since slug field needs migration
      // This is a temporary solution until database migration is complete
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${slug.replace(/-/g, '%')}%`)
        .maybeSingle();

      if (productError) {
        console.error('Error fetching product by slug:', productError);
        throw new Error(`Failed to fetch product: ${productError.message}`);
      }

      if (!productData) {
        console.log('Product not found by slug:', slug);
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
    enabled: !!slug,
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