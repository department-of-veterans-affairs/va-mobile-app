import { by, device, element, expect, waitFor } from 'detox'
import { setTimeout } from 'timers/promises'

import { CommonE2eIdConstants, checkImages, loginToDemoMode, toggleRemoteConfigFlag } from './utils'

var navigationValue = process.argv[7]

if (navigationValue === undefined) {
  navigationValue = process.argv[6]
}
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const appTabs = ['Home', 'Benefits', 'Health', 'Payments']

export const SimulatorE2ESettings = {
  DARK_MODE_OPTIONS:
    device.getPlatform() === 'ios' ? 'xcrun simctl ui booted appearance dark' : 'adb shell "cmd uimode night yes"',
  LIGHT_MODE_OPTIONS:
    device.getPlatform() === 'ios' ? 'xcrun simctl ui booted appearance light' : 'adb shell "cmd uimode night no"',
  FONT_RESIZING_LARGEST:
    device.getPlatform() === 'ios'
      ? 'xcrun simctl ui booted content_size extra-extra-extra-large'
      : 'adb shell settings put system font_scale 1.30',
  DISPLAY_RESIZING_LARGEST: device.getPlatform() === 'android' ? 'adb shell wm density 728' : '',
  FONT_RESIZING_RESET:
    device.getPlatform() === 'ios'
      ? 'xcrun simctl ui booted content_size medium'
      : 'adb shell settings put system font_scale 1.00',
  DISPLAY_RESIZING_RESET: 'adb shell wm density reset',
}

const textToScrollViewTestID: { [k: string]: string } = {
  Home: 'homeScreenID',
  'Contact VA': 'homeScreenID',
  'Personal information': 'profileID',
  'Contact information': 'profileID',
  'Military information': 'profileID',
  Settings: 'profileID',
  'Account security': 'settingsID',
  Notifications: 'settingsID',
  Benefits: 'benefitsTestID',
  'Received July 20, 2021': 'claimsHistoryID',
  'Received January 01, 2021': 'claimsHistoryID',
  'Received July 17, 2008': 'claimsHistoryID',
  'Review letters': 'lettersPageID',
  Health: 'healthCategoryTestID',
  Appointments: 'appointmentsTestID',
  'Vilanisi Reddy': 'appointmentsTestID',
  'Claim exam': 'appointmentsTestID',
  'Medication: Naproxen side effects': 'messagesTestID',
  'Drafts (3)': 'messagesTestID',
}

let scrollID: string
let textResized: boolean

type AccessibilityOptionArgs = {
  tab: string
  expectText: string
  textToTap: string[]
  simulatorSetting?: string | null
}

const configureSimulatorAndRunTests = async ({
  tab,
  expectText,
  textToTap,
  simulatorSetting = null,
}: AccessibilityOptionArgs) => {
  if (simulatorSetting === 'landscape') {
    await device.setOrientation('landscape')
    await expect(element(by.text(expectText)).atIndex(0)).toExist()
    const feature = await device.takeScreenshot(expectText)
    await checkImages(feature)
  } else if (simulatorSetting == 'darkMode') {
    try {
      await exec(SimulatorE2ESettings.DARK_MODE_OPTIONS)
    } catch (e) {
      console.error(`exec error: ${e}`)
    }

    await setTimeout(2000)
    await expect(element(by.text(expectText)).atIndex(0)).toExist()
    const feature = await device.takeScreenshot(expectText)
    await checkImages(feature)
  } else if (simulatorSetting === 'textResizing') {
    try {
      await exec(SimulatorE2ESettings.FONT_RESIZING_LARGEST)
    } catch (e) {
      console.error(`exec error: ${e}`)
    }

    if (device.getPlatform() === 'android') {
      textResized = true
      try {
        await exec(SimulatorE2ESettings.DISPLAY_RESIZING_LARGEST)
      } catch (e) {
        console.error(`exec error: ${e}`)
      }

      await setTimeout(2000)
      await loginToDemoMode()
      await navigateToPage({ tab, textToTap })
    }

    await expect(element(by.text(expectText)).atIndex(0)).toExist()
    const feature = await device.takeScreenshot(expectText)
    await checkImages(feature)

    if (device.getPlatform() === 'ios') {
      try {
        await element(by.id(tab)).tap()
      } catch (ex) {
        await element(by.text(tab)).atIndex(0).tap()
      }
    }
  } else {
    await navigateToPage({ tab, textToTap })
    await expect(element(by.text(expectText)).atIndex(0)).toExist()
    for (let i = 0; i < appTabs.length; i++) {
      if (appTabs[i] !== tab) {
        await element(by.text(appTabs[i])).tap()
        await element(by.text(tab)).tap()
        await expect(element(by.text(expectText)).atIndex(0)).toExist()
      }
    }
  }
}

