
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileImage, Search, Copy, Pencil, Trash2 } from 'lucide-react';
import { Product } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/utils/translations';
import { useToast } from '@/hooks/use-toast';
import { measurePerformance } from '@/utils/performance';

interface CompactProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onCopy: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const CompactProductTable = ({ products, onEdit, onCopy, onDelete }: CompactProductTableProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = useTranslation(language);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    
    return products.filter(product =>
      product.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.specs.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.specs.productionYear?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleModelClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const exportToPDF = () => {
    const printContent = generatePrintableTable();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
      
      toast({
        title: t('exportCompleted'),
        description: t('printSavePdf')
      });
    }
  };

  const exportToJPG = async () => {
    try {
      measurePerformance.markStart('jpg-export');
      
      // Lazy load html2canvas
      const html2canvas = await measurePerformance.loadHtml2Canvas();
      
      if (!html2canvas) {
        toast({
          title: t('exportError'),
          description: t('exportLibraryNotAvailable'),
          variant: "destructive"
        });
        return;
      }

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = generateExportTable();
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.padding = '40px';
      tempDiv.style.width = '1200px';
      document.body.appendChild(tempDiv);

      const canvas = await html2canvas(tempDiv, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false
      });

      document.body.removeChild(tempDiv);

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `stakerpol-produkty-${new Date().toISOString().split('T')[0]}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          measurePerformance.markEnd('jpg-export');
          
          toast({
            title: t('exportCompleted'),
            description: t('jpgFileDownloaded')
          });
        }
      }, 'image/jpeg', 0.95);
    } catch (error) {
      console.error('Export to JPG failed:', error);
      toast({
        title: t('exportError'),
        description: t('jpgExportFailed'),
        variant: "destructive"
      });
    }
  };

  const generateExportTable = () => {
    const currentDate = new Date().toLocaleDateString('pl-PL');
    const contactInfo = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #1e40af;">
        <div style="flex: 1;">
          <h1 style="color: #1e40af; margin: 0 0 8px 0; font-size: 24px; font-weight: bold;">FHU Stakerpol</h1>
          <p style="margin: 4px 0; font-size: 12px; color: #374151;"><strong>Michał Seweryn</strong></p>
          <p style="margin: 4px 0; font-size: 12px; color: #374151;">32-043 Skała</p>
          <p style="margin: 4px 0; font-size: 12px; color: #374151;">ul. Szewska 6</p>
          <p style="margin: 4px 0; font-size: 12px; color: #374151;"><strong>NIP:</strong> PL6492111954</p>
          <p style="margin: 4px 0; font-size: 12px; color: #374151;"><strong>Tel:</strong> +48 694 133 592</p>
          <p style="margin: 4px 0; font-size: 12px; color: #374151;"><strong>E-mail:</strong> info@stakerpol.pl</p>
        </div>
        <div style="text-align: right;">
          <p style="margin: 0; color: #6b7280; font-size: 12px;">${t('exportDate')}: ${currentDate}</p>
          <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 12px;">${t('totalProducts')}: ${filteredProducts.length}</p>
        </div>
      </div>
    `;

    return `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: white; color: #111827; max-width: 1200px; margin: 0 auto;">
        ${contactInfo}
        
        <h2 style="color: #1e40af; margin: 0 0 20px 0; font-size: 18px;">${t('inventoryStatement')}</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <thead>
            <tr style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white;">
              <th style="padding: 10px 6px; text-align: left; font-weight: 600; font-size: 12px; border-right: 1px solid rgba(255,255,255,0.3);">${t('model')}</th>
              <th style="padding: 10px 6px; text-align: left; font-weight: 600; font-size: 12px; border-right: 1px solid rgba(255,255,255,0.3);">${t('serialNumber')}</th>
              <th style="padding: 10px 6px; text-align: left; font-weight: 600; font-size: 12px; border-right: 1px solid rgba(255,255,255,0.3);">${t('productionYear')}</th>
              <th style="padding: 10px 6px; text-align: left; font-weight: 600; font-size: 12px; border-right: 1px solid rgba(255,255,255,0.3);">${t('liftHeight')}</th>
              <th style="padding: 10px 6px; text-align: left; font-weight: 600; font-size: 12px; border-right: 1px solid rgba(255,255,255,0.3);">${t('workingHours')}</th>
              <th style="padding: 10px 6px; text-align: left; font-weight: 600; font-size: 12px; border-right: 1px solid rgba(255,255,255,0.3);">${t('battery')}</th>
              <th style="padding: 10px 6px; text-align: left; font-weight: 600; font-size: 12px;">${t('operatorPlatform')}</th>
            </tr>
          </thead>
          <tbody>
            ${filteredProducts.map((product, index) => `
              <tr style="background: ${index % 2 === 0 ? '#f8fafc' : 'white'}; border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 6px; font-weight: 500; color: #1e40af; border-right: 1px solid #e5e7eb; font-size: 11px;">${product.model}</td>
                <td style="padding: 8px 6px; color: #374151; border-right: 1px solid #e5e7eb; font-size: 11px;">${product.specs.serialNumber || '-'}</td>
                <td style="padding: 8px 6px; color: #374151; border-right: 1px solid #e5e7eb; font-size: 11px;">${product.specs.productionYear || '-'}</td>
                <td style="padding: 8px 6px; color: #374151; border-right: 1px solid #e5e7eb; font-size: 11px;">${product.specs.liftHeight || '-'}</td>
                <td style="padding: 8px 6px; color: #374151; border-right: 1px solid #e5e7eb; font-size: 11px;">${product.specs.workingHours || '-'}</td>
                <td style="padding: 8px 6px; color: #374151; border-right: 1px solid #e5e7eb; font-size: 11px;">${product.specs.battery || '-'}</td>
                <td style="padding: 8px 6px; color: #374151; font-size: 11px;">${product.specs.operatorPlatform || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  };

  const generatePrintableTable = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${t('inventoryStatement')}</title>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 20px; background: white; }
          @media print {
            body { margin: 0; padding: 15px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        ${generateExportTable()}
      </body>
      </html>
    `;
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-lg">{t('compactTableView')}</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t('filterProducts')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full sm:w-64"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportToPDF}
                className="flex-1 sm:flex-initial"
              >
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToJPG}
                className="flex-1 sm:flex-initial"
              >
                <FileImage className="mr-2 h-4 w-4" />
                JPG
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">{t('model')}</TableHead>
              <TableHead className="hidden sm:table-cell w-[120px]">{t('serialNumber')}</TableHead>
              <TableHead className="hidden md:table-cell w-[100px]">{t('productionYear')}</TableHead>
              <TableHead className="hidden lg:table-cell w-[120px]">{t('liftHeight')}</TableHead>
              <TableHead className="hidden xl:table-cell w-[100px]">{t('workingHours')}</TableHead>
              <TableHead className="hidden xl:table-cell w-[100px]">{t('battery')}</TableHead>
              <TableHead className="hidden 2xl:table-cell w-[140px]">{t('operatorPlatform')}</TableHead>
              <TableHead className="text-right w-[120px]">Akcje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? t('noMatchingProducts') : t('noProducts')}
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="space-y-1">
                      <Button
                        variant="link"
                        className="p-0 h-auto font-medium text-left justify-start hover:text-stakerpol-orange"
                        onClick={() => handleModelClick(product.id)}
                      >
                        {product.model}
                      </Button>
                      <div className="text-xs text-muted-foreground sm:hidden">
                        {product.specs.serialNumber && `S/N: ${product.specs.serialNumber}`}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {product.specs.serialNumber || '-'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {product.specs.productionYear || '-'}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {product.specs.liftHeight || '-'}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    {product.specs.workingHours || '-'}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    {product.specs.battery || '-'}
                  </TableCell>
                  <TableCell className="hidden 2xl:table-cell">
                    {product.specs.operatorPlatform || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onCopy(product)}
                        className="h-8 w-8 p-0"
                        title={t('copyProduct')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onEdit(product)}
                        className="h-8 w-8 p-0"
                        title={t('editProduct')}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onDelete(product)}
                        className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                        title={t('deleteProduct')}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CompactProductTable;
