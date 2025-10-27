import { useEffect, useState } from "react";
import { Search, Building2, History, Eye } from "lucide-react";

import { translateStatus, translateVisitType } from "@/utils/translators";
import { getActionBadge, getStatusBadge } from "@/utils/badge-helpers";
import { extractSupabaseRelation } from "@/utils/supabase-helpers";
import { AccessDenied } from "@/components/ui/access-denied";
import { useUserProfile } from "@/hooks/use-user-profile";
import { ModuleHeader } from "@/components/module-header";
import { formatCreatedAt } from "@/utils/date-formatters";
import { useSupabase } from "@/hooks/use-supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import supabase from "@/lib/supabase";
import {
  PageLoader,
  TableSkeleton,
  ModalLoadingSkeleton,
} from "@/components/ui/page-loader";
import type {
  VisitWithChanges,
  AuditDetail,
  AuditRecord,
  UserEmailRecord,
  AuditRawRecord,
} from "@/types/visit-audit";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  formatDateWithoutTimezone,
  formatTime12h,
} from "@/utils/date-formatters";

/**
 * Change history component
 * @returns {JSX.Element} Change history component
 */
export const ChangeHistoryView: React.FC = () => {
  const { user } = useSupabase();
  const { userProfile, loading: profileLoading } = useUserProfile(user?.id);
  const [visits, setVisits] = useState<VisitWithChanges[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVisit, setSelectedVisit] = useState<VisitWithChanges | null>(
    null
  );
  const [visitHistory, setVisitHistory] = useState<AuditDetail[]>([]);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Load visits
  useEffect(() => {
    if (user && userProfile) {
      loadVisits();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userProfile]);

  // Load visits
  const loadVisits = async () => {
    if (!user || !userProfile) return;

    setLoading(true);

    try {
      // First, get all visits with audit
      const { data: auditData, error: auditError } = await supabase
        .from("visit_audit")
        .select(
          `
          visit_id,
          created_at,
          visit:visits(
            id,
            visit_date,
            start_time,
            end_time,
            status,
            created_at,
            advisor:profiles!visits_advisor_id_fkey(email, area_id),
            objective:objectives(name),
            visit_type:visit_types(name)
          )
        `
        )
        .order("created_at", { ascending: false });

      if (auditError) {
        console.error("Error al cargar auditoría:", auditError);
        throw auditError;
      }

      // Group by visit_id and count changes
      const visitsMap = new Map<string, VisitWithChanges>();

      (auditData || []).forEach((record: AuditRecord) => {
        const visit = extractSupabaseRelation(record.visit);
        if (!visit) return;

        const advisor = extractSupabaseRelation(visit.advisor);
        const objective = extractSupabaseRelation(visit.objective);
        const visitType = extractSupabaseRelation(visit.visit_type);

        if (!visitsMap.has(record.visit_id)) {
          visitsMap.set(record.visit_id, {
            visit_id: record.visit_id,
            objective_name: objective?.name || "N/A",
            visit_type_name: visitType?.name || "N/A",
            advisor_email: advisor?.email || "N/A",
            visit_date: visit?.visit_date || "N/A",
            start_time: visit?.start_time || "N/A",
            end_time: visit?.end_time || "N/A",
            current_status: visit?.status || "N/A",
            changes_count: 1,
            latest_change: record.created_at,
            created_at: visit?.created_at || record.created_at, // Real creation date of the visit
          });
        } else {
          const existing = visitsMap.get(record.visit_id)!;
          existing.changes_count += 1;
          // Keep the most recent change
          if (new Date(record.created_at) > new Date(existing.latest_change)) {
            existing.latest_change = record.created_at;
          }
        }
      });

      const visitsList = Array.from(visitsMap.values());

      // If CHIEF, filter only visits of their area
      // The RLS (Row Level Security) handles the filtering automatically
      if (userProfile.role === "CHIEF" && userProfile.area_id) {
        // Filtering is handled by RLS policies at the database level
      }

      // Sort by creation date (most recent first)
      visitsList.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setVisits(visitsList);
    } catch (error) {
      console.error("❌ Error loading visits:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load visit history
  const loadVisitHistory = async (visitId: string) => {
    setHistoryLoading(true);

    try {
      const { data, error } = await supabase
        .from("visit_audit")
        .select(
          `
          id,
          action,
          old_status,
          new_status,
          old_advisor_id,
          new_advisor_id,
          created_at,
          changed_by_id
        `
        )
        .eq("visit_id", visitId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get emails of users who made changes and advisors
      const changedByIds = [
        ...new Set((data || []).map((d) => d.changed_by_id).filter(Boolean)),
      ];
      const advisorIds = [
        ...new Set(
          (data || [])
            .flatMap((d) => [d.old_advisor_id, d.new_advisor_id])
            .filter(Boolean)
        ),
      ];
      const allUserIds = [...new Set([...changedByIds, ...advisorIds])];

      const userEmailsMap = new Map<string, string>();
      if (allUserIds.length > 0) {
        const { data: usersData } = await supabase
          .from("profiles")
          .select("id, email")
          .in("id", allUserIds);

        if (usersData) {
          usersData.forEach((user: UserEmailRecord) => {
            userEmailsMap.set(user.id, user.email);
          });
        }
      }

      const formattedHistory: AuditDetail[] = (data || []).map(
        (record: AuditRawRecord) => {
          return {
            id: record.id,
            action: record.action,
            changed_by_email: record.changed_by_id
              ? userEmailsMap.get(record.changed_by_id) || "Usuario desconocido"
              : "Sistema",
            old_status: record.old_status,
            new_status: record.new_status,
            old_advisor_email: record.old_advisor_id
              ? userEmailsMap.get(record.old_advisor_id) || null
              : null,
            new_advisor_email: record.new_advisor_id
              ? userEmailsMap.get(record.new_advisor_id) || null
              : null,
            created_at: record.created_at,
          };
        }
      );

      setVisitHistory(formattedHistory);
    } catch (error) {
      console.error("❌ Error loading visit history:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Handle view history
  const handleViewHistory = async (visit: VisitWithChanges) => {
    setSelectedVisit(visit);
    setHistoryModalOpen(true);
    await loadVisitHistory(visit.visit_id);
  };

  // Filter visits
  const filteredVisits = visits.filter((visit) => {
    const searchLower = searchTerm.toLowerCase();

    // Format creation date for search
    const createdAtFormatted = formatCreatedAt(visit.created_at).toLowerCase();

    return (
      createdAtFormatted.includes(searchLower) ||
      visit.advisor_email.toLowerCase().includes(searchLower) ||
      visit.objective_name.toLowerCase().includes(searchLower)
    );
  });

  // If user is not CHIEF, show access denied
  if (userProfile && userProfile.role !== "CHIEF") {
    return (
      <AccessDenied description="Solo los jefes de área pueden acceder a esta sección" />
    );
  }

  if (profileLoading || loading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6 p-6">
      <ModuleHeader
        title="Historial de Cambios"
        description="Visualiza todas las modificaciones realizadas en las visitas de tu área. Rastrea cada cambio de estado, reasignación y cancelación"
        icon={History}
        badge={
          userProfile?.area_name
            ? { label: userProfile.area_name, icon: Building2 }
            : undefined
        }
        stats={[
          {
            label:
              visits.length === 1
                ? "visita con cambios"
                : "visitas con cambios",
            value: visits.length,
          },
        ]}
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por fecha de creación, asesor u objetivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha de Creación</TableHead>
              <TableHead>Asesor</TableHead>
              <TableHead>Objetivo de Visita</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Fecha y Hora</TableHead>
              <TableHead>Cambios</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
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
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  <History className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  {searchTerm
                    ? "No se encontraron visitas"
                    : "No hay visitas con cambios registrados"}
                </TableCell>
              </TableRow>
            ) : (
              filteredVisits.map((visit) => (
                <TableRow key={visit.visit_id}>
                  <TableCell className="whitespace-nowrap text-sm text-gray-600">
                    {formatCreatedAt(visit.created_at)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {visit.advisor_email}
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-blue-700">
                      {visit.objective_name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {translateVisitType(visit.visit_type_name)}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        {formatDateWithoutTimezone(visit.visit_date)}
                      </div>
                      {visit.start_time !== "N/A" &&
                        visit.end_time !== "N/A" && (
                          <div className="text-xs text-gray-500">
                            {formatTime12h(visit.start_time)} -{" "}
                            {formatTime12h(visit.end_time)}
                          </div>
                        )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {visit.changes_count}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewHistory(visit)}
                            className="h-8 w-8 p-0 cursor-pointer"
                          >
                            <Eye className="h-4 w-4 text-blue-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Ver Historial Completo</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filteredVisits.length > 0 && (
        <div className="text-sm text-gray-600 text-center">
          Mostrando {filteredVisits.length} de {visits.length} visita(s)
        </div>
      )}

      {/* Modal of history */}
      {historyModalOpen && selectedVisit && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  Historial de Cambios
                </h2>

                {/* Information of the visit in card format */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                  {/* Current Status */}
                  <div>
                    <span className="text-sm font-semibold text-gray-700">
                      Estado Actual:{" "}
                    </span>
                    {getStatusBadge(selectedVisit.current_status)}
                  </div>

                  {/* Objective */}
                  <div>
                    <span className="text-sm font-semibold text-gray-700">
                      Objetivo:{" "}
                    </span>
                    <span className="text-sm text-gray-900">
                      {selectedVisit.objective_name}
                    </span>
                  </div>

                  {/* Visit Type */}
                  <div>
                    <span className="text-sm font-semibold text-gray-700">
                      Tipo de Visita:{" "}
                    </span>
                    <span className="text-sm text-gray-900">
                      {translateVisitType(selectedVisit.visit_type_name)}
                    </span>
                  </div>

                  {/* Responsible */}
                  <div>
                    <span className="text-sm font-semibold text-gray-700">
                      Responsable:{" "}
                    </span>
                    <span className="text-sm text-gray-900">
                      {selectedVisit.advisor_email}
                    </span>
                  </div>

                  {/* Date and Hour */}
                  <div>
                    <span className="text-sm font-semibold text-gray-700">
                      Fecha:{" "}
                    </span>
                    <span className="text-sm text-gray-900">
                      {formatDateWithoutTimezone(selectedVisit.visit_date)}
                    </span>
                    <span className="text-sm font-semibold text-gray-700 ml-4">
                      Hora:{" "}
                    </span>
                    <span className="text-sm text-gray-900">
                      {formatTime12h(selectedVisit.start_time)} -{" "}
                      {formatTime12h(selectedVisit.end_time)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {historyLoading ? (
                <ModalLoadingSkeleton />
              ) : visitHistory.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <History className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p>No hay cambios registrados para esta visita</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {visitHistory.map((change, index) => (
                    <div
                      key={change.id}
                      className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getActionBadge(change.action)}
                            <span className="text-sm text-gray-500">
                              {formatCreatedAt(change.created_at)}
                            </span>
                          </div>
                          <p className="text-sm">
                            <span className="font-semibold">Usuario:</span>{" "}
                            {change.changed_by_email}
                          </p>
                          {/* Only show status change if there is actually a change */}
                          {(change.old_status || change.new_status) &&
                            change.old_status !== change.new_status && (
                              <div className="mt-2 flex items-center gap-2 text-sm">
                                <span className="font-semibold">Estado:</span>
                                {change.old_status && (
                                  <Badge variant="outline">
                                    {translateStatus(change.old_status)}
                                  </Badge>
                                )}
                                {change.old_status && change.new_status && (
                                  <span className="text-gray-400">→</span>
                                )}
                                {change.new_status && (
                                  <Badge variant="outline">
                                    {translateStatus(change.new_status)}
                                  </Badge>
                                )}
                              </div>
                            )}
                          {/* Show advisor change for reassignments */}
                          {change.action === "REASSIGN" &&
                            (change.old_advisor_email ||
                              change.new_advisor_email) && (
                              <div className="mt-2 flex items-center gap-2 text-sm">
                                <span className="font-semibold">Asesor:</span>
                                {change.old_advisor_email && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-purple-100 text-purple-800"
                                  >
                                    {change.old_advisor_email}
                                  </Badge>
                                )}
                                {change.old_advisor_email &&
                                  change.new_advisor_email && (
                                    <span className="text-gray-400">→</span>
                                  )}
                                {change.new_advisor_email && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-blue-100 text-blue-800"
                                  >
                                    {change.new_advisor_email}
                                  </Badge>
                                )}
                              </div>
                            )}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">
                          #{index + 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50">
              <Button
                onClick={() => setHistoryModalOpen(false)}
                className="w-full"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
