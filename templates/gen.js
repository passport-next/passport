/* eslint-disable n/no-sync, no-console -- CLI */
import fs from 'node:fs';
import path from 'node:path';
import nunjucks from 'nunjucks';
import variables from './variables.js';

const templateDir = '.' + path.sep + 'templates' + path.sep;

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
  if (destDir !== '' && !fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  if (!init && variables.ignoreExisting.includes(dest) && fs.existsSync(dest)) {
    console.log('Skipping ' + dest);
  } else {
    console.log('Writing ' + dest);
    fs.writeFileSync(dest, nunjucks.render(file, variables));
  }
});
