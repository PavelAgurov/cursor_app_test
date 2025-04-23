/**
 * Calculate end date based on start date and duration
 * @param startDate The start date of the vacation in YYYY-MM-DD format
 * @param duration The duration of the vacation
 * @param unit The unit of duration (days, weeks, etc.)
 * @returns The end date as a string in YYYY-MM-DD format
 */
export function calculateEndDate(startDate: string, duration: number, unit: string): string {
  const start = new Date(startDate);
  const end = new Date(start);
  
  switch (unit.toLowerCase()) {
    case 'day':
    case 'days':
      end.setDate(start.getDate() + duration - 1); // -1 because the start day counts as a vacation day
      break;
    case 'week':
    case 'weeks':
      end.setDate(start.getDate() + duration * 7 - 1);
      break;
    case 'month':
    case 'months':
      end.setMonth(start.getMonth() + duration);
      end.setDate(end.getDate() - 1);
      break;
    default:
      // Default to days if unit is not recognized
      end.setDate(start.getDate() + duration - 1);
  }
  
  return end.toISOString().split('T')[0]; // Format as YYYY-MM-DD
}

/**
 * Validates if a string is in the YYYY-MM-DD format
 * @param dateStr The date string to validate
 * @returns True if the date is valid, false otherwise
 */
export function isValidDateFormat(dateStr: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}

/**
 * Checks if end date is after or equal to start date
 * @param startDate The start date in YYYY-MM-DD format
 * @param endDate The end date in YYYY-MM-DD format
 * @returns True if end date is valid (after or equal to start date), false otherwise
 */
export function isValidDateRange(startDate: string, endDate: string): boolean {
  return new Date(endDate) >= new Date(startDate);
} 

/**
 * Creates a formatted date string in a readable format
 * @returns Current date in a readable format
 */
export function getFormattedDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
} 