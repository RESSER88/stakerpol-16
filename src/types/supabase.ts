
import { Database } from '@/integrations/supabase/types';

// Typy z Supabase
export type SupabaseProduct = Database['public']['Tables']['products']['Row'];
export type SupabaseProductInsert = Database['public']['Tables']['products']['Insert'];
export type SupabaseProductUpdate = Database['public']['Tables']['products']['Update'];
export type SupabaseProductImage = Database['public']['Tables']['product_images']['Row'];

// Funkcje mapowania między typami aplikacji a Supabase
export const mapSupabaseProductToProduct = (supabaseProduct: SupabaseProduct, images: SupabaseProductImage[] = []) => {
  return {
    id: supabaseProduct.id,
    model: supabaseProduct.name,
    slug: (supabaseProduct as any).slug, // TypeScript will be updated with migration
    image: supabaseProduct.image_url || (images.length > 0 ? images[0].image_url : ''),
    images: images.map(img => img.image_url).filter(Boolean),
    shortDescription: supabaseProduct.short_description || '',
    createdAt: supabaseProduct.created_at,
    updatedAt: supabaseProduct.updated_at,
    specs: {
      productionYear: supabaseProduct.production_year?.toString() || '',
      serialNumber: supabaseProduct.serial_number || '',
      mastLiftingCapacity: supabaseProduct.lift_capacity_mast?.toString() || '',
      preliminaryLiftingCapacity: supabaseProduct.lift_capacity_initial?.toString() || '',
      workingHours: supabaseProduct.working_hours?.toString() || '',
      liftHeight: supabaseProduct.lift_height?.toString() || '',
      minHeight: supabaseProduct.min_height?.toString() || '',
      preliminaryLifting: supabaseProduct.initial_lift || '',
      battery: supabaseProduct.battery || '',
      condition: supabaseProduct.condition || '',
      driveType: supabaseProduct.drive_type || '',
      mast: supabaseProduct.mast || '',
      freeStroke: supabaseProduct.free_lift?.toString() || '',
      dimensions: supabaseProduct.dimensions || '',
      wheels: supabaseProduct.wheels || '',
      operatorPlatform: supabaseProduct.foldable_platform || '',
      additionalOptions: supabaseProduct.additional_options || '',
      additionalDescription: supabaseProduct.detailed_description || '',
      capacity: '', // Dla kompatybilności wstecznej
      charger: '' // Dla kompatybilności wstecznej
    }
  };
};

export const mapProductToSupabaseInsert = (product: any): SupabaseProductInsert => {
  return {
    name: product.model,
    short_description: product.shortDescription,
    serial_number: product.specs.serialNumber || `AUTO-${Date.now()}`,
    production_year: product.specs.productionYear ? parseInt(product.specs.productionYear) : null,
    lift_capacity_mast: product.specs.mastLiftingCapacity ? parseFloat(product.specs.mastLiftingCapacity) : null,
    lift_capacity_initial: product.specs.preliminaryLiftingCapacity ? parseFloat(product.specs.preliminaryLiftingCapacity) : null,
    working_hours: product.specs.workingHours ? parseFloat(product.specs.workingHours) : null,
    lift_height: product.specs.liftHeight ? parseFloat(product.specs.liftHeight) : null,
    min_height: product.specs.minHeight ? parseFloat(product.specs.minHeight) : null,
    initial_lift: product.specs.preliminaryLifting,
    battery: product.specs.battery,
    condition: product.specs.condition,
    drive_type: product.specs.driveType,
    mast: product.specs.mast,
    free_lift: product.specs.freeStroke ? parseFloat(product.specs.freeStroke) : null,
    dimensions: product.specs.dimensions,
    wheels: product.specs.wheels,
    foldable_platform: product.specs.operatorPlatform,
    additional_options: product.specs.additionalOptions,
    detailed_description: product.specs.additionalDescription,
    image_url: product.images && product.images.length > 0 ? product.images[0] : product.image
  };
};

export const mapProductToSupabaseUpdate = (product: any): SupabaseProductUpdate => {
  return {
    ...mapProductToSupabaseInsert(product),
    updated_at: new Date().toISOString()
  };
};
