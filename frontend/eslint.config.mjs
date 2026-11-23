import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import hooks from 'eslint-plugin-react-hooks';
import accessibility from 'eslint-plugin-jsx-a11y';
import globals from 'globals';
export default defineConfig([
  globalIgnores(['.next/**']),
  {
    files: ['**/*.{js,jsx,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { react, 'react-hooks': hooks, 'jsx-a11y': accessibility },
    settings: {
      react: { version: '19.2' },
      'jsx-a11y': { components: { Link: 'a', Image: 'img' } },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...hooks.configs.flat.recommended.rules,
      ...accessibility.configs.recommended.rules,
      'react/jsx-uses-vars': 'error',
      'react/jsx-no-undef': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
]);
