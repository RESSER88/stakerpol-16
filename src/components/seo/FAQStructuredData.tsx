
import { Product } from '@/types';

interface FAQStructuredDataProps {
  product?: Product;
  generalFAQ?: boolean;
}

const FAQStructuredData = ({ product, generalFAQ = false }: FAQStructuredDataProps) => {
  const generateProductFAQ = (product: Product) => [
    {
      question: `Jaki jest udźwig wózka ${product.model}?`,
      answer: `Wózek ${product.model} ma udźwig przy podnoszeniu masztu ${product.specs.mastLiftingCapacity} kg${product.specs.preliminaryLiftingCapacity ? ` i udźwig przy podnoszeniu wstępnym ${product.specs.preliminaryLiftingCapacity} kg` : ''}.`
    },
    {
      question: `Na jaką wysokość podnosi wózek ${product.model}?`,
      answer: `Maksymalna wysokość podnoszenia wynosi ${product.specs.liftHeight} mm. Wysokość konstrukcyjna to ${product.specs.minHeight} mm.`
    },
    {
      question: `Ile godzin pracy ma wózek ${product.model}?`,
      answer: `Ten egzemplarz ${product.model} ma ${product.specs.workingHours} motogodzin. Stan techniczny: ${product.specs.condition}.`
    },
    {
      question: `Czy wózek ${product.model} jest objęty gwarancją?`,
      answer: `Tak, wszystkie nasze używane wózki widłowe, w tym ${product.model}, są objęte gwarancją. Szczegóły gwarancji otrzymasz podczas zakupu.`
    },
    {
      question: `Czy można zobaczyć wózek ${product.model} przed zakupem?`,
      answer: `Oczywiście! Zapraszamy do naszego magazynu w Skale, gdzie można obejrzeć i przetestować ${product.model} oraz inne dostępne wózki.`
    }
  ];

  const generateGeneralFAQ = () => [
    {
      question: "Jakie uprawnienia są potrzebne do obsługi wózka widłowego?",
      answer: "Do obsługi wózka widłowego potrzebne są uprawnienia UDT kategorii II. Organizujemy kursy i pomoc w uzyskaniu uprawnień."
    },
    {
      question: "Czy oferujecie serwis wózków widłowych?",
      answer: "Tak, prowadzimy kompleksowy serwis wózków Toyota BT. Oferujemy przeglądy, naprawy, części zamienne i serwis wyjazdowy."
    },
    {
      question: "Jak długo trwa dostawa wózka widłowego?",
      answer: "Standardowa dostawa trwa 2-5 dni roboczych. Oferujemy transport własny oraz współpracę z firmami transportowymi."
    },
    {
      question: "Czy można kupić wózek na raty?",
      answer: "Tak, oferujemy różne formy finansowania: leasing, kredyt, raty. Pomożemy wybrać najkorzystniejszą opcję płatności."
    },
    {
      question: "Czy sprawdzacie stan techniczny przed sprzedażą?",
      answer: "Każdy wózek przechodzi dokładną kontrolę techniczną. Wszystkie usterki są usuwane przed przekazaniem klientowi."
    }
  ];

  const faqData = product ? generateProductFAQ(product) : generateGeneralFAQ();

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
};

export default FAQStructuredData;
