import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteAreaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  areaName: string;
  usersCount: number;
  isLoading?: boolean;
}

/**
 * Delete area modal component
 * @param {DeleteAreaModalProps} props - Props for the delete area modal component
 * @returns {React.FC} Delete area modal component
 */
export const DeleteAreaModal: React.FC<DeleteAreaModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
  areaName,
  usersCount,
  isLoading = false,
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error("Error deleting area:", error);
    }
  };

  const hasUsers = usersCount > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">Eliminar Área</DialogTitle>
          <DialogDescription>
            Área: <strong>{areaName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {hasUsers ? (
            <div className="p-3 bg-yellow-50 border border-yellow-400 rounded">
              <p className="text-sm text-yellow-800 font-semibold">
                ⚠️ No se puede eliminar esta área
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Esta área tiene <strong>{usersCount} usuario(s)</strong>{" "}
                asignado(s).
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Debes reasignar los usuarios a otra área antes de poder
                eliminarla.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                ¿Estás seguro de que deseas eliminar esta área?
              </p>
              <p className="text-sm text-red-600 mt-2 font-semibold">
                Esta acción no se puede deshacer.
              </p>
            </>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || hasUsers}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Eliminando..." : "Sí, Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
