
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryDetailPage from "./pages/CategoryDetailPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import KyotoMapPage from "./pages/KyotoMapPage";
import JourneyPlannerPage from "./pages/JourneyPlannerPage";
import MonthlyEventsPage from "./pages/MonthlyEventsPage";
import PhotoWallPage from "./pages/PhotoWallPage";
import UserTipsPage from "./pages/UserTipsPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/UnAuthorized";
import { KyotoFact } from "./components/KyotoFact";

// AUTH
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {
  // Create a new QueryClient instance inside the component
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <KyotoFact />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/categories/:categoryId" element={<CategoryDetailPage />} />
                <Route path="/items/:itemId" element={<ItemDetailPage />} />
                <Route path="/map" element={<KyotoMapPage />} />
                <Route path="/planner" element={<JourneyPlannerPage />} />
                <Route path="/events" element={<MonthlyEventsPage />} />
                <Route path="/photos" element={<PhotoWallPage />} />
                <Route path="/tips" element={<UserTipsPage />} />
                <Route path="/about" element={<AboutPage />} />

                {/* AUTH ROUTES */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="*" element={<NotFound />} />

              </Routes>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
