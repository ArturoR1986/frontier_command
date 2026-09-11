import {DatabaseSync} from 'node:sqlite';import {mkdir} from 'node:fs/promises';import path from 'node:path';
const source=path.resolve(process.argv[2]||'data/world.sqlite'),destination=path.resolve(process.argv[3]||('data/backups/world-'+new Date().toISOString().replace(/[:.]/g,'-')+'.sqlite'));
if(source===destination)throw Error('Backup must be a new file, separate from the live world.');await mkdir(path.dirname(destination),{recursive:true});
const db=new DatabaseSync(source,{readOnly:true});try{db.prepare('VACUUM INTO ?').run(destination);}finally{db.close();}
const backup=new DatabaseSync(destination,{readOnly:true});try{const check=backup.prepare('PRAGMA integrity_check').get();if(Object.values(check)[0]!=='ok')throw Error('Backup integrity check failed.');console.log('Verified consistent world backup: '+destination);}finally{backup.close();}
