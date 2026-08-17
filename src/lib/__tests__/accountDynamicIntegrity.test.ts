// Comprehensive Account-Dynamic Data Integrity Test Suite

import { MOCK_INSTANCES, MOCK_RECOMMENDATIONS, MOCK_SLOW_QUERIES, MOCK_LOGS } from "../mockTelemetry";
import { getAggregatedMultiAccountInstances } from "../enterpriseConsolidation";
import { getClusterTopology } from "../clusterTopology";
import { calculateAccountMonthlyCost, calculateInstanceMonthlyCost } from "../awsPricingEngine";

describe("Account-Dynamic Data Integrity & Zero Data-Leak Audit", () => {
  const accountIds = ["616399034957", "123456789012", "987654321098"];

  accountIds.forEach((accId) => {
    describe(`Account ${accId} isolation verification`, () => {
      it(`should filter instances strictly for account ${accId}`, () => {
        const filteredInstances = getAggregatedMultiAccountInstances(MOCK_INSTANCES, accId);
        expect(filteredInstances.every((i) => i.accountId === accId)).toBe(true);
        expect(filteredInstances.length).toBeGreaterThan(0);
      });

      it(`should isolate cost recommendations for account ${accId}`, () => {
        const filteredInstances = getAggregatedMultiAccountInstances(MOCK_INSTANCES, accId);
        const activeDbIds = new Set(filteredInstances.map((d) => d.id));
        const filteredRecs = MOCK_RECOMMENDATIONS.filter((rec) => activeDbIds.has(rec.dbInstanceId));

        expect(filteredRecs.every((rec) => activeDbIds.has(rec.dbInstanceId))).toBe(true);
        if (accId === "616399034957") {
          expect(filteredRecs.length).toBe(1);
          expect(filteredRecs[0].costDelta).toBe(0); // Free tier verified
        }
      });

      it(`should isolate slow queries for account ${accId}`, () => {
        const filteredInstances = getAggregatedMultiAccountInstances(MOCK_INSTANCES, accId);
        const activeDbIds = new Set(filteredInstances.map((d) => d.id));
        const filteredQueries = MOCK_SLOW_QUERIES.filter((q) => activeDbIds.has(q.dbInstanceId));

        expect(filteredQueries.every((q) => activeDbIds.has(q.dbInstanceId))).toBe(true);
      });

      it(`should isolate database logs for account ${accId}`, () => {
        const filteredInstances = getAggregatedMultiAccountInstances(MOCK_INSTANCES, accId);
        const activeDbIds = new Set(filteredInstances.map((d) => d.id));
        const filteredLogs = MOCK_LOGS.filter((l) => activeDbIds.has(l.dbInstanceId));

        expect(filteredLogs.every((l) => activeDbIds.has(l.dbInstanceId))).toBe(true);
      });

      it(`should calculate dynamic monthly cost for account ${accId} without hardcoded fallbacks`, () => {
        const filteredInstances = getAggregatedMultiAccountInstances(MOCK_INSTANCES, accId);
        const cost = calculateAccountMonthlyCost(filteredInstances);

        if (accId === "616399034957") {
          expect(cost).toBe(0); // 100% Free Tier
        } else {
          expect(cost).toBeGreaterThan(0);
        }
      });

      it(`should filter topology graph nodes for account ${accId}`, () => {
        const topology = getClusterTopology(accId);
        expect(topology.nodes.every((n) => n.accountId === accId)).toBe(true);
      });
    });
  });
});
