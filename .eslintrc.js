module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:jest/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'jest',
    "simple-import-sort",
    "eslint-plugin-unused-imports"
  ],
  rules: {
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'react/jsx-filename-extension': [
      'warn',
      { extensions: ['.tsx'] },
    ],
    'complexity': ['error', 10],
    'no-await-in-loop': 'warn',
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'prefer-promise-reject-errors': 'warn',
    //if we want to group imports can use below.
    "simple-import-sort/imports": ["error", {
      groups: [
        ["^react"],
        ["^antd"],
        ["^@?\\w"],
        ["@/(.*)"],
        ["^[./]"]
      ]
    }],
    "no-unused-vars": "off", // or "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off", // or "@typescript-eslint/no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        "vars": "all",
        "varsIgnorePattern": "^_",
        "args": "after-used",
        "argsIgnorePattern": "^_",
      },
    ],
    'react/prop-types': 'off',
  },
  env: {
    browser: true,
    'jest/globals': true,
  },
  settings: {
    react: {
      pragma: 'React',
    },
  },
};