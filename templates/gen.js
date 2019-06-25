/* eslint no-sync: 0, no-console: 0, node/no-unpublished-require: 0 */
'use strict';
const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');

const templateDir = '.' + path.sep + 'templates' + path.sep;
const variables = require('./variables.js');

const init = process.argv[2] === '--init';
variables.templateDir = templateDir;

const fileList = [];

const walkDirs = (dir) => {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    if (file === 'includes') {
      return;
    }
    if (path.extname(file) === '.j2') {
      fileList.push(dir + file);
    }
    if (fs.statSync(dir + file).isDirectory()) {
      walkDirs(dir + file + path.sep);
    }
  });
};

walkDirs(templateDir);

fileList.forEach((file) => {
  const parsedPath = path.parse(file);
  parsedPath.dir += path.sep;
  const destDir = parsedPath.dir.replace(templateDir, '');
  const dest = destDir + parsedPath.name;
  if (destDir !== '') {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
  }
  if (!init && variables.ignoreExisting.includes(dest) && fs.existsSync(dest)) {
    console.log('Skipping ' + dest);
  } else {
    console.log('Writing ' + dest);
    fs.writeFileSync(dest, nunjucks.render(file, variables));
  }
});
