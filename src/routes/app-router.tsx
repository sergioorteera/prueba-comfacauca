import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { AreaManagementView } from "@/views/area-management-view";
import { UserManagementView } from "@/views/user-management-view";
import { VisitManagementView } from "@/views/visit-management-view";
import { ChangeHistoryView } from "@/views/change-history-view";
import { ProtectedRoute } from "@/routes/protected-route";
import { PageLoader } from "@/components/ui/page-loader";
import { NotFoundView } from "@/views/not-found-view";
import { useSupabase } from "@/hooks/use-supabase";
import { LandingView } from "@/views/landing-view";
import type { UserRole } from "@/types/supabase";
import { AboutView } from "@/views/about-view";
import { AuthView } from "@/views/auth-view";
import supabase from "@/lib/supabase";

/**
 * Inner dashboard redirect component
 * @returns {JSX.Element} Inner dashboard redirect component
 */
const InnerDashboardRedirect: React.FC = () => {
  const { user } = useSupabase();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user role
  useEffect(() => {
    const loadUserRole = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error loading user role:", error);
        setLoading(false);
        return;
      }

      setUserRole(data?.role as UserRole);
      setLoading(false);
    };

    loadUserRole();
  }, [user]);

  if (loading) {
    return <PageLoader />;
  }

  // Redirect according to the role
  if (userRole === "ADMIN") {
    return <Navigate to="gestion-de-areas" replace />;
  } else if (userRole === "CHIEF") {
    return <Navigate to="gestion-de-usuarios" replace />;
  } else {
    return <Navigate to="gestion-de-visitas" replace />;
  }
};

/**
 * App router component
 * @returns {JSX.Element} App router component
 */
export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LandingView />} />
        <Route path="login" element={<AuthView />} />
        <Route path="dashboard" element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<InnerDashboardRedirect />} />
            <Route
              path="gestion-de-visitas"
              element={<VisitManagementView />}
            />
            <Route path="gestion-de-areas" element={<AreaManagementView />} />
            <Route
              path="gestion-de-usuarios"
              element={<UserManagementView />}
            />
            <Route
              path="historial-de-cambios"
              element={<ChangeHistoryView />}
            />
            <Route path="acerca-de" element={<AboutView />} />
          </Route>
        </Route>
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFoundView />} />
      </Routes>
    </BrowserRouter>
  );
};
