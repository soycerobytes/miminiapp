import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import reactHooks from 'eslint-plugin-react-hooks';

export default defineConfig([
  globalIgnores([
    'dist/**',
    '.astro/**',
    '.local/**',
    'node_modules/**',
    'playwright-report/**',
    'test-results/**',
    'coverage/**',
  ]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs['flat/recommended'],
  {
    files: ['src/**/*.{ts,tsx,astro}'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['*.{mjs,ts}', 'tests/**/*.{ts,tsx}', 'scripts/**/*.{mjs,ts}'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['tests/components/**/*.{ts,tsx}', 'tests/setup/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
  {
    files: ['**/*.astro'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
]);
