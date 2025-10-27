import { useState } from "react";
import { Button } from "@/components/ui/button";

interface IAdvisor {
  id: string;
  email: string;
}

interface IReassignVisitModalNativeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (newAdvisorId: string, notes: string) => Promise<void>;
  advisors: IAdvisor[];
  currentAdvisorId: string;
  isLoading?: boolean;
}

/**
 * Reassign visit modal native component
 * @param {ReassignVisitModalNativeProps} props - Props for the reassign visit modal native component
 * @returns {React.FC} Reassign visit modal native component
 */
export const ReassignVisitModalNative: React.FC<
  IReassignVisitModalNativeProps
> = ({
  open,
  onOpenChange,
  onConfirm,
  advisors,
  currentAdvisorId,
  isLoading = false,
}) => {
  const [newAdvisorId, setNewAdvisorId] = useState("");

  const handleConfirm = async () => {
    if (!newAdvisorId) return;

    try {
      await onConfirm(newAdvisorId, "");

      // Clear the form
      setNewAdvisorId("");

      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Filter the current advisor from the list
  const availableAdvisors = advisors.filter(
    (advisor) => advisor.id !== currentAdvisorId
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Reasignar Visita</h2>
            <p className="text-sm text-gray-600 mt-1">
              Selecciona el nuevo asesor al que deseas reasignar esta visita.
            </p>
          </div>

          {/* Form */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Nuevo Asesor <span className="text-red-500">*</span>
            </label>
            <select
              value={newAdvisorId}
              onChange={(e) => setNewAdvisorId(e.target.value)}
              disabled={isLoading || availableAdvisors.length === 0}
              className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona un asesor</option>
              {availableAdvisors.map((advisor) => (
                <option key={advisor.id} value={advisor.id}>
                  {advisor.email}
                </option>
              ))}
            </select>
            {availableAdvisors.length === 0 && (
              <p className="text-xs text-red-500 mt-1">
                No hay otros asesores disponibles para reasignar
              </p>
            )}
          </div>

          {/* Footer with buttons */}
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
              disabled={
                !newAdvisorId || isLoading || availableAdvisors.length === 0
              }
              className="flex-1"
            >
              {isLoading ? "Reasignando..." : "Reasignar Visita"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
