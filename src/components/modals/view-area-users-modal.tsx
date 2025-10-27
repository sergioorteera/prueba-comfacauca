import { useEffect, useState } from "react";

import { ModalLoadingSkeleton } from "@/components/ui/page-loader";
import type { Profile } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import supabase from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ViewAreaUsersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  areaId: string;
  areaName: string;
}

/**
 * View area users modal component
 * @param {ViewAreaUsersModalProps} props - Props for the view area users modal component
 * @returns {React.FC} View area users modal component
 */
export const ViewAreaUsersModal: React.FC<ViewAreaUsersModalProps> = ({
  open,
  onOpenChange,
  areaId,
  areaName,
}) => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      loadUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, areaId]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("area_id", areaId)
        .order("role", { ascending: true })
        .order("email", { ascending: true });

      if (error) throw error;

      setUsers(data || []);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Usuarios del Área</DialogTitle>
          <DialogDescription>
            Área: <strong>{areaName}</strong>
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <ModalLoadingSkeleton />
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {users.length === 0 ? (
              <p className="text-center py-8 text-gray-500">
                No hay usuarios asignados a esta área
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "CHIEF" ? "default" : "secondary"
                          }
                        >
                          {user.role === "CHIEF" ? "Jefe de Área" : "Asesor"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
