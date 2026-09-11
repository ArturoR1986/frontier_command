import {cp,mkdir,readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';import path from 'node:path';
const root=path.resolve(fileURLToPath(new URL('..',import.meta.url))),out=path.join(root,'dist','frontier-command');
await mkdir(path.join(out,'scripts'),{recursive:true});await mkdir(path.join(out,'src'),{recursive:true});
await cp(path.join(root,'src/frontier'),path.join(out,'src/frontier'),{recursive:true});
for(const file of ['frontier.html','package.json','README.md','Launch Frontier.cmd'])await cp(path.join(root,file),path.join(out,file));
for(const file of ['frontier-server.mjs','frontier-backup.mjs'])await cp(path.join(root,'scripts',file),path.join(out,'scripts',file));
await mkdir(path.join(out,'docs'),{recursive:true});for(const file of ['CURRENT_CONTROLS.md','CREDITS.md'])await cp(path.join(root,'docs',file),path.join(out,'docs',file));
const pkg=JSON.parse(await readFile(path.join(root,'package.json'),'utf8'));let commit='source archive',dirty=true;try{commit=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();dirty=Boolean(execFileSync('git',['status','--porcelain'],{cwd:root,encoding:'utf8'}).trim());}catch{}
await writeFile(path.join(out,'build.json'),JSON.stringify({name:pkg.name,version:pkg.version,commit,dirty,entry:'scripts/frontier-server.mjs',releaseQualified:false},null,2));
await writeFile(path.join(out,'package.json'),JSON.stringify({...pkg,scripts:{start:'node scripts/frontier-server.mjs',dev:'node scripts/frontier-server.mjs',backup:'node scripts/frontier-backup.mjs'}},null,2));
await writeFile(path.join(out,'README.md'),'# Frontier Command '+pkg.version+' — early playable prototype\n\nOpen Launch Frontier.cmd on Windows, or run node scripts/frontier-server.mjs using Node.js 24+. Open http://127.0.0.1:4180/ in a desktop browser. No dependency installation is needed. Keep the server running during play; Ctrl+C stops it.\n\nThis is a development package, not a qualified v1 release. Your world is in data/world.sqlite. Keep the colony access key from the field manual private. Client menus do not pause the shared world; the local simulation does not advance while its server is off.\n\nUse node scripts/frontier-backup.mjs to create and verify a consistent backup. Do not replace a running server database. Builds contain no player worlds or credentials.\n\n[Controls](docs/CURRENT_CONTROLS.md) · [Credits](docs/CREDITS.md) · [Production status](https://github.com/ArturoR1986/frontier_command/blob/main/docs/PRODUCTION_STATUS.md)\n');
console.log('Built persistent development package: '+out+' (saved worlds and access keys are never included)');
