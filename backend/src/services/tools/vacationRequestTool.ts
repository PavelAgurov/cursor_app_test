import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { isAuthorizedToSubmit } from '../authService';
import { calculateEndDate, isValidDateFormat, isValidDateRange } from '../../utils/dateUtils';
import { getUserByUsername } from '../../dataAccess/userAccess';
import { createNewVacationRequest } from '../../dataAccess/vacationAccess';

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
      if (!isValidDateFormat(startDate)) {
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
      if (!isValidDateFormat(finalEndDate)) {
        return `Invalid end date format. Please use YYYY-MM-DD format (e.g., 2023-06-22).`;
      }
      
      // Check if end date is after start date
      if (!isValidDateRange(startDate, finalEndDate)) {
        return `The end date must be after the start date.`;
      }
      
      // Check if the current user is authorized to submit a vacation request for the specified user
      if (!isAuthorizedToSubmit(currentUser, username)) {
        return `Access denied. You do not have permission to submit vacation requests for ${username}.`;
      }
      
      // Get the user's full name from username (or use the username if full name is not available)
      const user = getUserByUsername(username);
      const employeeName = user ? user.username : username; // In a real system, you'd use the user's full name
      
      // Create and save the new vacation request
      const saveSuccess = createNewVacationRequest(employeeName, startDate, finalEndDate);
      
      if (saveSuccess) {
        return `Vacation request for ${username} from ${startDate} to ${finalEndDate} has been submitted successfully. Status: pending`;
      } else {
        return `Failed to save the vacation request. Please try again later.`;
      }
    }
  });
}

