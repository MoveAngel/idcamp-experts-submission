import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import globals from 'globals';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  ...fixupConfigRules(compat.extends('airbnb-base')),

  {
    ...js.configs.recommended,
    files: ['**/*.{js,mjs,cjs}'],
  },

  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { vitest },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
        ...globals.node,
      },
      sourceType: 'module',
      ecmaVersion: 2022,
    },
  },

  {
    files: ['**/*.{js,mjs,cjs}'],
    rules: {
      'no-underscore-dangle': 'off',

      'import/extensions': ['error', 'ignorePackages', {
        js: 'always',
      }],

      camelcase: ['error', { properties: 'never', ignoreDestructuring: true }],

      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

      'class-methods-use-this': 'off',

      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    },
  },

  {
    files: ['**/_test/**/*.js', '**/*.test.js'],
    rules: {
      'no-unused-expressions': 'off',
    },
  },

  {
    files: ['*.config.js', '*.config.mjs'],
    rules: {
      'import/no-extraneous-dependencies': 'off',
      'import/no-unresolved': 'off',
    },
  },
];
