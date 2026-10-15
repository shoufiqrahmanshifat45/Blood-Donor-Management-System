import puppeteer from 'puppeteer-core';

async function testAllPages() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const outDir = 'C:\\Users\\hp\\.gemini\\antigravity-ide\\brain\\be7f0fb0-ed94-4d10-b149-dbbd705abeff';

  console.log('Launching browser for comprehensive multi-page verification...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1536, height: 960, deviceScaleFactor: 1 });

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  console.log('1. Loading Dashboard...');
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle0', timeout: 30000 });
  await sleep(1500);
  await page.screenshot({ path: `${outDir}/page_01_dashboard.png` });

  // 2. Click Donors tab in Sidebar
  console.log('2. Navigating to Donors Directory...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('aside nav button'));
    const donorBtn = buttons.find((b) => b.textContent && b.textContent.includes('Donors'));
    if (donorBtn) donorBtn.click();
  });
  await sleep(1000);
  await page.screenshot({ path: `${outDir}/page_02_donors_directory.png` });

  // 3. Open Donor Registration Modal
  console.log('3. Opening Donor Registration Modal...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const regBtn = buttons.find((b) => b.textContent && b.textContent.includes('Register New Donor'));
    if (regBtn) regBtn.click();
  });
  await sleep(600);
  await page.screenshot({ path: `${outDir}/page_03_donor_registration_modal.png` });

  // Close Registration Modal
  await page.evaluate(() => {
    const closeBtns = Array.from(document.querySelectorAll('button'));
    const cancelBtn = closeBtns.find((b) => b.textContent && b.textContent.includes('Cancel'));
    if (cancelBtn) cancelBtn.click();
  });
  await sleep(500);

  // 4. Open Donor Profile Modal (click 'View Profile' on first donor)
  console.log('4. Opening Donor Profile Modal...');
  await page.evaluate(() => {
    const viewBtns = Array.from(document.querySelectorAll('button'));
    const profileBtn = viewBtns.find((b) => b.textContent && b.textContent.includes('View Profile'));
    if (profileBtn) profileBtn.click();
  });
  await sleep(600);
  await page.screenshot({ path: `${outDir}/page_04_donor_profile_modal.png` });

  // Close Profile Modal (click close button or backdrop)
  await page.evaluate(() => {
    const closeBtns = Array.from(document.querySelectorAll('button'));
    const closeBtn = closeBtns.find((b) => b.textContent && b.textContent.includes('Close Profile'));
    if (closeBtn) closeBtn.click();
  });
  await sleep(500);

  // 5. Navigate to Blood Requests
  console.log('5. Navigating to Blood Requests...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('aside nav button'));
    const reqBtn = buttons.find((b) => b.textContent && b.textContent.includes('Blood Requests'));
    if (reqBtn) reqBtn.click();
  });
  await sleep(1000);
  await page.screenshot({ path: `${outDir}/page_05_blood_requests.png` });

  // 6. Switch to Emergency SOS Tab
  console.log('6. Switching to Emergency SOS Tab...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const sosBtn = buttons.find((b) => b.textContent && b.textContent.includes('Emergency SOS'));
    if (sosBtn) sosBtn.click();
  });
  await sleep(800);
  await page.screenshot({ path: `${outDir}/page_06_emergency_sos.png` });

  // 7. Navigate to Appointments
  console.log('7. Navigating to Appointments...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('aside nav button'));
    const aptBtn = buttons.find((b) => b.textContent && b.textContent.includes('Appointments'));
    if (aptBtn) aptBtn.click();
  });
  await sleep(1000);
  await page.screenshot({ path: `${outDir}/page_07_appointments.png` });

  // 8. Navigate to Reports
  console.log('8. Navigating to Reports & Analytics...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('aside nav button'));
    const rptBtn = buttons.find((b) => b.textContent && b.textContent.includes('Reports'));
    if (rptBtn) rptBtn.click();
  });
  await sleep(1000);
  await page.screenshot({ path: `${outDir}/page_08_reports.png` });

  // 9. Expand Tools and open BMI Calculator
  console.log('9. Expanding Tools & Opening BMI Calculator...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('aside nav button'));
    const toolsBtn = buttons.find((b) => b.textContent && b.textContent.includes('Tools'));
    if (toolsBtn) toolsBtn.click();
  });
  await sleep(500);
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('aside nav button'));
    const bmiBtn = buttons.find((b) => b.textContent && b.textContent.includes('BMI Calculator'));
    if (bmiBtn) bmiBtn.click();
  });
  await sleep(1000);
  await page.screenshot({ path: `${outDir}/page_09_tools_bmi.png` });

  // 10. Switch to Eligibility Guide
  console.log('10. Switching to Eligibility Guide...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const eligBtn = buttons.find((b) => b.textContent && b.textContent.includes('Eligibility Guide'));
    if (eligBtn) eligBtn.click();
  });
  await sleep(800);
  await page.screenshot({ path: `${outDir}/page_10_tools_eligibility.png` });

  // 11. Switch to Emergency Contacts
  console.log('11. Switching to Emergency Contacts...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const emerBtn = buttons.find((b) => b.textContent && b.textContent.includes('Emergency Contacts'));
    if (emerBtn) emerBtn.click();
  });
  await sleep(800);
  await page.screenshot({ path: `${outDir}/page_11_tools_emergency.png` });

  // 12. Navigate to Settings
  console.log('12. Navigating to Settings...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('aside nav button'));
    const setBtn = buttons.find((b) => b.textContent && b.textContent.includes('Settings'));
    if (setBtn) setBtn.click();
  });
  await sleep(1000);
  await page.screenshot({ path: `${outDir}/page_12_settings.png` });

  // 13. Open User Profile & Authentication Modal
  console.log('13. Opening User Profile / Auth Modal via avatar click...');
  await page.evaluate(() => {
    const profileBtn = document.querySelector('header button[aria-label="User Profile"]');
    if (profileBtn) profileBtn.click();
  });
  await sleep(700);
  await page.screenshot({ path: `${outDir}/page_13_auth_profile.png` });

  // 14. Switch to Register Tab in Auth Modal
  console.log('14. Switching to Register Tab in Auth Modal...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('div[class*="fixed"] button'));
    const regTab = buttons.find((b) => b.textContent && b.textContent.trim() === 'Register');
    if (regTab) regTab.click();
  });
  await sleep(500);
  await page.screenshot({ path: `${outDir}/page_14_auth_register.png` });

  console.log('All 14 comprehensive page tests and captures finished successfully!');
  await browser.close();
}

testAllPages().catch((err) => {
  console.error('Error during test execution:', err);
  process.exit(1);
});
