import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['react', 'jsx-a11y'],

  ignorePatterns: ['dist/**', 'node_modules/**'],

  settings: {
    react: {
      version: '19',
    },
  },

  env: {
    browser: false,
    node: true,
  },

  overrides: [
    {
      files: ['{src,test}/**/*.{ts,js}'],
      env: {
        browser: false,
        node: true,
      },
      rules: {
        'react/rules-of-hooks': 'off',
        'react/jsx-key': 'off',
      },
    },
    {
      files: ['client/**/*.{ts,tsx,js,jsx}'],
      env: {
        browser: true,
        node: true,
      },
      rules: {
        'react/rules-of-hooks': 'error',
        'react/exhaustive-deps': 'warn',
      },
    },
  ],
})
