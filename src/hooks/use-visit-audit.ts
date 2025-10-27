import { useCallback } from "react";
import type { VisitStatus } from "@/types/supabase";
import supabase from "@/lib/supabase";

type AuditAction = "CREATE" | "CANCEL" | "REASSIGN" | "EXECUTE" | "UPDATE";

interface AuditLogParams {
  visitId: string;
  action: AuditAction;
  changedById: string;
  oldStatus?: VisitStatus | null;
  newStatus?: VisitStatus | null;
  oldAdvisorId?: string | null;
  newAdvisorId?: string | null;
}

/**
 * Hook to log visit audit events
 * @returns {Object} Object with logAudit function
 */
export const useVisitAudit = () => {
  /**
   * Log an audit event for a visit
   * @param {AuditLogParams} params - Audit parameters
   * @returns {Promise<boolean>} True if audit was logged successfully
   */
  const logAudit = useCallback(async (params: AuditLogParams) => {
    const {
      visitId,
      action,
      changedById,
      oldStatus = null,
      newStatus = null,
      oldAdvisorId = null,
      newAdvisorId = null,
    } = params;

    try {
      const auditPayload = {
        visit_id: visitId,
        action,
        changed_by_id: changedById,
        old_status: oldStatus,
        new_status: newStatus,
        old_advisor_id: oldAdvisorId,
        new_advisor_id: newAdvisorId,
      };

      const { error } = await supabase
        .from("visit_audit")
        .insert(auditPayload)
        .select();

      if (error) {
        console.error(`Error al registrar auditoría ${action}:`, error);
        return false;
      }

      return true;
    } catch (err) {
      console.error(`Excepción al registrar auditoría ${action}:`, err);
      return false;
    }
  }, []);

  return { logAudit };
};
