import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import fs from 'fs';
import path from 'path';
import { parse, stringify } from 'yaml';
import { getUserByUsername } from '../dataService';

interface VacationRequest {
  id: number;
  employeeName: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface VacationRequests {
  vacation_requests: VacationRequest[];
}

/**
 * Check if a user has admin privileges
 * @param username The username to check
 * @returns True if the user is an admin, false otherwise
 */
function isUserAdmin(username: string): boolean {
  try {
    const user = getUserByUsername(username);
    return user?.role === 'admin';
  } catch (error) {
    console.error(`Error checking admin status for user ${username}:`, error);
    return false;
  }
}

/**
 * Check if a user is authorized to submit a vacation request for another user
 * @param currentUser The user making the request
 * @param targetUser The user for whom the vacation request is being submitted
 * @returns True if access is allowed, false otherwise
 */
function isAuthorizedToSubmit(currentUser: string, targetUser: string): boolean {
  // Users can always submit their own vacation requests
  if (currentUser.toLowerCase() === targetUser.toLowerCase()) {
    return true;
  }
  
  // Only admins can submit vacation requests for other users
  return isUserAdmin(currentUser);
}

/**
 * Calculate end date based on start date and duration
 * @param startDate The start date of the vacation
 * @param duration The duration of the vacation
 * @param unit The unit of duration (days, weeks, etc.)
 * @returns The end date as a string in YYYY-MM-DD format
 */
function calculateEndDate(startDate: string, duration: number, unit: string): string {
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
 * Load vacation requests from YAML file
 * @returns Vacation requests object
 */
function loadVacationRequests(): VacationRequests {
  try {
    const filePath = path.join(__dirname, '../../../data/vacation-requests.yaml');
    if (!fs.existsSync(filePath)) {
      console.error('Vacation requests file not found');
      return { vacation_requests: [] };
    }
    
    // Read the file content directly each time
    const fileContent = fs.readFileSync(filePath, 'utf8');
    console.log('Reading vacation requests directly from file');
    
    // Parse YAML content
    const data = parse(fileContent) as VacationRequests;
    
    // Ensure the data structure is valid
    if (!data || !data.vacation_requests || !Array.isArray(data.vacation_requests)) {
      console.error('Invalid vacation requests data structure');
      return { vacation_requests: [] };
    }
    
    console.log(`Loaded ${data.vacation_requests.length} vacation requests from file`);
    return data;
  } catch (error) {
    console.error('Error loading vacation requests:', error);
    return { vacation_requests: [] };
  }
}

/**
 * Save vacation requests to YAML file
 * @param requests Vacation requests object
 * @returns Success status
 */
function saveVacationRequests(requests: VacationRequests): boolean {
  try {
    const filePath = path.join(__dirname, '../../../data/vacation-requests.yaml');
    const yamlContent = stringify(requests);
    fs.writeFileSync(filePath, yamlContent, 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving vacation requests:', error);
    return false;
  }
}

/**
 * Get the next available ID for a new vacation request
 * @param requests Existing vacation requests
 * @returns The next available ID
 */
function getNextId(requests: VacationRequest[]): number {
  if (requests.length === 0) {
    return 1;
  }
  
  const maxId = Math.max(...requests.map(req => req.id));
  return maxId + 1;
}

/**
 * Creates a tool for submitting vacation requests
 * @returns The vacation request submission tool
 */
export function createVacationRequestTool() {
  return new DynamicStructuredTool({
    name: "submit_vacation_request",
    description: `
      Use this tool when a user wants to submit a vacation request.
      Accepts either a start date and end date, or a start date and duration.
      Admin users can submit requests for any employee, regular users can only submit for themselves.
    `,
    schema: z.object({
      username: z.string().describe("The username of the person for whom the vacation request is being submitted"),
      startDate: z.string().describe("The start date of the vacation in YYYY-MM-DD format"),
      endDate: z.string().optional().describe("The end date of the vacation in YYYY-MM-DD format (optional if duration is provided)"),
      duration: z.number().optional().describe("The duration of the vacation (optional if endDate is provided)"),
      durationUnit: z.string().optional().describe("The unit of duration (days, weeks, months) - only needed if duration is provided"),
      currentUser: z.string().describe("The username of the current user who is making the request")
    }),
    func: async ({ username, startDate, endDate, duration, durationUnit, currentUser }) => {
      console.log(`Vacation Request Tool: User ${currentUser} is submitting a vacation request for ${username}`);
      
      // Validate date format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
        return `Invalid start date format. Please use YYYY-MM-DD format (e.g., 2023-06-15).`;
      }
      
      // Calculate end date if duration is provided
      let finalEndDate = endDate;
      if (!finalEndDate && duration && durationUnit) {
        finalEndDate = calculateEndDate(startDate, duration, durationUnit);
      } else if (!finalEndDate) {
        return `Either end date or duration with unit must be provided.`;
      }
      
      // Check if the end date format is valid
      if (!/^\d{4}-\d{2}-\d{2}$/.test(finalEndDate)) {
        return `Invalid end date format. Please use YYYY-MM-DD format (e.g., 2023-06-22).`;
      }
      
      // Check if end date is after start date
      if (new Date(finalEndDate) < new Date(startDate)) {
        return `The end date must be after the start date.`;
      }
      
      // Check if the current user is authorized to submit a vacation request for the specified user
      if (!isAuthorizedToSubmit(currentUser, username)) {
        return `Access denied. You do not have permission to submit vacation requests for ${username}.`;
      }
      
      // Get the user's full name from username (or use the username if full name is not available)
      const user = getUserByUsername(username);
      const employeeName = user ? user.username : username; // In a real system, you'd use the user's full name
      
      // Load existing vacation requests
      const vacationRequests = loadVacationRequests();
      
      // Create a new vacation request
      const newRequest: VacationRequest = {
        id: getNextId(vacationRequests.vacation_requests),
        employeeName,
        startDate,
        endDate: finalEndDate,
        status: 'pending'
      };
      
      // Add the new request
      vacationRequests.vacation_requests.push(newRequest);
      
      // Save the updated vacation requests
      const saveSuccess = saveVacationRequests(vacationRequests);
      
      if (saveSuccess) {
        return `Vacation request for ${username} from ${startDate} to ${finalEndDate} has been submitted successfully. Status: pending`;
      } else {
        return `Failed to save the vacation request. Please try again later.`;
      }
    }
  });
}

/**
 * Get all vacation requests
 * @returns Array of vacation requests
 */
export function getAllVacationRequests(): VacationRequest[] {
  const data = loadVacationRequests();
  return data.vacation_requests;
} 