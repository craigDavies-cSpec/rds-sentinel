"use server";

import { getDbConnection, initDb } from "@/lib/db";

export async function getLayoutAction(): Promise<string[]> {
  try {
    await initDb();
    const db = await getDbConnection();
    const row = await db.get("SELECT panel_order FROM layout_settings WHERE id = 'default'");
    await db.close();
    if (row && row.panel_order) {
      return JSON.parse(row.panel_order);
    }
  } catch (err) {
    console.error("Failed to read layout configuration:", err);
  }
  return ["databases", "balancer", "logs"];
}

export async function saveLayoutAction(panelOrder: string[]): Promise<boolean> {
  try {
    await initDb();
    const db = await getDbConnection();
    await db.run(
      `INSERT OR REPLACE INTO layout_settings (id, panel_order, updated_at) 
       VALUES ('default', ?, ?)`,
      JSON.stringify(panelOrder),
      new Date().toISOString()
    );
    await db.close();
    return true;
  } catch (err) {
    console.error("Failed to save layout configuration:", err);
    return false;
  }
}