type NavigateToPageArgs = {
  tab: string
  textToTap: string[]
}

const navigateToPage = async ({ tab, textToTap }: NavigateToPageArgs) => {
  try {
    await element(by.id(tab)).tap()
  } catch (ex) {
    await element(by.text(tab)).atIndex(0).tap()
  }

  if (textToTap.length === 1) {
    if (textToTap[0] in textToScrollViewTestID) {
      scrollID = textToScrollViewTestID[textToTap[0]]
      await waitFor(element(by.text(textToTap[0])))
        .toBeVisible()
        .whileElement(by.id(scrollID))
        .scroll(50, 'down')
    } else if (tab in textToScrollViewTestID) {
      scrollID = textToScrollViewTestID[tab]
      await waitFor(element(by.text(textToTap[0])))
        .toBeVisible()
        .whileElement(by.id(scrollID))
        .scroll(50, 'down')
    }
    await element(by.text(textToTap[0])).atIndex(0).tap()
  } else {
    for (const curTextToTap of textToTap) {
      // multiple instances of text are present on screen
      if (curTextToTap === 'Get prescription details' || curTextToTap === 'Regular Chapter 31') {
        continue
      }
      if (curTextToTap === 'Received July 17, 2008') {
        await waitFor(element(by.text('Received July 17, 2008')))
          .toBeVisible()
          .whileElement(by.id(CommonE2eIdConstants.CLAIMS_HISTORY_SCROLL_ID))
          .scroll(100, 'down')
      } else if (curTextToTap === 'Files') {
        // wait for scroll to claim step animation to finish before scrolling to the top
        await setTimeout(1000)
        await element(by.id(CommonE2eIdConstants.CLAIMS_DETAILS_SCREEN_ID)).scrollTo('top')
      }

      if (curTextToTap === textToTap[0] && tab in textToScrollViewTestID) {
        scrollID = textToScrollViewTestID[tab]
        await waitFor(element(by.text(curTextToTap)))
          .toBeVisible()
          .whileElement(by.id(scrollID))
          .scroll(50, 'down')
      }

      if (curTextToTap in textToScrollViewTestID) {
        scrollID = textToScrollViewTestID[curTextToTap]
        await waitFor(element(by.text(curTextToTap)))
          .toBeVisible()
          .whileElement(by.id(scrollID))
          .scroll(50, 'down')
      }
      await element(by.text(curTextToTap)).tap()
    }

    const lastTextToTap = textToTap.at(-1)
    if (lastTextToTap === 'Get prescription details') {
      await waitFor(element(by.label('CAPECITABINE 500MG TAB.')))
        .toBeVisible()
        .whileElement(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID))
        .scroll(50, 'down')
    } else if (lastTextToTap === 'Received June 12, 2008') {
      await waitFor(element(by.text('Received June 12, 2008')))
        .toBeVisible()
        .whileElement(by.id(CommonE2eIdConstants.CLAIMS_HISTORY_SCROLL_ID))
        .scroll(100, 'down')
    } else if (
      lastTextToTap === 'Files' ||
      lastTextToTap === 'Submit evidence' ||
      lastTextToTap === 'Received July 20, 2021'
    ) {
      // wait for scroll to claim step animation to finish before scrolling to the top
      await setTimeout(1000)
      await element(by.id(CommonE2eIdConstants.CLAIMS_DETAILS_SCREEN_ID)).scrollTo('top')
    }

    if (lastTextToTap !== 'Received July 17, 2008') {
      if (lastTextToTap in textToScrollViewTestID) {
        scrollID = textToScrollViewTestID[lastTextToTap]
        await waitFor(element(by.text(lastTextToTap)))
          .toBeVisible()
          .whileElement(by.id(scrollID))
          .scroll(50, 'down')
      }
      await element(by.text(lastTextToTap)).atIndex(0).tap()
    }
  }
}

