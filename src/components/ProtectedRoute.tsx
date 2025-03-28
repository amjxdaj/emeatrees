
import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!loading && !isAdmin) {
      toast.error('Administrator access required');
      navigate('/admin-login', { 
        state: { returnUrl: location.pathname } 
      });
    }
  }, [isAdmin, loading, navigate, location.pathname]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Loader className="h-8 w-8 animate-spin text-nature-600 mb-4" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  return isAdmin ? <>{children}</> : null;
};

export default ProtectedRoute;
