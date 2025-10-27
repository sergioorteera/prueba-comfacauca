import { Button } from "@/components/ui/button";

interface DeleteUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  userEmail: string;
  visitsCount: number;
  isLoading?: boolean;
}

/**
 * Delete user modal
 * @param {DeleteUserModalProps} props - The props for the delete user modal
 * @returns {JSX.Element} The delete user modal
 */
export function DeleteUserModal({
  open,
  onOpenChange,
  onConfirm,
  userEmail,
  visitsCount,
  isLoading = false,
}: DeleteUserModalProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error: unknown) {
      console.error("Error deleting user:", error);
    }
  };

  if (!open) return null;

  const hasVisits = visitsCount > 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-red-600">
              Eliminar Usuario
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Usuario: <strong>{userEmail}</strong>
            </p>

            {hasVisits ? (
              <>
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-400 rounded">
                  <p className="text-sm text-yellow-800 font-semibold">
                    ⚠️ No se puede eliminar este usuario
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Este usuario tiene{" "}
                    <strong>
                      {visitsCount} visita{visitsCount > 1 ? "s" : ""}
                    </strong>{" "}
                    asociada{visitsCount > 1 ? "s" : ""}.
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Debes reasignar o eliminar sus visitas antes de poder
                    eliminarlo.
                  </p>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600 mt-2">
                  ¿Estás seguro de que deseas eliminar este usuario?
                </p>
                <p className="text-sm text-red-600 mt-2 font-semibold">
                  Esta acción no se puede deshacer.
                </p>
              </>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isLoading || hasVisits}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Eliminando..." : "Sí, Eliminar"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
