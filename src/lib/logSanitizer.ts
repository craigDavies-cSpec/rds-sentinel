/**
 * Security & Compliance utility to run edge-sanitization on query strings and log lines.
 * This runs locally on the edge (e.g. inside Lambda log subscription filters) to redact
 * sensitive fields, secrets, and raw PII parameters before shipping logs to the monitor.
 */

import { sanitizeDeepCredentials } from "./enterpriseSecurityVault";

// Regex patterns for sensitive identifiers
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const SECRET_KEYWORDS = /(password|passwd|secret|token|api_key|apikey|private_key|credit_card|card_num)/i;

/**
 * Redacts raw parameter values in SQL strings, converting them into standard
 * prepared statement placeholders (?) to avoid leaking PII or credentials in slow query dashboards.
 */
export function maskSQLQuery(query: string): string {
  if (!query) return "";

  let masked = query;

  // 1. Redact strings enclosed in single or double quotes
  masked = masked.replace(/'[^']*'/g, "'?'");
  masked = masked.replace(/"[^"]*"/g, '"?"');

  // 2. Redact numerical literals that are assignments or values
  masked = masked.replace(/(?<=\s|=|>|<|>=|<=)\b\d+\b/g, "?");

  // 3. Deep credential and PII sanitization
  const deepSanitized = sanitizeDeepCredentials(masked);
  masked = deepSanitized.sanitizedText;

  // 4. If query contains sensitive security keywords, completely redact the target assignment
  if (SECRET_KEYWORDS.test(masked)) {
    const lines = masked.split("\n");
    const sanitizedLines = lines.map(line => {
      if (SECRET_KEYWORDS.test(line)) {
        return line.replace(/(?<=\b(password|secret|token|key|pwd)\b\s*(=|like)\s*)\S+/i, "'[REDACTED_SECRET]'");
      }
      return line;
    });
    masked = sanitizedLines.join("\n");
  }

  return masked;
}

/**
 * Redacts generic log strings, masking email addresses, UUIDs, and SQL literals.
 */
export function maskLogLine(logLine: string): string {
  if (!logLine) return "";

  let sanitized = sanitizeDeepCredentials(logLine).sanitizedText;

  // 1. Redact email addresses
  sanitized = sanitized.replace(EMAIL_REGEX, "[REDACTED_EMAIL]");

  // 2. Redact obvious SQL credentials or key values in logs
  if (/password:\s*yes/i.test(sanitized)) {
    sanitized = sanitized.replace(/password:\s*yes/i, "password: [PROTECTED]");
  }

  return sanitized;
}
