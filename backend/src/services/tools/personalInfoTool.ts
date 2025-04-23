import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { isAuthorizedToView } from "../authService";
import { getUserVacationDays } from "../../dataAccess/vacationDaysAccess";

// Define an enum for the supported information types
enum InfoType {
  VACATION_DAYS = "vacation_days"
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
    `,
    schema: z.object({
      username: z.string().describe("The username of the person requesting information"),
      infoType: z.enum([InfoType.VACATION_DAYS])
        .describe(`The type of information requested. Available options: 
          - ${InfoType.VACATION_DAYS}: Number of vacation days available`),
      currentUser: z.string().describe("The username of the current user who is making the request")
    }),
    func: async ({ username, infoType, currentUser }) => {
      console.log(`Personal Info Tool: User ${currentUser} requested ${infoType} for ${username}`);
      
      // Check if the current user is authorized to view the requested information
      if (!isAuthorizedToView(currentUser, username)) {
        return `Access denied. You do not have permission to view ${username}'s information.`;
      }
      
      switch (infoType) {
        case InfoType.VACATION_DAYS:
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
          
        default:
          return `Sorry, I don't have information about ${infoType} for user ${username}.`;
      }
    }
  });
} 