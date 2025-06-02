import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

async function backupDatabase() {
  console.log("Starting database backup...");

  let pool;
  const databaseData = {};

  try {
    // Create connection string from env variables
    let cString =
      "mysql://" +
      process.env.MYSQL_USER +
      ":" +
      process.env.MYSQL_PASSWORD +
      "@" +
      process.env.MYSQL_HOST +
      ":" +
      process.env.MYSQL_PORT +
      "/" +
      process.env.MYSQL_DATABASE;

    // Create connection pool - don't call .promise() since we're already using mysql2/promise
    pool = mysql.createPool(cString);

    // Get list of all tables in the database
    const [tables] = await pool.query(
      `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = ?;
    `,
      [process.env.MYSQL_DATABASE]
    );

    // For each table, fetch all rows and add to databaseData
    for (const table of tables) {
      const tableName = table.TABLE_NAME || table.table_name; // Handle different case formats
      console.log(`Backing up table: ${tableName}`);

      const [rows] = await pool.query(`SELECT * FROM ${tableName};`);
      databaseData[tableName] = rows;
    }

    // Create backup directory if it doesn't exist
    const backupDir = path.join(process.cwd(), "backups");
    try {
      await fs.mkdir(backupDir, { recursive: true });
    } catch (err) {
      if (err.code !== "EEXIST") throw err;
    }

    // Create filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `db_backup_${timestamp}.json`;
    const filePath = path.join(backupDir, filename);

    // Write data to file
    await fs.writeFile(filePath, JSON.stringify(databaseData, null, 2));

    console.log(`Database backup completed successfully: ${filePath}`);
  } catch (error) {
    console.error("Error backing up database:", error);
    throw error;
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

// Execute the backup function
backupDatabase().catch((err) => {
  console.error("Database backup failed:", err);
  process.exit(1);
});
