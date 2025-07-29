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
      "streetAddress": "ul. Szewska 6",
      "addressLocality": "Skała",
      "postalCode": "32-043",
      "addressRegion": "Małopolskie",
      "addressCountry": "PL"
    },
    "areaServed": [
      {
        "@type": "Country",
        "name": "Poland",
        "sameAs": "https://pl.wikipedia.org/wiki/Polska"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Małopolskie",
        "sameAs": "https://pl.wikipedia.org/wiki/Województwo_małopolskie"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Wielkopolskie",
        "sameAs": "https://pl.wikipedia.org/wiki/Województwo_wielkopolskie"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Mazowieckie",
        "sameAs": "https://pl.wikipedia.org/wiki/Województwo_mazowieckie"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Śląskie",
        "sameAs": "https://pl.wikipedia.org/wiki/Województwo_śląskie"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Dolnośląskie",
        "sameAs": "https://pl.wikipedia.org/wiki/Województwo_dolnośląskie"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Pomorskie",
        "sameAs": "https://pl.wikipedia.org/wiki/Województwo_pomorskie"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Zachodniopomorskie",
        "sameAs": "https://pl.wikipedia.org/wiki/Województwo_zachodniopomorskie"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Łódzkie",
        "sameAs": "https://pl.wikipedia.org/wiki/Województwo_łódzkie"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Lubelskie",
        "sameAs": "https://pl.wikipedia.org/wiki/Województwo_lubelskie"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Podkarpackie",
        "sameAs": "https://pl.wikipedia.org/wiki/Województwo_podkarpackie"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Świętokrzyskie",
        "sameAs": "https://pl.wikipedia.org/wiki/Województwo_świętokrzyskie"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Podlaskie",
        "sameAs": "https://pl.wikipedia.org/wiki/Województwo_podlaskie"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Warmińsko-mazurskie",
        "sameAs": "https://pl.wikipedia.org/wiki/Województwo_warmińsko-mazurskie"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Kujawsko-pomorskie",
        "sameAs": "https://pl.wikipedia.org/wiki/Województwo_kujawsko-pomorskie"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Lubuskie",
        "sameAs": "https://pl.wikipedia.org/wiki/Województwo_lubuskie"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Opolskie",
        "sameAs": "https://pl.wikipedia.org/wiki/Województwo_opolskie"
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