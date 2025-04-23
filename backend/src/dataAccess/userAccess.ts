import { readYamlFile, writeYamlFile } from './fileAccess';

export interface User {
  username: string;
  role: 'admin' | 'user';
}

/**
 * Gets all user records
 * @returns Array of user objects
 */
export function getAllUsers(): User[] {
  const data = readYamlFile<{ users: User[] }>('users.yaml');
  return data.users;
}

/**
 * Gets a user by username
 * @param username The username to look up
 * @returns User object if found, undefined otherwise
 */
export function getUserByUsername(username: string): User | undefined {
  const users = getAllUsers();
  return users.find(user => user.username.toLowerCase() === username.toLowerCase());
}

/**
 * Adds a new user to the users.yaml file
 * @param username The username to add
 * @param role The role to assign to the user (defaults to 'user')
 * @returns true if successful, false if user already exists
 */
export function addUser(username: string, role: 'admin' | 'user' = 'user'): boolean {
  const data = readYamlFile<{ users: User[] }>('users.yaml');
  
  // Check if user already exists
  if (data.users.some(user => user.username.toLowerCase() === username.toLowerCase())) {
    return false;
  }
  
  // Add user and write back to file
  data.users.push({
    username: username.toLowerCase(),
    role
  });
  writeYamlFile('users.yaml', data);
  return true;
}

