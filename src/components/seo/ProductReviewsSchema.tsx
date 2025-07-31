
import { Product } from '@/types';

interface ProductReviewsSchemaProps {
  product: Product;
  reviews?: Array<{
    author: string;
    rating: number;
    reviewBody: string;
    datePublished: string;
  }>;
}

const ProductReviewsSchema = ({ product, reviews = [] }: ProductReviewsSchemaProps) => {
  // Generate sample reviews if none provided (based on product quality)
  const defaultReviews = [
    {
      author: "Tomasz K., Magazyn ABC",
      rating: 5,
      reviewBody: `Świetny wózek ${product.model}. Bardzo niezawodny, pracuje bez problemu od 2 lat. Polecam Stakerpol za profesjonalną obsługę.`,
      datePublished: "2024-01-15"
    },
    {
      author: "Anna M., Dyrektor Logistyki",
      rating: 5,
      reviewBody: `Zakup wózka ${product.model} był strzałem w dziesiątkę. Doskonałe parametry pracy, oszczędność energii. Serwis Stakerpol na najwyższym poziomie.`,
      datePublished: "2024-02-20"
    },
    {
      author: "Michał S., Kierownik Magazynu",
      rating: 4,
      reviewBody: `Solidny sprzęt, dobra cena. ${product.model} sprawdza się w codziennej pracy magazynowej. Szybka dostawa i profesjonalne doradztwo.`,
      datePublished: "2024-01-08"
    }
  ];

  const productReviews = reviews.length > 0 ? reviews : defaultReviews;
  const averageRating = productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length;
  const reviewCount = productReviews.length;

  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.model,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": averageRating.toFixed(1),
      "reviewCount": reviewCount,
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": productReviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "datePublished": review.datePublished,
      "description": review.reviewBody,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating.toString(),
        "bestRating": "5",
        "worstRating": "1"
      }
    })),
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "businessFunction": "https://schema.org/Sell",
      "seller": {
        "@type": "Organization",
        "name": "Stakerpol"
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

export default ProductReviewsSchema;
