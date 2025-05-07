
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ResumeProvider } from "@/context/ResumeContext";
import { ClerkProvider } from "@clerk/clerk-react";
import { AuthProvider } from "@/context/AuthContext";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import ResumeEditor from "./pages/ResumeEditor";
import ResumePreview from "./pages/ResumePreview";
import NotFound from "./pages/NotFound";
import SignInForm from "./components/auth/SignInForm";
import SignUpForm from "./components/auth/SignUpForm";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Get Clerk publishable key from environment
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const App = () => {
  // Create a new QueryClient instance inside the component
  const queryClient = new QueryClient();
  
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY || 'pk_test_dummy_key_for_development'}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <ResumeProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/sign-in" element={<SignInForm />} />
                  <Route path="/sign-up" element={<SignUpForm />} />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/editor/:id" element={
                    <ProtectedRoute>
                      <ResumeEditor />
                    </ProtectedRoute>
                  } />
                  <Route path="/preview/:id" element={
                    <ProtectedRoute>
                      <ResumePreview />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </ResumeProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default App;
