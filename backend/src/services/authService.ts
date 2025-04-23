import { getUserByUsername } from '../dataAccess/userAccess';

const ADMIN_ROLE = 'admin';

/**
 * Check if a user is authorized to view another user's information
 * @param currentUser The user making the request
 * @param targetUser The user whose information is being requested
 * @returns True if access is allowed, false otherwise
 */
export function isAuthorizedToView(currentUser: string, targetUser: string): boolean {
  // Users can always view their own information
  if (currentUser.toLowerCase() === targetUser.toLowerCase()) {
    return true;
  }
  
  // Only admins can view other users' information
  return isUserAdmin(currentUser);
}

/**
 * Check if a user is authorized to submit a vacation request for another user
 * @param currentUser The user making the request
 * @param targetUser The user for whom the vacation request is being submitted
 * @returns True if access is allowed, false otherwise
 */
export function isAuthorizedToSubmit(currentUser: string, targetUser: string): boolean {
  // Users can always submit their own vacation requests
  if (currentUser.toLowerCase() === targetUser.toLowerCase()) {
    return true;
  }
  
  // Only admins can submit vacation requests for other users
  return isUserAdmin(currentUser);
}

/**
 * Generic function to check if a current user can perform actions on a target user
 * @param currentUser The user making the request
 * @param targetUser The user who is the target of the action
 * @param actionType The type of action (optional)
 * @returns True if the action is allowed, false otherwise
 */
export function isAuthorized(currentUser: string, targetUser: string, actionType?: string): boolean {
  // Self-actions are always allowed
  if (currentUser.toLowerCase() === targetUser.toLowerCase()) {
    return true;
  }
  
  // For any action on another user, require admin privileges
  return isUserAdmin(currentUser);
} 

/**
 * Checks if a user has admin role
 * @param username The username to check
 * @returns true if user has admin role, false otherwise
 */
export function isUserAdmin(username: string): boolean {
  console.log(`Checking admin status for user ${username}`);
  try {
    const user = getUserByUsername(username);
    console.log(`User found: ${user}`);
    return user?.role === ADMIN_ROLE;
  } catch (error) {
    console.error(`Error checking admin status for user ${username}:`, error);
    return false;
  }
} 