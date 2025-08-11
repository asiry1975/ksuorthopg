import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ResidentHome from "./pages/Resident/ResidentHome";

import ResidentScheduleFormTest from "./pages/Resident/ResidentScheduleFormTest";
import ResidentView from "./pages/Resident/ResidentView";
import FacultyHome from "./pages/Faculty/FacultyHome";

import FacultyViewTest from "./pages/Faculty/FacultyViewTest";
import ProgramDirectorHome from "./pages/ProgramDirector/ProgramDirectorHome";
import ComingSoonPage from "./pages/ComingSoon";
import ResidentProfile from "./pages/Resident/ResidentProfile";
import FacultyProfile from "./pages/Faculty/FacultyProfile";
import { ScheduleProvider } from "./context/ScheduleContext";
import AppFooter from "./components/AppFooter";
import AuthPage from "./pages/Auth";
import PasswordRecovery from "./pages/PasswordRecovery";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ProfilePage from "./pages/Profile";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScheduleProvider>
            <div className="relative z-10">
              <Routes>
<Route path="/auth" element={<AuthPage />} />
                <Route path="/auth/recovery" element={<PasswordRecovery />} />
                <Route path="/" element={<Index />} />

                <Route
                  path="/resident"
                  element={<ProtectedRoute allowedRoles={["resident"]}><ResidentHome /></ProtectedRoute>}
                />
                <Route
                  path="/resident/schedule-test"
                  element={<ProtectedRoute allowedRoles={["resident"]}><ResidentScheduleFormTest /></ProtectedRoute>}
                />
                <Route
                  path="/resident/view"
                  element={<ProtectedRoute allowedRoles={["resident"]}><ResidentView /></ProtectedRoute>}
                />
                <Route
                  path="/resident/profile"
                  element={<ProtectedRoute allowedRoles={["resident"]}><ResidentProfile /></ProtectedRoute>}
                />
                
                <Route
                  path="/faculty"
                  element={<ProtectedRoute allowedRoles={["faculty"]}><FacultyHome /></ProtectedRoute>}
                />
                <Route
                  path="/faculty/view-test"
                  element={<ProtectedRoute allowedRoles={["faculty"]}><FacultyViewTest /></ProtectedRoute>}
                />
                <Route
                  path="/faculty/profile"
                  element={<ProtectedRoute allowedRoles={["faculty"]}><FacultyProfile /></ProtectedRoute>}
                />

                <Route
                  path="/program-director"
                  element={<ProtectedRoute allowedRoles={["program_director"]}><ProgramDirectorHome /></ProtectedRoute>}
                />

                <Route path="/coming-soon" element={<ComingSoonPage />} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              <AppFooter />
            </div>
            {/* Global background image */}
            
          </ScheduleProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
