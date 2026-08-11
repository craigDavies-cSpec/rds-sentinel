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
  });
});
