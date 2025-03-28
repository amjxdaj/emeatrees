
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ListFilter, PlusCircle, LogOut } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import FloatingActionButton from './FloatingActionButton';
import { Button } from './ui/button';

interface LayoutProps {
  children: ReactNode;
  hideAddButton?: boolean;
}

const Layout = ({ children, hideAddButton = false }: LayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isAdmin, logout } = useAdmin();
  
  return (
    <div className="min-h-screen flex flex-col pb-20">
      <header className="sticky top-0 z-30 glass-card border-b border-border/40 bg-white/90 backdrop-blur-md">
        <div className="flex items-center justify-between h-16 px-4 max-w-screen-xl mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-nature-500 text-white rounded-md p-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 14c-3.33-3.11-4.33-7.44-1-10.54"/>
                <path d="M4.43 12.97C2.79 14.92 2.59 17.85 4 19.87c1.65 2.39 4.75 2.86 7.58 1.64 2.18-.94 3.69-3.1 5.26-4.94.92-1.06 1.88-2.1 2.73-3.23"/>
                <path d="M12.01 6.7c1 3.3-.17 6.32-1.9 9.05-1.4 2.23-3.28 4.03-5.63 5.22"/>
                <path d="M11.93 12.45a4.84 4.84 0 0 1-3.66 1.55 1 1 0 0 1 0-3 2.84 2.84 0 0 0 2.16-.88"/>
              </svg>
            </div>
            <span className="font-display font-bold tracking-tight text-lg">emeaTrees</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-muted-foreground">
              EMEA College
            </div>
            
            {isAdmin && (
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <div className="page-container page-transition">
          {children}
        </div>
      </main>
      
      {!hideAddButton && <FloatingActionButton />}
      
      <nav className="mobile-nav">
        <Link to="/" className={`nav-item ${currentPath === '/' ? 'active' : ''}`}>
          <Home className="h-5 w-5 mb-1" />
          <span>Home</span>
        </Link>
        
        <Link 
          to={isAdmin ? "/add-tree" : "/admin-login"} 
          className={`nav-item ${currentPath === '/add-tree' ? 'active' : ''}`}
        >
          <PlusCircle className="h-5 w-5 mb-1" />
          <span>Add Tree</span>
        </Link>
        
        <a href="#filter" className="nav-item">
          <ListFilter className="h-5 w-5 mb-1" />
          <span>Filter</span>
        </a>
      </nav>
    </div>
  );
};

export default Layout;
