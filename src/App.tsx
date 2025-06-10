import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import Registration from "./pages/Registration";
import AddStudent from "./pages/AddStudent";
import Dashboard from "./pages/Dashboard";
import Course from "./pages/Course";
import Lesson from "./pages/Lesson";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
      staleTime: 30000,
      refetchOnWindowFocus: false,
      meta: {
        onError: (error: any) => {
          console.error("Query error:", error);
          toast({
            title: "Error loading data",
            description: error?.message || "Please try again later",
            variant: "destructive",
          });
        },
      },
    },
    mutations: {
      meta: {
        onError: (error: any) => {
          console.error("Mutation error:", error);
          toast({
            title: "Error saving data",
            description: error?.message || "Please try again later",
            variant: "destructive",
          });
        },
      },
    },
  },
});

const ErrorFallback = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    toast({
      title: "Something went wrong",
      description: "The application encountered an error. Please try refreshing the page.",
      variant: "destructive"
    });
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Oops! Something went wrong</h1>
      <p className="mb-6 text-gray-400 text-center max-w-md">
        We're sorry, but the application encountered an unexpected error.
      </p>
      <div className="space-x-4">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Refresh Page
        </button>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-secondary text-white rounded-md"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner closeButton position="bottom-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/add-student" element={<AddStudent />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/course/:courseId" element={<Course />} />
          <Route path="/lesson/:lessonId" element={<Lesson />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
