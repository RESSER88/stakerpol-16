import { useMemo } from 'react';
import { usePublicSupabaseProducts } from '@/hooks/usePublicSupabaseProducts';
import { Product } from '@/types';

export const useProductBySlug = (slug: string | undefined) => {
  const { products, isLoading, error } = usePublicSupabaseProducts();

  const product = useMemo(() => {
    if (!products || !slug) return null;
    
    // First try to find by slug (if slug exists in product)
    let foundProduct = products.find((p: Product) => (p as any).slug === slug);
    
    // If not found by slug, try by ID (for backward compatibility)
    if (!foundProduct) {
      foundProduct = products.find((p: Product) => p.id === slug);
    }
    
    return foundProduct || null;
  }, [products, slug]);

  return {
    product,
    isLoading,
    error,
    isNotFound: !isLoading && !product
  };
};