import { maskSQLQuery, maskLogLine } from "../logSanitizer";

describe("Log Sanitizer & Parameter Masking Utility", () => {
  describe("maskSQLQuery", () => {
    test("should redact string parameter values inside single quotes", () => {
      const sql = "SELECT * FROM users WHERE email = 'craig@example.com' AND name = 'Craig Davies'";
      const expected = "SELECT * FROM users WHERE email = '?' AND name = '?'";
      expect(maskSQLQuery(sql)).toBe(expected);
    });

    test("should redact numeric parameters while keeping columns intact", () => {
      const sql = "SELECT * FROM orders WHERE id = 12345 AND total_amount > 500";
      const expected = "SELECT * FROM orders WHERE id = ? AND total_amount > ?";
      expect(maskSQLQuery(sql)).toBe(expected);
    });

    test("should redact sensitive passwords and tokens when matched with keywords", () => {
      const sql = "UPDATE users SET password_hash = 'secret_hash_value', updated_at = NOW() WHERE token = 'active_token_123'";
      const result = maskSQLQuery(sql);
      expect(result).toContain("'[REDACTED_SECRET]'");
      expect(result).not.toContain("secret_hash_value");
      expect(result).not.toContain("active_token_123");
    });

    test("should handle empty or whitespace query strings gracefully", () => {
      expect(maskSQLQuery("")).toBe("");
      expect(maskSQLQuery("   ")).toBe("   ");
    });

    test("should mask complex queries with double-quoted identifiers and inline comments", () => {
      const sql = 'SELECT "user_id", "email" FROM "schema"."users" WHERE "role" = \'admin\' AND "status" = \'active\' -- filter admins';
      const masked = maskSQLQuery(sql);
      expect(masked).not.toContain("'admin'");
      expect(masked).not.toContain("'active'");
      expect(masked).toContain("SELECT");
    });
  });

  describe("maskLogLine", () => {
    test("should redact plain text email addresses", () => {
      const log = "2026-08-11 11:20:00 [WARNING] User connection warning for admin@cspec.uk (VPC ingress)";
      const expected = "2026-08-11 11:20:00 [WARNING] User connection warning for [REDACTED_EMAIL] (VPC ingress)";
      expect(maskLogLine(log)).toBe(expected);
    });

    test("should protect database connection logs displaying password status", () => {
      const log = "Access denied for user 'app-user'@'10.0.1.20' (using password: YES)";
      const expected = "Access denied for user 'app-user'@'10.0.1.20' (using password: [PROTECTED])";
      expect(maskLogLine(log)).toBe(expected);
    });

    test("should redact multiple emails with complex domains and plus-aliases", () => {
      const log = "Alert sent to dev+alert@subdomain.company.co.uk and ops.admin@corp.io";
      const sanitized = maskLogLine(log);
      expect(sanitized).not.toContain("dev+alert@subdomain.company.co.uk");
      expect(sanitized).not.toContain("ops.admin@corp.io");
      expect(sanitized).toContain("[REDACTED_EMAIL]");
    });

    test("should process large log strings efficiently without crashing", () => {
      const largeLog = "LOG ITEM ".repeat(1000) + "admin.user@enterprise.org";
      const start = Date.now();
      const sanitized = maskLogLine(largeLog);
      const duration = Date.now() - start;
      expect(sanitized).toContain("[REDACTED_EMAIL]");
      expect(duration).toBeLessThan(100); // Must process under 100ms
    });
  });
});
