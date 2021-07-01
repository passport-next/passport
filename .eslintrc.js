'use strict';
module.exports = {
  env: {
    node: true,
    browser: false
  },
  extends: [
    'eslint-config-ash-nazg/sauron-node.js',
    // Override eslint-config-passport-next's current preference for ESM
    'plugin:node/recommended-script'
  ],
  settings: {
    polyfills: [
      // Needing these for some reason to avoid an error
      'Promise',
      'Promise.reject',
      'Promise.resolve'
    ]
  },
  overrides: [
    {
      files: ['test/**/*.test.js'],
      env: {
        // jest: true,
        mocha: true
      },
      globals: {
        expect: 'readonly'
      },
      plugins: [
        'chai-friendly'
      ],
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
      files: ['**/*.md'],
      processor: 'markdown/markdown'
    },
    {
      files: '**/*.md/*.js',
      rules: {
        'eol-last': 'off',
        'no-console': 'off',
        'no-undef': 'off',
        'no-unused-vars': 'warn',
        'padded-blocks': 'off',
        'import/unambiguous': 'off',
        'import/no-unresolved': 'off',
        'node/no-missing-import': 'off',
        'node/no-missing-require': 'off',
        'func-names': 'off',
        'import/newline-after-import': 'off',
        strict: 'off',
        // Disable until eslint-plugin-jsdoc may fix: https://github.com/gajus/eslint-plugin-jsdoc/issues/211
        indent: 'off'
      }
    }
  ],
  globals: {
    // By some ESLint bug, config overrides not working with globals
    require: 'readonly',
    module: 'readonly',
    exports: 'writable'
  },
  plugins: [
    // 'jest'
  ],
  rules: {
    'no-underscore-dangle': 0,
    'no-param-reassign': 0,

    // Disable as middleware approach requires some callbacks
    'promise/prefer-await-to-callbacks': 0,

    // Disable until ready to tackle
    'eslint-comments/require-description': 0,

    // Disable current preferences of eslint-config-passport-next
    'import/no-commonjs': 0,
    'node/exports-style': 0,

    // add back different or stricter rules from airbnb
    'object-curly-spacing': ['error', 'always'],
    'func-names': 'warn',
    'max-len': ['error', 100, 2, {
      ignoreUrls: true,
      ignoreComments: false,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true
    }],
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always'
    }],
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 0 }],
    'arrow-parens': ['error', 'as-needed', {
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
};
