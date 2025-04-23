import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export interface HRPolicy {
  topic: string;
  text: string;
}

const hr_general_data_filePath = path.join(__dirname, '../../data/hr_general_data.csv');

/**
 * Load HR policy data from CSV file
 * @returns Array of HR policies
 */
export function loadHRPolicyData(): HRPolicy[] {
  try {
    if (!fs.existsSync(hr_general_data_filePath)) {
      console.error('HR policy data file not found');
      return [];
    }
    
    const fileContent = fs.readFileSync(hr_general_data_filePath, 'utf8');
    
    // Parse CSV data
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });
    
    console.log(`Loaded ${records.length} HR policies`);
    return records as HRPolicy[];
  } catch (error) {
    console.error('Error loading HR policy data:', error);
    return [];
  }
}

/**
 * Get HR policy by topic
 * @param topic The topic to search for
 * @returns The policy text if found, undefined otherwise
 */
export function getHRPolicyByTopic(topic: string): string | undefined {
  const policies = loadHRPolicyData();
  const policy = policies.find(p => 
    p.topic.toLowerCase() === topic.toLowerCase()
  );
  return policy?.text;
}

/**
 * Search HR policies by keyword
 * @param keyword The keyword to search for
 * @returns Array of matching HR policies
 */
export function searchHRPoliciesByKeyword(keyword: string): HRPolicy[] {
  const policies = loadHRPolicyData();
  const lowerKeyword = keyword.toLowerCase();
  return policies.filter(p => 
    p.topic.toLowerCase().includes(lowerKeyword) || 
    p.text.toLowerCase().includes(lowerKeyword)
  );
} 