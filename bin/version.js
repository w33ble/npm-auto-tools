/* eslint no-console: 0 */
const path = require('path');
const execa = require('execa');

const clTemplate = path.join(__dirname, '..', 'changelog-template.hbs');

const showWarnings = res => res.stderr.length && console.warn(res.stderr);

const autoChangelog = () =>
  execa('auto-changelog', [
    '--commit-limit',
    '0',
    '--output',
    'CHANGELOG.md',
    '--template',
    clTemplate,
    '--unreleased',
  ]);

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
