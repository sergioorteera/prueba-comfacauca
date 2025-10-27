/**
 * Extract Supabase relation data
 * Handles the case where Supabase returns arrays or single objects for relations
 * @template T - The type of the relation data
 * @param {T | T[] | null | undefined} relation - The relation data from Supabase
 * @returns {T | null} The extracted relation data or null
 */
export const extractSupabaseRelation = <T>(
  relation: T | T[] | null | undefined
): T | null => {
  if (!relation) return null;
  return Array.isArray(relation) ? relation[0] || null : relation;
};

/**
 * Extract multiple Supabase relations
 * @template T - The type of the relation data
 * @param {Array<T | T[] | null | undefined>} relations - Array of relation data from Supabase
 * @returns {Array<T | null>} Array of extracted relations
 */
export const extractSupabaseRelations = <T>(
  relations: Array<T | T[] | null | undefined>
): Array<T | null> => {
  return relations.map((relation) => extractSupabaseRelation(relation));
};

