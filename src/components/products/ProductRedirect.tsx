import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { usePublicSupabaseProducts } from '@/hooks/usePublicSupabaseProducts';
import { generateSlugFromProduct } from '@/hooks/useProductBySlug';
import { Loader2 } from 'lucide-react';

const ProductRedirect = () => {
  const { id } = useParams<{ id: string }>();
  const { products, isLoading } = usePublicSupabaseProducts();
  
  const product = products.find((p) => p.id === id);

  useEffect(() => {
    // If we have a product and it has necessary data for slug, redirect
    if (product && product.specs?.serialNumber) {
      const slug = generateSlugFromProduct(product);
      if (slug) {
        // Perform 301 redirect to slug-based URL
        window.history.replaceState(null, '', `/products/${slug}`);
      }
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-stakerpol-orange mx-auto mb-4" />
          <p className="text-muted-foreground">Przekierowanie...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return <Navigate to="/products" replace />;
  }

  // If product doesn't have serial number, we can't create a proper slug
  // So we'll render the product detail normally but with UUID
  if (!product.specs?.serialNumber) {
    return <Navigate to={`/products/${id}`} replace />;
  }

  const slug = generateSlugFromProduct(product);
  
  if (slug) {
    return <Navigate to={`/products/${slug}`} replace />;
  }

  // Fallback to products page if slug generation fails
  return <Navigate to="/products" replace />;
};

export default ProductRedirect;