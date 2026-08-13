import { getClusterTopology } from "../clusterTopology";

describe("clusterTopology module", () => {
  it("should return all nodes when accountId is 'all'", () => {
    const topology = getClusterTopology("all");
    expect(topology.nodes.length).toBe(5);
    expect(topology.primaryClusterId).toBe("aurora-prod-cluster-01");
    expect(topology.failoverReadinessPct).toBeGreaterThan(80);
  });

  it("should filter cluster nodes when specifying a target accountId", () => {
    const prodTopology = getClusterTopology("123456789012");
    expect(prodTopology.nodes.length).toBe(3);
    expect(prodTopology.nodes.every((n) => n.accountId === "123456789012")).toBe(true);

    const stagingTopology = getClusterTopology("987654321098");
    expect(stagingTopology.nodes.length).toBe(2);
    expect(stagingTopology.nodes.every((n) => n.accountId === "987654321098")).toBe(true);
  });

  it("should return valid replication links connecting writer and reader nodes", () => {
    const topology = getClusterTopology("all");
    expect(topology.links.length).toBe(3);

    const inRegionLinks = topology.links.filter((l) => l.type === "in-region");
    expect(inRegionLinks.length).toBe(2);

    const crossRegionLinks = topology.links.filter((l) => l.type === "cross-region");
    expect(crossRegionLinks.length).toBe(1);
    expect(crossRegionLinks[0].lagMs).toBe(62);
  });

  it("should contain a primary writer node with failover priority Tier 0", () => {
    const topology = getClusterTopology("123456789012");
    const writerNode = topology.nodes.find((n) => n.role === "writer");
    expect(writerNode).toBeDefined();
    expect(writerNode?.failoverPriority).toBe(0);
    expect(writerNode?.replicationLagMs).toBe(0);
  });
});
