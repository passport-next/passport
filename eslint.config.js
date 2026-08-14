import ashNazg from 'eslint-config-ash-nazg';

export default [
  {
    ignores: [
      'var/',
      'docs/jsdoc'
    ]
  },
  ...ashNazg(['sauron', 'node']),
  {
    rules: {
      '@stylistic/dot-location': ['error', 'property'],

      'no-underscore-dangle': 0,
      'no-param-reassign': 0,

      // Disable as middleware approach requires some callbacks
      'promise/prefer-await-to-callbacks': 0,

      // Disable until ready to tackle
      'eslint-comments/require-description': 0,

      // Disable current preferences of eslint-config-passport-next
      'import/no-commonjs': 0,
      'n/exports-style': 0,

      // add back different or stricter rules from airbnb
      '@stylistic/object-curly-spacing': ['error', 'always'],
      'func-names': 'warn',
      '@stylistic/max-len': ['error', 100, 2, {
        ignoreUrls: true,
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true
      }],
      '@stylistic/space-before-function-paren': ['error', {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always'
      }],
      'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 0 }],
      '@stylistic/arrow-parens': ['error', 'as-needed', {
        requireForBlockBody: true
      }],
      'no-empty-function': ['error', {
        allow: [
          'arrowFunctions',
          'functions',
          'methods'
        ]
      }],
      'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }],
      'no-multi-assign': ['error'],
      'no-unused-expressions': ['error', {
        allowShortCircuit: false,
        allowTernary: false,
        allowTaggedTemplates: false
      }],
      'jsdoc/tag-lines': ['error', 'never', {
        tags: {
          example: { lines: 'always' }
        }
      }]
    }
  },
  {
    files: ['test/**/*.test.js'],
    rules: {
      'no-unused-expressions': 'off',
      'chai-friendly/no-unused-expressions': ['error', {
        allowShortCircuit: false,
        allowTernary: false,
        allowTaggedTemplates: false
      }],
      'jsdoc/require-jsdoc': 'off'
      // 'jest/no-disabled-tests': [2],
      // 'jest/no-focused-tests': [2],
      // 'jest/no-identical-title': [2],
      // 'jest/prefer-to-have-length': [2],
      // 'jest/valid-expect': [2],
    }
  },
  {
    files: ['**/*.md/*.js'],
    rules: {
      'eol-last': 'off',
      'no-console': 'off',
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'padded-blocks': 'off',
      'jsdoc/require-jsdoc': 'off',
      'import/unambiguous': 'off',
      'import/no-unresolved': 'off',
      'n/no-missing-import': 'off',
      'n/no-missing-require': 'off',
      'func-names': 'off',
      'import/newline-after-import': 'off',
      strict: 'off'
    }
  }
];
