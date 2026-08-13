import { WebSocketStreamListener } from "../webSocketStream";
import { queryGraphQLTelemetry } from "../graphQLResolver";
import { injectChaosLatency } from "../chaosNetwork";

describe("webSocketStream module", () => {
  it("should connect and disconnect WebSocket stream listener", () => {
    const stream = new WebSocketStreamListener();
    expect(stream.getStatus()).toBe(false);

    stream.connect(() => {});
    expect(stream.getStatus()).toBe(true);

    stream.disconnect();
    expect(stream.getStatus()).toBe(false);
  });
});

describe("graphQLResolver module", () => {
  it("should resolve getInstances GraphQL query", () => {
    const res = queryGraphQLTelemetry("query { getInstances { id name } }");
    expect(res.data.getInstances).toBeDefined();
    expect(res.data.getInstances?.length).toBeGreaterThan(0);
  });

  it("should resolve getHealthScore GraphQL query", () => {
    const res = queryGraphQLTelemetry("query { getHealthScore }");
    expect(res.data.getHealthScore).toBe(94);
  });

  it("should handle unknown query fields gracefully", () => {
    const res = queryGraphQLTelemetry("query { unknownField }");
    expect(res.errors).toBeDefined();
  });
});

describe("chaosNetwork module", () => {
  it("should inject network latency when chaos enabled", () => {
    const state = injectChaosLatency(true, 350);
    expect(state.isChaosEnabled).toBe(true);
    expect(state.injectedLatencyMs).toBe(350);
  });

  it("should return zero latency when chaos disabled", () => {
    const state = injectChaosLatency(false);
    expect(state.isChaosEnabled).toBe(false);
    expect(state.injectedLatencyMs).toBe(0);
  });
});
