import {
  ACTION_TRANSLATIONS,
  STATUS_TRANSLATIONS,
  VISIT_TYPE_TRANSLATIONS,
} from "./constants";

/**
 * Translate action
 * @param {string} action - Action to translate
 * @returns {string} Translated action
 */
export const translateAction = (action: string): string => {
  return ACTION_TRANSLATIONS[action] || action;
};

/**
 * Translate status
 * @param {string | null} status - Status to translate
 * @returns {string} Translated status
 */
export const translateStatus = (status: string | null): string => {
  if (!status) return "N/A";
  return STATUS_TRANSLATIONS[status] || status;
};

/**
 * Translate visit type
 * @param {string} type - Visit type to translate
 * @returns {string} Translated visit type
 */
export const translateVisitType = (type: string): string => {
  return VISIT_TYPE_TRANSLATIONS[type] || type;
};

/**
 * Translate visit type name to Spanish with fallback
 * @param {string} name - Visit type name to translate
 * @returns {string} Translated visit type name
 */
export const translateVisitTypeName = (name: string): string => {
  const translations: Record<string, string> = {
    BUSINESS: "Empresarial",
    INDIVIDUAL: "Individual",
    COMMERCIAL: "Comercial",
    FOLLOW_UP: "Seguimiento",
    COMPLAINT: "Atención de Reclamo",
    PRESENTATION: "Presentación de Producto",
    RENEWAL: "Renovación de Contrato",
  };

  if (translations[name]) {
    return translations[name];
  }

  // If not found in translations, capitalize first letter
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};
