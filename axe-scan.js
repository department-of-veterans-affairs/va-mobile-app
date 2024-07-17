const { AxeBuilder } = require('@axe-core/webdriverjs')
const { Builder } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
require('chromedriver')

;(async function runAxe() {
  const options = new chrome.Options()

  // Add your desired Chrome options here
  options.addArguments('--no-sandbox')
  options.addArguments('--disable-setuid-sandbox')
  options.addArguments('--disable-dev-shm-usage')
  options.addArguments('--disable-gpu')
  options.addArguments('--window-size=1920,1080')

  const driver = new Builder().forBrowser('chrome').setChromeOptions(options).build()

  try {
    const url = process.argv[2]
    await driver.get(url)

    const results = await new AxeBuilder(driver).analyze()
    console.log(JSON.stringify(results, null, 2))

    // Output the number of accessibility issues
    const numIssues = results.violations.reduce((sum, violation) => sum + violation.nodes.length, 0)
    console.log(`Number of accessibility issues found in ${url}: ${numIssues}`)

    // Return the number of issues found
    process.exit(numIssues)
  } finally {
    await driver.quit()
  }
})()