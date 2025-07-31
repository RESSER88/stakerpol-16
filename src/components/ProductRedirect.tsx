
import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const ProductRedirect = () => {
  const { id } = useParams();
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product-redirect', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('products')
        .select('slug')
        .eq('id', id)
        .maybeSingle();
        
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  useEffect(() => {
    // Log redirect for analytics
    if (product?.slug) {
      console.log(`301 Redirect: /product/${id} -> /products/${product.slug}`);
    }
  }, [id, product]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    );
  }

  if (error || !product?.slug) {
    return <Navigate to="/products" replace />;
  }

  // 301 redirect to new slug-based URL
  return <Navigate to={`/products/${product.slug}`} replace />;
};

export default ProductRedirect;
