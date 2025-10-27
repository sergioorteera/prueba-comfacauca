import { Link } from "react-router";
import { Home, ArrowLeft, AlertCircle } from "lucide-react";

import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import { useSupabase } from "@/hooks/use-supabase";
import { Button } from "@/components/ui/button";

/**
 * Not found view component (404)
 * @returns {JSX.Element} Not found view component
 */
export const NotFoundView: React.FC = () => {
  const { user } = useSupabase();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100">
      <PublicHeader />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="flex min-h-[calc(100vh-300px)] flex-col items-center justify-center text-center">
          {/* Animated 404 */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-64 rounded-full bg-slate-200/50 blur-3xl"></div>
            </div>
            <div className="relative">
              <h1 className="text-[200px] font-bold leading-none text-slate-900 opacity-20">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <AlertCircle className="size-24 text-slate-600 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="max-w-2xl space-y-6">
            <h2 className="text-4xl font-bold text-slate-900 md:text-5xl">
              Página no encontrada
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              Lo sentimos, la página que estás buscando no existe o ha sido
              movida. Verifica la URL o regresa al inicio.
            </p>

            {/* Action Button */}
            <div className="flex flex-wrap justify-center gap-4 pt-8">
              {user ? (
                <Button asChild size="lg" className="shadow-lg">
                  <Link to="/dashboard">
                    <ArrowLeft className="mr-2 size-5" />
                    Volver al Dashboard
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="shadow-lg">
                  <Link to="/">
                    <Home className="mr-2 size-5" />
                    Ir al Inicio
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
};
