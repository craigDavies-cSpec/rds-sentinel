import { getLayoutAction, saveLayoutAction } from "@/app/actions";
import fs from "fs";
import path from "path";

describe("Layout Settings DB Unit Tests", () => {
  const dbPath = path.join(process.cwd(), "rds-sentinel.db");

  const cleanup = () => {
    if (fs.existsSync(dbPath)) {
      try {
        fs.unlinkSync(dbPath);
      } catch (e) {}
    }
  };

  beforeEach(() => {
    cleanup();
  });

  afterAll(() => {
    cleanup();
  });

  test("should get default layout, save updated layout, and retrieve updated layout", async () => {
    const initial = await getLayoutAction();
    expect(initial).toEqual(["databases", "balancer", "logs"]);

    const customOrder = ["balancer", "databases", "logs"];
    const saved = await saveLayoutAction(customOrder);
    expect(saved).toBe(true);

    const retrieved = await getLayoutAction();
    expect(retrieved).toEqual(customOrder);
  });

  test("should support consecutive layout updates and overwrite previous layout settings", async () => {
    await saveLayoutAction(["logs", "balancer", "databases"]);
    let current = await getLayoutAction();
    expect(current).toEqual(["logs", "balancer", "databases"]);

    await saveLayoutAction(["balancer", "logs", "databases"]);
    current = await getLayoutAction();
    expect(current).toEqual(["balancer", "logs", "databases"]);
  });
});
