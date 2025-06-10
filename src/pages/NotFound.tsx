
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Show toast notification
    toast({
      title: "Page not found",
      description: `The requested page "${location.pathname}" could not be found.`,
      variant: "destructive",
    });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center px-4 max-w-md">
          <h1 className="text-6xl font-bold mb-6 text-primary">404</h1>
          <p className="text-xl text-gray-400 mb-6">
            Oops! The page you're looking for doesn't exist or might have been moved.
          </p>
          <div className="space-y-4">
            <Link to="/">
              <Button className="w-full" size="lg">
                Return to Home
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
