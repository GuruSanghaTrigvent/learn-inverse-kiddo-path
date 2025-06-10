
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Settings } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-[#FFD93D] to-[#F8B500] bg-clip-text text-transparent">HoneyLearn</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/#features" className="text-gray-300 hover:text-primary transition-colors">
              Features
            </Link>
            <Link to="/#how-it-works" className="text-gray-300 hover:text-primary transition-colors">
              How it Works
            </Link>
            <Link to="/#pricing" className="text-gray-300 hover:text-primary transition-colors">
              Pricing
            </Link>
            {!loading && (
              session ? (
                <>
                  <Link to="/dashboard" className="text-gray-300 hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/settings" className="text-gray-300 hover:text-primary transition-colors">
                    <Settings className="h-5 w-5" />
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="text-gray-300 hover:text-primary"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/sign-in">
                    <Button variant="ghost" className="text-gray-300 hover:text-primary">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/sign-in">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Get Started
                    </Button>
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
