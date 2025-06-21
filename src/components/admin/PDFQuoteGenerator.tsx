
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowUp } from 'lucide-react';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { generatePDFQuote } from '@/utils/pdfGenerator';

interface PDFQuoteGeneratorProps {
  product: Product;
}

const PDFQuoteGenerator = ({ product }: PDFQuoteGeneratorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [netPrice, setNetPrice] = useState('');
  const [transportPrice, setTransportPrice] = useState('');
  const [clientName, setClientName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    // Walidacja pól
    if (!netPrice || !transportPrice || !clientName) {
      toast({
        title: "Błąd walidacji",
        description: "Wszystkie pola są wymagane",
        variant: "destructive"
      });
      return;
    }

    if (isNaN(Number(netPrice)) || isNaN(Number(transportPrice))) {
      toast({
        title: "Błąd walidacji",
        description: "Ceny muszą być liczbami",
        variant: "destructive"
      });
      return;
    }

    if (Number(netPrice) <= 0 || Number(transportPrice) < 0) {
      toast({
        title: "Błąd walidacji",
        description: "Cena netto musi być większa od 0, cena transportu nie może być ujemna",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      await generatePDFQuote({
        product,
        netPrice: Number(netPrice),
        transportPrice: Number(transportPrice),
        clientName: clientName.trim()
      });

      toast({
        title: "Sukces!",
        description: "Oferta PDF została wygenerowana i pobrana",
      });

      // Reset formularza i zamknij dialog
      setNetPrice('');
      setTransportPrice('');
      setClientName('');
      setIsOpen(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Błąd generowania PDF",
        description: "Nie udało się wygenerować oferty PDF",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-blue-600 border-blue-200 hover:bg-blue-50"
          title="Wygeneruj ofertę PDF"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-stakerpol-navy">
            Generuj ofertę PDF - {product.model}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="netPrice">Cena netto (PLN) *</Label>
            <Input
              id="netPrice"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="np. 25000.00"
              value={netPrice}
              onChange={(e) => setNetPrice(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="transportPrice">Cena transportu (PLN) *</Label>
            <Input
              id="transportPrice"
              type="number"
              step="0.01"
              min="0"
              placeholder="np. 500.00"
              value={transportPrice}
              onChange={(e) => setTransportPrice(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientName">Klient *</Label>
            <Input
              id="clientName"
              type="text"
              placeholder="Imię i nazwisko lub nazwa firmy"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isGenerating}
            >
              Anuluj
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="cta-button"
            >
              {isGenerating ? 'Generowanie...' : 'Wygeneruj PDF'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PDFQuoteGenerator;
