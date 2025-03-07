/*
Description:
Detox script that runs dark mode, landscape, and font size accessibility tests.
The script can run either as a full suite or a subset:
* Full suite: The script will check every page outlined in navigationDic.  A full suite run occurs either on the nightly dev build or when you check "run full e2e test" in the workflow options (if running manually).
* Subset: The script will only check the pages where the test name given in the array matches the test name typed into the "List tests to test in" workflow option.
When to update:
This script should be updated whenever a new feature/new page that has the bottom nav bar is added to the app. See https://department-of-veterans-affairs.github.io/va-mobile-app/docs/QA/QualityAssuranceProcess/Automation/AddingNewFeatures for more information.
*/
import { by, device, element, expect, waitFor } from 'detox'
import { setTimeout } from 'timers/promises'

import { CommonE2eIdConstants, checkImages, loginToDemoMode, toggleRemoteConfigFlag } from './utils'

let navigationValue = process.argv[7]

if (navigationValue === undefined) {
  navigationValue = process.argv[6]
}
const { exec } = require('child_process')
const appTabs = ['Home', 'Benefits', 'Health', 'Payments']

const navigationDic = {
  Home: [
    ['HomeScreen.e2e', 'Contact us', 'Contact VA'],
    [
      ['ProfileScreen.e2e', 'PersonalInformationScreen.e2e'],
      ['Profile', 'Personal information'],
      'Personal information',
    ],
    [['ProfileScreen.e2e', 'ContactInformation.e2e'], ['Profile', 'Contact information'], 'Contact information'],
    [['ProfileScreen.e2e', 'MilitaryInformation.e2e'], ['Profile', 'Military information'], 'Military information'],
    [['ProfileScreen.e2e', 'SettingsScreen.e2e'], ['Profile', 'Settings'], 'Settings'],
    [
      ['ProfileScreen.e2e', 'SettingsScreen.e2e'],
      ['Profile', 'Settings', 'Account security'],
      'To access or update your sign-in information, go to the website where you manage your account information. Any updates you make there will automatically update on the mobile app.',
    ],
    [['ProfileScreen.e2e', 'SettingsScreen.e2e'], ['Profile', 'Settings', 'Notifications'], 'Notifications'],
  ],
  Benefits: [
    ['DisabilityRatings.e2e', 'Disability rating', 'Disability rating'],
    ['Claims.e2e', 'Claims', 'Claims'],
    ['Claims.e2e', ['Claims', 'Claims history'], 'Claims history'],
    ['Claims.e2e', ['Claims', 'Claims history', 'Closed'], 'Your closed claims, decision reviews, and appeals'],
    ['Claims.e2e', ['Claims', 'Claims history', 'Active'], 'Your active claims, decision reviews, and appeals'],
    ['Claims.e2e', ['Claims', 'Claims history', 'Received July 20, 2021'], 'Claim details'],
    ['Claims.e2e', ['Claims', 'Claims history', 'Received July 20, 2021', 'Submit evidence'], 'Submit evidence'],
    ['Claims.e2e', ['Claims', 'Claims history', 'Received July 20, 2021', 'Files'], 'JESSE_GRAY_600246732_526.pdf'],
    [['Appeals.e2e', 'AppealsExpanded.e2e'], ['Claims', 'Claims history', 'Received July 17, 2008'], 'Appeal details'],
    [
      ['Appeals.e2e', 'AppealsExpanded.e2e'],
      ['Claims', 'Claims history', 'Received July 17, 2008', 'Issues'],
      'Currently on appeal',
    ],
    ['DecisionLetters.e2e', ['Claims', 'Claim letters'], 'Claim letters'],
    ['VALetters.e2e', 'VA letters and documents', 'Letters'],
    ['VALetters.e2e', ['VA letters and documents', 'Review letters'], 'Review letters'],
    [
      'VALetters.e2e',
      ['VA letters and documents', 'Review letters', 'Benefit summary and service verification letter'],
      'Letter details',
    ],
  ],
  Health: [
    [['Appointments.e2e', 'AppointmentsExpanded.e2e'], 'Appointments', 'Appointments'],
    [['Appointments.e2e', 'AppointmentsExpanded.e2e'], ['Appointments', 'Vilanisi Reddy'], 'Details'],
    [['Appointments.e2e', 'AppointmentsExpanded.e2e'], ['Appointments', 'Past'], 'Past 3 months'],
    ['Messages.e2e', 'Messages', 'Messages'],
    ['Messages.e2e', ['Messages', 'Medication: Naproxen side effects'], 'Review message'],
    ['Prescriptions.e2e', 'Prescriptions', 'Prescriptions'],
    ['Prescriptions.e2e', ['Prescriptions', 'Get prescription details'], 'AMLODIPINE BESYLATE 10MG TAB'],
    ['VaccineRecords.e2e', ['Medical records', 'Vaccines'], 'VA vaccines'],
    ['VaccineRecords.e2e', ['Medical records', 'Vaccines', 'January 14, 2021'], 'COVID-19 vaccine'],
    ['Allergies.e2e', ['Medical records', 'Allergies and reactions'], 'Allergies'],
    ['Allergies.e2e', ['Medical records', 'Allergies and reactions', 'January 10, 2023'], 'Penicillins allergy'],
  ],
  Payments: [
    ['Payments.e2e', 'VA payment history', 'History'],
    ['Payments.e2e', ['VA payment history', 'Regular Chapter 31'], 'Regular Chapter 31'],
    ['DirectDeposit.e2e', 'Direct deposit information', 'Direct deposit'],
  ],
}

