
import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/utils/translations';
import { usePublicSupabaseProducts } from '@/hooks/usePublicSupabaseProducts';
import CallToAction from '@/components/ui/CallToAction';
import ProductImage from '@/components/products/ProductImage';
import ProductInfo from '@/components/products/ProductInfo';
import ProductHeader from '@/components/products/ProductHeader';
import RelatedProducts from '@/components/products/RelatedProducts';
import ProductSchema from '@/components/seo/ProductSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { Loader2 } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const t = useTranslation(language);
  const { products, isLoading } = usePublicSupabaseProducts();
  
  const product = products.find((p) => p.id === id);
  
  useEffect(() => {
    // Scroll to top when component mounts or when ID changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container-custom py-12">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-stakerpol-orange mx-auto mb-4" />
              <p className="text-muted-foreground">Ładowanie produktu...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container-custom py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-stakerpol-navy">{t('productNotFound')}</h1>
          <Link to="/products" className="text-stakerpol-orange hover:underline text-lg">
            {t('backToProducts')}
          </Link>
        </div>
      </Layout>
    );
  }

  const breadcrumbItems = [
    { name: 'Strona główna', url: 'https://stakerpol.pl' },
    { name: 'Produkty', url: 'https://stakerpol.pl/products' },
    { name: product.model, url: `https://stakerpol.pl/products/${product.id}` }
  ];

  // Dynamic meta data
  const getMetaTitle = () => {
    const brand = product.model?.includes('Toyota') || product.model?.includes('BT') ? 'Toyota' : 'Toyota';
    const serialNumber = product.specs?.serialNumber ? ` (${product.specs.serialNumber})` : '';
    const type = product.specs?.driveType === 'Elektryczny' ? 'Wózek elektryczny' : 'Wózek widłowy';
    return `${product.model}${serialNumber} - ${type} | Stakerpol`;
  };

  const getMetaDescription = () => {
    const specs = [];
    if (product.specs?.liftHeight) specs.push(`${product.specs.liftHeight}mm wysokość podnoszenia`);
    if (product.specs?.mastLiftingCapacity) specs.push(`${product.specs.mastLiftingCapacity}kg udźwig`);
    if (product.specs?.productionYear) specs.push(`rok ${product.specs.productionYear}`);
    if (product.specs?.workingHours) specs.push(`${product.specs.workingHours}mth`);
    
    const specsText = specs.length > 0 ? ` - ${specs.join(', ')}` : '';
    return `${product.shortDescription || product.model}${specsText}. Profesjonalna sprzedaż używanych wózków widłowych Toyota/BT. Sprawdź ofertę Stakerpol.`;
  };

  const getOgImage = () => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return product.image || '';
  };

  return (
    <Layout>
      <Helmet>
        <title>{getMetaTitle()}</title>
        <meta name="description" content={getMetaDescription()} />
        <meta property="og:title" content={getMetaTitle()} />
        <meta property="og:description" content={getMetaDescription()} />
        <meta property="og:image" content={getOgImage()} />
        <meta property="og:url" content={`https://stakerpol.pl/products/${product.id}`} />
        <meta property="og:type" content="product" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={getMetaTitle()} />
        <meta name="twitter:description" content={getMetaDescription()} />
        <meta name="twitter:image" content={getOgImage()} />
        <link rel="canonical" href={`https://stakerpol.pl/products/${product.id}`} />
      </Helmet>
      <ProductSchema product={product} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <section id="product-details" className="bg-white py-12">
        <div className="container-custom">
          <ProductHeader />
          
          <div className="grid lg:grid-cols-2 gap-12">
            <ProductImage 
              image={product.image} 
              alt={product.model} 
              images={product.images} 
            />
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-stakerpol-navy leading-tight">
                  {product.model}
                </h1>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  {product.shortDescription}
                </p>
              </div>
              <ProductInfo product={product} language={language} />
            </div>
          </div>
        </div>
      </section>
      
      <RelatedProducts currentProductId={product.id} products={products} />
      
      <CallToAction />
    </Layout>
  );
};

export default ProductDetail;
