// ============================================================
// ESLint: catches likely mistakes in the site's JavaScript and
// TypeScript (unused variables, typos in names, ...). Run with
// `npm run lint`; it also runs on every pull request.
// Formatting (spaces, quotes) is Prettier's job, not ESLint's.
// ============================================================
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

export default [
  { ignores: ['dist/', '.astro/', 'node_modules/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
];
