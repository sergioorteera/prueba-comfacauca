import type { ReactNode } from "react";

interface PublicHeaderProps {
  /**
   * Optional actions to render on the right side of the header
   */
  actions?: ReactNode;
}

/**
 * Public header component for landing and error pages
 * @returns {JSX.Element} Public header component
 */
export const PublicHeader: React.FC<PublicHeaderProps> = ({ actions }) => {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://www.comfacauca.com/wp-content/uploads/media-1.svg"
              alt="Logo Comfacauca"
              className="h-12 w-auto"
            />
            <div className="hidden md:block">
              <h1 className="text-lg font-bold text-slate-900">
                Sistema de Gestión de Visitas
              </h1>
              <p className="text-xs text-slate-600">
                Comfacauca - Solución Integral
              </p>
            </div>
          </div>
          {actions && <div>{actions}</div>}
        </div>
      </div>
    </header>
  );
};
