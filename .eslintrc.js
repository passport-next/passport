module.exports = {
    env: {
      node: true,
    },
    extends: [
      'airbnb-base',
    ],
    overrides: [
      {
        files: ['test/**'],
        env: {
          // jest: true,
          mocha: true
        },
        globals: {
          expect: 'readonly'
        },
        rules: {
          // 'jest/no-disabled-tests': [2],
          // 'jest/no-focused-tests': [2],
          // 'jest/no-identical-title': [2],
          // 'jest/prefer-to-have-length': [2],
          // 'jest/valid-expect': [2],
        }
      }
    ],
    plugins: [
      // 'jest'
    ],
    rules: {
      'comma-dangle': 0,
      'no-underscore-dangle': 0,
      'no-param-reassign': 0,
      'prefer-destructuring': 0,
    }
  };
