import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/utils/translations';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import AIOptimizedMetaTags from '@/components/seo/AIOptimizedMetaTags';
import FAQSchema from '@/components/seo/FAQSchema';
import { getAllFAQ } from '@/data/faqData';
import { useScrollToTop } from '@/hooks/useScrollToTop';

const FAQ = () => {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const [searchTerm, setSearchTerm] = useState('');
  
  useScrollToTop();

  const faqData = getAllFAQ();

  const filteredFAQ = faqData.filter(
    item =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <AIOptimizedMetaTags
        title="FAQ - Najczęściej zadawane pytania o wózki widłowe | Stakerpol"
        description="Odpowiedzi na najważniejsze pytania o wózki widłowe Toyota BT, paleciaki elektryczne, serwis, UDT, baterie i eksploatację. Kompletny przewodnik dla użytkowników."
        keywords={["FAQ wózki widłowe", "pytania paleciak elektryczny", "Toyota BT instrukcja", "UDT wózek widłowy", "bateria paleciak", "serwis wózków widłowych"]}
        aiSearchOptimization={{
          semanticKeywords: ["FAQ wózki widłowe", "pytania paleciaki", "Toyota BT pomoc", "UDT wózek", "bateria ładowanie"],
          voiceSearchQueries: ["najczęściej zadawane pytania o wózki widłowe", "jak obsługiwać paleciak elektryczny", "czy potrzebne są uprawnienia UDT do wózka", "jak ładować baterię w paleciaku"],
          entityContext: ["Toyota BT FAQ", "wózki widłowe pytania", "paleciaki elektryczne pomoc", "UDT uprawnienia", "baterie obsługa"]
        }}
      />
      <FAQSchema includeStructuredData={true} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Najczęściej zadawane pytania
            </h1>
            <p className="text-muted-foreground text-lg">
              Odpowiedzi na najważniejsze pytania dotyczące wózków widłowych Toyota BT, 
              obsługi, serwisu i bezpieczeństwa
            </p>
          </div>

          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Wyszukaj pytanie lub słowo kluczowe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {searchTerm && (
              <p className="text-sm text-muted-foreground mt-2">
                Znaleziono {filteredFAQ.length} wyników dla "{searchTerm}"
              </p>
            )}
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {filteredFAQ.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border rounded-lg px-6 py-2"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {filteredFAQ.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Nie znaleziono wyników dla "{searchTerm}". 
                Spróbuj użyć innych słów kluczowych.
              </p>
            </div>
          )}

          <div className="mt-12 text-center">
            <div className="bg-muted rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Nie znalazłeś odpowiedzi?</h3>
              <p className="text-muted-foreground mb-4">
                Skontaktuj się z nami bezpośrednio - chętnie odpowiemy na wszystkie pytania
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span>📞 Tel: +48 694 133 592</span>
                <span>✉️ Email: info@stakerpol.pl</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;