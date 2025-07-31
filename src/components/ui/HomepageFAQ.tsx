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
import { getFeaturedFAQ } from '@/data/faqData';

const HomepageFAQ = () => {
  const { language } = useLanguage();
  const t = useTranslation(language);

  // Use shared FAQ data for consistency
  const featuredFAQ = getFeaturedFAQ();

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