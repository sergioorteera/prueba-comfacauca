/**
 * Public footer component for landing and error pages
 * @returns {JSX.Element} Public footer component
 */
export const PublicFooter: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-3">
            <img
              src="https://www.comfacauca.com/wp-content/uploads/media-1.svg"
              alt="Logo Comfacauca"
              className="h-8 w-auto"
            />
            <p className="text-sm text-slate-600">
              © 2025 Comfacauca. Todos los derechos reservados.
            </p>
          </div>
          <p className="text-sm text-slate-500">
            Sistema de Gestión de Visitas v1.0
          </p>
        </div>
      </div>
    </footer>
  );
};
