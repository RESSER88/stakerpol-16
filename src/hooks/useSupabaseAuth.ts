
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useErrorHandler } from './useErrorHandler';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(() => {
    // Initialize from localStorage cache
    const cached = localStorage.getItem('isAdmin');
    return cached ? JSON.parse(cached) : false;
  });
  const [adminLoading, setAdminLoading] = useState(false);
  const { toast } = useToast();
  const { handleError } = useErrorHandler();

  // Cache admin status in localStorage
  const setIsAdminWithCache = (value: boolean) => {
    setIsAdmin(value);
    localStorage.setItem('isAdmin', JSON.stringify(value));
  };

  // Check admin role with timeout and cache
  const checkAdminRole = async (userId: string, forceCheck = false): Promise<boolean> => {
    // Use cache if not forcing check and cache exists
    const cacheKey = `adminRole_${userId}`;
    const cached = localStorage.getItem(cacheKey);
    const cacheExpiry = localStorage.getItem(`${cacheKey}_expiry`);
    
    if (!forceCheck && cached && cacheExpiry && Date.now() < parseInt(cacheExpiry)) {
      const cachedValue = JSON.parse(cached);
      setIsAdminWithCache(cachedValue);
      return cachedValue;
    }

    setAdminLoading(true);
    
    try {
      console.log('👤 Checking admin role for user:', userId);
      
      // Add timeout protection (5 seconds)
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Admin role check timeout')), 5000)
      );
      
      const queryPromise = supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]);
      
      if (!error && data) {
        const userIsAdmin = data.role === 'admin';
        console.log('🛡️ User role check result:', data.role, '| isAdmin:', userIsAdmin);
        
        // Cache result for 5 minutes
        localStorage.setItem(cacheKey, JSON.stringify(userIsAdmin));
        localStorage.setItem(`${cacheKey}_expiry`, (Date.now() + 5 * 60 * 1000).toString());
        
        setIsAdminWithCache(userIsAdmin);
        return userIsAdmin;
      } else {
        console.log('⚠️ User role check failed:', error?.message || 'No role found');
        // On error, try to use cache as fallback
        if (cached) {
          const fallbackValue = JSON.parse(cached);
          setIsAdminWithCache(fallbackValue);
          return fallbackValue;
        }
        setIsAdminWithCache(false);
        return false;
      }
    } catch (error: any) {
      console.error('❌ Error checking admin role:', error);
      
      // On timeout or error, use cache as fallback
      if (cached) {
        const fallbackValue = JSON.parse(cached);
        console.log('🔄 Using cached admin status as fallback:', fallbackValue);
        setIsAdminWithCache(fallbackValue);
        return fallbackValue;
      }
      
      setIsAdminWithCache(false);
      return false;
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('🔐 Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Only check admin role on sign in and token refresh, not on every auth change
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            // Use debounced admin role check
            setTimeout(() => {
              if (mounted) {
                checkAdminRole(session.user.id);
              }
            }, 100); // Small delay to prevent race conditions
          }
        } else {
          // User logged out - clear cache
          console.log('👋 User logged out');
          localStorage.removeItem('isAdmin');
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('adminRole_')) {
              localStorage.removeItem(key);
              localStorage.removeItem(`${key}_expiry`);
            }
          });
          setIsAdminWithCache(false);
          setAdminLoading(false);
        }
        
        if (mounted) setLoading(false);
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        console.log('🔍 Checking for existing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('❌ Session check error:', error);
        } else {
          console.log('✅ Session check complete:', session ? 'Found session' : 'No session');
        }
        
        if (!mounted) return;
        
        if (!session) {
          setLoading(false);
        }
        // Session will be handled by the auth state change listener above
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔐 Attempting sign in for:', email);
      
      const { data, error } = await Promise.race([
        supabase.auth.signInWithPassword({ email, password }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Login timeout')), 15000)
        )
      ]) as any;

      if (error) {
        console.error('❌ Sign in error:', error);
        handleError(error, { 
          title: "Błąd logowania",
          context: "Auth - signIn"
        });
        return { error };
      }

      console.log('✅ Sign in successful:', data.user?.email);
      toast({
        title: "Zalogowano pomyślnie",
        description: `Witaj ${data.user?.email}`
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('❌ Sign in exception:', error);
      handleError(error, { 
        title: "Błąd logowania",
        context: "Auth - signIn"
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/admin`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        toast({
          title: "Błąd rejestracji",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      toast({
        title: "Rejestracja pomyślna",
        description: "Sprawdź swoją skrzynką pocztową aby potwierdzić konto"
      });

      return { data, error: null };
    } catch (error) {
      console.error('❌ Sign up error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('👋 Attempting sign out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Sign out error:', error);
        toast({
          title: "Błąd wylogowania",
          description: error.message,
          variant: "destructive"
        });
      } else {
        console.log('✅ Sign out successful');
        toast({
          title: "Wylogowano pomyślnie",
          description: "Do zobaczenia!"
        });
        // Redirect to home page after logout
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      }
      return { error };
    } catch (error) {
      console.error('❌ Sign out error:', error);
      return { error };
    }
  };

  return {
    user,
    session,
    loading,
    isAdmin,
    adminLoading,
    signIn,
    signUp,
    signOut
  };
};
