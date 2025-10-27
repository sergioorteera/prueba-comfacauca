interface AccessDeniedProps {
  message?: string;
  description?: string;
}

/**
 * Access denied component
 * @param {AccessDeniedProps} props - Props for the access denied component
 * @returns {JSX.Element} Access denied component
 */
export const AccessDenied: React.FC<AccessDeniedProps> = ({
  message = "Acceso Denegado",
  description = "No tienes permisos para acceder a esta sección",
}) => {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="text-center">
        <p className="text-red-600 font-semibold">{message}</p>
        <p className="text-sm text-gray-600 mt-2">{description}</p>
      </div>
    </div>
  );
};
