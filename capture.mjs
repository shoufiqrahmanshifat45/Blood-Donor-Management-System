import puppeteer from 'puppeteer-core';

async function capture() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const outputPath = 'C:\\Users\\hp\\.gemini\\antigravity-ide\\brain\\561eb38d-9cae-4975-b8e0-a785c4d220b1\\desktop_screenshot_1536.png';

  console.log('Launching browser with Edge executable...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1536, height: 960, deviceScaleFactor: 1 });
  
  console.log('Navigating to http://127.0.0.1:5173/ ...');
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0', timeout: 30000 });
  
  // Wait an extra second for Recharts SVGs to fully render
  await new Promise(r => setTimeout(r, 2000));

  console.log('Capturing screenshot to', outputPath);
  await page.screenshot({ path: outputPath, fullPage: false });
  
  await browser.close();
  console.log('Screenshot capture complete!');
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
