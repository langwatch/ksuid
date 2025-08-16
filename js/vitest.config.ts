import { defineConfig } from 'vitest/config';

// GlobalThis polyfill - must be at the very top
if (typeof globalThis === 'undefined') {
  if (typeof global !== 'undefined') {
    (global as any).globalThis = global;
  } else if (typeof window !== 'undefined') {
    (window as any).globalThis = window;
  }
}

// Core-js style globalThis polyfill
(function (global: any) {
  if (!global.globalThis) {
    Object.defineProperty(global, 'globalThis', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: global,
    });
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this);

export default defineConfig({
  test: {
    environment: 'node',
    testTimeout: 10000,
  },
});
