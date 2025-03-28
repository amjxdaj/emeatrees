
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminContextType {
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  login: async () => ({ success: false }),
  logout: () => {},
  loading: true,
});

export const useAdmin = () => useContext(AdminContext);

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Check for admin session in localStorage on initial load
  useEffect(() => {
    const checkAdminSession = () => {
      const adminSession = localStorage.getItem('admin_session');
      if (adminSession) {
        try {
          const parsed = JSON.parse(adminSession);
          const isSessionValid = new Date(parsed.expiresAt) > new Date();
          setIsAdmin(isSessionValid);
        } catch (e) {
          localStorage.removeItem('admin_session');
          setIsAdmin(false);
        }
      }
      setLoading(false);
    };

    checkAdminSession();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (error || !data) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Create an admin session that expires in 24 hours
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      localStorage.setItem('admin_session', JSON.stringify({
        id: data.id,
        username: data.username,
        expiresAt: expiresAt.toISOString()
      }));
      
      setIsAdmin(true);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_session');
    setIsAdmin(false);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout, loading }}>
      {children}
    </AdminContext.Provider>
  );
};
