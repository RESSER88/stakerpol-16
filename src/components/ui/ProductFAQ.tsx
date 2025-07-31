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
  // FAQ zgodne z tymi z strony głównej (najczęściej zadawane pytania)
  const productFAQ = [
    {
      question: "Czy do obsługi wózka potrzebne są uprawnienia UDT?",
      answer: "Tak, wymagane są uprawnienia UDT do obsługi wózków widłowych. Operator musi posiadać ważne świadectwo kwalifikacji wydane przez Urząd Dozoru Technicznego."
    },
    {
      question: "Czy używane wózki są objęte gwarancją?",
      answer: "Tak, wszystkie nasze używane wózki są objęte 3-miesięczną gwarancją. Gwarancja obejmuje sprawność mechaniczną i elektryczną urządzenia."
    },
    {
      question: "Jak długo ładuje się bateria wózka?",
      answer: "Pełne ładowanie baterii trwa 6-8 godzin w zależności od modelu wózka oraz parametrów prostownika. Nowoczesne prostowniki mają automatyczne wyłączanie."
    },
    {
      question: "Czy oferowane wózki używane przechodzą przegląd techniczny?",
      answer: "Tak, każdy wózek przed sprzedażą przechodzi dokładny przegląd techniczny. Sprawdzamy wszystkie systemy: hydrauliczny, elektryczny, hamulcowy oraz stan ogólny."
    },
    {
      question: "Czy można przetestować wózek przed zakupem?",
      answer: "Tak, zachęcamy do osobistego obejrzenia i przetestowania wózka przed zakupem. Umówimy wizytę w naszym magazynie, gdzie można sprawdzić wszystkie funkcje urządzenia."
    },
    {
      question: "Jakie są dostępne formy dostawy wózka?",
      answer: "Oferujemy dwie formy dostawy: odbiór osobisty z naszego magazynu oraz wysyłkę kurierską na podest. Koszt dostawy zależy od odległości i wagi urządzenia."
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