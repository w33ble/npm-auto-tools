#!/usr/bin/env node
/* eslint no-console: 0 */

const path = require('path');
const execa = require('execa');
const getopts = require('getopts');

const clTemplate = path.join(__dirname, '..', 'changelog-template.hbs');
const options = getopts(process.argv.slice(2), {
  alias: {
    u: 'unreleased',
  },
  default: {
    unreleased: false,
  },
});

const showWarnings = res => res.stderr.length && console.warn(res.stderr);

const autoChangelog = () => {
  const args = [
    '--commit-limit',
    'false',
    '--ignore-commit-pattern',
    '(chore|test):',
    '--output',
    'CHANGELOG.md',
    '--template',
    clTemplate,
  ];

  if (options.unreleased) args.push('--unreleased');

  return execa('auto-changelog', args);
};

const autoAuthors = () => execa('auto-authors');

const commitFiles = () => execa('git', ['add', 'CHANGELOG.md', 'AUTHORS.md']);

async function runScript() {
  showWarnings(await autoChangelog());
  showWarnings(await autoAuthors());
  showWarnings(await commitFiles());
}

runScript().catch(err => {
  console.error(err.stderr);
  console.error('Script failed!');
});
