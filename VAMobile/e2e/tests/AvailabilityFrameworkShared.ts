/**
 * Shared helpers for Availability Framework (AF) e2e tests.
 *
 * The AF tests are split by domain (AvailabilityFrameworkProfile, AvailabilityFrameworkHome,
 * AvailabilityFrameworkHealth, AvailabilityFrameworkBenefits, AvailabilityFrameworkPayments)
 * so they can run in parallel CI jobs. Each domain file defines its navigation array and
 * delegates to `describeAF` which handles targeted (AFValue) vs full-suite execution.
 */
import { enableAF, verifyAF } from './utils'

/** When set via CLI arg, limits test execution to entries matching this e2e file name */
export const AFValue = process.argv[7]

/** Runs the three AF use-case checks (DenyAccess, DenyContent, DenyContent+Upgrade) for a single feature */
export function runTests(testRun, AFNavigationArray, x) {
  it('should verify AF use case 1 for: ' + testRun, async () => {
    await enableAF(AFNavigationArray[x][1], 'DenyAccess')
    await verifyAF(AFNavigationArray[x], 'DenyAccess')
  })

  it('should verify AF use case 2 for: ' + testRun, async () => {
    await enableAF(AFNavigationArray[x][1], 'DenyContent')
    await verifyAF(AFNavigationArray[x], 'DenyContent')
  })

  it('should verify AF use case 2 Update available for: ' + testRun, async () => {
    if (testRun != 'WG_StartNewMessage' && testRun != 'WG_ReplyMessage') {
      await enableAF(AFNavigationArray[x][1], 'DenyContent', true)
      await verifyAF(AFNavigationArray[x], 'DenyContent', true)
    }
  })
}

/**
 * Creates a describe block that either runs all entries (full suite) or filters
 * to only entries whose file-name key matches AFValue (targeted/PR run).
 * Non-matching files produce a no-op `it('no AF changes')` test.
 */
export function describeAF(suiteName: string, navigationArray: any[][]) {
  describe(suiteName, () => {
    if (AFValue !== undefined) {
      let AFNeeded = false
      for (let x = 0; x < navigationArray.length; x++) {
        let firstValue = navigationArray[x][1]
        if (navigationArray[x][0] instanceof Array) {
          for (let z = 0; z < navigationArray[x][0].length; z++) {
            if (navigationArray[x][0][z] === AFValue) {
              AFNeeded = true
              runTests(firstValue, navigationArray, x)
            }
          }
        } else {
          if (navigationArray[x][0] === AFValue) {
            AFNeeded = true
            runTests(firstValue, navigationArray, x)
          }
        }
      }
      if (AFNeeded === false) {
        it('no AF changes', async () => {})
      }
    } else {
      for (let x = 0; x < navigationArray.length; x++) {
        runTests(navigationArray[x][1], navigationArray, x)
      }
    }
  })
}
