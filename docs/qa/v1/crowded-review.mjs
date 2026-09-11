import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_PATH).href);
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH});
try {
 const page=await browser.newPage({viewport:{width:1600,height:1000}});
 await page.goto('http://127.0.0.1:4173');await page.locator('#save-file').setInputFiles('artifacts/stress-colony.json');
 await page.waitForFunction(()=>window.frontier.snapshot().people.length===16);
 for(let i=0;i<4;i++)await page.locator('#zoom-out').click();
 await page.waitForTimeout(1500);await page.locator('#pause').click();
 await page.screenshot({path:'artifacts/crowded-80-structures.png'});
 await page.setViewportSize({width:1280,height:720});await page.locator('#community').click();await page.locator('#jump-sites').click();
 await page.screenshot({path:'artifacts/crowded-community-sites.png'});
 if(await page.locator('#fatal').isVisible())throw Error('Fatal panel');
 console.log('Crowded scene and 16-person community navigation captured.');
}finally{await browser.close();}
