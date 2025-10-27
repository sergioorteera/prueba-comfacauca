import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { UserRole, Area } from "@/types/supabase";
import supabase from "@/lib/supabase";

interface AssignAreaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (areaId: string | null) => Promise<void>;
  currentAreaId: string | null;
  userEmail: string;
  userId: string;
  userRole: UserRole;
  areas: Area[];
  isLoading?: boolean;
}

/**
 * Assign area modal
 * @param {AssignAreaModalProps} props - The props for the assign area modal
 * @returns {JSX.Element} The assign area modal
 */
export const AssignAreaModal: React.FC<AssignAreaModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
  currentAreaId,
  userEmail,
  userId,
  userRole,
  areas,
  isLoading = false,
}) => {
  const [selectedAreaId, setSelectedAreaId] = useState<string>(
    currentAreaId || ""
  );
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [hasConflict, setHasConflict] = useState(false);

  // Check if the area already has a chief when the user is CHIEF
  const checkExistingChief = async (areaId: string) => {
    if (userRole === "CHIEF" && areaId) {
      const { data: existingChief, error: checkError } = await supabase
        .from("profiles")
        .select("id, email")
        .eq("area_id", areaId)
        .eq("role", "CHIEF")
        .neq("id", userId)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking existing chief:", checkError);
        return;
      }

      if (existingChief) {
        setWarningMessage(
          `⚠️ Esta área ya tiene un Jefe de Área asignado: ${existingChief.email}. Primero debe cambiar el rol del jefe actual o reasignarlo a otra área.`
        );
        setHasConflict(true);
      } else {
        setWarningMessage(null);
        setHasConflict(false);
      }
    } else {
      setWarningMessage(null);
      setHasConflict(false);
    }
  };

  const handleAreaChange = async (areaId: string) => {
    setSelectedAreaId(areaId);
    if (areaId) {
      await checkExistingChief(areaId);
    } else {
      setWarningMessage(null);
      setHasConflict(false);
    }
  };

  const handleConfirm = async () => {
    if (hasConflict) {
      return; // Prevent confirming if there is a conflict
    }

    try {
      await onConfirm(selectedAreaId || null);
    } catch (error: unknown) {
      console.error("Error assigning area:", error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Asignar Área</h2>
            <p className="text-sm text-gray-600 mt-2">
              Usuario: <strong>{userEmail}</strong>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Área <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedAreaId}
              onChange={(e) => handleAreaChange(e.target.value)}
              disabled={isLoading}
              className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sin área asignada</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
            {areas.length === 0 && (
              <p className="text-xs text-red-500 mt-1">
                No hay áreas disponibles. Crea áreas primero en "Gestión de
                Áreas"
              </p>
            )}
            {warningMessage && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">{warningMessage}</p>
              </div>
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
              disabled={isLoading || hasConflict}
              className="flex-1"
            >
              {isLoading ? "Asignando..." : "Asignar Área"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
