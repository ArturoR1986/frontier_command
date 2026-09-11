import { readdir, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
let failures = 0;
for (const directory of ['src', 'scripts', 'tests']) {
  for (const file of await readdir(directory)) {
    if (!/\.(m?js)$/.test(file)) continue;
    const path = `${directory}/${file}`;
    const result = spawnSync(process.execPath, ['--check', path], { encoding: 'utf8' });
    if (result.status) { console.error(result.stderr); failures++; }
    const text = await readFile(path, 'utf8');
    if (/\t| +\r?$/m.test(text)) { console.error(`${path}: tabs or trailing spaces`); failures++; }
  }
}
if (failures) process.exit(1);
console.log('Syntax and whitespace checks passed.');
