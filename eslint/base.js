module.exports = {
  root: true,

  extends: [
    'eslint-config-airbnb-base/rules/errors',
    'eslint-config-airbnb-base/rules/node',
    'eslint-config-airbnb-base/rules/style',
    'eslint-config-airbnb-base/rules/variables',
    'eslint-config-airbnb-base/rules/es6',
    'prettier',
  ],

  env: {
    browser: true,
  },

  plugins: ['import', 'prettier'],

  rules: {
    'max-len': [
      'error',
      {
        code: 120,
      },
    ],
    quotes: ['error', 'single', { avoidEscape: true }],
    'no-unused-vars': ['off'],
    'no-nested-ternary': ['off'],
    'no-underscore-dangle': ['off'],
    'object-curly-spacing': ['error', 'always'],
    'require-jsdoc': ['off'],
    'no-invalid-this': ['off'],
    'no-continue': ['off'],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: false,
      },
    ],
    'class-methods-use-this': ['off'],
    'prettier/prettier': [
      'error',
      {
        tabWidth: 2,
        singleQuote: true,
        arrowParens: 'avoid',
      },
    ],
  },
};
