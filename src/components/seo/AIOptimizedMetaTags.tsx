import { Helmet } from "react-helmet-async";

interface AIOptimizedMetaTagsProps {
  title: string;
  description: string;
  keywords?: string[];
  structuredData?: any;
  geoLocation?: {
    latitude: string;
    longitude: string;
    region: string;
    placename: string;
  };
  aiSearchOptimization?: {
    semanticKeywords: string[];
    voiceSearchQueries: string[];
    entityContext: string[];
  };
}

const AIOptimizedMetaTags = ({
  title,
  description,
  keywords = [],
  structuredData,
  geoLocation,
  aiSearchOptimization
}: AIOptimizedMetaTagsProps) => {
  const defaultGeoLocation = {
    latitude: "50.0355",
    longitude: "20.2145", 
    region: "PL-MA",
    placename: "Niepołomice"
  };

  const geo = geoLocation || defaultGeoLocation;

  const defaultAIOptimization = {
    semanticKeywords: [
      "wózki widłowe",
      "Toyota paletyzator",
      "używane wózki elektryczne",
      "sprzedaż wózków magazynowych",
      "serwis wózków widłowych"
    ],
    voiceSearchQueries: [
      "gdzie kupić używany wózek widłowy",
      "ile kosztuje wózek widłowy Toyota",
      "jaki wózek widłowy do magazynu",
      "serwis wózków widłowych w okolicy"
    ],
    entityContext: [
      "Toyota Material Handling",
      "BT wózki widłowe",
      "paletyzatory elektryczne",
      "logistyka magazynowa",
      "handling equipment"
    ]
  };

  const aiOpt = aiSearchOptimization || defaultAIOptimization;

  return (
    <Helmet>
      {/* Standard SEO Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      
      {/* AI Search Engine Optimization 2025 */}
      <meta name="ai-search-keywords" content={aiOpt.semanticKeywords.join(", ")} />
      <meta name="voice-search-queries" content={aiOpt.voiceSearchQueries.join(" | ")} />
      <meta name="entity-context" content={aiOpt.entityContext.join(", ")} />
      
      {/* Geographic Meta Tags */}
      <meta name="geo.position" content={`${geo.latitude};${geo.longitude}`} />
      <meta name="geo.region" content={geo.region} />
      <meta name="geo.placename" content={geo.placename} />
      <meta name="ICBM" content={`${geo.latitude}, ${geo.longitude}`} />
      
      {/* OpenGraph for Social Media & AI */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="pl_PL" />
      <meta property="og:site_name" content="Stakerpol" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      
      {/* AI Search Engine Specific */}
      <meta name="chatgpt-search-optimization" content={aiOpt.semanticKeywords.join(", ")} />
      <meta name="perplexity-ai-context" content={aiOpt.entityContext.join(", ")} />
      <meta name="bard-semantic-context" content={description} />
      
      {/* Mobile & Performance */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : 'https://stakerpol.pl'} />
      
      {/* Language & Region */}
      <meta httpEquiv="content-language" content="pl" />
      <meta name="language" content="Polish" />
      <meta name="target-audience" content="Poland" />
      <meta name="distribution" content="global" />
      
      {/* Structured Data for AI */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData, null, 2)}
        </script>
      )}
    </Helmet>
  );
};

export default AIOptimizedMetaTags;