import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EnhancedMigrationStats {
  totalImages: number;
  base64Images: number;
  storageImages: number;
  failedImages: number;
  migrationProgress: number;
  isCompleted: boolean;
  retryAttempts: Record<string, number>;
  lastError?: string;
}

interface MigrationResult {
  imageId: string;
  status: 'success' | 'error' | 'retrying';
  newUrl?: string;
  error?: string;
  attempts: number;
}

export const useEnhancedImageMigration = (isAdmin: boolean, products: any[]) => {
  const [stats, setStats] = useState<EnhancedMigrationStats>({
    totalImages: 0,
    base64Images: 0,
    storageImages: 0,
    failedImages: 0,
    migrationProgress: 0,
    isCompleted: false,
    retryAttempts: {}
  });
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResults, setMigrationResults] = useState<MigrationResult[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!products || products.length === 0) return;

    analyzeImageStats();
  }, [products]);

  const analyzeImageStats = () => {
    let base64Count = 0;
    let storageCount = 0;
    let totalCount = 0;

    products.forEach(product => {
      if (product.images) {
        product.images.forEach((img: string) => {
          totalCount++;
          if (img.startsWith('data:')) {
            base64Count++;
          } else if (img.includes('supabase.co/storage')) {
            storageCount++;
          }
        });
      }
    });

    const progress = totalCount > 0 ? Math.round((storageCount / totalCount) * 100) : 100;
    const completed = base64Count === 0 && totalCount > 0;

    setStats(prev => ({
      ...prev,
      totalImages: totalCount,
      base64Images: base64Count,
      storageImages: storageCount,
      migrationProgress: progress,
      isCompleted: completed
    }));

    // Auto-start migration if admin and base64 images exist
    if (isAdmin && base64Count > 0 && !isMigrating && !completed) {
      startEnhancedMigration();
    }
  };

  const startEnhancedMigration = async () => {
    if (isMigrating) return;
    
    setIsMigrating(true);
    setMigrationResults([]);
    
    toast({
      title: "🚀 Enhanced Migration Started",
      description: `Migrating ${stats.base64Images} images with 6-try retry system...`,
      duration: 5000
    });

    try {
      console.log('🔄 Enhanced migration with retry system starting...');
      
      // Ensure bucket exists
      const { error: bucketError } = await supabase.storage.createBucket('product-images', { 
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 52428800 // 50MB
      });
      
      if (bucketError && !bucketError.message.includes('already exists')) {
        console.warn('Bucket creation warning:', bucketError);
      }

      // Execute enhanced migration with monitoring
      const { data, error } = await supabase.functions.invoke('migrate-images', {
        body: { 
          enhancedMigration: true,
          monitorProgress: true,
          maxRetries: 6
        }
      });

      if (error) throw error;

      if (data?.success) {
        setMigrationResults(data.results || []);
        
        const successCount = data.stats?.success || 0;
        const errorCount = data.stats?.errors || 0;
        const totalAttempts = data.results?.reduce((sum: number, result: any) => sum + result.attempts, 0) || 0;

        toast({
          title: "✅ Enhanced Migration Completed!",
          description: `Successfully migrated ${successCount} images, ${errorCount} failed. Total retry attempts: ${totalAttempts}`,
          duration: 10000
        });

        setStats(prev => ({
          ...prev,
          base64Images: errorCount,
          storageImages: prev.storageImages + successCount,
          failedImages: errorCount,
          migrationProgress: Math.round(((prev.totalImages - errorCount) / prev.totalImages) * 100),
          isCompleted: errorCount === 0
        }));

        // Refresh after successful migration
        if (errorCount === 0) {
          setTimeout(() => window.location.reload(), 3000);
        }
      } else {
        throw new Error(data?.error || 'Enhanced migration failed');
      }
    } catch (error: any) {
      console.error('Enhanced migration error:', error);
      setStats(prev => ({ ...prev, lastError: error.message }));
      
      toast({
        title: "⚠️ Migration Error",
        description: `Error: ${error.message}. Check console for details.`,
        variant: "destructive",
        duration: 8000
      });
    } finally {
      setIsMigrating(false);
    }
  };

  const retryFailedImages = async () => {
    const failedResults = migrationResults.filter(r => r.status === 'error');
    if (failedResults.length === 0) {
      toast({
        title: "ℹ️ No Failed Images",
        description: "All images have been successfully migrated.",
      });
      return;
    }

    toast({
      title: "🔄 Retrying Failed Images",
      description: `Retrying ${failedResults.length} failed images...`,
      duration: 5000
    });

    try {
      const { data, error } = await supabase.functions.invoke('migrate-images', {
        body: { 
          retryFailed: true,
          imageIds: failedResults.map(r => r.imageId)
        }
      });

      if (error) throw error;

      if (data?.success) {
        setMigrationResults(prev => [
          ...prev.filter(r => r.status !== 'error'),
          ...data.results
        ]);
        analyzeImageStats();
      }
    } catch (error: any) {
      toast({
        title: "⚠️ Retry Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return {
    stats,
    isMigrating,
    migrationResults,
    startEnhancedMigration,
    retryFailedImages,
    analyzeImageStats
  };
};