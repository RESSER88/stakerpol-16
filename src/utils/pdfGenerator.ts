
import jsPDF from 'jspdf';
import { Product } from '@/types';

interface QuoteData {
  product: Product;
  netPrice?: number;
  transportPrice?: number;
  clientName?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  address?: string;
  paymentMethod?: string;
  leasingAvailable?: boolean;
  additionalNotes?: string;
}

// Funkcja do pobierania i liczenia numerów ofert
const getNextQuoteNumber = (): string => {
  const currentYear = new Date().getFullYear();
  const storageKey = `quote_counter_${currentYear}`;
  
  // Pobierz aktualny licznik z localStorage
  let counter = parseInt(localStorage.getItem(storageKey) || '0');
  counter += 1;
  
  // Zapisz nowy licznik
  localStorage.setItem(storageKey, counter.toString());
  
  return `${counter.toString().padStart(3, '0')}/${currentYear}`;
};

// Funkcja do formatowania daty
const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

// Funkcja do formatowania ceny
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pl-PL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

export const generatePDFQuote = async (data: QuoteData): Promise<void> => {
  const { 
    product, 
    netPrice, 
    transportPrice, 
    clientName, 
    companyName, 
    email, 
    phone, 
    address,
    paymentMethod,
    leasingAvailable,
    additionalNotes
  } = data;
  
  // Tworzenie dokumentu PDF
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Kolory zgodne z identyfikacją wizualną (ulepszone)
  const primaryColor = '#002B5B'; // Ciemny granat
  const accentColor = '#1D4ED8'; // Niebieski akcent
  const textColor = '#374151'; // Szary tekst
  const lightGray = '#F3F4F6'; // Jasne tło
  const orangeAccent = '#f97316'; // Pomarańczowy Stakerpol
  
  // Daty
  const today = new Date();
  const validUntil = new Date();
  validUntil.setDate(today.getDate() + 14); // Ważna 14 dni
  
  const quoteNumber = getNextQuoteNumber();
  
  // === NAGŁÓWEK FIRMY (dwukolumnowy układ) ===
  
  // Lewa strona - dane firmy
  doc.setFontSize(14);
  doc.setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('FHU STAKERPOL', 15, 20);
  
  doc.setFontSize(9);
  doc.setTextColor(textColor);
  doc.setFont('helvetica', 'normal');
  doc.text('ul. Szewska 6, 32-043 Skała', 15, 25);
  doc.text('Tel: +48 694 133 592', 15, 29);
  doc.text('E-mail: info@stakerpol.pl', 15, 33);
  doc.text('www.stakerpol.pl', 15, 37);
  
  // Prawa strona - numer oferty i daty
  doc.setFontSize(16);
  doc.setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text(`OFERTA ${quoteNumber}`, pageWidth - 15, 20, { align: 'right' });
  
  doc.setFontSize(9);
  doc.setTextColor(textColor);
  doc.setFont('helvetica', 'normal');
  doc.text(`Data wystawienia: ${formatDate(today)}`, pageWidth - 15, 27, { align: 'right' });
  doc.text(`Ważna do: ${formatDate(validUntil)}`, pageWidth - 15, 31, { align: 'right' });
  
  // Linia oddzielająca nagłówek
  doc.setDrawColor(accentColor);
  doc.setLineWidth(1.5);
  doc.line(15, 45, pageWidth - 15, 45);
  
  let yPos = 55;
  
  // === DANE KLIENTA (jeśli wypełnione) ===
  
  const hasClientData = clientName || companyName || email || phone || address;
  
  if (hasClientData) {
    // Nagłówek sekcji z ikoną
    doc.setFontSize(12);
    doc.setTextColor(primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('👤 DLA KLIENTA', 15, yPos);
    
    // Tło sekcji
    doc.setFillColor(243, 244, 246);
    doc.rect(15, yPos + 2, pageWidth - 30, 18, 'F');
    
    doc.setTextColor(textColor);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    let clientYPos = yPos + 8;
    
    if (clientName) {
      doc.setFont('helvetica', 'bold');
      doc.text(clientName, 20, clientYPos);
      doc.setFont('helvetica', 'normal');
      clientYPos += 4;
    }
    
    if (companyName) {
      doc.text(companyName, 20, clientYPos);
      clientYPos += 4;
    }
    
    // Dane kontaktowe w jednej linii jeśli się mieszczą
    let contactInfo = [];
    if (email) contactInfo.push(`E-mail: ${email}`);
    if (phone) contactInfo.push(`Tel: ${phone}`);
    
    if (contactInfo.length > 0) {
      doc.text(contactInfo.join(' | '), 20, clientYPos);
      clientYPos += 4;
    }
    
    if (address) {
      const addressLines = address.split('\n');
      addressLines.forEach((line, index) => {
        if (line.trim()) {
          doc.text(line.trim(), 20, clientYPos + (index * 3));
        }
      });
      clientYPos += addressLines.length * 3;
    }
    
    yPos = Math.max(yPos + 22, clientYPos + 5);
  }
  
  // === SEKCJA PRODUKTU ===
  
  doc.setFontSize(12);
  doc.setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('🛠 OFEROWANY PRODUKT', 15, yPos);
  
  yPos += 8;
  
  // Ramka produktu z gradientem wizualnym
  doc.setDrawColor(accentColor);
  doc.setFillColor(230, 240, 255);
  doc.rect(15, yPos, pageWidth - 30, 20, 'FD');
  
  // Model produktu - wyśrodkowany i wyróżniony
  doc.setFontSize(14);
  doc.setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text(product.model, pageWidth / 2, yPos + 13, { align: 'center' });
  
  yPos += 28;
  
  // === SPECYFIKACJA TECHNICZNA (kafelkowy układ) ===
  
  doc.setFontSize(11);
  doc.setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('📋 SPECYFIKACJA TECHNICZNA', 15, yPos);
  
  yPos += 6;
  
  // Przygotowanie danych specyfikacji (wybrane pola)
  const specs = [
    { label: 'Numer seryjny', value: product.specs.serialNumber, icon: '#️⃣' },
    { label: 'Rok produkcji', value: product.specs.productionYear, icon: '📅' },
    { label: 'Udźwig (maszt)', value: product.specs.mastLiftingCapacity ? `${product.specs.mastLiftingCapacity} kg` : '', icon: '⚖️' },
    { label: 'Udźwig (wstępny)', value: product.specs.preliminaryLiftingCapacity ? `${product.specs.preliminaryLiftingCapacity} kg` : '', icon: '📊' },
    { label: 'Godziny pracy', value: product.specs.workingHours ? `${product.specs.workingHours} mh` : '', icon: '⏰' },
    { label: 'Wys. podnoszenia', value: product.specs.liftHeight ? `${product.specs.liftHeight} mm` : '', icon: '📏' },
    { label: 'Wys. konstrukcyjna', value: product.specs.minHeight ? `${product.specs.minHeight} mm` : '', icon: '📐' },
    { label: 'Wymiary', value: product.specs.dimensions, icon: '📦' },
    { label: 'Podest operatora', value: product.specs.operatorPlatform, icon: '🧑\u200D💼' }
  ].filter(spec => spec.value && spec.value.trim() !== '');
  
  // Kompaktowa tabela specyfikacji z lepszą stylizacją
  doc.setFontSize(8);
  doc.setTextColor(textColor);
  doc.setFont('helvetica', 'normal');
  
  const tableStartY = yPos;
  const cellHeight = 4.5;
  const col1Width = 75;
  
  specs.forEach((spec, index) => {
    const currentY = tableStartY + (index * cellHeight);
    
    // Przemienne tło dla lepszej czytelności
    if (index % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(15, currentY - 1, pageWidth - 30, cellHeight, 'F');
    }
    
    // Linie tabeli
    doc.setDrawColor(229, 231, 235);
    doc.line(15, currentY - 1, pageWidth - 15, currentY - 1);
    doc.line(90, currentY - 1, 90, currentY + cellHeight - 1);
    
    // Tekst z ikonami
    doc.setFont('helvetica', 'bold');
    doc.text(`${spec.label}:`, 17, currentY + 2.5);
    doc.setFont('helvetica', 'normal');
    doc.text(spec.value, 92, currentY + 2.5);
  });
  
  // Dolna linia tabeli
  doc.line(15, tableStartY + (specs.length * cellHeight) - 1, pageWidth - 15, tableStartY + (specs.length * cellHeight) - 1);
  
  yPos = tableStartY + (specs.length * cellHeight) + 10;
  
  // === SEKCJA CENOWA I WARUNKI (kafelkowy układ) ===
  
  const hasPricing = netPrice || transportPrice;
  const hasBusinessTerms = paymentMethod || leasingAvailable;
  
  if (hasPricing || hasBusinessTerms) {
    doc.setFontSize(12);
    doc.setTextColor(primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('💰 WARUNKI HANDLOWE', 15, yPos);
    
    yPos += 8;
    
    // Kafelkowe tło dla sekcji cenowej
    doc.setDrawColor(orangeAccent);
    doc.setFillColor(255, 251, 235);
    
    let sectionHeight = 8;
    const businessItems = [];
    
    if (netPrice) {
      businessItems.push(`Cena netto: ${formatPrice(netPrice)} PLN`);
      sectionHeight += 5;
    }
    
    if (transportPrice) {
      businessItems.push(`Transport: ${formatPrice(transportPrice)} PLN`);
      sectionHeight += 5;
    }
    
    if (paymentMethod) {
      businessItems.push(`Forma płatności: ${paymentMethod}`);
      sectionHeight += 5;
    }
    
    if (leasingAvailable) {
      businessItems.push('✅ Możliwość leasingu');
      sectionHeight += 5;
    }
    
    businessItems.push(`Ważność oferty: ${formatDate(validUntil)}`);
    sectionHeight += 5;
    
    doc.rect(15, yPos, pageWidth - 30, sectionHeight, 'FD');
    
    doc.setFontSize(10);
    doc.setTextColor(textColor);
    doc.setFont('helvetica', 'normal');
    
    businessItems.forEach((item, index) => {
      if (item.includes('Cena netto') || item.includes('Transport')) {
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }
      doc.text(item, 20, yPos + 6 + (index * 5));
    });
    
    yPos += sectionHeight + 10;
  }
  
  // === UWAGI DODATKOWE (jeśli są) ===
  
  if (additionalNotes && additionalNotes.trim()) {
    doc.setFontSize(11);
    doc.setTextColor(primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('📝 UWAGI DODATKOWE', 15, yPos);
    
    yPos += 6;
    
    doc.setFillColor(245, 245, 245);
    doc.rect(15, yPos, pageWidth - 30, 15, 'F');
    
    doc.setFontSize(9);
    doc.setTextColor(textColor);
    doc.setFont('helvetica', 'normal');
    
    // Podział długiego tekstu na linie
    const noteLines = doc.splitTextToSize(additionalNotes, pageWidth - 40);
    noteLines.forEach((line: string, index: number) => {
      doc.text(line, 20, yPos + 5 + (index * 4));
    });
    
    yPos += 20;
  }
  
  // === STOPKA KONTAKTOWA ===
  
  const footerY = Math.max(yPos + 15, pageHeight - 35);
  
  // Linia nad stopką
  doc.setDrawColor(primaryColor);
  doc.setLineWidth(0.5);
  doc.line(15, footerY - 5, pageWidth - 15, footerY - 5);
  
  // Dwukolumnowa stopka
  doc.setFontSize(10);
  doc.setTextColor(textColor);
  doc.setFont('helvetica', 'normal');
  
  // Lewa strona - zachęta do kontaktu
  doc.text('W razie pytań zapraszam do kontaktu:', 15, footerY + 2);
  doc.text('Jesteśmy do Państwa dyspozycji!', 15, footerY + 7);
  
  // Prawa strona - dane kontaktowe
  doc.setFont('helvetica', 'bold');
  doc.text('Michał Seweryn', pageWidth - 15, footerY + 2, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text('+48 694 133 592', pageWidth - 15, footerY + 7, { align: 'right' });
  doc.text('info@stakerpol.pl', pageWidth - 15, footerY + 12, { align: 'right' });
  
  // Mała stopka z URL
  doc.setFontSize(8);
  doc.setTextColor('#888888');
  doc.text('www.stakerpol.pl', pageWidth / 2, footerY + 18, { align: 'center' });
  
  // Zapisanie i pobranie pliku
  const fileName = `Oferta_${quoteNumber.replace('/', '_')}_${product.model.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(fileName);
};
