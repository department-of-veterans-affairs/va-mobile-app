const AxeBuilder = require('@axe-core/webdriverjs');
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('chromedriver');

async function runAxe(url) {
  let options = new chrome.Options();
  options.addArguments('--headless');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--disable-gpu');
  options.addArguments('--disable-setuid-sandbox');
  options.addArguments('--window-size=1920,1080');
  options.addArguments('--ignore-certificate-errors');
  options.addArguments('--ignore-ssl-errors');
  options.addArguments('--disable-software-rasterizer');
  options.addArguments('--log-level=3');

  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    await driver.get(url);

    let results = await new AxeBuilder(driver).analyze();
    let issueCount = results.violations.length;
    console.log(`${issueCount} Accessibility issues detected`);

    return issueCount;
  } catch (err) {
    console.error('Error running Axe:', err);
    return -1;
  } finally {
    await driver.quit();
  }
}

const url = process.argv[2];
runAxe(url).then(issueCount => process.exit(issueCount > 0 ? 1 : 0));