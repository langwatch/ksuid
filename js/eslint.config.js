import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        // Global objects for different environments
        window: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        require: 'readonly',
        Deno: 'readonly',
        global: 'readonly',
        globalThis: 'readonly',
        console: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      
      // General rules
      'no-console': 'off', // Allow console in examples
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  {
    files: ['src/node.ts', 'src/platform.ts'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
];
