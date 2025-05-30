
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';

export const useProductFormValidation = (products: Product[]) => {
  const { toast } = useToast();

  const checkSerialNumberUnique = (serialNumber: string, currentProductId?: string): boolean => {
    if (!serialNumber.trim()) return true;
    
    return !products.some(product => 
      product.specs.serialNumber?.toLowerCase() === serialNumber.toLowerCase() &&
      product.id !== currentProductId
    );
  };

  const validateProduct = (product: Product, images: string[], selectedProductId?: string): boolean => {
    if (!product.model.trim()) {
      toast({
        title: "Błąd walidacji",
        description: "Model produktu jest wymagany",
        variant: "destructive"
      });
      return false;
    }

    if (images.length === 0) {
      toast({
        title: "Błąd walidacji", 
        description: "Dodaj przynajmniej jedno zdjęcie produktu",
        variant: "destructive"
      });
      return false;
    }

    const serialNumber = product.specs.serialNumber?.trim();
    if (serialNumber && !checkSerialNumberUnique(serialNumber, selectedProductId)) {
      toast({
        title: "Błąd walidacji",
        description: `Numer seryjny "${serialNumber}" już istnieje w bazie danych`,
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  return {
    validateProduct,
    checkSerialNumberUnique
  };
};
