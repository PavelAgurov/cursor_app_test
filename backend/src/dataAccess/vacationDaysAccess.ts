import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export interface UserVacationData {
  username: string;
  vacation_days: number;
}

const vacation_days_filePath = path.join(__dirname, '../../data/vacation-days.csv');

/**
 * Load user vacation data from CSV file
 * @returns Array of user vacation data
 */
export function loadVacationData(): UserVacationData[] {
  try {
    if (!fs.existsSync(vacation_days_filePath)) {
      console.error('Vacation days data file not found');
      return [];
    }
    
    const fileContent = fs.readFileSync(vacation_days_filePath, 'utf8');
    
    // Parse CSV data
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });
    
    // Convert vacation_days from string to number
    const vacationData = records.map((record: any) => ({
      username: record.username,
      vacation_days: parseInt(record.vacation_days)
    }));
    
    console.log(`Loaded vacation data for ${vacationData.length} users`);
    return vacationData;
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
  const vacationData = loadVacationData();
  const userRecord = vacationData.find(user => user.username.toLowerCase() === username.toLowerCase());
  return userRecord?.vacation_days;
}

/**
 * Update user's vacation days
 * @param username The username to update
 * @param days The new number of vacation days
 * @returns True if successful, false otherwise
 */
export function updateUserVacationDays(username: string, days: number): boolean {
  try {
    let vacationData = loadVacationData();
    const userIndex = vacationData.findIndex(user => user.username.toLowerCase() === username.toLowerCase());
    
    if (userIndex === -1) {
      // User not found, add new record
      vacationData.push({
        username,
        vacation_days: days
      });
    } else {
      // Update existing record
      vacationData[userIndex].vacation_days = days;
    }
    
    // Write updated data back to file
    const csvContent = generateCsvContent(vacationData);
    fs.writeFileSync(vacation_days_filePath, csvContent);
    
    return true;
  } catch (error) {
    console.error(`Error updating vacation days for user ${username}:`, error);
    return false;
  }
}

/**
 * Generate CSV content from vacation data
 * @param data Array of user vacation data
 * @returns CSV formatted string
 */
function generateCsvContent(data: UserVacationData[]): string {
  // Generate header
  let content = 'username,vacation_days\n';
  
  // Generate rows
  data.forEach(item => {
    content += `${item.username},${item.vacation_days}\n`;
  });
  
  return content;
} 