/**
 * Format date without timezone problem
 * @param {string} dateString - Date string in format YYYY-MM-DD
 * @returns {string} Formatted date in format DD/MM/YYYY
 */
export const formatDateWithoutTimezone = (dateString: string): string => {
  if (!dateString || dateString === "N/A") return "N/A";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

/**
 * Format time from 24h to 12h with AM/PM
 * @param {string} time24 - Time string in 24h format (HH:MM)
 * @returns {string} Formatted time in 12h format with AM/PM
 */
export const formatTime12h = (time24: string): string => {
  if (!time24 || time24 === "N/A") return "N/A";

  const [hours24, minutes] = time24.split(":");
  const hours = parseInt(hours24, 10);

  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12; // Convert 0 to 12

  return `${hours12}:${minutes} ${period}`;
};

/**
 * Check if a visit can be executed (only on the current or past day)
 * @param {string} visitDate - Visit date string in format YYYY-MM-DD
 * @returns {boolean} True if the visit can be executed
 */
export const canExecuteVisit = (visitDate: string): boolean => {
  if (!visitDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset hours to compare only dates

  const visitDateObj = new Date(visitDate + "T00:00:00"); // Avoid timezone problem

  // Only can be executed if the visit date is today or past
  return visitDateObj <= today;
};

/**
 * Format a created_at timestamp to localized string
 * @param {string} timestamp - ISO timestamp string
 * @param {string} locale - Locale string (default: "es-CO")
 * @returns {string} Formatted date and time string
 */
export const formatCreatedAt = (
  timestamp: string,
  locale: string = "es-CO"
): string => {
  if (!timestamp) return "N/A";

  return new Date(timestamp).toLocaleString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format a date to localized date string (no time)
 * @param {string} timestamp - ISO timestamp string
 * @param {string} locale - Locale string (default: "es-ES")
 * @returns {string} Formatted date string
 */
export const formatDateOnly = (
  timestamp: string,
  locale: string = "es-ES"
): string => {
  if (!timestamp) return "N/A";

  return new Date(timestamp).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};