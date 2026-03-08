import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/usePageTitle";

const NotFound = () => {
  const location = useLocation();
  usePageTitle('Page Not Found');

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="min-h-screen flex items-center justify-center pt-16 animate-page-in">
      <div className="text-center px-8 sm:px-12">
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold text-foreground mb-4">404</h1>
        <p className="text-sm md:text-xl text-muted-foreground mb-6 md:mb-8">
          This path leads to the Abyss...
        </p>
        <Link to="/">
          <Button variant="secondary" size="default" className="text-sm md:text-base">
            Return Home
          </Button>
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
