import { readCsvFile } from './fileAccess';

export interface UserVacationData {
  username: string;
  vacation_days: number;
}

const VACATION_DAYS_FILE = 'vacation-days.csv';

/**
 * Load user vacation data from CSV file
 * @returns Array of user vacation data
 */
export function loadVacationData(): UserVacationData[] {
  try {
    const data = readCsvFile<UserVacationData>(VACATION_DAYS_FILE);
    console.log(`Loaded ${data.length} vacation days records`);
    return data;
  } catch (error) {
    console.error('Error loading vacation data:', error);
    return [];
  }
}

/**
 * Get user's vacation days
 * @param username The username to look up
 * @returns The number of vacation days for the user, or undefined if not found
 */
export function getUserVacationDays(username: string): number | undefined {
    const data = loadVacationData();
    return data.find(user => user.username.toLowerCase() === username.toLowerCase())?.vacation_days;
}
