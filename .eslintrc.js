module.exports = {
  extends: [
    'alloy',
    'alloy/typescript',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['jest'],
  env: {
    jest: true,
  },
  rules: {
    indent: [
      'error',
      2,
    ],
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/consistent-type-assertions': 'off',
    '@typescript-eslint/typedef': 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'semi': 'error',
    'no-new-func': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    'eol-last': 2,
    quotes: [2, 'single'],
    'complexity': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    '@typescript-eslint/prefer-optional-chain': 'off',
    'max-params': 'off',
    'no-trailing-spaces': [
      'error',
      {
        'skipBlankLines': true,
      },
    ],
  },
};
