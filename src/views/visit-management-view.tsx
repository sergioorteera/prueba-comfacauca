import { useEffect, useState } from "react";

import { ScheduleVisitModalNative } from "@/components/modals/schedule-visit-modal-native";
import { ReassignVisitModalNative } from "@/components/modals/reassign-visit-modal-native";
import { CancelVisitModalNative } from "@/components/modals/cancel-visit-modal-native";
import { ExecuteVisitModal } from "@/components/modals/execute-visit-modal";
import { extractSupabaseRelation } from "@/utils/supabase-helpers";
import { translateVisitTypeName } from "@/utils/translators";
import { getVisitStatusBadge } from "@/utils/badge-helpers";
import { TableSkeleton } from "@/components/ui/page-loader";
import { formatCreatedAt } from "@/utils/date-formatters";
import { useUserProfile } from "@/hooks/use-user-profile";
import { ModuleHeader } from "@/components/module-header";
import { useVisitAudit } from "@/hooks/use-visit-audit";
import type { VisitStatus } from "@/types/supabase";
import { useSupabase } from "@/hooks/use-supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import supabase from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Plus,
  CheckCircle2,
  XCircle,
  UserCog,
  Building2,
  CalendarCheck,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  formatDateWithoutTimezone,
  formatTime12h,
  canExecuteVisit,
} from "@/utils/date-formatters";

interface VisitData {
  id: string;
  visit_date: string;
  start_time: string;
  end_time: string;
  status: VisitStatus;
  notes: string | null;
  advisor_email: string;
  advisor_id: string;
  advisor_area_id?: string | null;
  objective_name: string;
  visit_type_name: string;
  created_at: string;
}

interface CancelReason {
  id: string;
  description: string;
}

interface Advisor {
  id: string;
  email: string;
}

interface Objective {
  id: string;
  name: string;
  objective_type: "PERSON" | "COMPANY";
}

interface VisitType {
  id: string;
  name: string;
}

/**
 * Visit management component
 * @returns {JSX.Element} Visit management component
 */
