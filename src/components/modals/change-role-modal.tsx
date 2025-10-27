import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/types/supabase";
import supabase from "@/lib/supabase";

interface ChangeRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (newRole: UserRole) => Promise<void>;
  currentRole: UserRole;
  userEmail: string;
  currentUserRole: UserRole | null;
  userId: string;
  userAreaId: string | null;
  isLoading?: boolean;
}

/**
 * Change role modal
 * @param {ChangeRoleModalProps} props - The props for the change role modal
 * @returns {JSX.Element} The change role modal
 */
export function ChangeRoleModal({
  open,
  onOpenChange,
  onConfirm,
  currentRole,
  userEmail,
  currentUserRole,
  userId,
  userAreaId,
  isLoading = false,
}: ChangeRoleModalProps) {
  const [newRole, setNewRole] = useState<UserRole>(currentRole);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [hasConflict, setHasConflict] = useState(false);

  // Check if the area already has a chief when CHIEF is selected
  const checkExistingChief = async (selectedRole: UserRole) => {
    if (selectedRole === "CHIEF" && userAreaId) {
      const { data: existingChief, error: checkError } = await supabase
        .from("profiles")
        .select("id, email")
        .eq("area_id", userAreaId)
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

  const handleRoleChange = async (selectedRole: UserRole) => {
    setNewRole(selectedRole);
    await checkExistingChief(selectedRole);
  };

  const handleConfirm = async () => {
    if (newRole === currentRole) {
      onOpenChange(false);
      return;
    }

    if (hasConflict) {
      return; // Prevent confirming if there is a conflict
    }

    try {
      await onConfirm(newRole);
      onOpenChange(false);
    } catch (error: unknown) {
      console.error("Error cambiando rol:", error);
    }
  };

  if (!open) return null;

  // CHIEF can only assign roles CHIEF and ADVISOR
  const isChief = currentUserRole === "CHIEF";

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Cambiar Rol de Usuario</h2>
            <p className="text-sm text-gray-600 mt-2">
              Usuario: <strong>{userEmail}</strong>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Nuevo Rol <span className="text-red-500">*</span>
            </label>
            <select
              value={newRole}
              onChange={(e) => handleRoleChange(e.target.value as UserRole)}
              disabled={isLoading}
              className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {!isChief && <option value="ADMIN">Administrador</option>}
              <option value="CHIEF">Jefe de Área</option>
              <option value="ADVISOR">Asesor</option>
            </select>
            {newRole === currentRole && (
              <p className="text-xs text-gray-500 mt-1">
                El rol seleccionado es el mismo que el actual
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
              disabled={isLoading || newRole === currentRole || hasConflict}
              className="flex-1"
            >
              {isLoading ? "Cambiando..." : "Cambiar Rol"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
