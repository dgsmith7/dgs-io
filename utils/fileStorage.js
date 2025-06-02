import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the projects data file
const projectsDataPath = path.join(__dirname, "..", "data", "projects.json");

// Ensure data directory exists
const dataDir = path.dirname(projectsDataPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

/**
 * Read projects data from file
 * @returns {Array} Array of project objects
 */
export function getAllProjects() {
  try {
    if (!fs.existsSync(projectsDataPath)) {
      return [];
    }
    const data = fs.readFileSync(projectsDataPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading projects data:", error);
    return [];
  }
}

/**
 * Write projects data to file
 * @param {Array} projects - Array of project objects
 */
export function saveProjects(projects) {
  try {
    fs.writeFileSync(projectsDataPath, JSON.stringify(projects, null, 2));
  } catch (error) {
    console.error("Error saving projects data:", error);
    throw error;
  }
}

/**
 * Get a single project by ID
 * @param {number} id - Project ID
 * @returns {Object|null} Project object or null if not found
 */
export function getProjectById(id) {
  const projects = getAllProjects();
  return projects.find((project) => project.id === parseInt(id)) || null;
}

/**
 * Initialize projects data from backup file
 * This should only be run once to migrate from database to file storage
 */
export function initializeProjectsFromBackup() {
  const backupPath = path.join(
    __dirname,
    "..",
    "backups",
    "db_backup_2025-06-02T03-42-43-248Z.json"
  );

  try {
    if (!fs.existsSync(backupPath)) {
      throw new Error("Backup file not found");
    }

    const backupData = JSON.parse(fs.readFileSync(backupPath, "utf8"));
    const projects = backupData.projects || [];

    saveProjects(projects);
    console.log(`Initialized ${projects.length} projects from backup`);
    return projects;
  } catch (error) {
    console.error("Error initializing projects from backup:", error);
    throw error;
  }
}
