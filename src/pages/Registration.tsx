
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Registration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Account created!",
          description: "Let's add your first student.",
        });
        navigate("/add-student");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Button
        variant="ghost"
        className="absolute top-4 left-4 text-gray-400 hover:text-white"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to home
      </Button>

      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md px-4 py-8">
          <div className="mb-12 flex justify-center">
            <div className="space-y-1">
              <div className="w-8 h-8 bg-white transform rotate-45 mx-auto"></div>
              <div className="w-8 h-8 bg-white transform rotate-45 mx-auto"></div>
            </div>
          </div>

          <h1 className="text-5xl font-bold text-white mb-12 text-center">
            Create your parent account
          </h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/10 rounded-lg text-white placeholder:text-gray-400 border-0 focus:ring-2 focus:ring-white/20 focus:outline-none"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/10 rounded-lg text-white placeholder:text-gray-400 border-0 focus:ring-2 focus:ring-white/20 focus:outline-none"
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-white/10 rounded-lg text-white placeholder:text-gray-400 border-0 focus:ring-2 focus:ring-white/20 focus:outline-none"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-white/10 rounded-lg text-white placeholder:text-gray-400 border-0 focus:ring-2 focus:ring-white/20 focus:outline-none"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#4747E8] text-white rounded-lg px-4 py-3 font-semibold hover:bg-[#3939B6] transition-colors duration-200 disabled:opacity-50"
            >
              {isLoading ? "Creating account..." : "Continue"}
            </button>

            <p className="text-sm text-center text-gray-400">
              By signing up, you're agreeing to our{" "}
              <Link to="/terms" className="text-[#4747E8] hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-[#4747E8] hover:underline">
                Privacy Policy
              </Link>
              .
            </p>

            <div className="text-center text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-[#4747E8] hover:underline">
                Log in
              </Link>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Registration;
