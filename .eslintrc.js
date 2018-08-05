module.exports = {
  globals: {
    server: true
  },
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  plugins: ['ember', 'prettier'],
  extends: ['eslint:recommended', 'plugin:ember/recommended', 'plugin:prettier/recommended'],
  env: {
    browser: true
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        printWidth: 120,
        singleQuote: true
      }
    ],
    'ember/order-in-components': 'error',
    'ember/order-in-controllers': 'error',
    'ember/order-in-routes': 'error',
    'prefer-const': 'error',
    'no-var': 'error'
  },
  overrides: [
    // node files
    {
      files: ['ember-cli-build.js', 'testem.js', 'blueprints/*/index.js', 'config/**/*.js', 'lib/*/index.js'],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015
      },
      env: {
        browser: false,
        node: true
      }
    }
  ]
};
