import { useState } from "react";

import type { Area } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditAreaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (name: string) => Promise<void>;
  area: Area;
  isLoading?: boolean;
}

/**
 * Edit area modal component
 * @param {EditAreaModalProps} props - Props for the edit area modal component
 * @returns {React.FC} Edit area modal component
 */
export const EditAreaModal: React.FC<EditAreaModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
  area,
  isLoading = false,
}) => {
  const [name, setName] = useState(area.name);

  const handleConfirm = async () => {
    if (!name.trim()) return;

    try {
      await onConfirm(name.trim());
    } catch (error) {
      console.error("Error editing area:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Área</DialogTitle>
          <DialogDescription>Modifica el nombre del área</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="area-name">
              Nombre del Área <span className="text-red-500">*</span>
            </Label>
            <Input
              id="area-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Área Comercial"
              disabled={isLoading}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading || !name.trim()}>
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
