
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="bg-nature-500 text-white rounded-md p-4 transform -rotate-12">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 7 17l-5-5" />
              <path d="m22 10-7.5 7.5L13 16" />
            </svg>
          </div>
        </div>
        <h1 className="text-5xl font-display font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          We couldn't find the page you were looking for.
        </p>
        <p className="text-muted-foreground mb-8">
          The tree you're searching for might have been moved or doesn't exist.
        </p>
        <Link to="/">
          <Button size="lg">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
