import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const DATA_DIR = path.join(__dirname, '../../data');

interface VacationRequest {
  id: number;
  employeeName: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
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
 * Gets the list of valid users
 * @returns Array of usernames
 */
export function getUsers(): string[] {
  const data = readYamlFile<{ users: string[] }>('users.yaml');
  return data.users;
}

/**
 * Adds a new user to the users.yaml file
 * @param username The username to add
 * @returns true if successful, false if user already exists
 */
export function addUser(username: string): boolean {
  const data = readYamlFile<{ users: string[] }>('users.yaml');
  
  // Check if user already exists
  if (data.users.includes(username.toLowerCase())) {
    return false;
  }
  
  // Add user and write back to file
  data.users.push(username.toLowerCase());
  writeYamlFile('users.yaml', data);
  return true;
}

/**
 * Gets the list of vacation requests
 * @returns Array of vacation requests
 */
export function getVacationRequests(): VacationRequest[] {
  const data = readYamlFile<{ vacation_requests: VacationRequest[] }>('vacation-requests.yaml');
  return data.vacation_requests;
}

/**
 * Gets the chat responses mapping
 * @returns Object mapping keywords to responses
 */
export function getChatResponses(): { [key: string]: string } {
  const data = readYamlFile<{ chat_responses: { [key: string]: string } }>('chat-responses.yaml');
  return data.chat_responses;
} 