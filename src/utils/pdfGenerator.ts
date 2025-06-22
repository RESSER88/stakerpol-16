
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
  const { product, netPrice, transportPrice, clientName, companyName, email, phone, address } = data;
  
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
  
  // === NAGŁÓWEK (kompaktowy) ===
  
  // Data w prawym górnym rogu
  doc.setFontSize(9);
  doc.setTextColor(textColor);
  doc.text(`Data: ${formatDate(today)}`, pageWidth - 15, 15, { align: 'right' });
  
  // Tytuł oferty - wyśrodkowany
  doc.setFontSize(16);
  doc.setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text(`OFERTA ${quoteNumber}`, pageWidth / 2, 25, { align: 'center' });
  
  // Linia pod tytułem
  doc.setDrawColor(accentColor);
  doc.setLineWidth(1.5);
  doc.line(15, 32, pageWidth - 15, 32);
  
  // === DANE KLIENTA (tylko wypełnione pola) ===
  
  let yPos = 45;
  
  // Sprawdź czy są jakiekolwiek dane klienta
  const hasClientData = clientName || companyName || email || phone || address;
  
  if (hasClientData) {
    doc.setFontSize(11);
    doc.setTextColor(primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Dla:', 15, yPos);
    
    doc.setTextColor(textColor);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    let clientYPos = yPos;
    
    if (clientName) {
      doc.text(clientName, 25, clientYPos);
      clientYPos += 4;
    }
    
    if (companyName) {
      doc.text(companyName, 25, clientYPos);
      clientYPos += 4;
    }
    
    if (email) {
      doc.text(`E-mail: ${email}`, 25, clientYPos);
      clientYPos += 4;
    }
    
    if (phone) {
      doc.text(`Tel: ${phone}`, 25, clientYPos);
      clientYPos += 4;
    }
    
    if (address) {
      const addressLines = address.split('\n');
      addressLines.forEach((line, index) => {
        if (line.trim()) {
          doc.text(line.trim(), 25, clientYPos + (index * 4));
        }
      });
      clientYPos += addressLines.length * 4;
    }
    
    yPos = clientYPos + 8;
  }
  
  // Od: (kompaktowe)
  doc.setFontSize(11);
  doc.setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('Od:', 15, yPos);
  
  doc.setTextColor(textColor);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  const companyInfo = [
    'FHU Stakerpol, ul. Szewska 6, 32-043 Skała',
    'E-mail: info@stakerpol.pl, Tel. +48 694 133 592',
    'www.stakerpol.pl'
  ];
  
  companyInfo.forEach((info, index) => {
    doc.text(info, 25, yPos + 4 + (index * 4));
  });
  
  yPos += 20;
  
  // === PRODUKT (kompaktowy) ===
  
  doc.setFontSize(12);
  doc.setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('OFEROWANY PRODUKT', 15, yPos);
  
  yPos += 8;
  
  // Ramka dla produktu - mniejsza
  doc.setDrawColor(primaryColor);
  doc.setFillColor(lightGray);
  doc.rect(15, yPos, pageWidth - 30, 20, 'FD');
  
  // Model produktu - wyśrodkowany
  doc.setFontSize(14);
  doc.setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text(product.model, pageWidth / 2, yPos + 13, { align: 'center' });
  
  yPos += 28;
  
  // === SPECYFIKACJA TECHNICZNA (kompaktowa tabela) ===
  
  doc.setFontSize(11);
  doc.setTextColor(primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('SPECYFIKACJA TECHNICZNA:', 15, yPos);
  
  yPos += 6;
  
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
  
  // Kompaktowa tabela specyfikacji
  doc.setFontSize(8);
  doc.setTextColor(textColor);
  doc.setFont('helvetica', 'normal');
  
  const tableStartY = yPos;
  const cellHeight = 4;
  const col1Width = 70;
  
  specs.forEach((spec, index) => {
    const currentY = tableStartY + (index * cellHeight);
    
    // Tło dla parzystych wierszy
    if (index % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(15, currentY - 1, pageWidth - 30, cellHeight, 'F');
    }
    
    // Linie tabeli
    doc.setDrawColor(229, 231, 235);
    doc.line(15, currentY - 1, pageWidth - 15, currentY - 1);
    doc.line(85, currentY - 1, 85, currentY + cellHeight - 1);
    
    // Tekst
    doc.setFont('helvetica', 'bold');
    doc.text(spec.label + ':', 17, currentY + 2);
    doc.setFont('helvetica', 'normal');
    doc.text(spec.value, 87, currentY + 2);
  });
  
  // Dolna linia tabeli
  doc.line(15, tableStartY + (specs.length * cellHeight) - 1, pageWidth - 15, tableStartY + (specs.length * cellHeight) - 1);
  
  yPos = tableStartY + (specs.length * cellHeight) + 10;
  
  // === PODSUMOWANIE FINANSOWE (tylko jeśli są ceny) ===
  
  if (netPrice || transportPrice) {
    doc.setFontSize(12);
    doc.setTextColor(primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('PODSUMOWANIE', 15, yPos);
    
    yPos += 8;
    
    // Ramka dla podsumowania - mniejsza
    doc.setDrawColor(accentColor);
    doc.setFillColor(255, 251, 235);
    
    let summaryHeight = 8; // Podstawowa wysokość
    const summaryItems = [];
    
    if (netPrice) {
      summaryItems.push(`Cena netto: ${formatPrice(netPrice)} PLN`);
      summaryHeight += 5;
    }
    
    if (transportPrice) {
      summaryItems.push(`Cena transportu: ${formatPrice(transportPrice)} PLN`);
      summaryHeight += 5;
    }
    
    summaryItems.push(`Termin płatności: przedpłata 100% przed wysyłką / możliwy leasing`);
    summaryItems.push(`Oferta ważna do: ${formatDate(validUntil)}`);
    summaryHeight += 10;
    
    doc.rect(15, yPos, pageWidth - 30, summaryHeight, 'FD');
    
    doc.setFontSize(10);
    doc.setTextColor(textColor);
    doc.setFont('helvetica', 'normal');
    
    summaryItems.forEach((item, index) => {
      doc.text(item, 20, yPos + 6 + (index * 5));
    });
    
    yPos += summaryHeight + 10;
  } else {
    // Jeśli brak cen, dodaj podstawowe informacje
    doc.setFontSize(12);
    doc.setTextColor(primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACJE', 15, yPos);
    
    yPos += 8;
    
    doc.setDrawColor(accentColor);
    doc.setFillColor(255, 251, 235);
    doc.rect(15, yPos, pageWidth - 30, 15, 'FD');
    
    doc.setFontSize(10);
    doc.setTextColor(textColor);
    doc.setFont('helvetica', 'normal');
    
    const basicInfo = [
      `Termin płatności: przedpłata 100% przed wysyłką / możliwy leasing`,
      `Oferta ważna do: ${formatDate(validUntil)}`
    ];
    
    basicInfo.forEach((info, index) => {
      doc.text(info, 20, yPos + 6 + (index * 5));
    });
    
    yPos += 20;
  }
  
  // === STOPKA (kompaktowa) ===
  
  const footerY = Math.max(yPos + 15, pageHeight - 25);
  
  // Linia nad stopką
  doc.setDrawColor(primaryColor);
  doc.setLineWidth(0.5);
  doc.line(15, footerY - 5, pageWidth - 15, footerY - 5);
  
  doc.setFontSize(9);
  doc.setTextColor(textColor);
  doc.setFont('helvetica', 'normal');
  
  const footerText = [
    'W razie pytań zapraszam do kontaktu.',
    'Z poważaniem, Michał Seweryn'
  ];
  
  footerText.forEach((text, index) => {
    doc.text(text, pageWidth / 2, footerY + (index * 4), { align: 'center' });
  });
  
  // Zapisanie i pobranie pliku
  const fileName = `Oferta_${quoteNumber.replace('/', '_')}_${product.model.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(fileName);
};
