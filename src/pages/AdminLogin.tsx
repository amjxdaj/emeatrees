
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the return URL from location state or default to add-tree
  const returnUrl = location.state?.returnUrl || '/add-tree';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await login(username, password);
      
      if (result.success) {
        toast.success('Logged in as administrator');
        navigate(returnUrl);
      } else {
        toast.error(result.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout hideAddButton>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-nature-500 text-white rounded-full p-3 mb-4">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-display font-bold tracking-tight">
            Administrator Login
          </h1>
          <p className="text-muted-foreground mt-2">
            Please login to access the add tree functionality
          </p>
        </div>
        
        <div className="glass-card p-6 rounded-xl shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1.5"
                autoComplete="username"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5"
                autoComplete="current-password"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Logging In...' : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLogin;
