import { describe, it, expect, beforeEach } from 'vitest';
import { Ksuid } from '../ksuid.js';
import { Instance } from '../instance.js';

describe('Ksuid', () => {
  let testInstance: Instance;

  beforeEach(() => {
    testInstance = new Instance(Instance.schemes.RANDOM, new Uint8Array(8).fill(1));
  });

  describe('constructor', () => {
    it('should create a valid Ksuid', () => {
      const ksuid = new Ksuid('prod', 'user', 1234567890, testInstance, 0);

      expect(ksuid.environment).toBe('prod');
      expect(ksuid.resource).toBe('user');
      expect(ksuid.timestamp).toBe(1234567890);
      expect(ksuid.instance).toBe(testInstance);
      expect(ksuid.sequenceId).toBe(0);
    });

    it('should throw error for invalid environment', () => {
      expect(() => {
        new Ksuid('invalid-env!', 'user', 1234567890, testInstance, 0);
      }).toThrow('environment contains invalid characters');
    });

    it('should throw error for invalid resource', () => {
      expect(() => {
        new Ksuid('prod', 'invalid-resource!', 1234567890, testInstance, 0);
      }).toThrow('resource contains invalid characters');
    });

    it('should throw error for negative timestamp', () => {
      expect(() => {
        new Ksuid('prod', 'user', -1, testInstance, 0);
      }).toThrow('timestamp must be positive');
    });

    it('should throw error for timestamp too large', () => {
      expect(() => {
        new Ksuid('prod', 'user', 2 ** 48, testInstance, 0);
      }).toThrow('timestamp must be a uint48');
    });

    it('should throw error for negative sequence ID', () => {
      expect(() => {
        new Ksuid('prod', 'user', 1234567890, testInstance, -1);
      }).toThrow('sequenceId must be positive');
    });

    it('should throw error for sequence ID too large', () => {
      expect(() => {
        new Ksuid('prod', 'user', 1234567890, testInstance, 2 ** 32);
      }).toThrow('sequenceId must be a uint32');
    });
  });

  describe('toString', () => {
    it('should generate correct string representation for production', () => {
      const ksuid = new Ksuid('prod', 'user', 1234567890, testInstance, 0);
      const result = ksuid.toString();

      expect(result).toMatch(/^user_[A-Za-z0-9]{29}$/);
      expect(result).not.toContain('prod_');
    });

    it('should generate correct string representation for non-production', () => {
      const ksuid = new Ksuid('dev', 'user', 1234567890, testInstance, 0);
      const result = ksuid.toString();

      expect(result).toMatch(/^dev_user_[A-Za-z0-9]{29}$/);
    });

    it('should cache the string representation', () => {
      const ksuid = new Ksuid('prod', 'user', 1234567890, testInstance, 0);
      const first = ksuid.toString();
      const second = ksuid.toString();

      expect(first).toBe(second);
    });
  });

  describe('parse', () => {
    it('should parse valid production KSUID', () => {
      const original = new Ksuid('prod', 'user', 1234567890, testInstance, 0);
      const parsed = Ksuid.parse(original.toString());

      expect(parsed.environment).toBe(original.environment);
      expect(parsed.resource).toBe(original.resource);
      expect(parsed.timestamp).toBe(original.timestamp);
      expect(parsed.sequenceId).toBe(original.sequenceId);
      expect(parsed.instance.scheme).toBe(original.instance.scheme);
    });

    it('should parse valid non-production KSUID', () => {
      const original = new Ksuid('dev', 'user', 1234567890, testInstance, 0);
      const parsed = Ksuid.parse(original.toString());

      expect(parsed.environment).toBe(original.environment);
      expect(parsed.resource).toBe(original.resource);
    });

    it('should throw error for non-string input', () => {
      expect(() => {
        Ksuid.parse(123 as unknown);
      }).toThrow('Input must be a string');
    });

    it('should throw error for empty string', () => {
      expect(() => {
        Ksuid.parse('');
      }).toThrow('Input must not be empty');
    });

    it('should throw error for invalid format', () => {
      expect(() => {
        Ksuid.parse('invalid-format');
      }).toThrow('ID is invalid');
    });

    it('should throw error for invalid environment', () => {
      expect(() => {
        Ksuid.parse('invalid!env_user_000000000000000000000000000');
      }).toThrow('ID is invalid');
    });

    it('should throw error for invalid resource', () => {
      expect(() => {
        Ksuid.parse('invalid!resource_000000000000000000000000000');
      }).toThrow('ID is invalid');
    });

    it('should throw error for production environment prefix', () => {
      expect(() => {
        Ksuid.parse('prod_user_000000000000000000000000000');
      }).toThrow('ID is invalid');
    });
  });

  describe('date', () => {
    it('should return correct date', () => {
      const timestamp = 1234567890;
      const ksuid = new Ksuid('prod', 'user', timestamp, testInstance, 0);

      expect(ksuid.date.getTime()).toBe(timestamp * 1000);
    });
  });

  describe('equals', () => {
    it('should return true for identical KSUIDs', () => {
      const ksuid1 = new Ksuid('prod', 'user', 1234567890, testInstance, 0);
      const ksuid2 = new Ksuid('prod', 'user', 1234567890, testInstance, 0);

      expect(ksuid1.equals(ksuid2)).toBe(true);
    });

    it('should return false for different KSUIDs', () => {
      const ksuid1 = new Ksuid('prod', 'user', 1234567890, testInstance, 0);
      const ksuid2 = new Ksuid('prod', 'user', 1234567891, testInstance, 0);

      expect(ksuid1.equals(ksuid2)).toBe(false);
    });

    it('should return false for non-Ksuid objects', () => {
      const ksuid = new Ksuid('prod', 'user', 1234567890, testInstance, 0);

      expect(ksuid.equals({} as unknown)).toBe(false);
    });
  });

  describe('toJSON', () => {
    it('should return correct JSON representation', () => {
      const ksuid = new Ksuid('prod', 'user', 1234567890, testInstance, 0);
      const json = ksuid.toJSON();

      expect(json).toEqual({
        environment: 'prod',
        resource: 'user',
        timestamp: 1234567890,
        date: new Date(1234567890 * 1000).toISOString(),
        instance: {
          scheme: Instance.schemes.RANDOM,
          identifier: [1, 1, 1, 1, 1, 1, 1, 1],
        },
        sequenceId: 0,
        string: ksuid.toString(),
      });
    });
  });
});
