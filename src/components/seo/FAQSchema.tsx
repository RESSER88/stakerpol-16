interface FAQSchemaProps {
  includeStructuredData?: boolean;
}

const FAQSchema = ({ includeStructuredData = true }: FAQSchemaProps) => {
  const faqData = [
    {
      question: "Czy model Toyota SWE 200d może bezpiecznie poruszać się po nawierzchni z kostki brukowej?",
      answer: "Tak, model nadaje się do jazdy po kostce."
    },
    {
      question: "Czy model SWE 200d może być użytkowany na powierzchniach kamienistych?",
      answer: "Nie, nie jest przystosowany do jazdy po kamieniach."
    },
    {
      question: "Czy wózek SWE 200d umożliwia rozładunek palet z naczepy TIR?",
      answer: "Tak, umożliwia rozładunek z TIRa."
    },
    {
      question: "Czy paleciak może wjechać do komory chłodniczej?",
      answer: "Tak, może wjechać."
    },
    {
      question: "Czy wózek może pracować w chłodni przez dłuższy czas?",
      answer: "Tak, jeśli zastosowano odpowiedni olej hydrauliczny."
    },
    {
      question: "Czy SWE 200d przejedzie przez bramę o wysokości 1,90 m?",
      answer: "Tak, jego wysokość całkowita to 1,54 m."
    },
    {
      question: "Czy wymagane jest oddzielne pomieszczenie do ładowania pojedynczego wózka?",
      answer: "Nie, nie jest wymagane."
    },
    {
      question: "Czy do obsługi tego wózka potrzebne są uprawnienia?",
      answer: "Tak, wymagane są uprawnienia UDT."
    },
    {
      question: "Czy wózek z masztem musi przechodzić obowiązkowy przegląd UDT?",
      answer: "Tak, wymagany jest ważny przegląd."
    },
    {
      question: "Na jak długo UDT wydaje decyzję eksploatacyjną dla wózka?",
      answer: "Bez podestu – 24 miesiące, z podestem – 12 miesięcy."
    },
    {
      question: "Czy używane wózki są objęte gwarancją?",
      answer: "Tak, gwarancja wynosi 3 miesiące."
    },
    {
      question: "W jaki sposób należy ładować akumulator wózka?",
      answer: "Za pomocą dołączonego prostownika."
    },
    {
      question: "Czy możliwe jest przetestowanie wózka przed zakupem?",
      answer: "Tak, można obejrzeć i przetestować wózek."
    },
    {
      question: "Jakie są dostępne formy dostawy wózka?",
      answer: "Możliwy odbiór osobisty lub wysyłka kurierska."
    },
    {
      question: "Czy oferowane wózki używane przechodzą przegląd techniczny?",
      answer: "Tak, każdy wózek jest sprawdzany technicznie."
    },
    {
      question: "Jak sprawdzany jest stan baterii w wózku elektrycznym?",
      answer: "Poprzez diagnostykę, testy i pomiar parametrów elektrolitu."
    },
    {
      question: "Czy oferujecie serwis wózków po zakończeniu gwarancji?",
      answer: "Tak, świadczymy serwis pogwarancyjny."
    },
    {
      question: "Czy posiadacie autoryzację do konserwacji wózków widłowych?",
      answer: "Tak, posiadamy odpowiednie uprawnienia."
    },
    {
      question: "Na czym polega funkcja 'creep to creep'?",
      answer: "Funkcja umożliwia manewrowanie na wyprostowanym dyszlu."
    },
    {
      question: "Co oznacza kod błędu 2.001?",
      answer: "Kod oznacza ze jest wcisiety przycisk \"grzybek\" bezpieczenstawa."
    },
    {
      question: "Co oznacza kod błędu E50?",
      answer: "Błąd E50? Kod oznacza ze jest wcisiety przycisk \"grzybek\" bezpieczenstawa."
    },
    {
      question: "W jakim stanie są koła i rolki w oferowanych wózkach?",
      answer: "Są nowe lub mają niewielki stopień zużycia."
    },
    {
      question: "Jakie materiały są stosowane w kołach wózków?",
      answer: "Najczęściej poliuretan – cichy, trwały, nie zostawia śladów."
    },
    {
      question: "Dlaczego paleciak nie podnosi ładunku i co zrobić?",
      answer: "Sprawdź poziom baterii, wagę ładunku i skontaktuj się z serwisem."
    },
    {
      question: "W jakich warunkach najlepiej sprawdzą się wózki BT SWE?",
      answer: "Wewnątrz i na zewnątrz, na równych powierzchniach, do załadunku/rozładunku."
    },
    {
      question: "Jak dobrać długość wideł do europalet?",
      answer: "Standardowa długość 1150 mm pasuje do europalet."
    },
    {
      question: "Jak długo ładuje się bateria wózka?",
      answer: "Pełne ładowanie trwa 6–8 godzin w zależności od modelu oraz parametrów prostownika."
    },
    {
      question: "Na czym polega kompleksowe sprawdzenie baterii?",
      answer: "Obejmuje testy obciążeniowe i kontrolę stanu elektrolitu."
    },
    {
      question: "Jak przebiega proces regeneracji baterii?",
      answer: "Diagnostyka, czyszczenie, wymiany, testy wydajnościowe."
    },
    {
      question: "Czy oferujecie możliwość leasingu wózków?",
      answer: "Tak, umożliwiamy leasing na atrakcyjnych warunkach."
    },
    {
      question: "Czy zapewniacie transport zakupionych wózków?",
      answer: "Tak, dostarczamy wózek bezpiecznie pod wskazany adres."
    },
    {
      question: "Jak można sprawdzić stan używanego wózka?",
      answer: "Każdy paleciak ma przegląd, zapraszamy na jazdę próbną."
    },
    {
      question: "Jakie modele Toyota BT posiadacie w ofercie?",
      answer: "SWE120L, SWE140L, SWE200D – wersje z podestem i bez."
    },
    {
      question: "Jak bezpiecznie ładować baterię wózka?",
      answer: "Zaparkować, wyłączyć, wentylować, stosować środki ochrony."
    },
    {
      question: "Co się dzieje przy niskim poziomie baterii?",
      answer: "Włącza się sygnał ostrzegawczy, podnoszenie zostaje zablokowane."
    }
  ];

  if (!includeStructuredData) {
    return null;
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
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

export default FAQSchema;