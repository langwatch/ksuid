// Type declarations for global objects
declare global {
  interface Window {
    // eslint-disable-next-line no-unused-vars
    crypto: { getRandomValues: (array: Uint8Array) => Uint8Array };
  }
  interface Process {
    versions: { node?: string; bun?: string };
    pid: number;
  }
  interface Deno {
    version: string;
  }
  var window: Window | undefined;
  var process: Process | undefined;
  var Deno: Deno | undefined;
}

import type { PlatformInfo, CryptoProvider } from './types.js';

/**
 * Detects the current platform/runtime environment
 * @returns Platform information including flags for browser, Node.js, Bun, and Deno
 * @example
 * ```typescript
 * const platform = detectPlatform();
 * if (platform.isNode) {
 *   console.log('Running in Node.js');
 * }
 * ```
 */
export function detectPlatform(): PlatformInfo {
  const isBrowser =
    typeof window !== 'undefined' && typeof window.crypto !== 'undefined';
  const isNode =
    typeof process !== 'undefined' &&
    typeof process.versions !== 'undefined' &&
    typeof process.versions.node !== 'undefined';
  const isBun =
    typeof process !== 'undefined' &&
    typeof process.versions !== 'undefined' &&
    typeof process.versions.bun !== 'undefined';
  const isDeno = typeof Deno !== 'undefined';

  return {
    isBrowser,
    isNode,
    isBun,
    isDeno,
  };
}

/**
 * Gets the appropriate crypto provider for the current platform
 * @returns A crypto provider with getRandomValues method
 * @throws {Error} If no crypto provider is available
 * @example
 * ```typescript
 * const crypto = getCryptoProvider();
 * const randomBytes = crypto.getRandomValues(new Uint8Array(16));
 * ```
 */
export function getCryptoProvider(): CryptoProvider {
  const platform = detectPlatform();

  if (platform.isBrowser && typeof window !== 'undefined' && window.crypto) {
    return {
      getRandomValues: (array: Uint8Array) =>
        window!.crypto.getRandomValues(array),
    };
  }

  if (platform.isNode) {
    try {
      const crypto = require('crypto') as {
        // eslint-disable-next-line no-unused-vars
        randomBytes: (size: number) => Uint8Array;
      };
      return {
        getRandomValues: (array: Uint8Array) => {
          const randomBytes = crypto.randomBytes(array.length);
          array.set(randomBytes);
          return array;
        },
        randomBytes: (size: number) => crypto.randomBytes(size),
      };
    } catch {
      // Fallback to browser crypto if available
      if (typeof globalThis !== 'undefined' && globalThis?.crypto) {
        return {
          getRandomValues: (array: Uint8Array) =>
            globalThis.crypto!.getRandomValues(array),
        };
      }
    }
  }

  // For Bun, Deno, and other platforms
  if (typeof globalThis !== 'undefined' && globalThis?.crypto) {
    return {
      getRandomValues: (array: Uint8Array) =>
        globalThis.crypto!.getRandomValues(array),
    };
  }

  throw new Error('No crypto provider available');
}

/**
 * Generates cryptographically secure random bytes
 * @param size - The number of random bytes to generate
 * @returns A Uint8Array filled with random bytes
 * @example
 * ```typescript
 * const randomBytes = getRandomBytes(16);
 * console.log(randomBytes.length); // 16
 * ```
 */
export function getRandomBytes(size: number): Uint8Array {
  const crypto = getCryptoProvider();
  const array = new Uint8Array(size);
  crypto.getRandomValues(array);
  return array;
}