export const VisitManagementView: React.FC = () => {
  const { user } = useSupabase();
  const { userProfile } = useUserProfile(user?.id);
  const { logAudit } = useVisitAudit();
  const [visits, setVisits] = useState<VisitData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Data for the modals
  const [cancelReasons, setCancelReasons] = useState<CancelReason[]>([]);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [visitTypes, setVisitTypes] = useState<VisitType[]>([]);

  // Modal states
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [executeModalOpen, setExecuteModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<VisitData | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (user && userProfile) {
      loadCancelReasons();
      loadAdvisors();
      loadObjectives();
      loadVisitTypes();
      loadVisits();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userProfile]);

  useEffect(() => {
    if (user && userProfile) {
      loadVisits();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  // Load visits
  const loadVisits = async () => {
    if (!user || !userProfile) return;

    setLoading(true);

    try {
      // Cancel expired visits automatically
      try {
        await supabase.rpc("cancel_expired_visits");
      } catch (error) {
        console.warn("No se pudieron cancelar visitas vencidas:", error);
        // Continue even if the automatic cancellation fails
      }

      let query = supabase
        .from("visits")
        .select(
          `
          id,
          visit_date,
          start_time,
          end_time,
          status,
          notes,
          created_at,
          advisor:profiles!visits_advisor_id_fkey(id, email, area_id),
          objective:objectives(name),
          visit_type:visit_types(name)
        `
        )
        .eq("status", "SCHEDULED"); // Only show scheduled visits

      // Filter by user role
      if (userProfile.role === "ADVISOR") {
        // Advisors: only their own visits
        query = query.eq("advisor_id", user.id);
      } else if (userProfile.role === "CHIEF") {
        // Chiefs: only visits in their area
        if (userProfile.area_id) {
          // We need to filter by advisor.area_id
          // Since we can't filter directly in the JOIN, we will load everything and filter afterwards
        }
      }
      // ADMIN: see all visits (no additional filter)

      // Filter by date if selected
      if (selectedDate) {
        query = query.eq("visit_date", selectedDate);
      }

      // Apply sorting at the end, after all filters
      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      type VisitQueryResult = {
        id: string;
        visit_date: string;
        start_time: string;
        end_time: string;
        status: VisitStatus;
        notes: string | null;
        created_at: string;
        advisor?: { id: string; email: string; area_id: string | null } | { id: string; email: string; area_id: string | null }[] | null;
        objective?: { name: string } | { name: string }[] | null;
        visit_type?: { name: string } | { name: string }[] | null;
      };

      let formattedData: VisitData[] = (data || []).map((visit: VisitQueryResult) => {
        const advisor = extractSupabaseRelation<{ id: string; email: string; area_id: string | null }>(visit.advisor);
        const objective = extractSupabaseRelation<{ name: string }>(visit.objective);
        const visitType = extractSupabaseRelation<{ name: string }>(visit.visit_type);

        return {
          id: visit.id,
          visit_date: visit.visit_date,
          start_time: visit.start_time,
          end_time: visit.end_time,
          status: visit.status,
          notes: visit.notes,
          advisor_email: advisor?.email || "N/A",
          advisor_id: advisor?.id || "",
          advisor_area_id: advisor?.area_id || null,
          objective_name: objective?.name || "N/A",
          visit_type_name: visitType?.name || "N/A",
          created_at: visit.created_at,
        };
      });

      // Filter by area for CHIEF (post-processing)
      if (userProfile.role === "CHIEF" && userProfile.area_id) {
        formattedData = formattedData.filter(
          (visit) => visit.advisor_area_id === userProfile.area_id
        );
      }

      setVisits(formattedData);
    } catch (error) {
      console.error("Error loading visits:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load cancel reasons
  const loadCancelReasons = async () => {
    try {
      const { data, error } = await supabase
        .from("cancel_reasons")
        .select("id, description")
        .order("description");

      if (error) throw error;
      setCancelReasons(data || []);
    } catch (error) {
      console.error("Error loading cancel reasons:", error);
      setCancelReasons([]);
    }
  };

  // Load advisors
  const loadAdvisors = async () => {
    if (!userProfile) return;

    try {
      let query = supabase
        .from("profiles")
        .select("id, email, area_id")
        .eq("role", "ADVISOR")
        .order("email");

      // If CHIEF, only load advisors from their area
      if (userProfile.role === "CHIEF" && userProfile.area_id) {
        query = query.eq("area_id", userProfile.area_id);
      }
      // ADMIN: see all advisors

      const { data, error } = await query;

      if (error) throw error;
      setAdvisors(data || []);
    } catch (error) {
      console.error("Error loading advisors:", error);
      setAdvisors([]);
    }
  };

  // Load objectives
  const loadObjectives = async () => {
    try {
      const { data, error } = await supabase
        .from("objectives")
        .select("id, name, objective_type")
        .order("name");

      if (error) throw error;
      setObjectives(data || []);
    } catch (error) {
      console.error("Error loading objectives:", error);
      setObjectives([]);
    }
  };

  // Load visit types
  const loadVisitTypes = async () => {
    try {
      const { data, error } = await supabase
        .from("visit_types")
        .select("id, name")
        .order("name");

      if (error) throw error;
      setVisitTypes(data || []);
    } catch (error) {
      console.error("Error loading visit types:", error);
      setVisitTypes([]);
    }
  };

  // Handle execute visit
  const handleExecuteVisit = async () => {
    if (!user || !userProfile || !selectedVisit) return;

    setActionLoading(true);

    try {
      // Executing the visit means marking it as COMPLETED
      const newStatus: VisitStatus = "COMPLETED";

      // Update the visit status
      const { error: updateError } = await supabase
        .from("visits")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", selectedVisit.id);

      if (updateError) throw updateError;

      // Register in audit
      await logAudit({
        visitId: selectedVisit.id,
        action: "EXECUTE",
        changedById: user.id,
        oldStatus: selectedVisit.status,
        newStatus: newStatus,
      });

      // Reload visits
      await loadVisits();
    } catch (error) {
      console.error("Error executing visit:", error);
      setError("Error al ejecutar la visita");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle cancel visit
  const handleCancelVisit = async (reasonId: string, notes: string) => {
    if (!user || !userProfile || !selectedVisit) return;

    setActionLoading(true);

    try {
      // Update the visit status
      const { error: updateError } = await supabase
        .from("visits")
        .update({
          status: "CANCELLED",
          cancel_reason_id: reasonId,
          notes: notes || selectedVisit.notes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedVisit.id);

      if (updateError) throw updateError;

      // Register in audit
      await logAudit({
        visitId: selectedVisit.id,
        action: "CANCEL",
        changedById: user.id,
        oldStatus: selectedVisit.status,
        newStatus: "CANCELLED",
      });

      setCancelModalOpen(false);
      setSelectedVisit(null);
      await loadVisits();
    } catch (error) {
      console.error("Error canceling visit:", error);
      alert("Error al cancelar la visita");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle schedule visit
  const handleScheduleVisit = async (visitData: {
    advisorId: string;
    objectiveId: string;
    visitTypeId: string;
    visitDate: string;
    startTime: string;
    endTime: string;
    notes: string;
  }) => {
    if (!user || !userProfile) return;

    setActionLoading(true);

    try {
      const visitPayload = {
        advisor_id: visitData.advisorId,
        assigned_by_id: user.id,
        objective_id: visitData.objectiveId,
        visit_type_id: visitData.visitTypeId,
        visit_date: visitData.visitDate,
        start_time: visitData.startTime,
        end_time: visitData.endTime,
        notes: visitData.notes || null,
        status: "SCHEDULED" as const,
      };

      // Create the visit
      const { data: newVisit, error: insertError } = await supabase
        .from("visits")
        .insert(visitPayload)
        .select()
        .single();

      if (insertError) throw insertError;

      // Register in audit (optional, does not fail if there is an error)
      await logAudit({
        visitId: newVisit.id,
        action: "CREATE",
        changedById: user.id,
        oldStatus: null,
        newStatus: "SCHEDULED",
      });

      setScheduleModalOpen(false);
      await loadVisits();
      // Scheduled visit successfully - will be reflected in the table
    } catch (error: unknown) {
      console.error("Error scheduling visit:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      setError(`Error al programar la visita: ${errorMessage}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle reassign visit
  const handleReassignVisit = async (newAdvisorId: string) => {
    if (!user || !userProfile || !selectedVisit) return;

    setActionLoading(true);

    try {
      // Update the visit advisor
      const { error: updateError } = await supabase
        .from("visits")
        .update({
          advisor_id: newAdvisorId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedVisit.id);

      if (updateError) throw updateError;

      // Register in audit
      await logAudit({
        visitId: selectedVisit.id,
        action: "REASSIGN",
        changedById: user.id,
        oldStatus: null,
        newStatus: null,
        oldAdvisorId: selectedVisit.advisor_id,
        newAdvisorId: newAdvisorId,
      });

      setReassignModalOpen(false);
      setSelectedVisit(null);
      await loadVisits();
    } catch (error) {
      console.error("Error reassigning visit:", error);
      alert("Error al reasignar la visita");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredVisits = visits.filter((visit) => {
    const searchLower = searchTerm.toLowerCase();

    // Translate visit type to search in Spanish
    const translatedVisitType = translateVisitTypeName(
      visit.visit_type_name
    ).toLowerCase();

    return (
      visit.advisor_email.toLowerCase().includes(searchLower) ||
      visit.objective_name.toLowerCase().includes(searchLower) ||
      visit.visit_type_name.toLowerCase().includes(searchLower) ||
      translatedVisitType.includes(searchLower)
    );
  });

  // Check user roles
  const isChief = userProfile?.role === "CHIEF";
  const isAdmin = userProfile?.role === "ADMIN";
  const canScheduleVisits = isChief || isAdmin;

  return (
    <div className="space-y-6 p-6">
      <ModuleHeader
        title="Gestión de Visitas"
        description={
          isAdmin
            ? "Administra y programa visitas para todos los asesores del sistema. Visualiza el estado de cada visita y realiza las acciones necesarias."
            : isChief
            ? "Gestiona las visitas de tu área, programa nuevas visitas para tus asesores y monitorea su progreso."
            : "Consulta tus visitas programadas, marca como ejecutadas las que hayas completado y cancela las que no se puedan realizar."
        }
        icon={CalendarCheck}
        badge={
          isChief && userProfile?.area_name
            ? { label: userProfile.area_name, icon: Building2 }
            : undefined
        }
        stats={[
          {
            label:
              filteredVisits.length === 1
                ? "visita programada"
                : "visitas programadas",
            value: filteredVisits.length,
          },
        ]}
        action={
          canScheduleVisits ? (
            <Button
              onClick={() => {
                setError(null);
                setScheduleModalOpen(true);
              }}
              size="lg"
              className="shadow-md"
            >
              <Plus className="mr-2 h-5 w-5" />
              Programar Visita
            </Button>
          ) : undefined
        }
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar por asesor, objetivo o tipo de visita..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
          {selectedDate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate("")}
            >
              Limpiar
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha de Creación</TableHead>
              <TableHead>Asesor</TableHead>
              <TableHead>Objetivo</TableHead>
              <TableHead>Tipo de Visita</TableHead>
              <TableHead>Fecha y Hora</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="p-4">
                  <TableSkeleton rows={5} columns={7} />
                </TableCell>
              </TableRow>
            ) : filteredVisits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No se encontraron visitas.
                </TableCell>
              </TableRow>
            ) : (
              filteredVisits.map((visit) => (
                <TableRow key={visit.id}>
                  <TableCell className="whitespace-nowrap text-sm text-gray-600">
                    {formatCreatedAt(visit.created_at)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {visit.advisor_email}
                  </TableCell>
                  <TableCell>{visit.objective_name}</TableCell>
                  <TableCell>
                    {translateVisitTypeName(visit.visit_type_name)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        {formatDateWithoutTimezone(visit.visit_date)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTime12h(visit.start_time)} -{" "}
                        {formatTime12h(visit.end_time)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getVisitStatusBadge(visit.status)}</TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <div className="flex items-center justify-end gap-1">
                        {/* Actions for Advisor - Only scheduled visits */}
                        {!isChief && !isAdmin && (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-block">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedVisit(visit);
                                      setExecuteModalOpen(true);
                                    }}
                                    disabled={
                                      !canExecuteVisit(visit.visit_date)
                                    }
                                    className="h-8 w-8 p-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                  </Button>
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {canExecuteVisit(visit.visit_date)
                                    ? "Ejecutar Visita"
                                    : "Solo se puede ejecutar el día de la visita"}
                                </p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedVisit(visit);
                                    setCancelModalOpen(true);
                                  }}
                                  className="h-8 w-8 p-0 cursor-pointer"
                                >
                                  <XCircle className="h-4 w-4 text-red-600" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Cancelar Visita</p>
                              </TooltipContent>
                            </Tooltip>
                          </>
                        )}

                        {/* Actions for Chief and Admin - Only scheduled visits */}
                        {(isChief || isAdmin) && (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-block">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedVisit(visit);
                                      setExecuteModalOpen(true);
                                    }}
                                    disabled={
                                      !canExecuteVisit(visit.visit_date)
                                    }
                                    className="h-8 w-8 p-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                  </Button>
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {canExecuteVisit(visit.visit_date)
                                    ? "Ejecutar Visita"
                                    : "Solo se puede ejecutar el día de la visita"}
                                </p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedVisit(visit);
                                    setReassignModalOpen(true);
                                  }}
                                  className="h-8 w-8 p-0 cursor-pointer"
                                >
                                  <UserCog className="h-4 w-4 text-purple-600" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Reasignar Visita</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedVisit(visit);
                                    setCancelModalOpen(true);
                                  }}
                                  className="h-8 w-8 p-0 cursor-pointer"
                                >
                                  <XCircle className="h-4 w-4 text-red-600" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Cancelar Visita</p>
                              </TooltipContent>
                            </Tooltip>
                          </>
                        )}
                      </div>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Error message */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 shadow-lg max-w-md">
          <button
            onClick={() => setError(null)}
            className="absolute top-1 right-2 text-red-700 hover:text-red-900 text-xl font-bold leading-none"
          >
            ×
          </button>
          <p className="font-bold pr-6">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Modal to cancel with native selectors */}
      {cancelModalOpen && (
        <CancelVisitModalNative
          open={cancelModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              setError(null);
            }
            setCancelModalOpen(open);
          }}
          onConfirm={handleCancelVisit}
          cancelReasons={cancelReasons}
          isLoading={actionLoading}
        />
      )}

      {/* Modal with native selectors (more stable) */}
      {scheduleModalOpen && (
        <ScheduleVisitModalNative
          open={scheduleModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              setError(null);
            }
            setScheduleModalOpen(open);
          }}
          onConfirm={handleScheduleVisit}
          advisors={advisors}
          objectives={objectives}
          visitTypes={visitTypes}
          isLoading={actionLoading}
        />
      )}

      {/* Modal to reassign with native selectors */}
      {selectedVisit && reassignModalOpen && (
        <ReassignVisitModalNative
          open={reassignModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              setError(null);
            }
            setReassignModalOpen(open);
          }}
          onConfirm={handleReassignVisit}
          advisors={advisors}
          currentAdvisorId={selectedVisit.advisor_id}
          isLoading={actionLoading}
        />
      )}

      {/* Modal to confirm to execute visit */}
      {selectedVisit && executeModalOpen && (
        <ExecuteVisitModal
          open={executeModalOpen}
          onOpenChange={(open: boolean) => {
            if (!open) {
              setError(null);
            }
            setExecuteModalOpen(open);
          }}
          onConfirm={handleExecuteVisit}
          isLoading={actionLoading}
        />
      )}
    </div>
  );
};
