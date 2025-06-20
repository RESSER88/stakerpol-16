
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, HardDrive, ArrowRightLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProductStoreConfig } from '@/stores/productStoreWithSupabase';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';

const SupabaseToggle = () => {
  const { toast } = useToast();
  const { useSupabase, setUseSupabase } = useProductStoreConfig();
  const { products: supabaseProducts, isLoading } = useSupabaseProducts();
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setIsToggling(true);
    
    try {
      if (checked) {
        // Przełączanie na Supabase
        console.log('Switching to Supabase storage');
        setUseSupabase(true);
        toast({
          title: "Przełączono na Supabase",
          description: "Aplikacja używa teraz bazy danych Supabase"
        });
      } else {
        // Przełączanie na lokalny store
        console.log('Switching to local storage');
        setUseSupabase(false);
        toast({
          title: "Przełączono na lokalny store",
          description: "Aplikacja używa teraz lokalnego przechowywania danych"
        });
      }
    } catch (error) {
      console.error('Error toggling storage:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się przełączyć sposobu przechowywania danych",
        variant: "destructive"
      });
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5" />
          Źródło danych
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {useSupabase ? (
              <Database className="h-5 w-5 text-green-600" />
            ) : (
              <HardDrive className="h-5 w-5 text-blue-600" />
            )}
            <div>
              <p className="font-medium">
                {useSupabase ? 'Baza danych Supabase' : 'Lokalny store (Zustand)'}
              </p>
              <p className="text-sm text-muted-foreground">
                {useSupabase 
                  ? `Produkty w bazie: ${isLoading ? 'Ładowanie...' : supabaseProducts.length}`
                  : 'Dane przechowywane lokalnie w przeglądarce'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Switch
              checked={useSupabase}
              onCheckedChange={handleToggle}
              disabled={isToggling}
            />
            <div className="text-sm text-muted-foreground min-w-[100px]">
              {useSupabase ? 'Supabase' : 'Lokalny'}
            </div>
          </div>
        </div>
        
        {useSupabase && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              <strong>Uwaga:</strong> Obecnie baza danych Supabase ma ograniczony dostęp (RLS). 
              Aby w pełni korzystać z funkcji, skonfiguruj uwierzytelnianie i polityki dostępu.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SupabaseToggle;
