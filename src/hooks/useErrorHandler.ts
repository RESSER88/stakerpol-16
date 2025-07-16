import { useCallback } from 'react';
import { toast } from 'sonner';
import { AuthError, PostgrestError } from '@supabase/supabase-js';

interface ErrorOptions {
  title?: string;
  context?: string;
  silent?: boolean;
  retry?: () => void;
}

export const useErrorHandler = () => {
  const handleError = useCallback((error: unknown, options: ErrorOptions = {}) => {
    const { title = 'Błąd', context, silent = false, retry } = options;
    
    console.error(`[${context || 'App'}] Error:`, error);
    
    if (silent) return;

    let message = 'Wystąpił nieoczekiwany błąd';
    
    // Handle Supabase Auth errors
    if (error && typeof error === 'object' && 'message' in error) {
      const authError = error as AuthError;
      if (authError.message?.includes('Invalid login credentials')) {
        message = 'Nieprawidłowe dane logowania';
      } else if (authError.message?.includes('Email not confirmed')) {
        message = 'Potwierdź swój email przed zalogowaniem';
      } else if (authError.message?.includes('User already registered')) {
        message = 'Użytkownik o tym adresie email już istnieje';
      } else if (authError.message?.includes('signup_disabled')) {
        message = 'Rejestracja jest obecnie wyłączona';
      } else {
        message = authError.message;
      }
    }
    
    // Handle Supabase Postgrest errors
    if (error && typeof error === 'object' && 'code' in error) {
      const pgError = error as PostgrestError;
      if (pgError.code === 'PGRST116') {
        message = 'Brak uprawnień do wykonania tej operacji';
      } else if (pgError.code === '23505') {
        message = 'Taki rekord już istnieje';
      } else if (pgError.code === '23503') {
        message = 'Nie można usunąć - rekord jest używany w innych miejscach';
      } else if (pgError.details) {
        message = pgError.details;
      } else if (pgError.message) {
        message = pgError.message;
      }
    }
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      message = 'Problemy z połączeniem internetowym';
    }
    
    // Show toast with retry option if provided
    if (retry) {
      toast.error(title, {
        description: message,
        action: {
          label: 'Spróbuj ponownie',
          onClick: retry,
        },
      });
    } else {
      toast.error(title, {
        description: message,
      });
    }
  }, []);

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    options: ErrorOptions = {}
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error, options);
      return null;
    }
  }, [handleError]);

  return { handleError, handleAsyncError };
};