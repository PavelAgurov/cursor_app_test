import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

interface UserVacationData {
  username: string;
  vacation_days: number;
}

/**
 * Load user vacation data from CSV file
 * @returns Array of user vacation data
 */
function loadVacationData(): UserVacationData[] {
  try {
    let filePath = path.join(__dirname, '../../../data/vacation-days.csv');
    if (!fs.existsSync(filePath)) {
      console.error('Vacation days data file not found');
      return [];
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
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
function getUserVacationDays(username: string): number | undefined {
  const vacationData = loadVacationData();
  const userRecord = vacationData.find(user => user.username.toLowerCase() === username.toLowerCase());
  return userRecord?.vacation_days;
}

/**
 * Creates a tool for querying personal user information
 * @returns The personal information query tool
 */
export function createPersonalInfoTool() {
  return new DynamicStructuredTool({
    name: "personal_info_query",
    description: `
      Use this tool when a user asks about their personal information like vacation days, etc.
      User can ask information about another person.
    `,
    schema: z.object({
      username: z.string().describe("The username of the person requesting information"),
      infoType: z.string().describe("The type of information requested (e.g., vacation_days)"),
      currentUser: z.string().describe("The username of the current user who is making the request")
    }),
    func: async ({ username, infoType, currentUser }) => {
      console.log(`Personal Info Tool: User ${currentUser} requested ${infoType} for ${username}`);
      
      if (infoType.toLowerCase() === 'vacation_days' || 
          infoType.toLowerCase() === 'vacation days' ||
          infoType.toLowerCase() === 'vacationdays') {
        const vacationDays = getUserVacationDays(username);
        
        if (vacationDays !== undefined) {
          // Check if the request is about the current user or someone else
          const isCurrentUser = username.toLowerCase() === currentUser.toLowerCase();
          if (isCurrentUser) {
            return `You have ${vacationDays} vacation days available.`;
          } else {
            return `${username} has ${vacationDays} vacation days available.`;
          }
        } else {
          return `Sorry, I couldn't find vacation information for user ${username}.`;
        }
      }
      
      return `Sorry, I don't have information about ${infoType} for user ${username}.`;
    }
  });
} 