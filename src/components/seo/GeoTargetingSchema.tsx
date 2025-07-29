interface GeoTargetingSchemaProps {
  includeStructuredData?: boolean;
}

const GeoTargetingSchema = ({ includeStructuredData = true }: GeoTargetingSchemaProps) => {
  if (!includeStructuredData) {
    return null;
  }

  const schema = {
    "@context": "https://schema.org/",
    "@type": "LocalBusiness",
    "name": "Stakerpol - Wózki widłowe Toyota BT",
    "description": "Sprzedaż i serwis używanych wózków widłowych Toyota BT w Polsce",
    "url": "https://stakerpol.pl",
    "telephone": "+48694133592",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "ul. Szewska 6",
      "addressLocality": "Skała",
      "postalCode": "32-043",
      "addressRegion": "Małopolskie",
      "addressCountry": "PL"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "50.2297",
      "longitude": "19.8347"
    },
    "areaServed": [
      {
        "@type": "Country",
        "name": "Poland",
        "sameAs": "https://pl.wikipedia.org/wiki/Polska"
      },
      {
        "@type": "City",
        "name": "Warszawa",
        "sameAs": "https://pl.wikipedia.org/wiki/Warszawa"
      },
      {
        "@type": "City",
        "name": "Kraków",
        "sameAs": "https://pl.wikipedia.org/wiki/Kraków"
      },
      {
        "@type": "City",
        "name": "Gdańsk",
        "sameAs": "https://pl.wikipedia.org/wiki/Gdańsk"
      },
      {
        "@type": "City",
        "name": "Wrocław",
        "sameAs": "https://pl.wikipedia.org/wiki/Wrocław"
      },
      {
        "@type": "City",
        "name": "Poznań",
        "sameAs": "https://pl.wikipedia.org/wiki/Poznań"
      },
      {
        "@type": "City",
        "name": "Łódź",
        "sameAs": "https://pl.wikipedia.org/wiki/Łódź"
      },
      {
        "@type": "City",
        "name": "Katowice",
        "sameAs": "https://pl.wikipedia.org/wiki/Katowice"
      },
      {
        "@type": "City", 
        "name": "Skała",
        "sameAs": "https://pl.wikipedia.org/wiki/Skała_(powiat_krakowski)"
      }
    ],
    "serviceArea": {
      "@type": "Country",
      "name": "Poland",
      "sameAs": "https://pl.wikipedia.org/wiki/Polska"
    },
    "openingHours": [
      "Mo-Fr 08:00-17:00",
      "Sa 08:00-14:00"
    ],
    "priceRange": "$$",
    "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer"],
    "currenciesAccepted": "PLN",
    "hasMap": "https://www.google.com/maps/place/ul.+Szewska+6,+32-043+Skała",
    "geoTargeting": {
      "primaryMarkets": [
        "Warszawa",
        "Kraków", 
        "Gdańsk",
        "Wrocław",
        "Poznań"
      ],
      "secondaryMarkets": [
        "Łódź",
        "Katowice",
        "Lublin",
        "Białystok",
        "Gdynia",
        "Szczecin",
        "Bydgoszcz",
        "Skała"
      ],
      "keywords": {
        "Warszawa": [
          "wózki widłowe Warszawa",
          "wózki paletowe elektryczne Warszawa",
          "Toyota wózki Warszawa",
          "serwis wózków widłowych Warszawa"
        ],
        "Kraków": [
          "wózki widłowe Kraków",
          "wózki paletowe elektryczne Kraków",
          "Toyota wózki Kraków",
          "serwis wózków widłowych Kraków"
        ],
        "Gdańsk": [
          "wózki widłowe Gdańsk",
          "wózki paletowe elektryczne Gdańsk",
          "Toyota BT Gdańsk"
        ],
        "Skała": [
          "wózki widłowe Skała",
          "Toyota BT Skała",
          "sprzedaż wózków Skała"
        ]
      }
    }
  };

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
};

export default GeoTargetingSchema;