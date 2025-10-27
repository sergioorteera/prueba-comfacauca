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

interface ICancelReason {
  id: string;
  description: string;
}

interface ICancelVisitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reasonId: string, notes: string) => Promise<void>;
  cancelReasons: ICancelReason[];
  isLoading?: boolean;
}

/**
 * Cancel visit modal component
 * @param {ICancelVisitModalProps} props - Props for the cancel visit modal component
 * @returns {React.FC} Cancel visit modal component
 */
export const CancelVisitModal: React.FC<ICancelVisitModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
  cancelReasons,
  isLoading = false,
}) => {
  const [selectedReasonId, setSelectedReasonId] = useState<string>("");
  const [notes, setNotes] = useState("");

  const handleConfirm = async () => {
    if (!selectedReasonId) return;

    await onConfirm(selectedReasonId, notes);

    // Clear the form
    setSelectedReasonId("");
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cancelar Visita</DialogTitle>
          <DialogDescription>
            Por favor, selecciona el motivo de cancelación y agrega notas
            adicionales si es necesario.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="cancel-reason">Motivo de Cancelación *</Label>
            <Select
              value={selectedReasonId}
              onValueChange={setSelectedReasonId}
              disabled={isLoading}
            >
              <SelectTrigger id="cancel-reason">
                <SelectValue placeholder="Selecciona un motivo" />
              </SelectTrigger>
              <SelectContent>
                {cancelReasons.map((reason) => (
                  <SelectItem key={reason.id} value={reason.id}>
                    {reason.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notas Adicionales (Opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Agrega información adicional sobre la cancelación..."
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
            variant="destructive"
            onClick={handleConfirm}
            disabled={!selectedReasonId || isLoading}
          >
            {isLoading ? "Cancelando..." : "Confirmar Cancelación"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
