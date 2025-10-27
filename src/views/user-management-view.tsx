import { useEffect, useState } from "react";
import { UserCog, Trash2, Search, Building2, Users } from "lucide-react";

import { ChangeRoleModal } from "@/components/modals/change-role-modal";
import { AssignAreaModal } from "@/components/modals/assign-area-modal";
import { DeleteUserModal } from "@/components/modals/delete-user-modal";
import { PageLoader, TableSkeleton } from "@/components/ui/page-loader";
import { extractSupabaseRelation } from "@/utils/supabase-helpers";
import { AccessDenied } from "@/components/ui/access-denied";
import { useUserProfile } from "@/hooks/use-user-profile";
import { ModuleHeader } from "@/components/module-header";
import { formatDateOnly } from "@/utils/date-formatters";
import type { UserRole, Area } from "@/types/supabase";
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

interface IUserData {
  id: string;
  email: string;
  role: UserRole;
  area_id: string | null;
  area_name?: string | null;
  created_at: string;
}

/**
 * User management component
 * @returns {JSX.Element} User management component
 */
export const UserManagementView: React.FC = () => {
  const { user } = useSupabase();
  const { userProfile, loading: profileLoading } = useUserProfile(user?.id);
  const [users, setUsers] = useState<IUserData[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<IUserData | null>(null);
  const [changeRoleModalOpen, setChangeRoleModalOpen] = useState(false);
  const [assignAreaModalOpen, setAssignAreaModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [userVisitsCount, setUserVisitsCount] = useState<number>(0);

  // Load areas
  useEffect(() => {
    if (user) {
      loadAreas();
    }
  }, [user]);

  // Load users
  useEffect(() => {
    if (user && userProfile) {
      loadUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userProfile]);

  // Load areas
  const loadAreas = async () => {
    try {
      const { data, error } = await supabase
        .from("areas")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;

      setAreas(data || []);
    } catch (error) {
      console.error("Error loading areas:", error);
    }
  };

  // Load users
  const loadUsers = async () => {
    if (!user || !userProfile) return;

    setLoading(true);

    try {
      let query = supabase
        .from("profiles")
        .select(
          `
          id, 
          email, 
          role, 
          area_id,
          created_at,
          area:areas(name)
        `
        )
        .neq("id", user.id) // Exclude current user from the query
        .order("created_at", { ascending: false });

      // If user is CHIEF, filter only users from their area from the query
      if (userProfile.role === "CHIEF" && userProfile.area_id) {
        query = query.eq("area_id", userProfile.area_id);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedUsers: IUserData[] = (data || []).map((u: { id: string; email: string; role: string; area_id: string | null; created_at: string; area?: { name: string } | { name: string }[] | null }) => {
        const area = extractSupabaseRelation<{ name: string }>(u.area);
        return {
          id: u.id,
          email: u.email,
          role: u.role as UserRole,
          area_id: u.area_id,
          area_name: area?.name || null,
          created_at: u.created_at,
        };
      });

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error loading users:", error);
      setError("Error al cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  // Check user visits
  const checkUserVisits = async (userId: string) => {
    try {
      // Check visits where the user is the assigned advisor
      const { count: advisorCount, error: advisorError } = await supabase
        .from("visits")
        .select("id", { count: "exact", head: true })
        .eq("advisor_id", userId);

      if (advisorError) throw advisorError;

      // Check visits where the user is the one who created/scheduled them
      const { count: assignedByCount, error: assignedByError } = await supabase
        .from("visits")
        .select("id", { count: "exact", head: true })
        .eq("assigned_by_id", userId);

      if (assignedByError) throw assignedByError;

      // Total associated visits
      const totalVisits = (advisorCount || 0) + (assignedByCount || 0);
      setUserVisitsCount(totalVisits);
    } catch (error) {
      console.error("Error checking user visits:", error);
      setUserVisitsCount(0);
    }
  };

  // Handle change role
  const handleChangeRole = async (newRole: UserRole) => {
    if (!user || !selectedUser) return;

    setActionLoading(true);

    try {
      // Preventive validation: If changing to CHIEF, check if the area already has a chief
      if (newRole === "CHIEF" && selectedUser.area_id) {
        const { data: existingChief, error: checkError } = await supabase
          .from("profiles")
          .select("id, email")
          .eq("area_id", selectedUser.area_id)
          .eq("role", "CHIEF")
          .neq("id", selectedUser.id) // Exclude current user
          .maybeSingle();

        if (checkError) throw checkError;

        if (existingChief) {
          setError(
            `No se puede asignar el rol de Jefe de Área. Esta área ya tiene un jefe asignado (${existingChief.email}). Primero debe cambiar el rol del jefe actual o reasignarlo a otra área.`
          );
          setActionLoading(false);
          return;
        }
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", selectedUser.id);

      if (updateError) throw updateError;

      setChangeRoleModalOpen(false);
      await loadUsers();
    } catch (error: unknown) {
      console.error("Error changing role:", error);

      // If error is unique constraint for CHIEF per area, show error
      const dbError = error as { code?: string; message?: string };
      if (
        dbError?.code === "23505" &&
        dbError?.message?.includes("unique_chief_per_area")
      ) {
        setError(
          "No se puede asignar el rol de Jefe de Área. Esta área ya tiene un jefe asignado. Cada área solo puede tener un único jefe."
        );
      } else {
        setError("Error al cambiar el rol del usuario");
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Handle assign area
  const handleAssignArea = async (areaId: string | null) => {
    if (!user || !selectedUser) return;

    setActionLoading(true);

    try {
      // Preventive validation: If user is CHIEF and is being assigned an area, check if they already have a chief
      if (selectedUser.role === "CHIEF" && areaId) {
        const { data: existingChief, error: checkError } = await supabase
          .from("profiles")
          .select("id, email")
          .eq("area_id", areaId)
          .eq("role", "CHIEF")
          .neq("id", selectedUser.id) // Exclude current user
          .maybeSingle();

        if (checkError) throw checkError;

        if (existingChief) {
          setError(
            `No se puede asignar esta área. Ya tiene un Jefe de Área asignado (${existingChief.email}). Primero debe cambiar el rol del jefe actual o reasignarlo a otra área.`
          );
          setActionLoading(false);
          return;
        }
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ area_id: areaId })
        .eq("id", selectedUser.id);

      if (updateError) throw updateError;

      setAssignAreaModalOpen(false);
      await loadUsers();
    } catch (error: unknown) {
      console.error("Error assigning area:", error);

      // If error is unique constraint for CHIEF per area, show error
      const dbError = error as { code?: string; message?: string };
      if (
        dbError?.code === "23505" &&
        dbError?.message?.includes("unique_chief_per_area")
      ) {
        setError(
          "No se puede asignar esta área. Ya tiene un Jefe de Área asignado. Cada área solo puede tener un único jefe."
        );
      } else {
        setError("Error al asignar el área");
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!user || !selectedUser || !userProfile) return;

    // Prevent user from deleting themselves
    if (selectedUser.id === user.id) {
      setError("No puedes eliminar tu propio usuario");
      return;
    }

    // CHIEF can only delete ADVISORS
    if (userProfile.role === "CHIEF" && selectedUser.role !== "ADVISOR") {
      setError("Solo puedes eliminar asesores");
      setDeleteModalOpen(false);
      return;
    }

    setActionLoading(true);

    try {
      const { error: deleteError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", selectedUser.id);

      if (deleteError) throw deleteError;

      setDeleteModalOpen(false);
      await loadUsers();
    } catch (error: unknown) {
      console.error("Error deleting user:", error);
      setError("Error al eliminar el usuario");
    } finally {
      setActionLoading(false);
    }
  };

  // Get role badge
  /**
   * Get role badge
   * @param {UserRole} role - The role to get the badge for
   * @returns {JSX.Element} The role badge
   */
  const getRoleBadge = (role: UserRole) => {
    const roleConfig: Record<
      UserRole,
      { label: string; variant: "default" | "secondary" | "outline" }
    > = {
      ADMIN: { label: "Administrador", variant: "default" },
      CHIEF: { label: "Jefe de Área", variant: "secondary" },
      ADVISOR: { label: "Asesor", variant: "outline" },
    };

    const config = roleConfig[role];

    return (
      <Badge variant={config.variant} className="w-fit">
        {config.label}
      </Badge>
    );
  };

  // Filter users
  /**
   * Filter users
   * @param {IUserData} user - The user to filter
   * @returns {IUserData[]} The filtered users
   */
  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchLower) ||
      user.area_name?.toLowerCase().includes(searchLower)
    );
  });

  // If user is not ADMIN or CHIEF, show access denied
  /**
   * If user is not ADMIN or CHIEF, show access denied
   * @returns {JSX.Element} Access denied component
   */
  if (
    userProfile &&
    userProfile.role !== "ADMIN" &&
    userProfile.role !== "CHIEF"
  ) {
    return (
      <AccessDenied description="Solo los administradores y jefes de área pueden acceder a esta sección" />
    );
  }

  if (profileLoading || loading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6 p-6">
      <ModuleHeader
        title="Gestión de Usuarios"
        description={
          userProfile?.role === "ADMIN"
            ? "Administra todos los usuarios del sistema, asigna roles y áreas de trabajo"
            : "Administra los asesores de tu área de forma eficiente"
        }
        icon={Users}
        badge={
          userProfile?.role === "CHIEF" && userProfile.area_name
            ? { label: userProfile.area_name, icon: Building2 }
            : undefined
        }
        stats={[
          {
            label: users.length === 1 ? "usuario" : "usuarios",
            value: users.length,
          },
        ]}
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por email o área..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Fecha de Registro</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="p-4">
                  <TableSkeleton rows={5} columns={5} />
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  {searchTerm
                    ? "No se encontraron usuarios"
                    : "No hay usuarios registrados"}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((userData) => (
                <TableRow key={userData.id}>
                  <TableCell className="font-medium">
                    {userData.email}
                  </TableCell>
                  <TableCell>{getRoleBadge(userData.role)}</TableCell>
                  <TableCell>
                    {userData.area_name ? (
                      <div className="flex items-center gap-2">
                        <Building2 className="h-3 w-3 text-blue-600" />
                        <span className="text-sm">{userData.area_name}</span>
                      </div>
                    ) : (
                      <Badge variant="destructive" className="text-xs">
                        Sin área asignada
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatDateOnly(userData.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <div className="flex items-center justify-end gap-1">
                        {/* ADMIN: Todas las acciones */}
                        {userProfile?.role === "ADMIN" && (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUser(userData);
                                    setAssignAreaModalOpen(true);
                                  }}
                                  disabled={userData.id === user?.id}
                                  className="h-8 w-8 p-0 cursor-pointer"
                                >
                                  <Building2 className="h-4 w-4 text-purple-600" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Asignar Área</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUser(userData);
                                    setChangeRoleModalOpen(true);
                                  }}
                                  disabled={userData.id === user?.id}
                                  className="h-8 w-8 p-0 cursor-pointer"
                                >
                                  <UserCog className="h-4 w-4 text-blue-600" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Cambiar Rol</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={async () => {
                                    setSelectedUser(userData);
                                    await checkUserVisits(userData.id);
                                    setDeleteModalOpen(true);
                                  }}
                                  disabled={userData.id === user?.id}
                                  className="h-8 w-8 p-0 cursor-pointer"
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {userData.id === user?.id
                                    ? "No puedes eliminarte a ti mismo"
                                    : "Eliminar Usuario"}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </>
                        )}

                        {/* CHIEF: Solo eliminar asesores */}
                        {userProfile?.role === "CHIEF" &&
                          userData.role === "ADVISOR" && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={async () => {
                                    setSelectedUser(userData);
                                    await checkUserVisits(userData.id);
                                    setDeleteModalOpen(true);
                                  }}
                                  className="h-8 w-8 p-0 cursor-pointer"
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Eliminar Asesor</p>
                              </TooltipContent>
                            </Tooltip>
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

      {/* Mensaje de error */}
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

      {/* Modal de cambiar rol */}
      {selectedUser && changeRoleModalOpen && (
        <ChangeRoleModal
          open={changeRoleModalOpen}
          onOpenChange={(open: boolean) => {
            if (!open) {
              setError(null);
            }
            setChangeRoleModalOpen(open);
          }}
          onConfirm={handleChangeRole}
          currentRole={selectedUser.role}
          userEmail={selectedUser.email}
          currentUserRole={userProfile?.role || null}
          userId={selectedUser.id}
          userAreaId={selectedUser.area_id}
          isLoading={actionLoading}
        />
      )}

      {/* Modal de asignar área */}
      {selectedUser && assignAreaModalOpen && (
        <AssignAreaModal
          open={assignAreaModalOpen}
          onOpenChange={(open: boolean) => {
            if (!open) {
              setError(null);
            }
            setAssignAreaModalOpen(open);
          }}
          onConfirm={handleAssignArea}
          currentAreaId={selectedUser.area_id}
          userEmail={selectedUser.email}
          userId={selectedUser.id}
          userRole={selectedUser.role}
          areas={areas}
          isLoading={actionLoading}
        />
      )}

      {/* Modal de eliminar usuario */}
      {selectedUser && deleteModalOpen && (
        <DeleteUserModal
          open={deleteModalOpen}
          onOpenChange={(open: boolean) => {
            if (!open) {
              setError(null);
            }
            setDeleteModalOpen(open);
          }}
          onConfirm={handleDeleteUser}
          userEmail={selectedUser.email}
          visitsCount={userVisitsCount}
          isLoading={actionLoading}
        />
      )}
    </div>
  );
};
