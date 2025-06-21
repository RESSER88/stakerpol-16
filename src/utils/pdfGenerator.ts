import jsPDF from 'jspdf';
import { Product } from '@/types';

interface QuoteData {
  product: Product;
  netPrice: number;
  transportPrice: number;
  clientName: string;
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
  const { product, netPrice, transportPrice, clientName } = data;
  
  // Tworzenie dokumentu PDF
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Kolory zgodne z identyfikacją wizualną
  const primaryColor = '#1e3a8a'; // stakerpol-navy
  const accentColor = '#f97316'; // stakerpol-orange
  const textColor = '#374151'; // gray-700
  const lightGray = '#f3f4f6'; // gray-100
  
  // Daty
  const today = new Date();
  const validUntil = new Date();
  validUntil.setDate(today.getDate() + 30);
  
  const quoteNumber = getNextQuoteNumber();
  
  // === NAGŁÓWEK ===
  
  // Data w prawym górnym rogu
  doc.setFontSize(10);
  doc.setTextColor(textColor);
  doc.text(`Data: ${formatDate(today)}`, pageWidth - 20, 20, { align: 'right' });
  
  // Tytuł oferty - wyśrodkowany
  doc.setFontSize(18);
  doc.setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text(`OFERTA ${quoteNumber}`, pageWidth / 2, 35, { align: 'center' });
  
  // Linia pod tytułem
  doc.setDrawColor(accentColor);
  doc.setLineWidth(2);
  doc.line(20, 45, pageWidth - 20, 45);
  
  // === DANE OGÓLNE ===
  
  let yPos = 60;
  
  // Dla:
  doc.setFontSize(12);
  doc.setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('Dla:', 20, yPos);
  
  doc.setTextColor(textColor);
  doc.setFont('helvetica', 'normal');
  doc.text(clientName, 35, yPos);
  
  yPos += 15;
  
  // Od:
  doc.setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('Od:', 20, yPos);
  
  doc.setTextColor(textColor);
  doc.setFont('helvetica', 'normal');
  const companyInfo = [
    'FHU Stakerpol',
    '32-043 Skała',
    'ul. Szewska 6',
    'E-mail: info@stakerpol.pl',
    'Tel. +48 694 133 592',
    'www.stakerpol.pl'
  ];
  
  companyInfo.forEach((info, index) => {
    doc.text(info, 35, yPos + (index * 5));
  });
  
  yPos += 45;
  
  // === SEKCJA GŁÓWNA - PRODUKT ===
  
  // Nagłówek sekcji produktu
  doc.setFontSize(14);
  doc.setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('OFEROWANY PRODUKT', 20, yPos);
  
  yPos += 15;
  
  // Ramka dla produktu - tylko model bez opisu
  doc.setDrawColor(lightGray);
  doc.setFillColor(lightGray);
  doc.rect(20, yPos, pageWidth - 40, 40, 'F');
  doc.setDrawColor(primaryColor);
  doc.rect(20, yPos, pageWidth - 40, 40);
  
  // Model produktu - wyśrodkowany
  doc.setFontSize(16);
  doc.setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text(product.model, pageWidth / 2, yPos + 25, { align: 'center' });
  
  yPos += 50;
  
  // === SPECYFIKACJA TECHNICZNA ===
  
  doc.setFontSize(12);
  doc.setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('SPECYFIKACJA TECHNICZNA:', 20, yPos);
  
  yPos += 10;
  