const featureID = {
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

let scrollID
let textResized

/*Constants for accessibility related command line options.  
Any new accessibility related command line options should be added here. */
export const NavigationE2eConstants = {
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

/*
Takes a screenshot for each accessibility option and compares it to a known screenshot (when done locally).
param key: Dictionary key from navigationDic. Corresponds to the sections given on the lower nav bar (Home, Health, Benefits, Payments)
param navigationDicValue: Dictionary value from navigationDic. Corresponds to the feature in the section that has a lower nav bar
param accessibilityFeatureType: String value that tells the test what accessability test to run or null value that verifies that a feature is in the right place navigation wise
*/
const accessibilityOption = async (key, navigationDicValue, accessibilityFeatureType: string | null) => {
  const navigationArray = navigationDicValue
  if (accessibilityFeatureType === 'landscape') {
    await device.setOrientation('landscape')
    await expect(element(by.text(navigationDicValue[2])).atIndex(0)).toExist()
    var feature = await device.takeScreenshot(navigationDicValue[2])
    checkImages(feature)
    await device.setOrientation('portrait')
  } else if (accessibilityFeatureType == 'darkMode') {
    exec(NavigationE2eConstants.DARK_MODE_OPTIONS, (error) => {
      if (error) {
        console.error(`exec error: ${error}`)
        return
      }
    })
    await setTimeout(2000)
    await expect(element(by.text(navigationDicValue[2])).atIndex(0)).toExist()
    var feature = await device.takeScreenshot(navigationDicValue[2])
    checkImages(feature)
  } else if (accessibilityFeatureType === 'textResizing') {
    exec(NavigationE2eConstants.FONT_RESIZING_LARGEST, (error) => {
      if (error) {
        console.error(`exec error: ${error}`)
        return
      }
    })
    if (device.getPlatform() === 'android') {
      textResized = true
      exec(NavigationE2eConstants.DISPLAY_RESIZING_LARGEST, (error) => {
        if (error) {
          console.error(`exec error: ${error}`)
          return
        }
      })
      await setTimeout(2000)
      await loginToDemoMode()
      await navigateToPage(key, navigationDicValue)
    }

    await expect(element(by.text(navigationDicValue[2])).atIndex(0)).toExist()
    var feature = await device.takeScreenshot(navigationDicValue[2])
    checkImages(feature)

    if (device.getPlatform() === 'ios') {
      try {
        await element(by.id(key)).tap()
      } catch (ex) {
        await element(by.text(key)).atIndex(0).tap()
      }
    }
  } else {
    await navigateToPage(key, navigationDicValue)
    await expect(element(by.text(navigationArray[2])).atIndex(0)).toExist()
    for (let i = 0; i < appTabs.length; i++) {
      if (appTabs[i] != key) {
        await element(by.text(appTabs[i])).tap()
        await element(by.text(key)).tap()
        await expect(element(by.text(navigationArray[2])).atIndex(0)).toExist()
      }
    }
  }
}

const navigateToPage = async (key, navigationDicValue) => {
  try {
    await element(by.id(key)).tap()
  } catch (ex) {
    await element(by.text(key)).atIndex(0).tap()
  }
  const navigationArray = navigationDicValue
  if (typeof navigationArray[1] === 'string') {
    if (navigationArray[1] in featureID) {
      scrollID = featureID[navigationArray[1]]
      await waitFor(element(by.text(navigationArray[1])))
        .toBeVisible()
        .whileElement(by.id(scrollID))
        .scroll(50, 'down')
    } else if (key in featureID) {
      scrollID = featureID[key]
      await waitFor(element(by.text(navigationArray[1])))
        .toBeVisible()
        .whileElement(by.id(scrollID))
        .scroll(50, 'down')
    }
    await element(by.text(navigationArray[1])).atIndex(0).tap()
  } else {
    const subNavigationArray = navigationArray[1]
    for (let k = 0; k < subNavigationArray.length - 1; k++) {
      if (subNavigationArray[k] === 'Received July 17, 2008') {
        await waitFor(element(by.text('Received July 17, 2008')))
          .toBeVisible()
          .whileElement(by.id(CommonE2eIdConstants.CLAIMS_HISTORY_SCROLL_ID))
          .scroll(100, 'down')
      } else if (subNavigationArray[k] === 'Files') {
        await element(by.id(CommonE2eIdConstants.CLAIMS_DETAILS_SCREEN_ID)).scrollTo('top')
      }

      if (k == 0 && key in featureID) {
        scrollID = featureID[key]
        await waitFor(element(by.text(subNavigationArray[k])))
          .toBeVisible()
          .whileElement(by.id(scrollID))
          .scroll(50, 'down')
      }

      if (subNavigationArray[k] in featureID) {
        scrollID = featureID[subNavigationArray[k]]
        await waitFor(element(by.text(subNavigationArray[k])))
          .toBeVisible()
          .whileElement(by.id(scrollID))
          .scroll(50, 'down')
      }
      await element(by.text(subNavigationArray[k])).tap()
    }

    if (subNavigationArray.slice(-1)[0] === 'Get prescription details') {
      await waitFor(element(by.label('CAPECITABINE 500MG TAB.')))
        .toBeVisible()
        .whileElement(by.id(CommonE2eIdConstants.PRESCRIPTION_HISTORY_SCROLL_ID))
        .scroll(50, 'down')
    } else if (subNavigationArray.slice(-1)[0] === 'Received June 12, 2008') {
      await waitFor(element(by.text('Received June 12, 2008')))
        .toBeVisible()
        .whileElement(by.id(CommonE2eIdConstants.CLAIMS_HISTORY_SCROLL_ID))
        .scroll(100, 'down')
    } else if (subNavigationArray.slice(-1)[0] === 'Files' || subNavigationArray.slice(-1)[0] === 'Submit evidence') {
      await element(by.id(CommonE2eIdConstants.CLAIMS_DETAILS_SCREEN_ID)).scrollTo('top')
    }

    if (subNavigationArray.slice(-1)[0] in featureID) {
      scrollID = featureID[subNavigationArray.slice(-1)[0]]
      await waitFor(element(by.text(subNavigationArray.slice(-1)[0])))
        .toBeVisible()
        .whileElement(by.id(scrollID))
        .scroll(50, 'down')
    }
    await element(by.text(subNavigationArray.slice(-1)[0]))
      .atIndex(0)
      .tap()
  }
}

beforeAll(async () => {
  await device.launchApp({ newInstance: false })
  await toggleRemoteConfigFlag(CommonE2eIdConstants.IN_APP_REVIEW_TOGGLE_TEXT)
  await loginToDemoMode()
})

afterEach(async () => {
  exec(NavigationE2eConstants.LIGHT_MODE_OPTIONS, (error) => {
    if (error) {
      console.error(`exec error: ${error}`)
      return
    }
  })

  exec(NavigationE2eConstants.FONT_RESIZING_RESET, (error) => {
    if (error) {
      console.error(`exec error: ${error}`)
      return
    }
  })
  if (device.getPlatform() === 'android') {
    exec(NavigationE2eConstants.DISPLAY_RESIZING_RESET, (error) => {
      if (error) {
        console.error(`exec error: ${error}`)
        return
      }
    })
    if (textResized) {
      textResized = false
      await loginToDemoMode()
    }
  }
})

describe('Navigation', () => {
  let testsRun = false
  for (const [key, value] of Object.entries(navigationDic)) {
    for (let j = 0; j < value.length; j++) {
      const nameArray = value[j]
      let testName = nameArray[2]
      if (
        nameArray[2] ===
        'To access or update your sign-in information, go to the website where you manage your account information. Any updates you make there will automatically update on the mobile app.'
      ) {
        testName = 'Account security'
      }
      let runTest = false
      if (nameArray[0] instanceof Array) {
        for (let z = 0; z < value.length; z++) {
          if (navigationValue === nameArray[0][z]) {
            runTest = true
          }
        }
      } else if (navigationValue === nameArray[0]) {
        runTest = true
      }
      if (runTest === true || navigationValue === undefined) {
        testsRun = true
        it('verify navigation for: ' + testName, async () => {
          await accessibilityOption(key, value[j], null)
        })

        if (testName !== 'Community care' && testName !== 'Claim exam') {
          it('verify navigation landscape mode for: ' + testName, async () => {
            await accessibilityOption(key, value[j], 'landscape')
          })

          it('verify navigation dark mode for: ' + testName, async () => {
            await accessibilityOption(key, value[j], 'darkMode')
          })
          it('verify navigation text resizing for: ' + testName, async () => {
            if (device.getPlatform() === 'ios') {
              await accessibilityOption(key, value[j], 'textResizing')
            }
          })
        }
      }
    }
  }
  if (testsRun == false) {
    it('no Nav changes', async () => {})
  }
})
