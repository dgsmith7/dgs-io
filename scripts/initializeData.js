#!/usr/bin/env node
import { initializeProjectsFromBackup } from "./utils/fileStorage.js";

try {
  initializeProjectsFromBackup();
  console.log("Projects data initialized successfully");
} catch (error) {
  console.error("Failed to initialize projects data:", error);
  process.exit(1);
}
