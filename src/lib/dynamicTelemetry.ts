/**
 * Ingestion and telemetry control logic.
 * Implements adaptive scraping intervals to minimize AWS API charges and
 * a telemetry backpressure outbox queue with exponential backoff and circuit breaking.
 */

export interface TelemetryPayload {
  instanceId: string;
  timestamp: string;
  metrics: {
    cpu: number;
    connections: number;
    iops: number;
    freeStorageBytes: number;
  };
}

/**
 * 1. DYNAMIC SCRAPING INTERVAL CALCULATOR (AWS Expert Audit)
 * Computes next scrape interval in milliseconds based on current database load and subscription level.
 * - Under heavy load (CPU > 80% or high connections), scrape more frequently to capture detail.
 * - Under idle loads, expand scrape windows to save AWS API call costs.
 */
export function calculateNextIntervalMs(
  currentCpu: number,
  connections: number,
  tier: "trial" | "small" | "medium" | "enterprise"
): number {
  const BASE_INTERVAL_MINUTES = {
    trial: 10,       // Trial limits rate
    small: 5,        // Standard rate
    medium: 3,       // Higher resolution
    enterprise: 1,   // Real-time resolution
  };

  const baseMinutes = BASE_INTERVAL_MINUTES[tier] || 5;
  const baseMs = baseMinutes * 60 * 1000;

  // If DB is experiencing a spike (CPU > 85% or connections nearing exhaustion)
  // we scale down the interval to capture real-time behavior (down to 30s minimum)
  if (currentCpu > 85 || connections > 100) {
    return Math.max(30 * 1000, baseMs / 3); // Scrape 3x faster under stress
  }

  // If DB is completely idle (CPU < 15%)
  // we increase the interval to save API costs (up to 2x idle margin)
  if (currentCpu < 15 && connections < 5) {
    return baseMs * 2;
  }

  return baseMs;
}

/**
 * 2. TELEMETRY BACKPRESSURE OUTBOX QUEUE (Developer & QA Audits)
 * Manages telemetries queued for delivery. If the server or database collector fails,
 * queues the payloads, retries with exponential backoff, and trips a circuit breaker
 * to prevent thread locks or API flood.
 */
export class TelemetryOutboxQueue {
  private queue: TelemetryPayload[] = [];
  private maxQueueSize = 500;
  private retryDelayMs = 2000;
  private backoffFactor = 2;
  private maxRetryDelayMs = 60 * 1000; // Cap backoff at 1 minute
  private circuitBreakerState: "CLOSED" | "OPEN" | "HALF-OPEN" = "CLOSED";
  private consecutiveFailures = 0;
  private failureThreshold = 3;

  constructor() {}

  /**
   * Adds a telemetry record to the queue. If queue is full, drops oldest metrics (backpressure).
   */
  public enqueue(payload: TelemetryPayload): void {
    if (this.queue.length >= this.maxQueueSize) {
      this.queue.shift(); // Drop oldest payload to protect memory
    }
    this.queue.push(payload);
  }

  /**
   * Gets current queue count.
   */
  public size(): number {
    return this.queue.length;
  }

  /**
   * Returns current circuit breaker status.
   */
  public getStatus() {
    return {
      state: this.circuitBreakerState,
      consecutiveFailures: this.consecutiveFailures,
      queueCount: this.queue.length,
      retryDelayMs: this.retryDelayMs,
    };
  }

  /**
   * Simulates telemetry submission to the AWS performance endpoint.
   * If connection fails, increments failure counts and calculates exponential backoff.
   */
  public async processQueue(sendTelemetryFn: (payload: TelemetryPayload) => Promise<boolean>): Promise<void> {
    if (this.circuitBreakerState === "OPEN") {
      // Circuit is open; skip processing to prevent resource exhaustion
      return;
    }

    while (this.queue.length > 0) {
      const payload = this.queue[0];

      try {
        const success = await sendTelemetryFn(payload);

        if (success) {
          this.queue.shift(); // Successfully sent, remove from queue
          this.consecutiveFailures = 0;
          this.retryDelayMs = 2000; // Reset retry interval
          this.circuitBreakerState = "CLOSED";
        } else {
          throw new Error("Target destination endpoint offline");
        }
      } catch (error) {
        this.consecutiveFailures++;
        this.retryDelayMs = Math.min(this.maxRetryDelayMs, this.retryDelayMs * this.backoffFactor);

        if (this.consecutiveFailures >= this.failureThreshold) {
          this.circuitBreakerState = "OPEN";
          // Trip circuit open and trigger automatic recovery trigger in 30 seconds
          setTimeout(() => {
            this.circuitBreakerState = "HALF-OPEN";
            this.consecutiveFailures = 0;
          }, 30000);
        }
        break; // Stop processing further items for this tick
      }
    }
  }
}
