import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { getAllVacationRequests as getVacationRequestsFromFile } from './tools/vacationRequestTool';

const DATA_DIR = path.join(__dirname, '../../data');

interface VacationRequest {
  id: number;
  employeeName: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface User {
  username: string;
  role: 'admin' | 'user';
}

/**
 * Reads and parses a YAML file
 * @param filename The name of the YAML file to read
 * @returns The parsed YAML data
 */
function readYamlFile<T>(filename: string): T {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return yaml.load(fileContents) as T;
  } catch (error) {
    console.error(`Error reading YAML file ${filename}:`, error);
    throw new Error(`Failed to read data from ${filename}`);
  }
}

/**
 * Writes data to a YAML file
 * @param filename The name of the YAML file to write
 * @param data The data to write to the file
 */
function writeYamlFile<T>(filename: string, data: T): void {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const yamlStr = yaml.dump(data);
    fs.writeFileSync(filePath, yamlStr, 'utf8');
    console.log(`Successfully wrote data to ${filename}`);
  } catch (error) {
    console.error(`Error writing YAML file ${filename}:`, error);
    throw new Error(`Failed to write data to ${filename}`);
  }
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

/**
 * Checks if a user has admin role
 * @param username The username to check
 * @returns true if user has admin role, false otherwise
 */
export function isUserAdmin(username: string): boolean {
  const user = getUserByUsername(username);
  return user?.role === 'admin';
}

/**
 * Gets the list of vacation requests directly from the file
 * @returns Array of vacation requests
 */
export function getVacationRequests(): VacationRequest[] {
  // Get vacation requests directly from the file each time
  return getVacationRequestsFromFile();
} 