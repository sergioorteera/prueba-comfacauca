import { useState } from "react";
import { Button } from "@/components/ui/button";

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

interface IScheduleVisitModalNativeProps {
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
 * Schedule visit modal native component
 * @param {IScheduleVisitModalNativeProps} props - Props for the schedule visit modal native component
 * @returns {React.FC} Schedule visit modal native component
 */
export const ScheduleVisitModalNative: React.FC<
  IScheduleVisitModalNativeProps
> = ({
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

    try {
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

      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to translate visit type names to Spanish
  const translateVisitTypeName = (name: string): string => {
    const translations: Record<string, string> = {
      BUSINESS: "Empresarial",
      INDIVIDUAL: "Individual",
      COMMERCIAL: "Comercial",
      FOLLOW_UP: "Seguimiento",
      COMPLAINT: "Atención de Reclamo",
      PRESENTATION: "Presentación de Producto",
      RENEWAL: "Renovación de Contrato",
    };

    // If there is an exact translation, use it
    if (translations[name]) {
      return translations[name];
    }

    // If not, capitalize the first letter
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  // Validate that the end time is after the start time
  const isTimeValid = startTime && endTime ? endTime > startTime : true;
  const isFormValid =
    advisorId &&
    objectiveId &&
    visitTypeId &&
    visitDate &&
    startTime &&
    endTime &&
    isTimeValid;
  const hasAllData =
    advisors.length > 0 && objectives.length > 0 && visitTypes.length > 0;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Programar Nueva Visita</h2>
              <p className="text-sm text-gray-600">
                Completa la información para programar una nueva visita.
              </p>
            </div>
          </div>

          {/* Warning if missing data */}
          {!hasAllData && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-yellow-800 mb-2">
                ⚠️ Datos faltantes:
              </p>
              <ul className="text-xs text-yellow-700 space-y-1">
                {advisors.length === 0 && (
                  <li>• No hay asesores (ADVISOR) activos</li>
                )}
                {objectives.length === 0 && (
                  <li>• No hay objetivos de visita</li>
                )}
                {visitTypes.length === 0 && <li>• No hay tipos de visita</li>}
              </ul>
            </div>
          )}

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Asesor <span className="text-red-500">*</span>
              </label>
              <select
                value={advisorId}
                onChange={(e) => setAdvisorId(e.target.value)}
                disabled={isLoading || advisors.length === 0}
                className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona un asesor</option>
                {advisors.map((advisor) => (
                  <option key={advisor.id} value={advisor.id}>
                    {advisor.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Objetivo de la Visita <span className="text-red-500">*</span>
              </label>
              <select
                value={objectiveId}
                onChange={(e) => setObjectiveId(e.target.value)}
                disabled={isLoading || objectives.length === 0}
                className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona un objetivo</option>
                {objectives.map((objective) => (
                  <option key={objective.id} value={objective.id}>
                    {objective.name} (
                    {objective.objective_type === "PERSON"
                      ? "Persona"
                      : "Empresa"}
                    )
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Tipo de Visita <span className="text-red-500">*</span>
              </label>
              <select
                value={visitTypeId}
                onChange={(e) => setVisitTypeId(e.target.value)}
                disabled={isLoading || visitTypes.length === 0}
                className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona el tipo de visita</option>
                {visitTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {translateVisitTypeName(type.name)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Fecha de la Visita <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                disabled={isLoading}
                className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Hora de Inicio <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  disabled={isLoading}
                  className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Hora de Fin <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  disabled={isLoading}
                  className={`w-full h-10 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                    startTime && endTime && endTime <= startTime
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {startTime && endTime && endTime <= startTime && (
                  <p className="text-xs text-red-500 mt-1">
                    La hora de fin debe ser posterior a la hora de inicio
                  </p>
                )}
              </div>
            </div>
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
              disabled={!isFormValid || isLoading}
              className="flex-1"
              title={
                !isTimeValid
                  ? "La hora de fin debe ser posterior a la hora de inicio"
                  : ""
              }
            >
              {isLoading ? "Programando..." : "Programar Visita"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
