// Aurora Cluster & Read Replica Topology Engine

export interface ClusterNode {
  id: string;
  name: string;
  role: "writer" | "reader" | "cross-region-replica";
  engine: string;
  region: string;
  instanceClass: string;
  status: "healthy" | "degraded" | "syncing";
  replicationLagMs: number;
  failoverPriority: number; // Tier 0, Tier 1, Tier 2
  iops: number;
  connections: number;
  cpuLoad: number;
  accountId: string;
}

export interface ReplicationLink {
  sourceId: string;
  targetId: string;
  type: "in-region" | "cross-region";
  lagMs: number;
  status: "active" | "lagging" | "syncing";
}

export interface ClusterTopologyData {
  primaryClusterId: string;
  clusterName: string;
  engine: string;
  failoverReadinessPct: number;
  nodes: ClusterNode[];
  links: ReplicationLink[];
}

/**
 * Returns topology hierarchy and replication latency data for active AWS account / databases
 */
export function getClusterTopology(accountId: string = "all"): ClusterTopologyData {
  const allNodes: ClusterNode[] = [
    {
      id: "node-writer-prod",
      name: "sales-db-prod (Primary Writer)",
      role: "writer",
      engine: "Aurora PostgreSQL 15.4",
      region: "us-east-1 (N. Virginia)",
      instanceClass: "db.r6g.2xlarge",
      status: "healthy",
      replicationLagMs: 0,
      failoverPriority: 0,
      iops: 4800,
      connections: 142,
      cpuLoad: 72,
      accountId: "123456789012",
    },
    {
      id: "node-reader-east-1a",
      name: "sales-db-replica-1a",
      role: "reader",
      engine: "Aurora PostgreSQL 15.4",
      region: "us-east-1a (N. Virginia)",
      instanceClass: "db.r6g.xlarge",
      status: "healthy",
      replicationLagMs: 2,
      failoverPriority: 1,
      iops: 2400,
      connections: 45,
      cpuLoad: 38,
      accountId: "123456789012",
    },
    {
      id: "node-reader-east-1b",
      name: "sales-db-replica-1b",
      role: "reader",
      engine: "Aurora PostgreSQL 15.4",
      region: "us-east-1b (N. Virginia)",
      instanceClass: "db.r6g.xlarge",
      status: "healthy",
      replicationLagMs: 4,
      failoverPriority: 2,
      iops: 2200,
      connections: 32,
      cpuLoad: 31,
      accountId: "123456789012",
    },
    {
      id: "node-cross-west-2",
      name: "analytics-warehouse-replica (Cross-Region)",
      role: "cross-region-replica",
      engine: "Aurora MySQL 8.0",
      region: "us-west-2 (Oregon)",
      instanceClass: "db.r6g.xlarge",
      status: "healthy",
      replicationLagMs: 62,
      failoverPriority: 3,
      iops: 2400,
      connections: 18,
      cpuLoad: 45,
      accountId: "987654321098",
    },
    {
      id: "node-dev-sandbox",
      name: "dev-sandbox-db",
      role: "writer",
      engine: "RDS MySQL 8.0",
      region: "us-east-1 (N. Virginia)",
      instanceClass: "db.t3.medium",
      status: "healthy",
      replicationLagMs: 0,
      failoverPriority: 0,
      iops: 300,
      connections: 3,
      cpuLoad: 12,
      accountId: "987654321098",
    },
    {
      id: "node-cspec-live",
      name: "free-tier-sandbox-db (Primary)",
      role: "writer",
      engine: "RDS PostgreSQL 16.1",
      region: "eu-west-1 (Ireland)",
      instanceClass: "db.t4g.micro",
      status: "healthy",
      replicationLagMs: 0,
      failoverPriority: 0,
      iops: 300,
      connections: 6,
      cpuLoad: 18,
      accountId: "616399034957",
    },
  ];

  const filteredNodes = accountId === "all" 
    ? allNodes 
    : allNodes.filter((n) => n.accountId === accountId);

  // Define active replication links between nodes
  const links: ReplicationLink[] = ([
    {
      sourceId: "node-writer-prod",
      targetId: "node-reader-east-1a",
      type: "in-region",
      lagMs: 2,
      status: "active",
    },
    {
      sourceId: "node-writer-prod",
      targetId: "node-reader-east-1b",
      type: "in-region",
      lagMs: 4,
      status: "active",
    },
    {
      sourceId: "node-writer-prod",
      targetId: "node-cross-west-2",
      type: "cross-region",
      lagMs: 62,
      status: "active",
    },
  ] as ReplicationLink[]).filter((link) => 
    filteredNodes.some((n) => n.id === link.sourceId) && 
    filteredNodes.some((n) => n.id === link.targetId)
  );

  const avgLag = filteredNodes.reduce((acc, curr) => acc + curr.replicationLagMs, 0) / (filteredNodes.length || 1);
  const failoverReadinessPct = Math.max(85, Math.min(99.9, Number((100 - avgLag * 0.15).toFixed(1))));

  return {
    primaryClusterId: "aurora-prod-cluster-01",
    clusterName: "Aurora Enterprise Multi-Region Cluster",
    engine: "Aurora Global Database",
    failoverReadinessPct,
    nodes: filteredNodes,
    links,
  };
}
