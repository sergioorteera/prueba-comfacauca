import type { UserRole } from "./supabase";

/**
 * Visit with changes interface (for change history view)
 * @interface VisitWithChanges
 */
export interface VisitWithChanges {
  visit_id: string;
  objective_name: string;
  visit_type_name: string;
  advisor_email: string;
  visit_date: string;
  start_time: string;
  end_time: string;
  current_status: string;
  changes_count: number;
  latest_change: string;
  created_at: string;
}

/**
 * Audit detail interface (for visit history)
 * @interface AuditDetail
 */
export interface AuditDetail {
  id: string;
  action: string;
  changed_by_email: string;
  old_status: string | null;
  new_status: string | null;
  old_advisor_email: string | null;
  new_advisor_email: string | null;
  created_at: string;
}

/**
 * User profile interface (with area information)
 * @interface UserProfile
 */
export interface UserProfile {
  role: UserRole;
  area_id: string | null;
  area_name: string | null;
}

/**
 * Audit record interface (from Supabase query)
 * @interface AuditRecord
 */
export interface AuditRecord {
  visit_id: string;
  created_at: string;
  visit:
    | {
        id: string;
        visit_date: string;
        start_time: string;
        end_time: string;
        status: string;
        created_at: string;
        advisor:
          | { email: string; area_id: string | null }
          | { email: string; area_id: string | null }[];
        objective: { name: string } | { name: string }[];
        visit_type: { name: string } | { name: string }[];
      }
    | {
        id: string;
        visit_date: string;
        start_time: string;
        end_time: string;
        status: string;
        created_at: string;
        advisor:
          | { email: string; area_id: string | null }
          | { email: string; area_id: string | null }[];
        objective: { name: string } | { name: string }[];
        visit_type: { name: string } | { name: string }[];
      }[];
}

/**
 * User email record interface (simple user info)
 * @interface UserEmailRecord
 */
export interface UserEmailRecord {
  id: string;
  email: string;
}

/**
 * Audit raw record interface (from Supabase query)
 * @interface AuditRawRecord
 */
export interface AuditRawRecord {
  id: string;
  action: string;
  old_status: string | null;
  new_status: string | null;
  old_advisor_id: string | null;
  new_advisor_id: string | null;
  created_at: string;
  changed_by_id: string;
}
