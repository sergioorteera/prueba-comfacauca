import { useState } from "react";

import { Textarea } from "@/components/ui/textarea";
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

interface IObjective {
  id: string;
  name: string;
  objective_type: "PERSON" | "COMPANY";
}

interface IVisitType {
  id: string;
  name: string;
}

interface IScheduleVisitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (visitData: {
    advisorId: string;
    objectiveId: string;
    visitTypeId: string;
    visitDate: string;
    startTime: string;
    endTime: string;
    notes: string;
  }) => Promise<void>;
  advisors: IAdvisor[];
  objectives: IObjective[];
  visitTypes: IVisitType[];
  isLoading?: boolean;
}

/**
 * Schedule visit modal component
 * @param {IScheduleVisitModalProps} props - Props for the schedule visit modal component
 * @returns {React.FC} Schedule visit modal component
 */
export const ScheduleVisitModal: React.FC<IScheduleVisitModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
  advisors,
  objectives,
  visitTypes,
  isLoading = false,
}) => {
  const [advisorId, setAdvisorId] = useState("");
  const [objectiveId, setObjectiveId] = useState("");
  const [visitTypeId, setVisitTypeId] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");

  const handleConfirm = async () => {
    if (
      !advisorId ||
      !objectiveId ||
      !visitTypeId ||
      !visitDate ||
      !startTime ||
      !endTime
    ) {
      return;
    }

    await onConfirm({
      advisorId,
      objectiveId,
      visitTypeId,
      visitDate,
      startTime,
      endTime,
      notes,
    });

    // Clear the form
    setAdvisorId("");
    setObjectiveId("");
    setVisitTypeId("");
    setVisitDate("");
    setStartTime("");
    setEndTime("");
    setNotes("");
  };

  const isFormValid =
    advisorId &&
    objectiveId &&
    visitTypeId &&
    visitDate &&
    startTime &&
    endTime;

  const hasAllData =
    advisors.length > 0 && objectives.length > 0 && visitTypes.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Programar Nueva Visita</DialogTitle>
          <DialogDescription>
            Completa la información para programar una nueva visita.
          </DialogDescription>
        </DialogHeader>

        {!hasAllData && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm font-semibold text-yellow-800 mb-2">
              ⚠️ Datos faltantes en la base de datos:
            </p>
            <ul className="text-xs text-yellow-700 space-y-1">
              {advisors.length === 0 && (
                <li>• No hay asesores registrados con rol ADVISOR</li>
              )}
              {objectives.length === 0 && (
                <li>• No hay objetivos de visita creados</li>
              )}
              {visitTypes.length === 0 && (
                <li>• No hay tipos de visita configurados</li>
              )}
            </ul>
            <p className="text-xs text-yellow-600 mt-2">
              Por favor, configura estos datos en Supabase antes de programar
              visitas.
            </p>
          </div>
        )}

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="advisor">Asesor *</Label>
            <Select
              value={advisorId}
              onValueChange={setAdvisorId}
              disabled={isLoading || advisors.length === 0}
            >
              <SelectTrigger id="advisor">
                <SelectValue
                  placeholder={
                    advisors.length === 0
                      ? "No hay asesores disponibles"
                      : "Selecciona un asesor"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {advisors.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    No hay asesores disponibles
                  </div>
                ) : (
                  advisors.map((advisor) => (
                    <SelectItem key={advisor.id} value={advisor.id}>
                      {advisor.email}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="objective">Objetivo de la Visita *</Label>
            <Select
              value={objectiveId}
              onValueChange={setObjectiveId}
              disabled={isLoading || objectives.length === 0}
            >
              <SelectTrigger id="objective">
                <SelectValue
                  placeholder={
                    objectives.length === 0
                      ? "No hay objetivos disponibles"
                      : "Selecciona un objetivo"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {objectives.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    No hay objetivos disponibles
                  </div>
                ) : (
                  objectives.map((objective) => (
                    <SelectItem key={objective.id} value={objective.id}>
                      {objective.name} (
                      {objective.objective_type === "PERSON"
                        ? "Persona"
                        : "Empresa"}
                      )
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="visit-type">Tipo de Visita *</Label>
            <Select
              value={visitTypeId}
              onValueChange={setVisitTypeId}
              disabled={isLoading || visitTypes.length === 0}
            >
              <SelectTrigger id="visit-type">
                <SelectValue
                  placeholder={
                    visitTypes.length === 0
                      ? "No hay tipos de visita disponibles"
                      : "Selecciona el tipo de visita"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {visitTypes.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    No hay tipos de visita disponibles
                  </div>
                ) : (
                  visitTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="visit-date">Fecha de la Visita *</Label>
            <Input
              id="visit-date"
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start-time">Hora de Inicio *</Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="end-time">Hora de Fin *</Label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes-schedule">Notas (Opcional)</Label>
            <Textarea
              id="notes-schedule"
              placeholder="Agrega notas sobre la visita..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isLoading}
              rows={3}
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
          <Button onClick={handleConfirm} disabled={!isFormValid || isLoading}>
            {isLoading ? "Programando..." : "Programar Visita"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
