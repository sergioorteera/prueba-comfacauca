import { useState } from "react";

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

interface CreateAreaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (name: string) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Create area modal component
 * @param {CreateAreaModalProps} props - Props for the create area modal component
 * @returns {React.FC} Create area modal component
 */
export const CreateAreaModal: React.FC<CreateAreaModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}) => {
  const [name, setName] = useState("");

  const handleConfirm = async () => {
    if (!name.trim()) return;

    try {
      await onConfirm(name.trim());
      setName("");
    } catch (error) {
      console.error("Error creating area:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Nueva Área</DialogTitle>
          <DialogDescription>Ingresa el nombre del área</DialogDescription>
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
            {isLoading ? "Creando..." : "Crear Área"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
