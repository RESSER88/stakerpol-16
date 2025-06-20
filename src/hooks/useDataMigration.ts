
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useProductStore } from '@/stores/productStore';
import { mapProductToSupabaseInsert } from '@/types/supabase';

export const useDataMigration = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const { toast } = useToast();
  const { products: localProducts } = useProductStore();

  const uploadImageToStorage = async (imageUrl: string, productId: string, index: number): Promise<string | null> => {
    try {
      // Skip if already a Supabase Storage URL
      if (imageUrl.includes('supabase.co/storage')) {
        return imageUrl;
      }

      // Download image from current URL
      const response = await fetch(imageUrl);
      if (!response.ok) {
        console.error('Failed to fetch image:', imageUrl);
        return null;
      }

      const blob = await response.blob();
      const fileExt = imageUrl.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${productId}-${index}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Error uploading image:', error);
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('Error processing image:', error);
      return null;
    }
  };

  const migrateToSupabase = async () => {
    if (localProducts.length === 0) {
      toast({
        title: "Brak danych do migracji",
        description: "Nie ma produktów w lokalnej bazie danych"
      });
      return;
    }

    setIsMigrating(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      toast({
        title: "Rozpoczynanie migracji",
        description: `Migracja ${localProducts.length} produktów do Supabase...`
      });

      for (const product of localProducts) {
        try {
          console.log('Migrating product:', product.model);

          // Upload images to Storage first
          const uploadedImages: string[] = [];
          
          if (product.images && product.images.length > 0) {
            for (let i = 0; i < product.images.length; i++) {
              const imageUrl = product.images[i];
              const uploadedUrl = await uploadImageToStorage(imageUrl, product.id, i);
              if (uploadedUrl) {
                uploadedImages.push(uploadedUrl);
              }
            }
          } else if (product.image) {
            const uploadedUrl = await uploadImageToStorage(product.image, product.id, 0);
            if (uploadedUrl) {
              uploadedImages.push(uploadedUrl);
            }
          }

          // Prepare product data for Supabase
          const supabaseProduct = mapProductToSupabaseInsert({
            ...product,
            images: uploadedImages
          });

          // Insert product into Supabase
          const { data: newProduct, error: productError } = await supabase
            .from('products')
            .insert([supabaseProduct])
            .select()
            .single();

          if (productError) {
            console.error('Error inserting product:', productError);
            errorCount++;
            continue;
          }

          // Insert images into product_images table
          if (uploadedImages.length > 0 && newProduct) {
            const imageInserts = uploadedImages.map((imageUrl, index) => ({
              product_id: newProduct.id,
              image_url: imageUrl,
              display_order: index + 1,
              alt_text: `${product.model} - zdjęcie ${index + 1}`
            }));

            const { error: imagesError } = await supabase
              .from('product_images')
              .insert(imageInserts);

            if (imagesError) {
              console.error('Error inserting images:', imagesError);
            }
          }

          successCount++;
          console.log('Successfully migrated:', product.model);
          
        } catch (error) {
          console.error('Error migrating product:', product.model, error);
          errorCount++;
        }
      }

      toast({
        title: "Migracja zakończona",
        description: `Pomyślnie zmigrowano ${successCount} produktów. Błędów: ${errorCount}`
      });

    } catch (error) {
      console.error('Migration error:', error);
      toast({
        title: "Błąd migracji",
        description: "Wystąpił błąd podczas migracji danych",
        variant: "destructive"
      });
    } finally {
      setIsMigrating(false);
    }
  };

  const migrateFromSupabase = async () => {
    setIsMigrating(true);
    
    try {
      // This would implement the reverse migration if needed
      toast({
        title: "Funkcja w budowie",
        description: "Migracja z Supabase do lokalnego store będzie zaimplementowana w przyszłości"
      });
    } catch (error) {
      console.error('Reverse migration error:', error);
      toast({
        title: "Błąd",
        description: "Wystąpił błąd podczas migracji",
        variant: "destructive"
      });
    } finally {
      setIsMigrating(false);
    }
  };

  return {
    isMigrating,
    migrateToSupabase,
    migrateFromSupabase
  };
};
