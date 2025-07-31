import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePublicSupabaseProducts } from '@/hooks/usePublicSupabaseProducts';

// Component for handling 301 redirects from UUID URLs to slug URLs
const ProductRedirect = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, isLoading } = usePublicSupabaseProducts();

  useEffect(() => {
    if (!isLoading && products && id) {
      const product = products.find(p => p.id === id);
      
      if (product && (product as any).slug) {
        // 301 redirect to slug URL
        navigate(`/products/${(product as any).slug}`, { replace: true });
      } else if (product) {
        // Product exists but no slug, redirect to old route
        navigate(`/products/${product.id}`, { replace: true });
      } else {
        // Product not found, redirect to products page
        navigate('/products', { replace: true });
      }
    }
  }, [products, isLoading, id, navigate]);

  // Show loading while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Przekierowywanie...</p>
      </div>
    </div>
  );
};

export default ProductRedirect;