import { useEffect, useState } from "react";
import { Building2, Plus, Pencil, Trash2, Users, Building } from "lucide-react";

import { ViewAreaUsersModal } from "@/components/modals/view-area-users-modal";
import { CreateAreaModal } from "@/components/modals/create-area-modal";
import { DeleteAreaModal } from "@/components/modals/delete-area-modal";
import { EditAreaModal } from "@/components/modals/edit-area-modal";
import { AccessDenied } from "@/components/ui/access-denied";
import { useUserProfile } from "@/hooks/use-user-profile";
import { ModuleHeader } from "@/components/module-header";
import { ErrorAlert } from "@/components/ui/error-alert";
import { PageLoader } from "@/components/ui/page-loader";
import type { Area, Profile } from "@/types/supabase";
import { useSupabase } from "@/hooks/use-supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface IAreaWithDetails extends Area {
  chief?: Profile | null;
  advisors_count: number;
}

/**
 * Area management view component
 * @returns {JSX.Element} Area management component
 */
export const AreaManagementView: React.FC = () => {
  const { user } = useSupabase();
  const { userProfile, loading: profileLoading } = useUserProfile(user?.id);
  const [areas, setAreas] = useState<IAreaWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<IAreaWithDetails | null>(
    null
  );
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewUsersModalOpen, setViewUsersModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Load areas
  useEffect(() => {
    if (user) {
      loadAreas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Load areas
  const loadAreas = async () => {
    if (!user) return;

    setLoading(true);

    try {
      // Load areas
      const { data: areasData, error: areasError } = await supabase
        .from("areas")
        .select("*")
        .order("name", { ascending: true });

      if (areasError) throw areasError;

      // For each area, load the chief and count advisors
      const areasWithDetails = await Promise.all(
        (areasData || []).map(async (area) => {
          // Load the chief of the area
          const { data: chief } = await supabase
            .from("profiles")
            .select("id, email, role, area_id")
            .eq("area_id", area.id)
            .eq("role", "CHIEF")
            .maybeSingle();

          // Count advisors
          const { count: advisorsCount } = await supabase
            .from("profiles")
            .select("id", { count: "exact", head: true })
            .eq("area_id", area.id)
            .eq("role", "ADVISOR");

          return {
            ...area,
            chief: chief || null,
            advisors_count: advisorsCount || 0,
          };
        })
      );

      setAreas(areasWithDetails);
    } catch (error) {
      console.error("Error loading areas:", error);
      setError("Error al cargar las áreas");
    } finally {
      setLoading(false);
    }
  };

  // Create area
  const handleCreateArea = async (name: string) => {
    if (!user) return;

    setActionLoading(true);

    try {
      const { error: createError } = await supabase
        .from("areas")
        .insert({ name });

      if (createError) throw createError;

      setCreateModalOpen(false);
      await loadAreas();
    } catch (error) {
      console.error("Error creating area:", error);
      setError("Error al crear el área");
    } finally {
      setActionLoading(false);
    }
  };

  // Edit area
  const handleEditArea = async (name: string) => {
    if (!user || !selectedArea) return;

    setActionLoading(true);

    try {
      const { error: updateError } = await supabase
        .from("areas")
        .update({ name })
        .eq("id", selectedArea.id);

      if (updateError) throw updateError;

      setEditModalOpen(false);
      await loadAreas();
    } catch (error) {
      console.error("Error updating area:", error);
      setError("Error al actualizar el área");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete area
  const handleDeleteArea = async () => {
    if (!user || !selectedArea) return;

    setActionLoading(true);

    try {
      // Verify if it has users assigned
      const { count } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("area_id", selectedArea.id);

      if (count && count > 0) {
        setError(
          `No se puede eliminar el área porque tiene ${count} usuario(s) asignado(s)`
        );
        setDeleteModalOpen(false);
        setActionLoading(false);
        return;
      }

      const { error: deleteError } = await supabase
        .from("areas")
        .delete()
        .eq("id", selectedArea.id);

      if (deleteError) throw deleteError;

      setDeleteModalOpen(false);
      await loadAreas();
    } catch (error) {
      console.error("Error deleting area:", error);
      setError("Error al eliminar el área");
    } finally {
      setActionLoading(false);
    }
  };

  // Filter areas
  const filteredAreas = areas.filter((area) => {
    const searchLower = searchTerm.toLowerCase();
    return area.name.toLowerCase().includes(searchLower);
  });

  // Verify if the user is ADMIN
  if (userProfile && userProfile.role !== "ADMIN") {
    return (
      <AccessDenied description="Solo los administradores pueden acceder a esta sección" />
    );
  }

  if (profileLoading || loading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6 p-6">
      <ModuleHeader
        title="Gestión de Áreas"
        description="Crea y administra las áreas del sistema, asigna jefes de área y organiza los equipos de trabajo"
        icon={Building}
        stats={[
          { label: areas.length === 1 ? "área" : "áreas", value: areas.length },
        ]}
        action={
          <Button
            onClick={() => {
              setError(null);
              setCreateModalOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Crear Área
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar por nombre de área..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre del Área</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Jefe de Área</TableHead>
              <TableHead>Asesores</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAreas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  {searchTerm
                    ? "No se encontraron áreas"
                    : "No hay áreas registradas"}
                </TableCell>
              </TableRow>
            ) : (
              filteredAreas.map((area) => (
                <TableRow key={area.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-blue-600" />
                      {area.name}
                    </div>
                  </TableCell>
                  <TableCell>{area.description || "Sin descripción"}</TableCell>
                  <TableCell>
                    {area.chief ? (
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="text-xs">
                          {area.chief.email}
                        </Badge>
                      </div>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        Sin asignar
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {area.advisors_count} asesor
                      {area.advisors_count !== 1 ? "es" : ""}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedArea(area);
                                setViewUsersModalOpen(true);
                              }}
                              className="h-8 w-8 p-0 cursor-pointer"
                            >
                              <Users className="h-4 w-4 text-purple-600" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ver Usuarios del Área</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedArea(area);
                                setEditModalOpen(true);
                              }}
                              className="h-8 w-8 p-0 cursor-pointer"
                            >
                              <Pencil className="h-4 w-4 text-blue-600" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Editar Área</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedArea(area);
                                setDeleteModalOpen(true);
                              }}
                              className="h-8 w-8 p-0 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Eliminar Área</p>
                          </TooltipContent>
                        </Tooltip>
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
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {/* Create area modal */}
      {createModalOpen && (
        <CreateAreaModal
          open={createModalOpen}
          onOpenChange={(open: boolean) => {
            if (!open) setError(null);
            setCreateModalOpen(open);
          }}
          onConfirm={handleCreateArea}
          isLoading={actionLoading}
        />
      )}

      {/* Edit area modal */}
      {selectedArea && editModalOpen && (
        <EditAreaModal
          open={editModalOpen}
          onOpenChange={(open: boolean) => {
            if (!open) setError(null);
            setEditModalOpen(open);
          }}
          onConfirm={handleEditArea}
          area={selectedArea}
          isLoading={actionLoading}
        />
      )}

      {/* Delete area modal */}
      {selectedArea && deleteModalOpen && (
        <DeleteAreaModal
          open={deleteModalOpen}
          onOpenChange={(open: boolean) => {
            if (!open) setError(null);
            setDeleteModalOpen(open);
          }}
          onConfirm={handleDeleteArea}
          areaName={selectedArea.name}
          usersCount={
            (selectedArea.chief ? 1 : 0) + selectedArea.advisors_count
          }
          isLoading={actionLoading}
        />
      )}

      {/* View area users modal */}
      {selectedArea && viewUsersModalOpen && (
        <ViewAreaUsersModal
          open={viewUsersModalOpen}
          onOpenChange={setViewUsersModalOpen}
          areaId={selectedArea.id}
          areaName={selectedArea.name}
        />
      )}
    </div>
  );
};
