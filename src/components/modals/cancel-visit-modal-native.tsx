import { useState } from "react";

import { Button } from "@/components/ui/button";

interface CancelReason {
  id: string;
  description: string;
}

interface ICancelVisitModalNativeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reasonId: string, notes: string) => Promise<void>;
  cancelReasons: CancelReason[];
  isLoading?: boolean;
}

/**
 * Cancel visit modal native component
 * @param {CancelVisitModalNativeProps} props - Props for the cancel visit modal native component
 */
export const CancelVisitModalNative: React.FC<ICancelVisitModalNativeProps> = ({
  open,
  onOpenChange,
  onConfirm,
  cancelReasons,
  isLoading = false,
}) => {
  const [selectedReasonId, setSelectedReasonId] = useState<string>("");

  const handleConfirm = async () => {
    if (!selectedReasonId) return;

    try {
      await onConfirm(selectedReasonId, "");

      // Clear the form
      setSelectedReasonId("");

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
            <h2 className="text-xl font-semibold">Cancelar Visita</h2>
            <p className="text-sm text-gray-600 mt-1">
              Por favor, selecciona el motivo de cancelación.
            </p>
          </div>

          {/* Form */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Motivo de Cancelación <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedReasonId}
              onChange={(e) => setSelectedReasonId(e.target.value)}
              disabled={isLoading || cancelReasons.length === 0}
              className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona un motivo</option>
              {cancelReasons.map((reason) => (
                <option key={reason.id} value={reason.id}>
                  {reason.description}
                </option>
              ))}
            </select>
            {cancelReasons.length === 0 && (
              <p className="text-xs text-red-500 mt-1">
                No hay motivos de cancelación disponibles
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
              variant="destructive"
              onClick={handleConfirm}
              disabled={!selectedReasonId || isLoading}
              className="flex-1"
            >
              {isLoading ? "Cancelando..." : "Confirmar Cancelación"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
