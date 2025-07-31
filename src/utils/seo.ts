// Advanced SEO utilities for 2025 optimization
export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  structuredData?: any;
  ogImage?: string;
  canonical?: string;
}

export const generatePageTitle = (pageTitle: string, businessName = "Stakerpol"): string => {
  return `${pageTitle} | ${businessName} - Wózki widłowe Toyota BT`;
};

export const generateMetaDescription = (content: string, maxLength = 158): string => {
  if (content.length <= maxLength) return content;
  
  const truncated = content.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return truncated.substring(0, lastSpace) + '...';
};

export const generateSchemaMarkup = (type: string, data: any) => {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": type,
    ...data
  };
  
  return baseSchema;
};

export const generateBreadcrumbSchema = (breadcrumbs: Array<{name: string, url: string}>) => {
  return generateSchemaMarkup("BreadcrumbList", {
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  });
};

export const optimizeImageAlt = (productName: string, context = "wózek widłowy"): string => {
  return `${productName} - ${context} Toyota BT używany na sprzedaż w Stakerpol`;
};

export const generateCanonicalUrl = (path: string, baseUrl = "https://stakerpol.pl"): string => {
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

// AI Search Engine optimization keywords for 2025
export const aiSearchKeywords = {
  semantic: [
    "wózki widłowe używane",
    "Toyota paletyzator elektryczny", 
    "sprzedaż wózków magazynowych",
    "serwis wózków widłowych Kraków",
    "części zamienne Toyota BT",
    "wózek widłowy do magazynu",
    "paletyzator elektryczny używany",
    "transport wewnętrzny magazyn"
  ],
  voiceSearch: [
    "gdzie kupić używany wózek widłowy",
    "ile kosztuje wózek widłowy Toyota",
    "jaki wózek widłowy do małego magazynu", 
    "serwis wózków widłowych w okolicy",
    "używane wózki elektryczne na sprzedaż",
    "Toyota BT wózki widłowe cena",
    "najlepszy wózek widłowy do palet",
    "gdzie naprawić wózek widłowy"
  ],
  entities: [
    "Toyota Material Handling",
    "BT wózki widłowe", 
    "paletyzatory elektryczne",
    "logistyka magazynowa",
    "handling equipment",
    "Stakerpol autoryzowany dealer",
    "wózki widłowe Małopolska",
    "transport wewnętrzny"
  ]
};