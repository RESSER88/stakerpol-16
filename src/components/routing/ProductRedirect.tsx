import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductByUuid } from '@/hooks/useProductByUuid';

// Component that handles redirects from UUID URLs to slug URLs
const ProductRedirect = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useProductByUuid(id);

  useEffect(() => {
    if (!isLoading && product?.slug) {
      // Redirect to slug URL with 301 status (for SEO)
      console.log(`Redirecting from UUID ${id} to slug ${product.slug}`);
      navigate(`/products/${product.slug}`, { replace: true });
    } else if (!isLoading && error) {
      // Product not found, redirect to 404
      console.log(`Product ${id} not found, redirecting to 404`);
      navigate('/404', { replace: true });
    }
  }, [product, isLoading, error, id, navigate]);

  // Show loading state during redirect
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // This should not render as we redirect immediately
  return null;
};

export default ProductRedirect;