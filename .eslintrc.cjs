module.exports = {
  extends: ['./eslint/tsx'].map(require.resolve),
  ignorePatterns: ['build'],
};
