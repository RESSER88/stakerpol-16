
import { useState, useCallback } from 'react';
import { Upload, X, Star, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { optimizeImage, validateImageFile, createImagePreview } from '@/utils/imageOptimization';
import { cn } from '@/lib/utils';

interface ProductImageManagerProps {
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  currentImages?: string[];
  className?: string;
}

const ProductImageManager = ({ 
  onImagesChange, 
  maxImages = 3, 
  currentImages = [],
  className 
}: ProductImageManagerProps) => {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>(currentImages);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const { toast } = useToast();

  const handleFileSelect = useCallback(async (files: FileList) => {
    if (previews.length >= maxImages) {
      toast({
        title: "Limit zdjęć osiągnięty",
        description: `Możesz dodać maksymalnie ${maxImages} zdjęcia`,
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    const newPreviews: string[] = [];

    try {
      for (let i = 0; i < files.length && previews.length + newPreviews.length < maxImages; i++) {
        const file = files[i];
        
        // Validate file
        const validationError = validateImageFile(file);
        if (validationError) {
          toast({
            title: "Błąd pliku",
            description: validationError,
            variant: "destructive"
          });
          continue;
        }

        // Optimize image
        const optimizedFile = await optimizeImage(file, {
          maxWidth: 1600,
          maxHeight: 1200,
          quality: 0.85,
          format: 'webp'
        });

        // Create preview
        const preview = await createImagePreview(optimizedFile);
        newPreviews.push(preview);
      }

      const updatedPreviews = [...previews, ...newPreviews];
      setPreviews(updatedPreviews);
      onImagesChange(updatedPreviews);

      if (newPreviews.length > 0) {
        toast({
          title: "Zdjęcia dodane",
          description: `Dodano ${newPreviews.length} zoptymalizowanych zdjęć`
        });
      }
    } catch (error) {
      console.error('Error processing images:', error);
      toast({
        title: "Błąd przetwarzania",
        description: "Nie udało się przetworzyć niektórych zdjęć",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  }, [previews, maxImages, onImagesChange, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  const removeImage = useCallback((index: number) => {
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setPreviews(updatedPreviews);
    onImagesChange(updatedPreviews);
    
    // Adjust main image index if necessary
    if (mainImageIndex >= updatedPreviews.length) {
      setMainImageIndex(Math.max(0, updatedPreviews.length - 1));
    } else if (index <= mainImageIndex && mainImageIndex > 0) {
      setMainImageIndex(mainImageIndex - 1);
    }
  }, [previews, onImagesChange, mainImageIndex]);

  const setAsMainImage = useCallback((index: number) => {
    setMainImageIndex(index);
    // Reorder array to put main image first
    const reorderedPreviews = [...previews];
    const [mainImage] = reorderedPreviews.splice(index, 1);
    reorderedPreviews.unshift(mainImage);
    setPreviews(reorderedPreviews);
    onImagesChange(reorderedPreviews);
    setMainImageIndex(0);
    
    toast({
      title: "Zdjęcie główne ustawione",
      description: "Wybrane zdjęcie zostało ustawione jako główne"
    });
  }, [previews, onImagesChange, toast]);

  const generateThumbnailWithWhiteBackground = useCallback((src: string): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const size = 300; // Square thumbnail size
        canvas.width = size;
        canvas.height = size;
        
        // Fill with white background
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, size, size);
          
          // Calculate dimensions to fit image within square while maintaining aspect ratio
          const scale = Math.min(size / img.width, size / img.height);
          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;
          const x = (size - scaledWidth) / 2;
          const y = (size - scaledHeight) / 2;
          
          ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        }
        
        resolve(canvas.toDataURL('image/webp', 0.9));
      };
      
      img.src = src;
    });
  }, []);

  return (
    <div className={cn("space-y-6", className)}>
      <div className="border-2 border-dashed border-gray-300 rounded-lg">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="p-8 text-center hover:border-stakerpol-orange transition-colors"
        >
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-stakerpol-navy">
            Dodaj zdjęcia produktu
          </h3>
          <p className="text-gray-600 mb-4">
            Przeciągnij zdjęcia tutaj lub kliknij, aby wybrać (maksymalnie {maxImages})
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Obsługiwane formaty: JPG, PNG, WebP • Automatyczna optymalizacja • Max 300KB
          </p>
          
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
            id="product-images-upload"
            disabled={uploading || previews.length >= maxImages}
          />
          
          <Button
            type="button"
            className="cta-button"
            asChild
            disabled={uploading || previews.length >= maxImages}
          >
            <label htmlFor="product-images-upload" className="cursor-pointer">
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Przetwarzanie...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Wybierz zdjęcia
                </>
              )}
            </label>
          </Button>
        </div>
      </div>

      {previews.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-stakerpol-navy">
            Podgląd zdjęć ({previews.length}/{maxImages})
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <div className={cn(
                  "relative aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all",
                  index === mainImageIndex 
                    ? "border-stakerpol-orange shadow-lg ring-2 ring-stakerpol-orange/20" 
                    : "border-gray-200 hover:border-gray-300"
                )}>
                  <img
                    src={preview}
                    alt={`Zdjęcie produktu ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Main image indicator */}
                  {index === mainImageIndex && (
                    <div className="absolute top-2 left-2 bg-stakerpol-orange text-white px-2 py-1 rounded text-xs font-semibold flex items-center">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Główne
                    </div>
                  )}
                  
                  {/* Action buttons */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {index !== mainImageIndex && (
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="h-6 w-6 p-0 bg-white/90 hover:bg-white"
                        onClick={() => setAsMainImage(index)}
                        title="Ustaw jako zdjęcie główne"
                      >
                        <Star className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => removeImage(index)}
                      title="Usuń zdjęcie"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-2 text-center">
                  <span className="text-sm text-gray-600">
                    Zdjęcie {index + 1}
                    {index === mainImageIndex && (
                      <span className="text-stakerpol-orange font-semibold"> (Główne)</span>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {previews.length < maxImages && (
            <div className="text-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('product-images-upload')?.click()}
                disabled={uploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Dodaj więcej zdjęć ({maxImages - previews.length} pozostało)
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductImageManager;
