import { open } from "sqlite";
import sqlite3 from "sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "rds-sentinel.db");

export async function getDbConnection() {
  return open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });
}

export async function initDb() {
  const db = await getDbConnection();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS layout_settings (
      id TEXT PRIMARY KEY,
      panel_order TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
  // Insert default layout if empty
  await db.run(
    `INSERT OR IGNORE INTO layout_settings (id, panel_order, updated_at) 
     VALUES ('default', '["databases", "balancer", "logs"]', ? )`,
    new Date().toISOString()
  );
  await db.close();
}
