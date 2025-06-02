import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Extract projects data from backup and create static JSON file
 */
function createStaticProjectsData() {
  const backupPath = path.join(
    __dirname,
    "..",
    "backups",
    "db_backup_2025-06-02T03-42-43-248Z.json"
  );
  const outputPath = path.join(
    __dirname,
    "..",
    "public",
    "data",
    "projects.json"
  );

  try {
    console.log("Reading backup file...");
    const backupData = JSON.parse(fs.readFileSync(backupPath, "utf8"));
    const projects = backupData.projects || [];

    console.log(`Found ${projects.length} projects`);

    // Process projects to clean up date format and ensure all required fields
    const processedProjects = projects.map((project) => {
      // Clean up the date format like the original app.js does
      if (project.open_date_gmt) {
        let arr = project.open_date_gmt.toString().split(" ");
        arr[5] = "";
        project.open_date_gmt = arr.join(" ");
      }
      return project;
    });

    // Write to public/data directory for static access
    fs.writeFileSync(outputPath, JSON.stringify(processedProjects, null, 2));

    console.log(
      `Successfully created ${outputPath} with ${processedProjects.length} projects`
    );
    return processedProjects;
  } catch (error) {
    console.error("Error creating static projects data:", error);
    throw error;
  }
}

// Run the function
console.log("Starting script...");
try {
  createStaticProjectsData();
  console.log("Script completed successfully");
} catch (error) {
  console.error("Script failed:", error);
  process.exit(1);
}
