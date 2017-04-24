module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    'prettier'
  ],
  plugins: [
    'prettier'
  ],
  env: {
    browser: true
  },
  rules: {
    'prettier/prettier': ['error', {
      printWidth: 120,
      singleQuote: true
    }]
  }
};
