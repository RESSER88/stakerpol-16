import { usePublicSupabaseProducts } from './usePublicSupabaseProducts';
import { Product } from '@/types';

export const useProductBySlug = (slug: string | undefined) => {
  const { products, isLoading, error, refetch } = usePublicSupabaseProducts();
  
  const product = products.find((p) => {
    // Try to match by slug if it exists
    if (p.specs?.serialNumber) {
      const expectedSlug = generateSlugFromProduct(p);
      return expectedSlug === slug;
    }
    return false;
  });

  return {
    product,
    isLoading,
    error,
    refetch,
    allProducts: products
  };
};

// Helper function to generate slug from product data
export const generateSlugFromProduct = (product: Product): string => {
  if (!product.model) return '';
  
  let baseSlug = product.model.toLowerCase();
  baseSlug = baseSlug.replace(/[^a-z0-9\s-]/g, '');
  baseSlug = baseSlug.replace(/\s+/g, '-');
  baseSlug = baseSlug.replace(/-+/g, '-');
  baseSlug = baseSlug.trim().replace(/^-+|-+$/g, '');
  
  // Add serial number if available
  if (product.specs?.serialNumber) {
    const serialSlug = product.specs.serialNumber.replace(/[^a-z0-9]/gi, '').toLowerCase();
    if (serialSlug) {
      baseSlug = `${baseSlug}-${serialSlug}`;
    }
  }
  
  return baseSlug;
};