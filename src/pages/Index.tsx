
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import CallToAction from '@/components/ui/CallToAction';
import ProductCard from '@/components/ui/ProductCard';
import WhyChooseUs from '@/components/ui/WhyChooseUs';
import ProductsEmptyState from '@/components/ui/ProductsEmptyState';
import HomepageFAQ from '@/components/ui/HomepageFAQ';
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema';
import WebsiteSchema from '@/components/seo/WebsiteSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import ServiceSchema from '@/components/seo/ServiceSchema';
import GeoTargetingSchema from '@/components/seo/GeoTargetingSchema';
import AIOptimizedMetaTags from '@/components/seo/AIOptimizedMetaTags';
import { usePublicSupabaseProducts } from '@/hooks/usePublicSupabaseProducts';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/utils/translations';
import { getRandomItems } from '@/utils/randomUtils';
import { useMemo } from 'react';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const { products, isLoading } = usePublicSupabaseProducts();

  // Get 4 random products on each page load
  const featuredProducts = useMemo(() => {
    return getRandomItems(products, 4);
  }, [products]);

  const renderFeaturedProducts = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-stakerpol-orange mx-auto mb-4" />
            <p className="text-muted-foreground">Ładowanie produktów...</p>
          </div>
        </div>
      );
    }

    if (products.length === 0) {
      return <ProductsEmptyState />;
    }

    return (
      <>
        <div className="product-grid-desktop mt-8">
          {featuredProducts.map((product, index) => (
            <div key={product.id} style={{ animationDelay: `${index * 100}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="secondary-button"
            asChild
          >
            <Link to="/products">
              {t('viewAllProducts')}
            </Link>
          </Button>
        </div>
      </>
    );
  };

  return (
    <Layout>
      <AIOptimizedMetaTags 
        title="Stakerpol - Wózki widłowe Toyota BT | Sprzedaż używanych wózków elektrycznych i spalinowych"
        description="Profesjonalna sprzedaż używanych wózków widłowych Toyota i BT. Elektryczne i spalinowe paleciaki magazynowe z serwisem. Sprawdź ofertę wózków paletowych w Stakerpol."
        keywords={[
          "wózki widłowe",
          "toyota",
          "bt",
          "elektryczne",
          "spalinowe",
          "paleciaki",
          "magazynowe",
          "używane",
          "serwis",
          "stakerpol",
          "paletyzatory",
          "logistyka",
          "magazyn",
          "transport wewnętrzny"
        ]}
        aiSearchOptimization={{
          semanticKeywords: [
            "wózki widłowe używane",
            "Toyota paletyzator elektryczny",
            "sprzedaż wózków magazynowych",
            "serwis wózków widłowych Kraków",
            "części zamienne Toyota BT",
            "wózek widłowy do magazynu",
            "paletyzator elektryczny używany",
            "transport wewnętrzny magazyn"
          ],
          voiceSearchQueries: [
            "gdzie kupić używany wózek widłowy",
            "ile kosztuje wózek widłowy Toyota",
            "jaki wózek widłowy do małego magazynu",
            "serwis wózków widłowych w okolicy",
            "używane wózki elektryczne na sprzedaż",
            "Toyota BT wózki widłowe cena",
            "najlepszy wózek widłowy do palet",
            "gdzie naprawić wózek widłowy"
          ],
          entityContext: [
            "Toyota Material Handling",
            "BT wózki widłowe",
            "paletyzatory elektryczne",
            "logistyka magazynowa",
            "handling equipment",
            "Stakerpol autoryzowany dealer",
            "wózki widłowe Małopolska",
            "transport wewnętrzny"
          ]
        }}
      />
      <LocalBusinessSchema />
      <WebsiteSchema />
      <FAQSchema />
      <ServiceSchema />
      <GeoTargetingSchema />
      {/* Hero Section with Background Image */}
      <section 
        className="hero-section relative bg-gradient-to-br from-gray-900 via-gray-800 to-toyota-black text-white min-h-[600px] flex items-center"
      >
        <div className="container-custom py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 md:pr-8 text-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {t('heroTitle')}
              </h1>
              <p className="text-lg text-gray-300 md:text-xl">
                {t('heroSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  className="cta-button text-lg"
                  size="lg"
                  asChild
                >
                  <Link to="/products">
                    {t('browseProducts')}
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-2 border-white text-black bg-white hover:bg-gray-100 hover:text-black text-lg transition-all duration-300"
                  size="lg"
                  asChild
                >
                  <Link to="/contact">
                    {t('contact')}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="section-title text-center">{t('aboutUsTitle')}</h2>
          <p className="section-subtitle text-center max-w-3xl mx-auto">
            {t('aboutUsDescription')}
          </p>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Featured Products Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="section-title text-center">{t('featuredProducts')}</h2>
          <p className="text-center text-gray-600 mb-8">
            {t('featuredProductsSubtitle')}
          </p>
          
          {renderFeaturedProducts()}
        </div>
      </section>

      <HomepageFAQ />

      <CallToAction />
    </Layout>
  );
};

export default Index;
