import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { UserDashboardPage } from "./pages/UserDashboardPage";
import { TemplateSelectionPage } from "./pages/TemplateSelectionPage";
import { TemplateCreationPage } from "./pages/TemplateCreationPage";
import { TemplateDownloadPage } from "./pages/TemplateDownloadPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminUserDetailPage } from "./pages/AdminUserDetailPage";
import { AdminSubscriptionDetailPage } from "./pages/AdminSubscriptionDetailPage";
import { AdminSubscriptionsListPage } from "./pages/AdminSubscriptionsListPage"; // Import AdminSubscriptionsListPage
import { ATSCheckPage } from "./pages/ATSCheckPage";
import NotFound from '@/pages/NotFound'; // Use default import for NotFound
import { useAuth } from "./hooks/useAuth";


const queryClient = new QueryClient();

// Helper component for protected routes
function ProtectedRoute({ children, adminOnly = false }: { children: JSX.Element; adminOnly?: boolean }) {
  const isAuthenticated = localStorage.getItem('accessToken') !== null;
  // TODO: Implement actual role checking based on user data
  const isAdmin = localStorage.getItem('userRole') === 'admin'; // Placeholder for role check
  // TODO: Implement premium subscription check for ATS page

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    // Redirect non-admin users from admin routes
    return <Navigate to="/dashboard" replace />;
  }

  // TODO: Add premium check here for ATSCheckPage route

  return children;
}

function App() {
  const { isAdmin } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* User Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboardPage />
                </ProtectedRoute>
              }
            />
             <Route
              path="/templates"
              element={
                <ProtectedRoute>
                  <TemplateSelectionPage />
                </ProtectedRoute>
              }
            />
             <Route
              path="/templates/:templateId/create"
              element={
                <ProtectedRoute>
                  <TemplateCreationPage />
                </ProtectedRoute>
              }
            />
             <Route
              path="/resume/:resumeId/download"
              element={
                <ProtectedRoute>
                  <TemplateDownloadPage />
                </ProtectedRoute>
              }
            />
             <Route
              path="/resume/:resumeId/ats-check" // Route with resumeId parameter
              element={
                <ProtectedRoute> {/* TODO: Add premium check here */}
                  <ATSCheckPage />
                </ProtectedRoute>
              }
            />
            {/* Add a route for editing a resume */}
            {/* <Route path="/resume/:resumeId/edit" element={<ProtectedRoute><ResumeEditorPage /></ProtectedRoute>} /> */}

            {/* Admin Protected Routes */}
             <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
             <Route // Route for admin users list
              path="/admin/users"
              element={
                <ProtectedRoute adminOnly={true}>
                  {/* TODO: Create AdminUsersListPage */}
                   <AdminDashboardPage /> {/* Temporarily using dashboard to show user list */}
                </ProtectedRoute>
              }
            />
             <Route // Route for individual user details
              path="/admin/users/:id"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminUserDetailPage />
                </ProtectedRoute>
              }
            />
             <Route // Route for admin subscriptions list
              path="/admin/subscriptions"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminSubscriptionsListPage /> {/* Use the new list page */}
                </ProtectedRoute>
              }
            />
             <Route // Route for individual subscription details
              path="/admin/subscriptions/:id"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminSubscriptionDetailPage />
                </ProtectedRoute>
              }
            />
            {/* TODO: Add more admin routes (templates, transactions, etc.) */}


            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;