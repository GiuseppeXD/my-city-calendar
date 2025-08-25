// Utility functions for date handling to avoid timezone issues

/**
 * Parse date string (YYYY-MM-DD) to Date object in local timezone
 * Avoids timezone issues that occur with new Date(dateString)
 */
export const parseHolidayDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day); // month is 0-indexed
};

/**
 * Format date to YYYY-MM-DD string
 */
export const formatHolidayDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // month is 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};