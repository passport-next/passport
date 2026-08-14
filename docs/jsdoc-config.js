'use strict';

module.exports = {
  recurseDepth: 10,
  source: {
    exclude: [
      'node_modules',
      'dist',
      'var',
      'coverage',
      'test'
    ]
    // excludePattern: ''
  },
  sourceType: 'module',
  tags: {
    allowUnknownTags: false
  },
  templates: {
    cleverLinks: true,
    monospaceLinks: false /* ,
    default: {
      layoutFile: 'docs/layout.tmpl'
    } */
  },
  opts: {
    recurse: true,
    verbose: true,
    destination: 'docs/jsdoc'
    // tutorials: 'docs/tutorials'
  }
};
