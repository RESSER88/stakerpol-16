
import { create } from 'zustand';
import { Product } from '@/types';

// Store hybrydowy - umożliwia przełączanie między lokalnym store a Supabase
interface ProductStoreState {
  useSupabase: boolean;
  setUseSupabase: (useSupabase: boolean) => void;
  
  // Funkcje pomocnicze do migracji danych
  migrateToSupabase: () => Promise<void>;
  migrateFromSupabase: () => Promise<void>;
}

export const useProductStoreConfig = create<ProductStoreState>((set, get) => ({
  useSupabase: false, // Domyślnie używamy lokalnego store
  
  setUseSupabase: (useSupabase: boolean) => {
    console.log('Switching to', useSupabase ? 'Supabase' : 'local store');
    set({ useSupabase });
  },

  migrateToSupabase: async () => {
    console.log('Migrating products to Supabase...');
    // Implementacja migracji będzie dodana później
    // gdy będziemy mieli możliwość dodawania produktów do Supabase
  },

  migrateFromSupabase: async () => {
    console.log('Migrating products from Supabase...');
    // Implementacja migracji będzie dodana później
  }
}));
