
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check admin role with proper error handling
          setAdminLoading(true);
          try {
            const { data, error } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .single();
            
            if (!mounted) return;
            
            if (!error && data) {
              const userIsAdmin = data.role === 'admin';
              setIsAdmin(userIsAdmin);
              
              // Auto-redirect admin users to admin panel after successful sign in
              if (userIsAdmin && event === 'SIGNED_IN') {
                console.log('Admin user signed in, redirecting to /admin');
                // Use setTimeout to avoid redirect conflicts
                setTimeout(() => {
                  if (window.location.pathname !== '/admin') {
                    window.location.href = '/admin';
                  }
                }, 500);
              }
            } else {
              console.log('User role check failed:', error?.message || 'No role found');
              setIsAdmin(false);
            }
          } catch (error) {
            console.error('Error checking admin role:', error);
            if (mounted) setIsAdmin(false);
          } finally {
            if (mounted) setAdminLoading(false);
          }
        } else {
          // User logged out
          setIsAdmin(false);
          setAdminLoading(false);
        }
        
        if (mounted) setLoading(false);
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session check error:', error);
        }
        
        if (!mounted) return;
        
        if (!session) {
          setLoading(false);
        }
        // Session will be handled by the auth state change listener above
      } catch (error) {
        console.error('Auth initialization error:', error);
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
      console.log('Attempting sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        toast({
          title: "Błąd logowania",
          description: error.message || "Nieprawidłowe dane logowania",
          variant: "destructive"
        });
        return { error };
      }

      console.log('Sign in successful:', data.user?.email);
      toast({
        title: "Zalogowano pomyślnie",
        description: `Witaj ${data.user?.email}`
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Sign in exception:', error);
      toast({
        title: "Błąd",
        description: "Wystąpił nieoczekiwany błąd podczas logowania",
        variant: "destructive"
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
      console.error('Sign up error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Błąd wylogowania",
          description: error.message,
          variant: "destructive"
        });
      } else {
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
      console.error('Sign out error:', error);
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
