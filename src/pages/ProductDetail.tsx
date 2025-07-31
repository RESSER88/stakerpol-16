
import { useParams, Link } from 'react-router-dom';
import { useProductBySlug } from '@/hooks/useProductBySlug';
import { usePublicSupabaseProducts } from '@/hooks/usePublicSupabaseProducts';
import Layout from '@/components/layout/Layout';
import ProductHeader from '@/components/products/ProductHeader';
import ProductImage from '@/components/products/ProductImage';
import ProductInfo from '@/components/products/ProductInfo';
import ModernSpecificationsTable from '@/components/products/ModernSpecificationsTable';
import RelatedProducts from '@/components/products/RelatedProducts';
import ProductSchema from '@/components/seo/ProductSchema';
import ProductReviewsSchema from '@/components/seo/ProductReviewsSchema';
import FAQStructuredData from '@/components/seo/FAQStructuredData';
import ImageObjectSchema from '@/components/seo/ImageObjectSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/utils/translations';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePageOptimization } from '@/hooks/usePageOptimization';
import { Helmet } from 'react-helmet-async';

const ProductDetail = () => {
  const { slug } = useParams();
  const { language } = useLanguage();
  const t = useTranslation(language);
  
  const { data: product, isLoading, error } = useProductBySlug(slug || '');
  const { products: allProducts } = usePublicSupabaseProducts();
  
  // Performance optimization
  usePageOptimization({
    preloadImages: product?.images?.slice(0, 2),
    prefetchRoutes: ['/products', '/contact']
  });

  const breadcrumbItems = [
    { name: 'Strona główna', url: 'https://stakerpol.pl/' },
    { name: 'Produkty', url: 'https://stakerpol.pl/products' },
    { name: product?.model || 'Produkt', url: `https://stakerpol.pl/products/${slug}` }
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-stakerpol-orange" />
            <p className="text-muted-foreground">Ładowanie produktu...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center space-y-4">
              <h2 className="text-2xl font-bold text-red-600">Nie znaleziono produktu</h2>
              <p className="text-muted-foreground">
                Przepraszamy, ale produkt o podanym identyfikatorze nie istnieje.
              </p>
              <Button asChild>
                <Link to="/products">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Powrót do produktów
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const relatedProducts = allProducts
    .filter(p => p.id !== product.id)
    .slice(0, 3);

  const pageTitle = `${product.model} - Wózek Widłowy Toyota BT | Stakerpol`;
  const pageDescription = product.shortDescription || 
    `Profesjonalny wózek widłowy ${product.model} Toyota BT. Udźwig ${product.specs.mastLiftingCapacity} kg, wysokość podnoszenia ${product.specs.liftHeight} mm. Stan: ${product.specs.condition}. Sprawdź specyfikację!`;

  return (
    <Layout>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`${product.model}, wózek widłowy, Toyota BT, ${product.specs.mastLiftingCapacity} kg, używany wózek widłowy, Stakerpol`} />
        <link rel="canonical" href={`https://stakerpol.pl/products/${slug}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={product.image} />
        <meta property="og:url" content={`https://stakerpol.pl/products/${slug}`} />
        <meta property="og:type" content="product" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={product.image} />
        
        {/* AI Search Optimization */}
        <meta name="ai-search-keywords" content={`wózek widłowy ${product.model}, Toyota BT paletyzator, używany wózek elektryczny ${product.specs.mastLiftingCapacity} kg`} />
        <meta name="voice-search-queries" content={`ile kosztuje ${product.model}, jaki udźwig ma ${product.model}, gdzie kupić ${product.model}`} />
      </Helmet>
      
      {/* Structured Data */}
      <ProductSchema product={product} />
      <ProductReviewsSchema product={product} />
      <FAQStructuredData product={product} />
      <ImageObjectSchema product={product} />
      <BreadcrumbSchema items={breadcrumbItems} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs Navigation */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link to="/" className="text-stakerpol-orange hover:underline">Strona główna</Link></li>
            <li className="text-muted-foreground">/</li>
            <li><Link to="/products" className="text-stakerpol-orange hover:underline">Produkty</Link></li>
            <li className="text-muted-foreground">/</li>
            <li className="text-muted-foreground">{product.model}</li>
          </ol>
        </nav>

        {/* Back to Products Button */}
        <div className="mb-6">
          <Button variant="outline" asChild className="group">
            <Link to="/products">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              {t('backToProducts') || 'Powrót do produktów'}
            </Link>
          </Button>
        </div>

        {/* Product Header */}
        <ProductHeader product={product} />

        {/* Product Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="space-y-4">
            <ProductImage 
              image={product.image}
              alt={product.model}
              images={product.images}
            />
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <ProductInfo product={product} language={language} />
          </div>
        </div>

        {/* Specifications Table */}
        <div className="mb-12">
          <ModernSpecificationsTable product={product} language={language} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
