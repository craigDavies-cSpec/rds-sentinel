// Chaos Network Latency Injector Engine (Phase 9C)

export interface ChaosNetworkState {
  isChaosEnabled: boolean;
  injectedLatencyMs: number;
  droppedPacketsCount: number;
}

export function injectChaosLatency(
  enabled: boolean,
  latencyMs: number = 250
): ChaosNetworkState {
  if (!enabled) {
    return {
      isChaosEnabled: false,
      injectedLatencyMs: 0,
      droppedPacketsCount: 0,
    };
  }

  return {
    isChaosEnabled: true,
    injectedLatencyMs: Math.max(0, latencyMs),
    droppedPacketsCount: Math.floor(Math.random() * 3),
  };
}
