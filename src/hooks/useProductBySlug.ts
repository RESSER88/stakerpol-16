
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mapSupabaseProductToProduct, SupabaseProduct, SupabaseProductImage } from '@/types/supabase';

export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      console.log('Fetching product by slug:', slug);
      
      // Try to fetch by slug first
      let { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      // If not found by slug, try by ID (for backward compatibility)
      if (!productData && !productError) {
        console.log('Product not found by slug, trying by ID for backward compatibility');
        ({ data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', slug)
          .maybeSingle());
      }

      if (productError) {
        console.error('Error fetching product:', productError);
        throw productError;
      }

      if (!productData) {
        throw new Error('Product not found');
      }

      // Fetch product images
      const { data: imagesData, error: imagesError } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productData.id)
        .order('display_order', { ascending: true });

      if (imagesError) {
        console.error('Error fetching images:', imagesError);
      }

      const product = mapSupabaseProductToProduct(productData as SupabaseProduct, imagesData as SupabaseProductImage[] || []);
      
      console.log('Successfully fetched product:', product);
      return product;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });
};
