import { useParams } from 'react-router-dom';
import { useProductBySlug } from '@/hooks/useProductBySlug';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import Layout from '@/components/layout/Layout';
import ProductImage from '@/components/products/ProductImage';
import ProductHeader from '@/components/products/ProductHeader';
import ProductInfo from '@/components/products/ProductInfo';
import RelatedProducts from '@/components/products/RelatedProducts';
import CallToAction from '@/components/ui/CallToAction';
import ProductFAQ from '@/components/ui/ProductFAQ';
import AIOptimizedMetaTags from '@/components/seo/AIOptimizedMetaTags';
import ProductSchema from '@/components/seo/ProductSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import ImageObjectSchema from '@/components/seo/ImageObjectSchema';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/utils/translations';

const ProductDetailSlug = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const t = useTranslation(language);
  const { data: product, isLoading, error } = useProductBySlug(slug);
  
  useScrollToTop();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4 text-destructive">
            Produkt nie znaleziony
          </h1>
          <p className="text-muted-foreground mb-8">
            Poszukiwany produkt nie istnieje lub został usunięty.
          </p>
          <a 
            href="/products" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Powrót do produktów
          </a>
        </div>
      </Layout>
    );
  }

  // SEO data generation
  const breadcrumbItems = [
    { name: "Strona główna", url: '/' },
    { name: "Produkty", url: '/products' },
    { name: product.model, url: `/products/${slug}` }
  ];

  const getMetaTitle = () => {
    const year = product.specs.productionYear;
    const capacity = product.specs.mastLiftingCapacity;
    return `${product.model} ${year} - Wózek widłowy ${capacity} | Stakerpol`;
  };

  const getMetaDescription = () => {
    const specs = product.specs;
    return `${product.model} z ${specs.productionYear}r. Udźwig ${specs.mastLiftingCapacity}, wysokość ${specs.liftHeight}. ${specs.workingHours} mh. Stan: ${specs.condition}. Sprawdź ofertę Stakerpol!`;
  };

  const getOgImage = () => {
    return product.image || (product.images && product.images[0]) || '/placeholder.svg';
  };

  return (
    <Layout>
      <AIOptimizedMetaTags
        title={getMetaTitle()}
        description={getMetaDescription()}
        keywords={[
          product.model.toLowerCase(),
          'wózek widłowy',
          'toyota używany',
          product.specs.productionYear,
          'paletyzator elektryczny',
          'stakerpol'
        ]}
      />
      
      <ProductSchema product={product} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <ImageObjectSchema product={product} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ProductImage 
            image={product.image}
            alt={product.model}
            images={product.images}
          />
          
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">{product.model}</h1>
              <p className="text-muted-foreground">{product.shortDescription}</p>
            </div>
            <ProductInfo product={product} language={language} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProductFAQ product={product} />
          </div>
          
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Zainteresowany?</h3>
              <p className="text-muted-foreground mb-4">Skontaktuj się z nami po więcej informacji</p>
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
              >
                Napisz do nas
              </a>
            </div>
          </div>
        </div>

        <RelatedProducts currentProductId={product.id} products={[]} />
      </div>
    </Layout>
  );
};

export default ProductDetailSlug;