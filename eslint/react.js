module.exports = {
  extends: ['./base', 'eslint-config-airbnb/rules/react', 'plugin:react/recommended'],

  rules: {
    'react/prop-types': 'error',
    'react/require-default-props': 'error',

    'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
    'react/prefer-stateless-function': 'off',
    'react/jsx-no-bind': 'error',
    'react/sort-comp': [
      'error',
      {
        order: [
          'displayName',
          'statics',
          'static-methods',
          'defaultProps',
          'state',
          'constructor',
          'render',
          '/^(_)?render.+$/',
          'componentWillMount',
          'componentDidMount',
          'componentWillReceiveProps',
          'shouldComponentUpdate',
          'componentWillUpdate',
          'componentDidUpdate',
          'componentWillUnmount',
          '/^on[A-Z].+$/',
          'everything-else',
          '/^_.+$/',
        ],
      },
    ],
  },
};
