import { generateSecureToken, isValidToken, generateFormUrl } from '../utils/crypto';

describe('Crypto Utils', () => {
  describe('generateSecureToken', () => {
    it('should generate a 64-character hex string', () => {
      const token = generateSecureToken();
      expect(token).toHaveLength(64);
      expect(/^[a-f0-9]{64}$/.test(token)).toBe(true);
    });

    it('should generate unique tokens', () => {
      const token1 = generateSecureToken();
      const token2 = generateSecureToken();
      expect(token1).not.toEqual(token2);
    });
  });

  describe('isValidToken', () => {
    it('should validate correct token format', () => {
      const validToken = generateSecureToken();
      expect(isValidToken(validToken)).toBe(true);
    });

    it('should reject invalid token formats', () => {
      expect(isValidToken('')).toBe(false);
      expect(isValidToken('invalid')).toBe(false);
      expect(isValidToken('12345')).toBe(false);
      expect(isValidToken('g'.repeat(64))).toBe(false);
      expect(isValidToken('a'.repeat(63))).toBe(false);
      expect(isValidToken('a'.repeat(65))).toBe(false);
    });

    it('should reject non-string inputs', () => {
      expect(isValidToken(null as any)).toBe(false);
      expect(isValidToken(undefined as any)).toBe(false);
      expect(isValidToken(123 as any)).toBe(false);
      expect(isValidToken({} as any)).toBe(false);
    });
  });

  describe('generateFormUrl', () => {
    it('should generate correct form URL', () => {
      const baseUrl = 'https://example.com';
      const token = 'abc123';
      const url = generateFormUrl(baseUrl, token);
      expect(url).toBe('https://example.com/form/abc123');
    });

    it('should handle base URL without trailing slash', () => {
      const baseUrl = 'https://example.com';
      const token = 'def456';
      const url = generateFormUrl(baseUrl, token);
      expect(url).toBe('https://example.com/form/def456');
    });
  });
}); 