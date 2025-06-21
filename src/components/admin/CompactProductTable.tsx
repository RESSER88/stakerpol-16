
import { useState } from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Edit, Copy, Trash2, Search } from 'lucide-react';
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

      {/* Lista produktów */}
      <div className="space-y-3">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'Nie znaleziono produktów odpowiadających wyszukiwaniu' : 'Brak produktów do wyświetlenia'}
          </div>
        ) : (
          filteredProducts.map((product) => (
            <Card key={product.id} className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  {/* Lewa sekcja - podstawowe informacje */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4">
                      {/* Miniaturka */}
                      <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        {product.image || (product.images && product.images[0]) ? (
                          <img
                            src={product.image || product.images[0]}
                            alt={product.model}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            Brak zdjęcia
                          </div>
                        )}
                      </div>
                      
                      {/* Informacje podstawowe */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-stakerpol-navy truncate">
                          {product.model}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {product.shortDescription}
                        </p>
                        <div className="flex gap-4 text-xs text-gray-500 mt-1">
                          <span>Nr: {product.specs.serialNumber || 'Brak'}</span>
                          <span>Rok: {product.specs.productionYear || 'Brak'}</span>
                          <span>Stan: {product.specs.condition || 'Brak'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Prawa sekcja - akcje */}
                  <div className="flex items-center gap-2 ml-4">
                    <PDFQuoteGenerator product={product} />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleExpanded(product.id)}
                      className="text-gray-600"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(product)}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCopy(product)}
                      className="text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(product)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Rozszerzone szczegóły */}
                {expandedProduct === product.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Data utworzenia:</span>
                        <span className="ml-2 text-gray-600">{formatDate(product.createdAt)}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Ostatnia modyfikacja:</span>
                        <span className="ml-2 text-gray-600">{formatDate(product.updatedAt)}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Udźwig maszt:</span>
                        <span className="ml-2 text-gray-600">{product.specs.mastLiftingCapacity || 'Brak'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Godziny pracy:</span>
                        <span className="ml-2 text-gray-600">{product.specs.workingHours || 'Brak'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Wysokość podnoszenia:</span>
                        <span className="ml-2 text-gray-600">{product.specs.liftHeight || 'Brak'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Bateria:</span>
                        <span className="ml-2 text-gray-600">{product.specs.battery || 'Brak'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Podsumowanie */}
      <div className="text-sm text-gray-600 text-center py-2">
        Wyświetlono {filteredProducts.length} z {products.length} produktów
      </div>
    </div>
  );
};

export default CompactProductTable;
