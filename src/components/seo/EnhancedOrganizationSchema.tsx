
const EnhancedOrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://stakerpol.pl#organization",
    "name": "Stakerpol",
    "legalName": "Stakerpol",
    "description": "Profesjonalna sprzedaż i serwis wózków widłowych Toyota BT. Autoryzowany dealer z 16-letnim doświadczeniem w branży logistycznej.",
    "url": "https://stakerpol.pl",
    "logo": {
      "@type": "ImageObject",
      "url": "https://stakerpol.pl/logo.png",
      "width": "300",
      "height": "100"
    },
    "image": [
      "https://stakerpol.pl/images/magazyn-stakerpol.jpg",
      "https://stakerpol.pl/images/serwis-wozki.jpg",
      "https://stakerpol.pl/images/team-stakerpol.jpg"
    ],
    "telephone": "+48694133592",
    "email": "info@stakerpol.pl",
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
      "latitude": "50.237",
      "longitude": "19.835"
    },
    "foundingDate": "2008",
    "founders": [
      {
        "@type": "Person",
        "name": "Michał Seweryn",
        "jobTitle": "Właściciel i Główny Specjalista",
        "description": "16 lat doświadczenia w branży wózków widłowych, autoryzowany serwisant Toyota Material Handling"
      }
    ],
    "numberOfEmployees": "5-10",
    "slogan": "Profesjonalne rozwiązania logistyczne od 16 lat",
    "knowsAbout": [
      "Wózki widłowe Toyota",
      "Wózki elektryczne BT",
      "Serwis wózków widłowych", 
      "Części zamienne Toyota",
      "Uprawnienia UDT",
      "Regeneracja baterii",
      "Przeglądy techniczne",
      "Leasing wózków widłowych"
    ],
    "areaServed": {
      "@type": "Country",
      "name": "Poland"
    },
    "serviceArea": [
      {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": "50.237",
          "longitude": "19.835"
        },
        "geoRadius": "200000"
      }
    ],
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "name": "Autoryzacja Toyota Material Handling",
        "credentialCategory": "Autoryzowany Dealer"
      },
      {
        "@type": "EducationalOccupationalCredential", 
        "name": "Certyfikat UDT",
        "credentialCategory": "Uprawnienia Serwisowe"
      }
    ],
    "award": [
      "Autoryzowany Partner Toyota Material Handling",
      "16 lat bez reklamacji serwisowych",
      "Ponad 1000 zadowolonych klientów"
    ],
    "openingHours": [
      "Mo-Fr 08:00-17:00",
      "Sa 08:00-14:00"
    ],
    "paymentAccepted": [
      "Cash",
      "Credit Card", 
      "Bank Transfer",
      "Leasing",
      "Installments"
    ],
    "priceRange": "$$",
    "currenciesAccepted": "PLN",
    "hasMap": "https://www.google.com/maps/place/ul.+Szewska+6,+32-043+Skała",
    "sameAs": [
      "https://www.facebook.com/stakerpol",
      "https://www.instagram.com/stakerpol",
      "https://www.linkedin.com/company/stakerpol"
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+48694133592",
        "contactType": "customer service",
        "availableLanguage": ["Polish", "English"],
        "areaServed": "PL"
      },
      {
        "@type": "ContactPoint",
        "telephone": "+48694133592", 
        "contactType": "technical support",
        "availableLanguage": ["Polish"],
        "areaServed": "PL"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Katalog Wózków Widłowych",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Wózki Elektryczne",
          "description": "Elektryczne wózki widłowe Toyota BT"
        },
        {
          "@type": "OfferCatalog",
          "name": "Wózki Spalinowe", 
          "description": "Spalinowe wózki widłowe Toyota"
        },
        {
          "@type": "OfferCatalog",
          "name": "Serwis i Części",
          "description": "Kompleksowy serwis i oryginalne części"
        }
      ]
    }
  };

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
};

export default EnhancedOrganizationSchema;
