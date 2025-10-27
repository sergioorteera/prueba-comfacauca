import { Button } from "@/components/ui/button";

interface IExecuteVisitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

/**
 * Execute visit modal component
 * @param {IExecuteVisitModalProps} props - Props for the execute visit modal component
 * @returns {React.FC} Execute visit modal component
 */
export const ExecuteVisitModal: React.FC<IExecuteVisitModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              Confirmar Ejecución de Visita
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              ¿Está seguro de cambiar el estado de esta visita a{" "}
              <strong>Ejecutada</strong>?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Esta acción marcará la visita como completada y ya no aparecerá en
              la lista de visitas programadas.
            </p>
          </div>

          {/* Footer con botones */}
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
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isLoading ? "Ejecutando..." : "Sí, Ejecutar Visita"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
