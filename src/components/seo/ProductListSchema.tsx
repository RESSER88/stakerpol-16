import { Product } from '@/types';

interface ProductListSchemaProps {
  products: Product[];
}

const ProductListSchema = ({ products }: ProductListSchemaProps) => {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "CollectionPage",
    "name": "Wózki widłowe Toyota BT - Używane paletyzatory elektryczne",
    "description": "Profesjonalna oferta używanych wózków widłowych Toyota BT. Sprawdzone paletyzatory elektryczne z gwarancją i przeglądem technicznym.",
    "url": "https://stakerpol.pl/products",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": products.length,
      "itemListElement": products.map((product, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.model,
          "description": product.shortDescription || `Wózek widłowy ${product.model}`,
          "url": `https://stakerpol.pl/products/${product.id}`,
          "image": product.image || (product.images && product.images[0]) || '',
          "brand": {
            "@type": "Brand",
            "name": "Toyota"
          },
          "category": "Wózki widłowe",
          "fuelType": "Electric",
          "usedCondition": product.specs?.condition || "Używany",
          "offers": {
            "@type": "Offer",
            "availability": "https://schema.org/InStock",
            "seller": {
              "@type": "Organization",
              "name": "Stakerpol"
            }
          }
        }
      }))
    },
    "provider": {
      "@type": "Organization",
      "name": "Stakerpol",
      "url": "https://stakerpol.pl",
      "telephone": "+48694133592"
    }
  };

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
};

export default ProductListSchema;