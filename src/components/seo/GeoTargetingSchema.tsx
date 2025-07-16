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
    "description": "Sprzedaż i serwis używanych wózków widłowych Toyota BT w Małopolsce",
    "url": "https://stakerpol.pl",
    "telephone": "+48694133592",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "ul. Energetyków 9c",
      "addressLocality": "Niepołomice",
      "postalCode": "32-005",
      "addressRegion": "Małopolskie",
      "addressCountry": "PL"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "50.0355",
      "longitude": "20.2145"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Kraków",
        "sameAs": "https://pl.wikipedia.org/wiki/Kraków"
      },
      {
        "@type": "City", 
        "name": "Niepołomice",
        "sameAs": "https://pl.wikipedia.org/wiki/Niepołomice"
      },
      {
        "@type": "City",
        "name": "Wieliczka",
        "sameAs": "https://pl.wikipedia.org/wiki/Wieliczka"
      },
      {
        "@type": "City",
        "name": "Tarnów",
        "sameAs": "https://pl.wikipedia.org/wiki/Tarnów"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Małopolskie",
        "sameAs": "https://pl.wikipedia.org/wiki/Województwo_małopolskie"
      }
    ],
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "50.0355",
        "longitude": "20.2145"
      },
      "geoRadius": "100000"
    },
    "openingHours": [
      "Mo-Fr 08:00-17:00",
      "Sa 08:00-14:00"
    ],
    "priceRange": "$$",
    "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer"],
    "currenciesAccepted": "PLN",
    "hasMap": "https://www.google.com/maps/place/ul.+Energetyków+9c,+32-005+Niepołomice",
    "geoTargeting": {
      "primaryMarkets": [
        "Kraków",
        "Niepołomice",
        "Wieliczka"
      ],
      "secondaryMarkets": [
        "Tarnów",
        "Nowy Sącz",
        "Bochnia"
      ],
      "keywords": {
        "Kraków": [
          "wózki widłowe Kraków",
          "używane wózki widłowe Kraków",
          "Toyota wózki Kraków",
          "serwis wózków widłowych Kraków"
        ],
        "Niepołomice": [
          "wózki widłowe Niepołomice",
          "Toyota BT Niepołomice",
          "sprzedaż wózków Niepołomice"
        ],
        "Wieliczka": [
          "wózki widłowe Wieliczka",
          "używane wózki Wieliczka",
          "serwis wózków Wieliczka"
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