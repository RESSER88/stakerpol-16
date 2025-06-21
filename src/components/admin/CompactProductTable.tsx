
import { useState } from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Edit, Copy, Trash2, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import PDFQuoteGenerator from './PDFQuoteGenerator';

interface CompactProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onCopy: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const CompactProductTable = ({ products, onEdit, onCopy, onDelete }: CompactProductTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  const filteredProducts = products.filter(product =>
    product.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.specs.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpanded = (productId: string) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL');
  };

  return (
    <div className="space-y-4">
      {/* Pasek wyszukiwania */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Szukaj produktów..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Lista produktów - zoptymalizowana pod mobile */}
      <div className="space-y-3">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'Nie znaleziono produktów odpowiadających wyszukiwaniu' : 'Brak produktów do wyświetlenia'}
          </div>
        ) : (
          filteredProducts.map((product) => (
            <Card key={product.id} className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4">
                {/* Mobile-first layout */}
                <div className="space-y-3">
                  {/* Sekcja główna - zawsze widoczna */}
                  <div className="flex items-start gap-3">
                    {/* Miniaturka - mniejsza na mobile */}
                    <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      {product.image || (product.images && product.images[0]) ? (
                        <img
                          src={product.image || product.images[0]}
                          alt={product.model}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          Brak
                        </div>
                      )}
                    </div>
                    
                    {/* Informacje podstawowe */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-stakerpol-navy text-sm sm:text-base line-clamp-2">
                        {product.model}
                      </h3>
                      
                      {/* Mobile: skrócony opis, Desktop: pełny opis */}
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-1 sm:line-clamp-2 mt-1">
                        {product.shortDescription}
                      </p>
                      
                      {/* Kluczowe informacje - zawsze widoczne */}
                      <div className="flex flex-wrap gap-2 sm:gap-4 text-xs text-gray-500 mt-2">
                        <span className="truncate">Nr: {product.specs.serialNumber || 'Brak'}</span>
                        <span>Rok: {product.specs.productionYear || 'Brak'}</span>
                        <span className="hidden sm:inline">Stan: {product.specs.condition || 'Brak'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Akcje - responsywne */}
                  <div className="flex items-center justify-between gap-2">
                    {/* Przyciski akcji - mniejsze na mobile */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      <PDFQuoteGenerator product={product} />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleExpanded(product.id)}
                        className="text-gray-600 px-2 sm:px-3"
                        title="Pokaż szczegóły"
                      >
                        {expandedProduct === product.id ? (
                          <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
                        ) : (
                          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(product)}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50 px-2 sm:px-3"
                        title="Edytuj"
                      >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onCopy(product)}
                        className="text-green-600 border-green-200 hover:bg-green-50 px-2 sm:px-3"
                        title="Kopiuj"
                      >
                        <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(product)}
                        className="text-red-600 border-red-200 hover:bg-red-50 px-2 sm:px-3"
                        title="Usuń"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Rozszerzone szczegóły - responsywne */}
                  {expandedProduct === product.id && (
                    <div className="pt-3 border-t border-gray-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center">
                          <span className="font-medium text-gray-700">Data utworzenia:</span>
                          <span className="sm:ml-2 text-gray-600">{formatDate(product.createdAt)}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center">
                          <span className="font-medium text-gray-700">Ostatnia modyfikacja:</span>
                          <span className="sm:ml-2 text-gray-600">{formatDate(product.updatedAt)}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center">
                          <span className="font-medium text-gray-700">Udźwig maszt:</span>
                          <span className="sm:ml-2 text-gray-600">{product.specs.mastLiftingCapacity || 'Brak'}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center">
                          <span className="font-medium text-gray-700">Godziny pracy:</span>
                          <span className="sm:ml-2 text-gray-600">{product.specs.workingHours || 'Brak'}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center">
                          <span className="font-medium text-gray-700">Wysokość podnoszenia:</span>
                          <span className="sm:ml-2 text-gray-600">{product.specs.liftHeight || 'Brak'}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center">
                          <span className="font-medium text-gray-700">Bateria:</span>
                          <span className="sm:ml-2 text-gray-600">{product.specs.battery || 'Brak'}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:col-span-2 lg:col-span-1">
                          <span className="font-medium text-gray-700">Stan:</span>
                          <span className="sm:ml-2 text-gray-600">{product.specs.condition || 'Brak'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Podsumowanie - lepsze na mobile */}
      <div className="text-xs sm:text-sm text-gray-600 text-center py-2 bg-gray-50 rounded-lg">
        Wyświetlono {filteredProducts.length} z {products.length} produktów
      </div>
    </div>
  );
};

export default CompactProductTable;
