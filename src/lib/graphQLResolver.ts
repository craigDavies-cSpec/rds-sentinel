// GraphQL Telemetry Query Resolver Engine (Phase 9C)
import { MOCK_INSTANCES, MOCK_SLOW_QUERIES } from "./mockTelemetry";

export interface GraphQLQueryResult {
  data: {
    getInstances?: typeof MOCK_INSTANCES;
    getSlowQueriesCount?: number;
    getHealthScore?: number;
  };
  errors?: string[];
}

/**
 * Evaluates simulated GraphQL telemetry query strings
 */
export function queryGraphQLTelemetry(queryString: string): GraphQLQueryResult {
  const clean = queryString.trim();

  if (clean.includes("getInstances")) {
    return {
      data: {
        getInstances: MOCK_INSTANCES,
      },
    };
  }

  if (clean.includes("getSlowQueries")) {
    return {
      data: {
        getSlowQueriesCount: MOCK_SLOW_QUERIES.length,
      },
    };
  }

  if (clean.includes("getHealthScore")) {
    return {
      data: {
        getHealthScore: 94,
      },
    };
  }

  return {
    data: {},
    errors: ["SyntaxError: Unknown GraphQL selection query field."],
  };
}
