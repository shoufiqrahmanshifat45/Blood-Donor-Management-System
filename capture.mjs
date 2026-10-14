import puppeteer from 'puppeteer-core';

async function capture() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const outDir = 'C:\\Users\\hp\\.gemini\\antigravity-ide\\brain\\be7f0fb0-ed94-4d10-b149-dbbd705abeff';

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
  await new Promise(r => setTimeout(r, 2000));

  // 1. Initial State (Tools collapsed by default on refresh/enter)
  console.log('Capturing initial state screenshot (Tools collapsed)...');
  await page.screenshot({ path: `${outDir}/app_initial_state.png`, fullPage: false });

  // 2. Click the Tools bar to expand hidden items
  console.log('Clicking Tools bar...');
  const toolsButton = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.textContent && b.textContent.includes('Tools'));
  });

  if (toolsButton) {
    await toolsButton.click();
    await new Promise(r => setTimeout(r, 500));
    console.log('Capturing state with Tools expanded...');
    await page.screenshot({ path: `${outDir}/app_tools_expanded.png`, fullPage: false });
  }

  await browser.close();
  console.log('All verification captures complete!');
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
