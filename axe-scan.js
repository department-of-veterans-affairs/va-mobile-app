const AxeBuilder = require('@axe-core/webdriverjs');
const { Builder } = require('selenium-webdriver');
require('chromedriver');

async function runAxe(url) {
  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new (require('selenium-webdriver/chrome').Options)()
      .headless()
      .addArguments('--no-sandbox')
      .addArguments('--disable-dev-shm-usage')
      .addArguments('--disable-gpu')
      .addArguments('--disable-setuid-sandbox')
      .addArguments('--window-size=1920,1080')
      .addArguments('--ignore-certificate-errors')
      .addArguments('--ignore-ssl-errors')
      .addArguments('--disable-software-rasterizer')
      .addArguments('--log-level=3'))
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
