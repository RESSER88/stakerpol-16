interface WebsiteSchemaProps {
  includeStructuredData?: boolean;
}

const WebsiteSchema = ({ includeStructuredData = true }: WebsiteSchemaProps) => {
  if (!includeStructuredData) {
    return null;
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://stakerpol.pl#website",
    "name": "Stakerpol",
    "alternateName": "Stakerpol - Wózki widłowe Toyota BT",
    "url": "https://stakerpol.pl",
    "description": "Profesjonalna sprzedaż i serwis wózków widłowych BT Toyota. Oferujemy wysokiej jakości używane wózki elektryczne i spalinowe wraz z kompleksowym serwisem.",
    "inLanguage": "pl-PL",
    "publisher": {
      "@id": "https://stakerpol.pl#organization"
    },
    "copyrightHolder": {
      "@id": "https://stakerpol.pl#organization"
    },
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://stakerpol.pl/products?search={search_term_string}",
          "httpMethod": "GET"
        },
        "query-input": "required name=search_term_string"
      }
    ],
    "mainEntity": {
      "@type": "ItemList",
      "name": "Wózki widłowe Toyota BT",
      "description": "Katalog używanych wózków widłowych elektrycznych i spalinowych",
      "url": "https://stakerpol.pl/products"
    }
  };

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
};

export default WebsiteSchema;