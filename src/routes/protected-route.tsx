import { Outlet, Navigate } from "react-router";

import { PageLoader } from "@/components/ui/page-loader";
import { useSupabase } from "@/hooks/use-supabase";

/**
 * Protected route component
 * @returns {JSX.Element} Protected route component
 */
export const ProtectedRoute: React.FC = () => {
  const { user, loading, otpSent } = useSupabase();

  if (loading) {
    return <PageLoader />;
  }

  // If there is no user, redirect to home
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If the user is authenticated but needs OTP verification
  if (user && otpSent) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
