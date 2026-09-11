import {readdir,readFile} from 'node:fs/promises';import {spawnSync} from 'node:child_process';
let failures=0,count=0;
async function check(directory){for(const file of await readdir(directory,{withFileTypes:true})){const path=directory+'/'+file.name;if(file.isDirectory()){await check(path);continue;}if(!/\.(m?js)$/.test(file.name))continue;count++;const result=spawnSync(process.execPath,['--check',path],{encoding:'utf8'});if(result.status){console.error(result.stderr);failures++;}if(/\t| +\r?$/m.test(await readFile(path,'utf8'))){console.error(path+': tabs or trailing spaces');failures++;}}}
for(const directory of ['src','scripts','tests'])await check(directory);if(failures)process.exit(1);console.log(count+' files: recursive syntax and whitespace checks passed.');
