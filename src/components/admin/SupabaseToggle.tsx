
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, HardDrive, ArrowRightLeft, Upload, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProductStoreConfig } from '@/stores/productStoreWithSupabase';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';
import { useProductStore } from '@/stores/productStore';
import { useDataMigration } from '@/hooks/useDataMigration';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const SupabaseToggle = () => {
  const { toast } = useToast();
  const { useSupabase, setUseSupabase } = useProductStoreConfig();
  const { products: supabaseProducts, isLoading } = useSupabaseProducts();
  const { products: localProducts } = useProductStore();
  const { isMigrating, migrateToSupabase } = useDataMigration();
  const { isAdmin } = useSupabaseAuth();
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async (checked: boolean) => {
    if (!isAdmin) {
      toast({
        title: "Brak uprawnień",
        description: "Tylko administratorzy mogą przełączać źródła danych",
        variant: "destructive"
      });
      return;
    }

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

  const handleMigrateToSupabase = async () => {
    if (!isAdmin) {
      toast({
        title: "Brak uprawnień",
        description: "Tylko administratorzy mogą wykonywać migrację",
        variant: "destructive"
      });
      return;
    }

    await migrateToSupabase();
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
        <div className="flex items-center justify-between mb-4">
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
                  : `Produkty lokalnie: ${localProducts.length}`
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Switch
              checked={useSupabase}
              onCheckedChange={handleToggle}
              disabled={isToggling || !isAdmin}
            />
            <div className="text-sm text-muted-foreground min-w-[100px]">
              {useSupabase ? 'Supabase' : 'Lokalny'}
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Migracja danych</h4>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleMigrateToSupabase}
                disabled={isMigrating || localProducts.length === 0}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Upload className="mr-2 h-4 w-4" />
                {isMigrating ? 'Migracja...' : `Przenieś do Supabase (${localProducts.length})`}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Migracja przeniesie wszystkie produkty i zdjęcia z lokalnego store do Supabase
            </p>
          </div>
        )}
        
        {useSupabase && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              <strong>✓ Supabase aktywny:</strong> Dane są przechowywane w chmurze z pełnym uwierzytelnianiem i zabezpieczeniami RLS.
            </p>
          </div>
        )}

        {!isAdmin && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Uwaga:</strong> Tylko administratorzy mogą przełączać źródła danych i wykonywać migrację.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SupabaseToggle;