beforeAll(async () => {
  await device.launchApp({ newInstance: false })
  await toggleRemoteConfigFlag(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)
  await loginToDemoMode()
})

afterEach(async () => {
  try {
    await device.setOrientation('portrait')
  } catch (e) {
    console.error('failed to set orientation to portrait mode', e)
  }

  try {
    await exec(SimulatorE2ESettings.LIGHT_MODE_OPTIONS)
    await exec(SimulatorE2ESettings.FONT_RESIZING_RESET)
    if (device.getPlatform() === 'android') {
      await exec(SimulatorE2ESettings.DISPLAY_RESIZING_RESET)
      if (textResized) {
        textResized = false
        await loginToDemoMode()
      }
    }
  } catch (e) {
    console.error(`exec error: ${e}`)
  }
})

type NavigationTestCase = {
  tab: string
  testFiles: string[]
  textToTap: string[]
  expectText: string
  alternateTestName?: string
}

const navigationTestCases: NavigationTestCase[] = [
  {
    tab: 'Home',
    testFiles: ['HomeScreen.e2e'],
    textToTap: ['Contact us'],
    expectText: 'Contact VA',
  },
  {
    tab: 'Home',
    testFiles: ['ProfileScreen.e2e', 'PersonalInformationScreen.e2e'],
    textToTap: ['Profile', 'Personal information'],
    expectText: 'Personal information',
  },
  {
    tab: 'Home',
    testFiles: ['ProfileScreen.e2e', 'ContactInformation.e2e'],
    textToTap: ['Profile', 'Contact information'],
    expectText: 'Contact information',
  },
  {
    tab: 'Home',
    testFiles: ['ProfileScreen.e2e', 'MilitaryInformation.e2e'],
    textToTap: ['Profile', 'Military information'],
    expectText: 'Military information',
  },
  {
    tab: 'Home',
    testFiles: ['ProfileScreen.e2e', 'SettingsScreen.e2e'],
    textToTap: ['Profile', 'Settings'],
    expectText: 'Settings',
  },
  {
    tab: 'Home',
    testFiles: ['ProfileScreen.e2e', 'SettingsScreen.e2e'],
    textToTap: ['Profile', 'Settings', 'Account security'],
    expectText:
      'To access or update your sign-in information, go to the website where you manage your account information. Any updates you make there will automatically update on the mobile app.',
    alternateTestName: 'Account security',
  },
  {
    tab: 'Home',
    testFiles: ['ProfileScreen.e2e', 'SettingsScreen.e2e'],
    textToTap: ['Profile', 'Settings', 'Notifications'],
    expectText: 'Notifications',
  },
  {
    tab: 'Benefits',
    testFiles: ['DisabilityRatings.e2e'],
    textToTap: ['Disability rating'],
    expectText: 'Disability rating',
  },
  {
    tab: 'Benefits',
    testFiles: ['Claims.e2e'],
    textToTap: ['Claims'],
    expectText: 'Claims',
  },
  {
    tab: 'Benefits',
    testFiles: ['Claims.e2e'],
    textToTap: ['Claims', 'Claims history'],
    expectText: 'Claims history',
  },
  {
    tab: 'Benefits',
    testFiles: ['Claims.e2e'],
    textToTap: ['Claims', 'Claims history', 'Closed'],
    expectText: 'Your closed claims, decision reviews, and appeals',
  },
  {
    tab: 'Benefits',
    testFiles: ['Claims.e2e'],
    textToTap: ['Claims', 'Claims history', 'Active'],
    expectText: 'Your active claims, decision reviews, and appeals',
  },
  {
    tab: 'Benefits',
    testFiles: ['Claims.e2e'],
    textToTap: ['Claims', 'Claims history', 'Received July 20, 2021'],
    expectText: 'Claim details',
  },
  {
    tab: 'Benefits',
    testFiles: ['Claims.e2e'],
    textToTap: ['Claims', 'Claims history', 'Received July 20, 2021', 'Files'],
    expectText: 'JESSE_GRAY_600246732_526.pdf',
  },
  //['Claims.e2e', ['Claims', 'Claims history', 'Received July 20, 2021', 'Submit evidence'], 'Submit evidence'],
  {
    tab: 'Benefits',
    testFiles: ['Appeals.e2e', 'AppealsExpanded.e2e'],
    textToTap: ['Claims', 'Claims history', 'Received July 17, 2008'],
    expectText: 'Appeal details',
  },
  {
    tab: 'Benefits',
    testFiles: ['Appeals.e2e', 'AppealsExpanded.e2e'],
    textToTap: ['Claims', 'Claims history', 'Received July 17, 2008', 'Issues'],
    expectText: 'Currently on appeal',
  },
  {
    tab: 'Benefits',
    testFiles: ['DecisionLetters.e2e'],
    textToTap: ['Claims', 'Claim letters'],
    expectText: 'Claim letters',
  },
  {
    tab: 'Benefits',
    testFiles: ['VALetters.e2e'],
    textToTap: ['VA letters and documents'],
    expectText: 'Letters',
  },
  {
    tab: 'Benefits',
    testFiles: ['VALetters.e2e'],
    textToTap: ['VA letters and documents', 'Review letters'],
    expectText: 'Review letters',
  },
  {
    tab: 'Benefits',
    testFiles: ['VALetters.e2e'],
    textToTap: ['VA letters and documents', 'Review letters', 'Benefit summary and service verification letter'],
    expectText: 'Letter details',
  },
  {
    tab: 'Health',
    testFiles: ['Appointments.e2e', 'AppointmentsExpanded.e2e'],
    textToTap: ['Appointments'],
    expectText: 'Appointments',
  },
  {
    tab: 'Health',
    testFiles: ['Appointments.e2e', 'AppointmentsExpanded.e2e'],
    textToTap: ['Appointments', 'Vilanisi Reddy'],
    expectText: 'Details',
  },
  {
    tab: 'Health',
    testFiles: ['Appointments.e2e', 'AppointmentsExpanded.e2e'],
    textToTap: ['Appointments', 'Past'],
    expectText: 'Past 3 months',
  },
  {
    tab: 'Health',
    testFiles: ['Messages.e2e'],
    textToTap: ['Messages'],
    expectText: 'Messages',
  },
  {
    tab: 'Health',
    testFiles: ['Messages.e2e'],
    textToTap: ['Messages', 'Medication: Naproxen side effects'],
    expectText: 'Review message',
  },
  {
    tab: 'Health',
    testFiles: ['Prescriptions.e2e'],
    textToTap: ['Prescriptions'],
    expectText: 'Prescriptions',
  },
  {
    tab: 'Health',
    testFiles: ['Prescriptions.e2e'],
    textToTap: ['Prescriptions', 'Get prescription details'],
    expectText: 'AMLODIPINE BESYLATE 10MG TAB',
  },
  {
    tab: 'Health',
    testFiles: ['VaccineRecords.e2e'],
    textToTap: ['V\ufeffA vaccine records'],
    expectText: 'VA vaccines',
  },
  {
    tab: 'Health',
    testFiles: ['VaccineRecords.e2e'],
    textToTap: ['V\ufeffA vaccine records', 'January 14, 2021'],
    expectText: 'COVID-19 vaccine',
  },
  {
    tab: 'Payments',
    testFiles: ['Payments.e2e'],
    textToTap: ['VA payment history'],
    expectText: 'History',
  },

  {
    tab: 'Payments',
    testFiles: ['Payments.e2e'],
    textToTap: ['VA payment history', 'Regular Chapter 31'],
    expectText: 'Regular Chapter 31',
  },

  {
    tab: 'Payments',
    testFiles: ['DirectDeposit.e2e'],
    textToTap: ['Direct deposit information'],
    expectText: 'Direct deposit',
  },
]

describe.each(navigationTestCases)('Navigation', ({ tab, testFiles, textToTap, expectText, alternateTestName }) => {
  const testName = alternateTestName || expectText

  it('verify navigation for: ' + testName, async () => {
    await configureSimulatorAndRunTests({ tab, expectText, textToTap })
  })

  it('verify navigation landscape mode for: ' + testName, async () => {
    // key prop warning on screen shot
    await configureSimulatorAndRunTests({ tab, expectText, textToTap, simulatorSetting: 'landscape' })
  })

  it('verify navigation dark mode for: ' + testName, async () => {
    await configureSimulatorAndRunTests({ tab, expectText, textToTap, simulatorSetting: 'darkMode' })
  })

  it('verify navigation text resizing for: ' + testName, async () => {
    if (device.getPlatform() === 'ios') {
      await configureSimulatorAndRunTests({ tab, expectText, textToTap, simulatorSetting: 'textResizing' })
    }
  })
})
