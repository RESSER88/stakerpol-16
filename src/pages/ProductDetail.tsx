
import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
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
import ImageObjectSchema from '@/components/seo/ImageObjectSchema';
import AIOptimizedMetaTags from '@/components/seo/AIOptimizedMetaTags';
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
      <AIOptimizedMetaTags 
        title={getMetaTitle()}
        description={getMetaDescription()}
        keywords={[
          product.model,
          'Toyota wózek widłowy',
          'BT paletyzator',
          'wózek elektryczny używany',
          'paletyzator magazynowy',
          'Toyota forklift',
          'wózek widłowy ' + (product.specs?.productionYear || ''),
          'udźwig ' + (product.specs?.mastLiftingCapacity || '') + 'kg',
          'wysokość ' + (product.specs?.liftHeight || '') + 'mm'
        ]}
        aiSearchOptimization={{
          semanticKeywords: [
            `${product.model} specyfikacja techniczna`,
            `Toyota ${product.model} parametry`,
            `wózek widłowy ${product.model} używany`,
            `${product.model} cena sprzedaż`,
            `paletyzator ${product.model} magazyn`,
            `BT ${product.model} elektryczny`,
            `${product.model} udźwig wysokość`,
            `Toyota forklift ${product.model} części`
          ],
          voiceSearchQueries: [
            `jaki jest udźwig ${product.model}`,
            `ile kosztuje ${product.model}`,
            `jakie są parametry ${product.model}`,
            `gdzie kupić ${product.model}`,
            `czy ${product.model} jest dobry do magazynu`,
            `jaką ma wysokość podnoszenia ${product.model}`,
            `ile motogodzin ma ${product.model}`,
            `czy ${product.model} jest elektryczny`
          ],
          entityContext: [
            `Toyota ${product.model} Material Handling`,
            `BT ${product.model} wózek widłowy`,
            `${product.model} paletyzator elektryczny`,
            `${product.model} transport wewnętrzny`,
            `${product.model} logistyka magazynowa`,
            `Toyota forklift ${product.model} używany`,
            `${product.model} handling equipment`
          ]
        }}
      />
      <ProductSchema product={product} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <ImageObjectSchema product={product} />
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

              <h2 className="text-2xl font-semibold text-stakerpol-navy border-b border-gray-200 pb-2">
                Specyfikacja techniczna
              </h2>

              <div className="space-y-4">
                <h3 className="text-xl font-medium text-stakerpol-navy">
                  Parametry podnoszenia
                </h3>
                <ProductInfo product={product} language={language} />
                
                <h3 className="text-xl font-medium text-stakerpol-navy mt-6">
                  Zastosowania
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
                  <span>• Magazyn</span>
                  <span>• Produkcja</span>
                  <span>• Przewożenie palet</span>
                  <span>• Rozładunek TIR</span>
                  <span>• Chłodnie</span>
                  <span>• Obsługa regałów</span>
                </div>

                <h3 className="text-xl font-medium text-stakerpol-navy mt-6">
                  Stan i eksploatacja
                </h3>
                <div className="text-sm text-gray-600">
                  <p>Stan: {product.specs?.condition || 'Używany'}</p>
                  {product.specs?.workingHours && <p>Motogodziny: {product.specs.workingHours} mth</p>}
                  {product.specs?.productionYear && <p>Rok produkcji: {product.specs.productionYear}</p>}
                </div>
              </div>
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
