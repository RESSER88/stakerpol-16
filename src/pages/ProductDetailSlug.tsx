import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductImage from '@/components/products/ProductImage';
import ProductHeader from '@/components/products/ProductHeader';
import ProductInfo from '@/components/products/ProductInfo';
import RelatedProducts from '@/components/products/RelatedProducts';
import CallToAction from '@/components/ui/CallToAction';
import ProductFAQ from '@/components/ui/ProductFAQ';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProductBySlug } from '@/hooks/useProductBySlug';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import AIOptimizedMetaTags from '@/components/seo/AIOptimizedMetaTags';
import ProductSchema from '@/components/seo/ProductSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import ImageObjectSchema from '@/components/seo/ImageObjectSchema';
import { Link } from 'react-router-dom';

const ProductDetailSlug = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const { product, isLoading, isNotFound } = useProductBySlug(slug);
  
  useScrollToTop();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Ładowanie produktu...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (isNotFound) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Produkt nie został znaleziony</h1>
          <p className="text-muted-foreground mb-8">
            Nie mogliśmy znaleźć produktu o podanym identyfikatorze.
          </p>
          <Link 
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Powrót do listy produktów
          </Link>
        </div>
      </Layout>
    );
  }

  if (!product) return null;

  // Breadcrumb items for structured data
  const breadcrumbItems = [
    { name: 'Strona główna', url: 'https://stakerpol.pl' },
    { name: 'Produkty', url: 'https://stakerpol.pl/products' },
    { name: product.model, url: `https://stakerpol.pl/products/${(product as any).slug || product.id}` }
  ];

  // SEO meta generation
  const getMetaTitle = () => {
    const baseTitle = `${product.model} ${product.specs?.serialNumber || ''}`;
    const suffix = "używany na sprzedaż | Stakerpol Toyota BT";
    return `${baseTitle} - ${suffix}`;
  };

  const getMetaDescription = () => {
    const specs = [];
    if (product.specs?.mastHeight) specs.push(`wys. podnoszenia ${product.specs.mastHeight}mm`);
    if (product.specs?.liftingCapacity) specs.push(`udźwig ${product.specs.liftingCapacity}kg`);
    if (product.specs?.productionYear) specs.push(`rok ${product.specs.productionYear}`);
    if (product.specs?.workingHours) specs.push(`${product.specs.workingHours}h`);
    
    const specsText = specs.length > 0 ? ` (${specs.join(', ')})` : '';
    return `${product.model} ${product.specs?.serialNumber || ''}${specsText} - używany wózek widłowy Toyota BT na sprzedaż. ${product.shortDescription || ''} Gwarancja 3 miesiące, przegląd techniczny, możliwość testowania.`.substring(0, 158);
  };

  const getOgImage = () => {
    return product.image || 'https://stakerpol.pl/og-product-default.jpg';
  };

  return (
    <Layout>
      <AIOptimizedMetaTags
        title={getMetaTitle()}
        description={getMetaDescription()}
        ogImage={getOgImage()}
        keywords={[
          `${product.name} ${product.serial_number}`,
          "wózek widłowy używany",
          "Toyota BT sprzedaż",
          "paleciak elektryczny",
          "magazyn logistics",
          product.condition || "bardzo dobry stan"
        ]}
        canonical={`https://stakerpol.pl/products/${product.slug}`}
        aiSearchOptimization={{
          semanticKeywords: [
            `${product.name} używany`,
            `Toyota BT ${product.serial_number}`,
            "wózek widłowy na sprzedaż",
            `paleciak ${product.lift_capacity_initial}kg`,
            "magazyn handling equipment"
          ],
          voiceSearchQueries: [
            `gdzie kupić ${product.name} używany`,
            `ile kosztuje wózek widłowy ${product.name}`,
            `${product.name} Toyota BT na sprzedaż`,
            `używany paleciak ${product.lift_capacity_initial}kg`
          ],
          entityContext: [
            `${product.name} Toyota`,
            `BT ${product.serial_number}`,
            `wózek widłowy ${product.production_year}`,
            "Stakerpol dealer autoryzowany"
          ]
        }}
      />
      
      <ProductSchema product={product} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <ImageObjectSchema 
        imageUrl={getOgImage()}
        alt={`${product.name} ${product.serial_number} - używany wózek widłowy Toyota BT`}
        caption={`${product.name} w bardzo dobrym stanie technicznym`}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ProductImage product={product} />
          <div>
            <ProductHeader product={product} language={language} />
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Model</h2>
              <p className="text-2xl font-bold text-primary">{product.name}</p>
            </div>
            
            {product.short_description && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Krótki opis</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {product.short_description}
                </p>
              </div>
            )}
            
            <ProductInfo product={product} language={language} />
          </div>
        </div>

        {product.detailed_description && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Zastosowanie</h2>
            <div className="prose max-w-none">
              <p className="text-muted-foreground leading-relaxed text-lg">
                {product.detailed_description}
              </p>
            </div>
          </div>
        )}

        {product.condition && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Stan techniczny</h2>
            <div className="bg-muted rounded-lg p-6">
              <p className="text-lg font-medium text-foreground">
                {product.condition}
              </p>
            </div>
          </div>
        )}

        <ProductFAQ product={product} />
        <RelatedProducts currentProductId={product.id} />
        <CallToAction />
      </div>
    </Layout>
  );
};

export default ProductDetailSlug;