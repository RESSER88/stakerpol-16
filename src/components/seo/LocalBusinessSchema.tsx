interface LocalBusinessSchemaProps {
  includeOfferCatalog?: boolean;
}

const LocalBusinessSchema = ({ includeOfferCatalog = true }: LocalBusinessSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness", 
    "@id": "https://stakerpol.pl#organization",
    "name": "Stakerpol",
    "legalName": "Stakerpol",
    "description": "Profesjonalna sprzedaż i serwis wózków widłowych BT Toyota. Oferujemy wysokiej jakości używane wózki elektryczne i spalinowe wraz z kompleksowym serwisem.",
    "url": "https://stakerpol.pl",
    "telephone": "+48694133592",
    "email": "info@stakerpol.pl",
    "foundingDate": "2010",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "PL",
      "addressRegion": "Wielkopolska"
    },
    "areaServed": [
      {
        "@type": "Country",
        "name": "Polska"
      },
      {
        "@type": "State",
        "name": "Wielkopolska"
      },
      {
        "@type": "City", 
        "name": "Poznań"
      },
      {
        "@type": "City",
        "name": "Warszawa"
      },
      {
        "@type": "City",
        "name": "Kraków"
      },
      {
        "@type": "City",
        "name": "Wrocław"
      },
      {
        "@type": "City",
        "name": "Gdańsk"
      }
    ],
    "logo": {
      "@type": "ImageObject",
      "url": "https://stakerpol.pl/logo.png"
    },
    "sameAs": [
      "https://www.facebook.com/stakerpol",
      "https://www.instagram.com/stakerpol"
    ],
    "hasOfferCatalog": includeOfferCatalog ? {
      "@type": "OfferCatalog",
      "name": "Wózki widłowe BT Toyota",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Wózki elektryczne",
          "description": "Elektyczne wózki widłowe BT Toyota - ekonomiczne, ciche i przyjazne środowisku"
        },
        {
          "@type": "OfferCatalog", 
          "name": "Wózki spalinowe",
          "description": "Spalinowe wózki widłowe Toyota - wydajne rozwiązania do intensywnej pracy"
        },
        {
          "@type": "OfferCatalog",
          "name": "Serwis i części",
          "description": "Kompleksowy serwis wózków widłowych i oryginalne części zamienne"
        }
      ]
    } : undefined,
    "knowsAbout": [
      "Wózki widłowe Toyota",
      "Wózki elektryczne BT", 
      "Serwis wózków widłowych",
      "Części zamienne Toyota",
      "Wynajem wózków widłowych",
      "Sprzedaż używanych wózków",
      "Paleciaki magazynowe",
      "Uprawnienia UDT",
      "Przeglądy techniczne wózków",
      "Baterie do wózków elektrycznych",
      "Regeneracja baterii",
      "Wózki paletowe",
      "Leasing wózków widłowych",
      "Transport wózków",
      "Diagnostyka wózków",
      "Oleje hydrauliczne",
      "Koła poliuretanowe",
      "Maszt wózka widłowego",
      "Bezpieczeństwo pracy z wózkiem",
      "Funkcja creep to creep",
      "Prostowniki baterii",
      "Ładowanie baterii wózków",
      "Parametry prostownika",
      "Manewrowanie na wyprostowanym dyszlu",
      "Systemy bezpieczeństwa wózków",
      "Kody błędów wózków",
      "Konserwacja pojazdów magazynowych",
      "Wózki SWE120L, SWE140L, SWE200D",
      "Europałety standardowe",
      "Widła 1150mm"
    ],
    "serviceType": [
      "Sprzedaż wózków widłowych",
      "Serwis i naprawa",
      "Części zamienne",
      "Wynajem krótkoterminowy",
      "Doradztwo techniczne",
      "Przeglądy UDT",
      "Regeneracja baterii",
      "Transport i dostawa",
      "Szkolenia obsługi",
      "Diagnoza techniczna",
      "Leasing wózków"
    ]
  };

  // Remove undefined properties
  const cleanSchema = JSON.parse(JSON.stringify(schema));

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema, null, 2) }}
    />
  );
};

export default LocalBusinessSchema;