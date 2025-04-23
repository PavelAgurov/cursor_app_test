import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const DATA_DIR = path.join(__dirname, '../../data');

/**
 * Reads and parses a YAML file
 * @param filename The name of the YAML file to read
 * @returns The parsed YAML data
 */
export function readYamlFile<T>(filename: string): T {
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
export function writeYamlFile<T>(filename: string, data: T): void {
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
 * Read YAML file from an absolute path
 * @param filePath The absolute path to the YAML file
 * @returns The parsed YAML data
 */
export function readYamlFileFromPath<T>(filePath: string): T {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      throw new Error(`File not found: ${filePath}`);
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return yaml.load(fileContent) as T;
  } catch (error) {
    console.error(`Error reading YAML file ${filePath}:`, error);
    throw new Error(`Failed to read data from ${filePath}`);
  }
}

/**
 * Write YAML data to an absolute path
 * @param filePath The absolute path to the YAML file
 * @param data The data to write
 * @returns Success status
 */
export function writeYamlFileToPath<T>(filePath: string, data: T): boolean {
  try {
    const yamlContent = yaml.dump(data);
    fs.writeFileSync(filePath, yamlContent, 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing YAML file ${filePath}:`, error);
    return false;
  }
} 