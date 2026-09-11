import {spawn} from 'node:child_process';
import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_PATH).href);
const root=resolve('artifacts/release-6814c55');
const server=spawn(process.execPath,['serve.mjs'],{cwd:root,stdio:'pipe',env:{...process.env,PORT:'4176'}});
let browser;
try {
 await new Promise((res,rej)=>{server.stdout.once('data',res);server.once('error',rej);});
 browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH});
 const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[],missing=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
 await page.goto('http://127.0.0.1:4176');await page.locator('#new-game').click();
 await page.waitForFunction(()=>window.frontier.snapshot().time>1);
 await page.locator('#community').click();await page.locator('[data-charter="recovery"]').click();await page.locator('[data-home]').first().click();await page.locator('#close-community').click();
 await page.locator('#save').click();await page.reload();await page.locator('#continue').click();
 const s=await page.evaluate(()=>window.frontier.snapshot());
 if(s.people.length!==4||s.sites.length!==3||s.community.charter!=='recovery'||!s.people[0].home)throw Error('Package continuity failed');
 await page.screenshot({path:'artifacts/package-6814c55.png'});
 const build=JSON.parse(await readFile(resolve(root,'build.json'),'utf8'));
 if(!build.sourceCommit.startsWith('6814c55')||errors.length||missing.length)throw Error(JSON.stringify({build,errors,missing}));
 await writeFile('artifacts/package-check.json',JSON.stringify({passed:true,build,entry:'node serve.mjs in extracted folder',port:4176,checks:['package-only boot','new game','four settlers','three sites','community controls','save/reload/continue','1280x720','no missing runtime files'],errors,missing},null,2));
 console.log('Extracted 6814c55 package passed.');
}finally{if(browser)await browser.close();server.kill();}
