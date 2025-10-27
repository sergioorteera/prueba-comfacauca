import { useEffect, useState } from "react";
import type { UserRole } from "@/types/supabase";
import supabase from "@/lib/supabase";

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  area_id: string | null;
  area_name: string | null;
}

/**
 * Hook to load the user profile
 * @param {string | undefined} userId - The user ID to load the profile for
 * @returns {Object} Object with the user profile, loading state, and error
 */
export const useUserProfile = (userId: string | undefined) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from("profiles")
          .select("id, email, role, area_id, area:areas(name)")
          .eq("id", userId)
          .single();

        if (fetchError) throw fetchError;

        // Extract area name
        const area = Array.isArray(data?.area) ? data.area[0] : data?.area;

        setUserProfile({
          id: data.id,
          email: data.email,
          role: data.role as UserRole,
          area_id: data.area_id,
          area_name: area?.name || null,
        });
      } catch (err) {
        console.error("Error loading user profile:", err);
        setError(
          err instanceof Error ? err.message : "Error al cargar el perfil"
        );
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [userId]);

  return { userProfile, loading, error };
};
