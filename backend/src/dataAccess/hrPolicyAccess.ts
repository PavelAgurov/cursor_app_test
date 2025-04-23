import { readCsvFile } from './fileAccess';

export interface HRPolicy {
  topic: string;
  text: string;
}

const HR_GENERAL_DATA_FILE = 'hr_general_data.csv';

/**
 * Load HR policy data from CSV file
 * @returns Array of HR policies
 */
export function loadHRPolicyData(): HRPolicy[] {
  try {
    const data = readCsvFile<HRPolicy>(HR_GENERAL_DATA_FILE);
    console.log(`Loaded ${data.length} HR policies`);
    return data;
  } catch (error) {
    console.error('Error loading HR policy data:', error);
    return [];
  }
}

