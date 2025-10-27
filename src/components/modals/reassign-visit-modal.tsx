import { useState } from "react";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IAdvisor {
  id: string;
  email: string;
}

interface IReassignVisitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (newAdvisorId: string, notes: string) => Promise<void>;
  advisors: IAdvisor[];
  currentAdvisorId: string;
  isLoading?: boolean;
}

/**
 * Reassign visit modal component
 * @param {IReassignVisitModalProps} props - Props for the reassign visit modal component
 * @returns {React.FC} Reassign visit modal component
 */
export const ReassignVisitModal: React.FC<IReassignVisitModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
  advisors,
  currentAdvisorId,
  isLoading = false,
}) => {
  const [newAdvisorId, setNewAdvisorId] = useState("");
  const [notes, setNotes] = useState("");

  const handleConfirm = async () => {
    if (!newAdvisorId) return;

    await onConfirm(newAdvisorId, notes);

    // Clear the form
    setNewAdvisorId("");
    setNotes("");
  };

  // Filter the current advisor from the list
  const availableAdvisors = advisors.filter(
    (advisor) => advisor.id !== currentAdvisorId
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Reasignar Visita</DialogTitle>
          <DialogDescription>
            Selecciona el nuevo asesor al que deseas reasignar esta visita.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="new-advisor">Nuevo Asesor *</Label>
            <Select
              value={newAdvisorId}
              onValueChange={setNewAdvisorId}
              disabled={isLoading}
            >
              <SelectTrigger id="new-advisor">
                <SelectValue placeholder="Selecciona un asesor" />
              </SelectTrigger>
              <SelectContent>
                {availableAdvisors.map((advisor) => (
                  <SelectItem key={advisor.id} value={advisor.id}>
                    {advisor.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableAdvisors.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No hay otros asesores disponibles para reasignar.
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reassign-notes">
              Motivo de Reasignación (Opcional)
            </Label>
            <Textarea
              id="reassign-notes"
              placeholder="Agrega información sobre la reasignación..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isLoading}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={
              !newAdvisorId || isLoading || availableAdvisors.length === 0
            }
          >
            {isLoading ? "Reasignando..." : "Reasignar Visita"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
