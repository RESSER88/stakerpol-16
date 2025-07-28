import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';

interface ProductFAQProps {
  product: Product;
}

const ProductFAQ = ({ product }: ProductFAQProps) => {
  // FAQ specyficzne dla produktu
  const productFAQ = [
    {
      question: `Czy ${product.model} ma aktualny przegląd UDT?`,
      answer: "Tak, wózek posiada aktualny przegląd UDT. Wraz z zakupem otrzymasz wszystkie dokumenty eksploatacyjne."
    },
    {
      question: `Jak długo ładuje się bateria w modelu ${product.model}?`,
      answer: `Bateria w modelu ${product.model} ładuje się przez 6-8 godzin. Wózek jest wyposażony w profesjonalny prostownik z automatycznym wyłączaniem.`
    },
    {
      question: `Czy ${product.model} nadaje się do pracy w chłodni?`,
      answer: "Tak, wózek może pracować w chłodni. Toyota BT są przystosowane do pracy w niskich temperaturach z odpowiednim olejem hydraulicznym."
    },
    {
      question: `Jakie są koszty eksploatacji ${product.model}?`,
      answer: "Koszt eksploatacji to głównie energia elektryczna (ok. 3-5 zł za 8h pracy) oraz okresowe przeglądy serwisowe. Brak kosztów paliwa i niskie koszty utrzymania."
    }
  ];

  return (
    <div className="bg-gray-50/50 rounded-lg p-6 mt-8">
      <h3 className="text-xl font-semibold text-stakerpol-navy mb-4">
        Pytania techniczne o {product.model}
      </h3>
      
      <Accordion type="single" collapsible className="space-y-3">
        {productFAQ.map((item, index) => (
          <AccordionItem 
            key={index} 
            value={`product-faq-${index}`}
            className="border border-border rounded-md px-4 py-1 bg-white"
          >
            <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-muted-foreground mb-3">
          Masz więcej pytań technicznych?
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            size="sm"
            asChild
          >
            <Link to="/faq">
              Zobacz wszystkie FAQ
            </Link>
          </Button>
          <Button 
            size="sm"
            asChild
          >
            <a href="tel:+48694133592">
              Zadzwoń: +48 694 133 592
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductFAQ;