const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox','--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'] });
  const routes = ['/', '/intro', '/hook', '/world', '/select', '/kart', '/games/language-kart', '/quiz', '/feedback'];
  const results = [];
  for (const r of routes) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1024, height: 768 });
    let status = '?', txt = '';
    try {
      const resp = await page.goto('http://localhost:3100'+r, { waitUntil: 'networkidle2', timeout: 20000 });
      status = resp.status();
      await new Promise(res => setTimeout(res, 1500));
      txt = await page.evaluate(() => document.body.innerText.slice(0, 200).replace(/\s+/g,' '));
    } catch (e) { status = 'ERR:'+e.message.slice(0,40); }
    results.push(`${r} => ${status} | ${txt}`);
    await page.close();
  }
  // special: check opening text + character names on '/'
  const p = await browser.newPage();
  await p.setViewport({ width: 1024, height: 768 });
  await p.goto('http://localhost:3100/', { waitUntil: 'networkidle2', timeout: 20000 });
  await new Promise(res => setTimeout(res, 2000));
  const openTxt = await p.evaluate(() => document.body.innerText);
  const hasPilihan = openTxt.includes('PILIHAN KITA');
  const hasNara = openTxt.includes('NARA');
  results.push('OPENING hasPILIHANKITA='+hasPilihan+' hasNARA='+hasNara);
  await p.close();

  console.log(results.join('\n'));
  await browser.close();
})();
