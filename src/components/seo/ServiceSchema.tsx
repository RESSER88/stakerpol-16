interface ServiceSchemaProps {
  includeStructuredData?: boolean;
}

const ServiceSchema = ({ includeStructuredData = true }: ServiceSchemaProps) => {
  if (!includeStructuredData) {
    return null;
  }

  const services = [
    {
      "@type": "Service",
      "name": "Sprzedaż używanych wózków widłowych",
      "description": "Profesjonalna sprzedaż sprawdzonych używanych wózków widłowych Toyota BT z gwarancją i przeglądem technicznym",
      "serviceType": "Sprzedaż pojazdów magazynowych",
      "provider": {
        "@type": "Organization",
        "name": "Stakerpol"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Poland",
        "sameAs": "https://pl.wikipedia.org/wiki/Polska"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Wózki widłowe Toyota BT",
        "itemListElement": [
          {
            "@type": "OfferCatalog",
            "name": "Wózki elektryczne",
            "itemListElement": [
              {
                "@type": "Offer",
                "name": "Toyota SWE120L",
                "description": "Kompaktowy wózek elektryczny o udźwigu 1200 kg"
              },
              {
                "@type": "Offer", 
                "name": "Toyota SWE140L",
                "description": "Uniwersalny wózek elektryczny o udźwigu 1400 kg"
              },
              {
                "@type": "Offer",
                "name": "Toyota SWE200D",
                "description": "Wózek elektryczny o udźwigu 2000 kg"
              }
            ]
          }
        ]
      }
    },
    {
      "@type": "Service",
      "name": "Serwis i naprawa wózków widłowych",
      "description": "Kompleksowy serwis, naprawa i konserwacja wózków widłowych Toyota BT. Przeglądy UDT, diagnostyka, wymiana części",
      "serviceType": "Serwis pojazdów magazynowych",
      "provider": {
        "@type": "Organization",
        "name": "Stakerpol"
      },
      "serviceAudience": {
        "@type": "Audience",
        "audienceType": "Firmy magazynowe, centra logistyczne, zakłady produkcyjne"
      }
    },
    {
      "@type": "Service",
      "name": "Części zamienne do wózków widłowych",
      "description": "Oryginalne części zamienne Toyota BT: baterie, ładowarki, koła, filtry, oleje hydrauliczne",
      "serviceType": "Sprzedaż części zamiennych",
      "provider": {
        "@type": "Organization",
        "name": "Stakerpol"
      }
    }
  ];

  const schema = {
    "@context": "https://schema.org/",
    "@type": "ItemList",
    "name": "Usługi Stakerpol - Wózki widłowe",
    "description": "Kompleksowe usługi związane z wózkami widłowymi Toyota BT",
    "numberOfItems": services.length,
    "itemListElement": services.map((service, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": service
    }))
  };

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
};

export default ServiceSchema;