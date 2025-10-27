import { Button } from "@/components/ui/button";

interface IScheduleVisitModalSimpleProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Schedule visit modal simple component
 * @param {IScheduleVisitModalSimpleProps} props - Props for the schedule visit modal simple component
 * @returns {React.FC} Schedule visit modal simple component
 */
export const ScheduleVisitModalSimple: React.FC<
  IScheduleVisitModalSimpleProps
> = ({ open, onOpenChange }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Programar Nueva Visita</h2>
        <p className="text-sm text-gray-600 mb-4">
          Modal de prueba - Si ves esto, el problema está en el componente
          Dialog de Radix UI
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Asesor</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Selecciona un asesor"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Fecha</label>
            <input type="date" className="w-full border rounded px-3 py-2" />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              alert("Funcionalidad en desarrollo");
              onOpenChange(false);
            }}
            className="flex-1"
          >
            Programar
          </Button>
        </div>
      </div>
    </div>
  );
};
