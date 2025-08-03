import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

// UUID pattern regex
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const useSEORedirects = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleUUIDToSlugRedirect = async () => {
      const path = location.pathname;
      
      // Check if we're on a product detail page with UUID
      const productUUIDMatch = path.match(/^\/products\/([a-f0-9-]+)$/);
      
      if (productUUIDMatch) {
        const productId = productUUIDMatch[1];
        
        // Verify it's a UUID
        if (UUID_PATTERN.test(productId)) {
          console.log('UUID detected in URL, attempting redirect to slug:', productId);
          
          try {
            // Fetch product to get slug (fallback if slug field doesn't exist yet)
            const { data: product, error } = await supabase
              .from('products')
              .select('name')
              .eq('id', productId)
              .maybeSingle();

            if (error) {
              console.error('Error fetching product for redirect:', error);
              return;
            }

            if (product && product.name) {
              // Generate slug from name as fallback
              const generatedSlug = product.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
              
              console.log(`Redirecting from UUID ${productId} to generated slug ${generatedSlug}`);
              navigate(`/products/${generatedSlug}`, { replace: true });
              
              // Track the redirect for monitoring
              console.log('301 Redirect executed:', {
                from: `/products/${productId}`,
                to: `/products/${generatedSlug}`,
                timestamp: new Date().toISOString()
              });
            } else {
              console.warn('Product not found for redirect:', productId);
            }
          } catch (error) {
            console.error('Redirect error:', error);
          }
        }
      }
    };

    handleUUIDToSlugRedirect();
  }, [location.pathname, navigate]);

  const generateRedirectMap = async () => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('id, name');

      if (error) throw error;

      const redirectMap = products.reduce((map, product) => {
        // Generate slug from name as fallback
        const generatedSlug = product.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        
        map[`/products/${product.id}`] = `/products/${generatedSlug}`;
        return map;
      }, {} as Record<string, string>);

      console.log('Generated redirect map:', redirectMap);
      return redirectMap;
    } catch (error) {
      console.error('Error generating redirect map:', error);
      return {};
    }
  };

  return {
    generateRedirectMap
  };
};