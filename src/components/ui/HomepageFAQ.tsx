import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/utils/translations';

const HomepageFAQ = () => {
  const { language } = useLanguage();
  const t = useTranslation(language);

  // Wybrane najważniejsze pytania do strony głównej
  const featuredFAQ = [
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
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h2 className="section-title">Najczęściej zadawane pytania</h2>
          <p className="section-subtitle">
            Odpowiedzi na najważniejsze pytania o wózki widłowe, obsługę i serwis
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {featuredFAQ.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border rounded-lg px-6 py-2 bg-gray-50/50"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline text-stakerpol-navy">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              size="lg"
              className="secondary-button"
              asChild
            >
              <Link to="/faq">
                Zobacz wszystkie pytania ({/* +30 więcej */})
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomepageFAQ;