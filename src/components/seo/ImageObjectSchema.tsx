import { Product } from '@/types';

interface ImageObjectSchemaProps {
  product: Product;
}

const ImageObjectSchema = ({ product }: ImageObjectSchemaProps) => {
  const getImageObjects = () => {
    const images = [];
    
    // Add main image
    if (product.image) {
      images.push({
        "@type": "ImageObject",
        "url": product.image,
        "description": `Wózek widłowy ${product.model} - zdjęcie główne`,
        "caption": `${product.model} - profesjonalny wózek widłowy Toyota`,
        "representativeOfPage": true
      });
    }
    
    // Add additional images
    if (product.images) {
      product.images.forEach((image, index) => {
        images.push({
          "@type": "ImageObject",
          "url": image,
          "description": `Wózek widłowy ${product.model} - zdjęcie ${index + 1}`,
          "caption": `${product.model} - widok detalu ${index + 1}`
        });
      });
    }
    
    return images;
  };

  const imageObjects = getImageObjects();
  
  if (imageObjects.length === 0) return null;

  const schema = {
    "@context": "https://schema.org/",
    "@type": "ImageGallery",
    "associatedMedia": imageObjects,
    "about": {
      "@type": "Product",
      "name": product.model,
      "category": "Wózki widłowe"
    }
  };

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
};

export default ImageObjectSchema;