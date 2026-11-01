import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Booking from "./pages/Booking";
import Admin from "./pages/AdminLogin";
import AdminDashboard from "./pages/Admin";
import NotFound from "./pages/NotFound";
import TermsAndConditions from "./pages/TermsAndConditions";
import { LanguageProvider } from "./LanguageContext";
import Payment from "./pages/Payment";
import GettingTouch from "./pages/GettingTouch";
import FloatingButtons from "./components/FloatingButtonsWrapper";
import AboutSection from "./components/AboutSection";
import ProtectedAdmin from "./components/ProtectedAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/dashboard" element={<ProtectedAdmin><AdminDashboard /></ProtectedAdmin>} />
          <Route path="/terms&conditions" element={<TermsAndConditions />} />
          <Route path="/scanPayment" element={<Payment />} />
          <Route path="/gettingTouch" element={<GettingTouch />} />
          <Route path="/about" element={<AboutSection />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <FloatingButtons />
      </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