  // Przygotowanie danych specyfikacji - tylko określone pola
  const specs = [
    { label: 'Model', value: product.model },
    { label: 'Numer seryjny', value: product.specs.serialNumber },
    { label: 'Rok produkcji', value: product.specs.productionYear },
    { label: 'Udźwig przy podnoszeniu masztu [kg]', value: product.specs.mastLiftingCapacity },
    { label: 'Udźwig przy podnoszeniu wstępnym [kg]', value: product.specs.preliminaryLiftingCapacity },
    { label: 'Godziny pracy [mh]', value: product.specs.workingHours },
    { label: 'Wysokość podnoszenia [mm]', value: product.specs.liftHeight },
    { label: 'Wysokość konstrukcyjna [mm]', value: product.specs.minHeight },
    { label: 'Wstępne podnoszenie', value: product.specs.preliminaryLifting },
    { label: 'Wymiary (długość / szerokość) [mm]', value: product.specs.dimensions },
    { label: 'Składany podest dla operatora', value: product.specs.operatorPlatform }
  ].filter(spec => spec.value && spec.value.trim() !== '');
  
  // Tabela specyfikacji
  doc.setFontSize(9);
  doc.setTextColor(textColor);
  doc.setFont('helvetica', 'normal');
  
  const tableStartY = yPos;
  const cellHeight = 6;
  const col1Width = 80;
  const col2Width = pageWidth - 60 - col1Width;
  
  specs.forEach((spec, index) => {
    const currentY = tableStartY + (index * cellHeight);
    
    // Tło dla parzystych wierszy
    if (index % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(20, currentY - 2, pageWidth - 40, cellHeight, 'F');
    }
    
    // Linie tabeli
    doc.setDrawColor(229, 231, 235);
    doc.line(20, currentY - 2, pageWidth - 20, currentY - 2);
    doc.line(20, currentY + cellHeight - 2, pageWidth - 20, currentY + cellHeight - 2);
    doc.line(20, currentY - 2, 20, currentY + cellHeight - 2);
    doc.line(100, currentY - 2, 100, currentY + cellHeight - 2);
    doc.line(pageWidth - 20, currentY - 2, pageWidth - 20, currentY + cellHeight - 2);
    
    // Tekst
    doc.setFont('helvetica', 'bold');
    doc.text(spec.label + ':', 22, currentY + 2);
    doc.setFont('helvetica', 'normal');
    doc.text(spec.value, 102, currentY + 2);
  });
  
  yPos = tableStartY + (specs.length * cellHeight) + 15;
  
  // === PODSUMOWANIE FINANSOWE ===
  
  doc.setFontSize(14);
  doc.setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('PODSUMOWANIE', 20, yPos);
  
  yPos += 15;
  
  // Ramka dla podsumowania
  doc.setDrawColor(accentColor);
  doc.setFillColor(255, 251, 235);
  doc.rect(20, yPos, pageWidth - 40, 50, 'FD');
  
  doc.setFontSize(11);
  doc.setTextColor(textColor);
  doc.setFont('helvetica', 'normal');
  
  const summaryItems = [
    `Cena netto: ${formatPrice(netPrice)} PLN`,
    `Cena transportu: ${formatPrice(transportPrice)} PLN`,
    `Termin płatności: przedpłata 100% przed wysyłką / możliwy leasing`,
    `Oferta ważna do: ${formatDate(validUntil)}`
  ];
  
  summaryItems.forEach((item, index) => {
    doc.text(item, 25, yPos + 10 + (index * 8));
  });
  
  // === STOPKA ===
  
  const footerY = pageHeight - 40;
  
  // Linia nad stopką
  doc.setDrawColor(primaryColor);
  doc.setLineWidth(1);
  doc.line(20, footerY - 10, pageWidth - 20, footerY - 10);
  
  doc.setFontSize(10);
  doc.setTextColor(textColor);
  doc.setFont('helvetica', 'normal');
  
  const footerText = [
    'W razie pytań zapraszam do kontaktu.',
    'Z poważaniem,',
    'Michał Seweryn'
  ];
  
  footerText.forEach((text, index) => {
    doc.text(text, pageWidth / 2, footerY + (index * 5), { align: 'center' });
  });
  
  // Zapisanie i pobranie pliku
  const fileName = `Oferta_${quoteNumber.replace('/', '_')}_${product.model.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(fileName);
};
