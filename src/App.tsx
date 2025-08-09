import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ResidentHome from "./pages/Resident/ResidentHome";
import ResidentScheduleForm from "./pages/Resident/ResidentScheduleForm";
import ResidentView from "./pages/Resident/ResidentView";
import FacultyHome from "./pages/Faculty/FacultyHome";
import FacultyView from "./pages/Faculty/FacultyView";
import ProgramDirectorHome from "./pages/ProgramDirector/ProgramDirectorHome";
import ComingSoonPage from "./pages/ComingSoon";
import { ScheduleProvider } from "./context/ScheduleContext";
import AppFooter from "./components/AppFooter";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScheduleProvider>
          <div className="relative z-10">
            <Routes>
              <Route path="/" element={<Index />} />

              <Route path="/resident" element={<ResidentHome />} />
              <Route path="/resident/schedule" element={<ResidentScheduleForm />} />
              <Route path="/resident/view" element={<ResidentView />} />

              <Route path="/faculty" element={<FacultyHome />} />
              <Route path="/faculty/view" element={<FacultyView />} />

              <Route path="/program-director" element={<ProgramDirectorHome />} />

              <Route path="/coming-soon" element={<ComingSoonPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            <AppFooter />
          </div>
          {/* Global background image */}
          <div aria-hidden="true" className="fixed inset-0 bg-[url('/lovable-uploads/a40df1ae-56a6-461a-8377-4c41dd0fd784.png')] bg-cover bg-center pointer-events-none opacity-[0.99] z-0" />
        </ScheduleProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
