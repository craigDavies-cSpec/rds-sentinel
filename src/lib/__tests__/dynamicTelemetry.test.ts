import { calculateNextIntervalMs, TelemetryOutboxQueue } from "../dynamicTelemetry";

describe("Telemetry Ingestion & Backpressure Queue", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("calculateNextIntervalMs", () => {
    test("should return 30 seconds scrape interval when CPU is spiked (> 85%) on Enterprise", () => {
      const interval = calculateNextIntervalMs(90, 10, "enterprise");
      expect(interval).toBe(30000); // 30s (capped floor limit)
    });

    test("should return 60 seconds scrape interval when CPU is spiked (> 85%) on Medium", () => {
      const interval = calculateNextIntervalMs(90, 10, "medium");
      expect(interval).toBe(60000); // 180s / 3 = 60s
    });

    test("should double the base interval when database is idle (CPU < 15% and low connections)", () => {
      const baseMediumMs = 3 * 60 * 1000; // 3 minutes base for medium tier
      const interval = calculateNextIntervalMs(10, 2, "medium");
      expect(interval).toBe(baseMediumMs * 2); // 6 minutes (360,000 ms)
    });

    test("should return base tier interval when load is normal (e.g. 40% CPU)", () => {
      const baseMediumMs = 3 * 60 * 1000;
      const interval = calculateNextIntervalMs(40, 12, "medium");
      expect(interval).toBe(baseMediumMs);
    });

    test("should calculate correct intervals across trial and small business tiers", () => {
      expect(calculateNextIntervalMs(50, 10, "trial")).toBe(600000); // 10m base
      expect(calculateNextIntervalMs(50, 10, "small")).toBe(300000); // 5m base
    });
  });

  describe("TelemetryOutboxQueue Circuit Breaker & Backpressure", () => {
    let outbox: TelemetryOutboxQueue;

    beforeEach(() => {
      outbox = new TelemetryOutboxQueue();
    });

    test("should enqueue payloads and track queue size", () => {
      outbox.enqueue({
        instanceId: "test-db",
        timestamp: new Date().toISOString(),
        metrics: { cpu: 20, connections: 5, iops: 100, freeStorageBytes: 1024 }
      });
      expect(outbox.size()).toBe(1);
    });

    test("should cap maximum outbox queue capacity to prevent memory leaks", () => {
      for (let i = 0; i < 600; i++) {
        outbox.enqueue({
          instanceId: `test-db-${i}`,
          timestamp: new Date().toISOString(),
          metrics: { cpu: 20, connections: 5, iops: 100, freeStorageBytes: 1024 }
        });
      }
      expect(outbox.size()).toBeLessThanOrEqual(500);
    });

    test("should trip circuit breaker to OPEN state after 3 failures and recover to CLOSED after HALF-OPEN success", async () => {
      // Enqueue payloads
      for (let i = 0; i < 4; i++) {
        outbox.enqueue({
          instanceId: "test-db",
          timestamp: new Date().toISOString(),
          metrics: { cpu: 20, connections: 5, iops: 100, freeStorageBytes: 1024 }
        });
      }

      // Process queue with failing mock target function
      const failingSubmit = jest.fn().mockResolvedValue(false);
      
      // 1st failure
      await outbox.processQueue(failingSubmit);
      expect(outbox.getStatus().state).toBe("CLOSED");

      // 2nd failure
      await outbox.processQueue(failingSubmit);
      expect(outbox.getStatus().state).toBe("CLOSED");

      // 3rd failure - trips breaker to OPEN
      await outbox.processQueue(failingSubmit);
      expect(outbox.getStatus().state).toBe("OPEN");

      // Fast forward the circuit recovery timeout (30 seconds)
      jest.advanceTimersByTime(30000);

      // Verify circuit shifts to HALF-OPEN
      expect(outbox.getStatus().state).toBe("HALF-OPEN");

      // Process with successful submit to transition back to CLOSED
      const successfulSubmit = jest.fn().mockResolvedValue(true);
      await outbox.processQueue(successfulSubmit);
      expect(outbox.getStatus().state).toBe("CLOSED");
      expect(outbox.getStatus().consecutiveFailures).toBe(0);
    });
  });
});
