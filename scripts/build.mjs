import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
await cp('src', 'dist/src', { recursive: true });
await cp('index.html', 'dist/index.html');
const pkg = JSON.parse(await readFile('package.json', 'utf8'));
await writeFile('dist/build.json', JSON.stringify({ name: pkg.name, version: pkg.version }, null, 2) + '\n');
console.log(`Built ${pkg.name} ${pkg.version} in dist/`);
