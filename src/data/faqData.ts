// Shared FAQ data for consistency across the app
export interface FAQItem {
  question: string;
  answer: string;
  featured?: boolean; // For homepage display
}

export const faqData: FAQItem[] = [
  {
    question: "Czy do obsługi wózka potrzebne są uprawnienia UDT?",
    answer: "Tak, wymagane są uprawnienia UDT do obsługi wózków widłowych. Operator musi posiadać ważne świadectwo kwalifikacji wydane przez Urząd Dozoru Technicznego.",
    featured: true
  },
  {
    question: "Czy używane wózki są objęte gwarancją?",
    answer: "Tak, wszystkie nasze używane wózki są objęte 3-miesięczną gwarancją. Gwarancja obejmuje sprawność mechaniczną i elektryczną urządzenia.",
    featured: true
  },
  {
    question: "Jak długo ładuje się bateria wózka?",
    answer: "Pełne ładowanie baterii trwa 6-8 godzin w zależności od modelu wózka oraz parametrów prostownika. Nowoczesne prostowniki mają automatyczne wyłączanie.",
    featured: true
  },
  {
    question: "Czy oferowane wózki używane przechodzą przegląd techniczny?",
    answer: "Tak, każdy wózek przed sprzedażą przechodzi dokładny przegląd techniczny. Sprawdzamy wszystkie systemy: hydrauliczny, elektryczny, hamulcowy oraz stan ogólny.",
    featured: true
  },
  {
    question: "Czy można przetestować wózek przed zakupem?",
    answer: "Tak, zachęcamy do osobistego obejrzenia i przetestowania wózka przed zakupem. Umówimy wizytę w naszym magazynie, gdzie można sprawdzić wszystkie funkcje urządzenia.",
    featured: true
  },
  {
    question: "Jakie są dostępne formy dostawy wózka?",
    answer: "Oferujemy dwie formy dostawy: odbiór osobisty z naszego magazynu oraz wysyłkę kurierską na podest. Koszt dostawy zależy od odległości i wagi urządzenia.",
    featured: true
  },
  {
    question: "Czy model Toyota SWE 200d może bezpiecznie poruszać się po nawierzchni z kostki brukowej?",
    answer: "Tak, model nadaje się do jazdy po kostce brukowej. Wózek jest wyposażony w odpowiednie koła poliuretanowe, które zapewniają stabilność i bezpieczeństwo podczas poruszania się po nierównych powierzchniach."
  },
  {
    question: "Czy model SWE 200d może być użytkowany na powierzchniach kamienistych?",
    answer: "Nie, wózek nie jest przystosowany do jazdy po kamieniach. Powierzchnie kamieniste mogą uszkodzić koła i wpłynąć na stabilność urządzenia."
  },
  {
    question: "Czy wózek SWE 200d umożliwia rozładunek palet z naczepy TIR?",
    answer: "Tak, wózek umożliwia rozładunek z naczepy TIR dzięki odpowiedniej wysokości podnoszenia i konstrukcji, która pozwala na bezpieczne manewrowanie w ograniczonej przestrzeni."
  },
  {
    question: "Czy paleciak może wjechać do komory chłodniczej?",
    answer: "Tak, może wjechać do komory chłodniczej. Wózki Toyota BT są przystosowane do pracy w niskich temperaturach, ale wymagają odpowiedniego oleju hydraulicznego."
  },
  {
    question: "Czy wózek może pracować w chłodni przez dłuższy czas?",
    answer: "Tak, może pracować w chłodni przez dłuższy czas, jeśli zastosowano odpowiedni olej hydrauliczny odporny na niskie temperatury. Zalecamy regularną kontrolę baterii w takich warunkach."
  },
  {
    question: "Czy SWE 200d przejedzie przez bramę o wysokości 1,90 m?",
    answer: "Tak, bez problemu. Wysokość całkowita wózka SWE 200d to 1,54 m, co pozwala na swobodne przejechanie przez bramę o wysokości 1,90 m z bezpiecznym marginesem."
  },
  {
    question: "Czy wymagane jest oddzielne pomieszczenie do ładowania pojedynczego wózka?",
    answer: "Nie, nie jest wymagane oddzielne pomieszczenie. Wystarczy dobrze wentylowane miejsce z dostępem do gniazdka 230V i zachowaniem podstawowych zasad bezpieczeństwa."
  },
  {
    question: "Czy wózek z masztem musi przechodzić obowiązkowy przegląd UDT?",
    answer: "Tak, wózek z masztem wymaga obowiązkowego przeglądu UDT. Jest to wymóg prawny zapewniający bezpieczeństwo eksploatacji urządzenia."
  },
  {
    question: "Na jak długo UDT wydaje decyzję eksploatacyjną dla wózka?",
    answer: "Dla wózków bez podestu operatora - 24 miesiące, dla wózków z podestem operatora - 12 miesięcy. Po tym czasie wymagane jest odnowienie przeglądu."
  },
  {
    question: "W jaki sposób należy ładować akumulator wózka?",
    answer: "Akumulator należy ładować za pomocą dołączonego prostownika. Proces ładowania trwa 6-8 godzin. Ważne jest przestrzeganie instrukcji i ładowanie w wentylowanym pomieszczeniu."
  },
  {
    question: "Jak sprawdzany jest stan baterii w wózku elektrycznym?",
    answer: "Stan baterii sprawdzamy poprzez kompleksową diagnostykę: testy obciążeniowe, kontrolę stanu elektrolitu, pomiar napięcia ogniw oraz test wydajności ładowania."
  },
  {
    question: "Czy oferujecie serwis wózków po zakończeniu gwarancji?",
    answer: "Tak, świadczymy kompleksowy serwis pogwarancyjny. Oferujemy naprawy, przeglądy okresowe, wymianę części oraz serwis wyjazdowy."
  },
  {
    question: "Czy posiadacie autoryzację do konserwacji wózków widłowych?",
    answer: "Tak, posiadamy wszystkie wymagane uprawnienia i certyfikaty do konserwacji wózków widłowych marki Toyota BT oraz innych producentów."
  },
  {
    question: "Na czym polega funkcja 'creep to creep'?",
    answer: "Funkcja 'creep to creep' umożliwia bardzo powolne manewrowanie wózkiem na wyprostowanym dyszlu bez konieczności przytrzymywania przycisku jazdy. Przydatna przy precyzyjnym pozycjonowaniu."
  },
  {
    question: "Co oznacza kod błędu 2.001?",
    answer: "Kod błędu 2.001 oznacza, że jest wciśnięty przycisk bezpieczeństwa 'grzybek'. Aby usunąć błąd, należy odbezpieczyć przycisk przez obrócenie w prawo."
  },
  {
    question: "Co oznacza kod błędu E50?",
    answer: "Kod błędu E50 również oznacza, że jest wciśnięty przycisk bezpieczeństwa 'grzybek'. Procedura usunięcia błędu jest identyczna - obrót przycisku w prawo."
  },
  {
    question: "W jakim stanie są koła i rolki w oferowanych wózkach?",
    answer: "Koła i rolki w naszych wózkach są nowe lub mają niewielki stopień zużycia. Przed sprzedażą sprawdzamy ich stan i w razie potrzeby wymieniamy na nowe."
  },
  {
    question: "Jakie materiały są stosowane w kołach wózków?",
    answer: "Najczęściej stosujemy koła poliuretanowe - są ciche, bardzo trwałe, nie zostawiają śladów na podłodze i zapewniają doskonałą przyczepność."
  },
  {
    question: "Dlaczego paleciak nie podnosi ładunku i co zrobić?",
    answer: "Przyczyny mogą być różne: niski stan baterii, przeciążenie, awaria hydrauliki. Należy sprawdzić poziom baterii, wagę ładunku i skontaktować się z naszym serwisem."
  },
  {
    question: "W jakich warunkach najlepiej sprawdzą się wózki BT SWE?",
    answer: "Wózki BT SWE sprawdzają się doskonale w magazynach, halach produkcyjnych, zarówno wewnątrz jak i na zewnątrz, na równych powierzchniach do załadunku i rozładunku."
  },
  {
    question: "Jak dobrać długość wideł do europalet?",
    answer: "Standardowa długość wideł 1150 mm idealnie pasuje do europalet (1200x800 mm). Ta długość zapewnia stabilność i bezpieczeństwo transportu."
  },
  {
    question: "Na czym polega kompleksowe sprawdzenie baterii?",
    answer: "Kompleksowe sprawdzenie obejmuje: testy obciążeniowe, kontrolę stanu elektrolitu, pomiar napięcia poszczególnych ogniw, sprawdzenie połączeń i test wydajności."
  },
  {
    question: "Jak przebiega proces regeneracji baterii?",
    answer: "Proces regeneracji obejmuje: diagnostykę stanu, czyszczenie ogniw, wymianę uszkodzonych elementów, uzupełnienie elektrolitu i testy wydajnościowe."
  },
  {
    question: "Czy oferujecie możliwość leasingu wózków?",
    answer: "Tak, współpracujemy z firmami leasingowymi i umożliwiamy leasing na atrakcyjnych warunkach. Pomożemy w wyborze najlepszej opcji finansowania."
  },
  {
    question: "Czy zapewniacie transport zakupionych wózków?",
    answer: "Tak, oferujemy profesjonalny transport wózków. Dostarczamy urządzenie bezpiecznie pod wskazany adres na specjalistycznej naczepie lub samochodzie z HDS."
  },
  {
    question: "Jak można sprawdzić stan używanego wózka?",
    answer: "Każdy paleciak przechodzi dokładny przegląd przed sprzedażą. Dodatkowo zapraszamy na jazdę próbną w naszym magazynie, gdzie można osobiście przetestować wszystkie funkcje."
  },
  {
    question: "Jakie modele Toyota BT posiadacie w ofercie?",
    answer: "W ofercie mamy modele: SWE120L, SWE140L, SWE200D w różnych konfiguracjach - zarówno wersje z podestem operatora jak i bez podestu."
  },
  {
    question: "Jak bezpiecznie ładować baterię wózka?",
    answer: "Bezpieczne ładowanie wymaga: zaparkowania wózka, wyłączenia zasilania, zapewnienia wentylacji, stosowania środków ochrony osobistej i postępowania zgodnie z instrukcją."
  },
  {
    question: "Co się dzieje przy niskim poziomie baterii?",
    answer: "Przy niskim poziomie baterii włącza się sygnał ostrzegawczy (świetlny i dźwiękowy), a podnoszenie zostaje zablokowane dla bezpieczeństwa. Wózek nadal może jeździć."
  }
];

// Helper functions
export const getFeaturedFAQ = () => faqData.filter(item => item.featured);
export const getAllFAQ = () => faqData;