import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, PlusCircle, LogOut } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import FloatingActionButton from "./FloatingActionButton";
import { Button } from "./ui/button";

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
            <img src="/favicon.ico" alt="emeaTrees Logo" className="h-8 w-8 rounded-lg" />
            <span className="font-display font-bold tracking-tight text-lg">
              emeaTrees
            </span>
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
        <div className="page-container page-transition">{children}</div>
      </main>

      {!hideAddButton && <FloatingActionButton />}

      <nav className="mobile-nav">
        <Link
          to="/"
          className={`nav-item ${currentPath === "/" ? "active" : ""}`}
        >
          <Home className="h-5 w-5 mb-1" />
          <span>Home</span>
        </Link>

        <Link
          to={isAdmin ? "/add-tree" : "/admin-login"}
          className={`nav-item ${currentPath === "/add-tree" ? "active" : ""}`}
        >
          <PlusCircle className="h-5 w-5 mb-1" />
          <span>Add Tree</span>
        </Link>
      </nav>
    </div>
  );
};

export default Layout;
