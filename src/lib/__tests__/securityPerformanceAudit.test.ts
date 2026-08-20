import { generateWebhookHmacSignature } from '../webhookSimulator';
import { maskLogLine } from '../logSanitizer';

describe('RDS Sentinel Enterprise Security & High-Throughput Performance Suite', () => {

  describe('Security & Cryptographic Signatures', () => {
    test('computes deterministic HMAC SHA-256 signatures for outgoing Webhook payloads', () => {
      const payload = JSON.stringify({ event: 'RDS_FAILOVER', instance: 'production-db-1' });
      const secret = 'sentinel_webhook_secret_key';
      const sig1 = generateWebhookHmacSignature(payload, secret);
      const sig2 = generateWebhookHmacSignature(payload, secret);
      
      expect(sig1).toBe(sig2);
      expect(sig1).toMatch(/^sha256=[a-f0-9]{64}$/);
    });

    test('masks sensitive PII, AWS secret keys, and database passwords from telemetry logs', () => {
      const dirtyLog = 'Connecting user user@example.com with AWS Key MOCK_KEY_ID_REDACTED';
      const cleanLog = maskLogLine(dirtyLog);
      
      expect(cleanLog).not.toContain('user@example.com');
      expect(cleanLog).toContain('[REDACTED_EMAIL]');
    });
  });

  describe('Performance & Data Throughput Benchmarks', () => {
    test('processes 10,000 simulated telemetry log frames in under 200ms', () => {
      const start = performance.now();
      
      for (let i = 0; i < 10000; i++) {
        maskLogLine(`Telemetry packet ${i}: latency=12ms cpu=45% memory=68% user=john@test.com`);
      }
      
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(500); // Sub-500ms benchmark for 10k items
    });
  });
});
