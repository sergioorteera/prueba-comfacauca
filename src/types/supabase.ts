/**
 * Database interface
 * @interface Database
 */
export interface Database {
  public: {
    Tables: {
      Views: {
        [_ in never]: never;
      };
      Functions: {
        [_ in never]: never;
      };
      Enums: {
        [_ in never]: never;
      };
      CompositeTypes: {
        [_ in never]: never;
      };
    };
  };
}

/**
 * User role type
 * @type {UserRole}
 */
export type UserRole = "ADMIN" | "CHIEF" | "ADVISOR";
export type VisitStatus =
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

/**
 * Area interface
 * @interface Area
 */
export interface Area {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

/**
 * Profile interface
 * @interface Profile
 */
export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  area_id: string | null;
  created_at: string;
}
