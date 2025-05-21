import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { UserDashboardPage } from "./pages/UserDashboardPage";
import { TemplateSelectionPage } from "./pages/TemplateSelectionPage";
import { TemplateCreationPage } from "./pages/TemplateCreationPage";
import { TemplateDownloadPage } from "./pages/TemplateDownloadPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Protected Routes (assuming authentication is handled) */}
          <Route path="/dashboard" element={<UserDashboardPage />} />
          <Route path="/templates" element={<TemplateSelectionPage />} />
          <Route path="/templates/:templateId/create" element={<TemplateCreationPage />} />
          <Route path="/resume/:resumeId/download" element={<TemplateDownloadPage />} />
          {/* Add a route for editing a resume */}
          {/* <Route path="/resume/:resumeId/edit" element={<ResumeEditorPage />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;