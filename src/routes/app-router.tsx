import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { BrowserRouter, Route, Routes } from "react-router";
import { VisitManagement } from "@/views/visit-management";
import { UserManagement } from "@/views/user-management";
import { ChangeHistory } from "@/views/change-history";
import { LandingView } from "@/views/landing-view";
import { AboutView } from "@/views/about-view";
import { AuthView } from "@/views/auth-view";
import ProtectedRoute from "./protected-route";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LandingView />} />
        <Route path="login" element={<AuthView />} />
        <Route path="dashboard" element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<VisitManagement />} />
            <Route path="gestion-de-visitas" element={<VisitManagement />} />
            <Route path="gestion-de-usuarios" element={<UserManagement />} />
            <Route path="historial-de-cambios" element={<ChangeHistory />} />
            <Route path="acerca-de" element={<AboutView />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
