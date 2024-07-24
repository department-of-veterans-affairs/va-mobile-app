import { by, device, element, expect, waitFor } from 'detox'
import { setTimeout } from 'timers/promises'

import { CommonE2eIdConstants, checkImages, loginToDemoMode, resetInAppReview, toggleRemoteConfigFlag } from './utils'

var navigationValue = process.argv[7]

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
    ['Claims.e2e', ['Claims', 'Claims history', 'Received January 01, 2021', 'Review file requests'], 'File requests'],
    [
      'Claims.e2e',
      [
        'Claims',
        'Claims history',
        'Received January 01, 2021',
        'Review file requests',
        'Dental disability - More information needed',
      ],
      'Dental disability - More information needed',
    ],
    ['Claims.e2e', ['Claims', 'Claims history', 'Received July 20, 2021', 'Details'], 'Claim type'],
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
    ['VaccineRecords.e2e', 'V\ufeffA vaccine records', 'VA vaccines'],
    ['VaccineRecords.e2e', ['V\ufeffA vaccine records', 'January 14, 2021'], 'COVID-19 vaccine'],
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
  'Review file requests': 'claimStatusDetailsID',
  'Dental disability - More information needed': 'fileRequestPageTestID',
  'Review letters': 'lettersPageID',
  Health: 'healthCategoryTestID',
  Appointments: 'appointmentsTestID',
  'Vilanisi Reddy': 'appointmentsTestID',
  'Claim exam': 'appointmentsTestID',
  'Medication: Naproxen side effects': 'messagesTestID',
  'Drafts (3)': 'messagesTestID',
  Payments: 'paymentsID',
}

let scrollID
let textResized

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
      await element(by.id(key)).atIndex(0).tap()
    }
  } else {
    if (navigationArray[2] === 'Claim type' || navigationArray[2] === 'Prescriptions') {
      await resetInAppReview()
    }
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
  await element(by.id(key)).tap()
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
      if (subNavigationArray[k] === 'Review file requests') {
        await waitFor(element(by.id('Step3FileRequestButton')))
          .toBeVisible()
          .whileElement(by.id('ClaimDetailsScreen'))
          .scroll(100, 'down')
      } else if (subNavigationArray[k] === 'Received July 17, 2008') {
        await waitFor(element(by.text('Received July 17, 2008')))
          .toBeVisible()
          .whileElement(by.id('claimsHistoryID'))
          .scroll(100, 'down')
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

    if (subNavigationArray.slice(-1)[0] === 'Review file requests') {
      await waitFor(element(by.id('Step3FileRequestButton')))
        .toBeVisible()
        .whileElement(by.id('ClaimDetailsScreen'))
        .scroll(100, 'down')
    } else if (subNavigationArray.slice(-1)[0] === 'Get prescription details') {
      await waitFor(element(by.label('CAPECITABINE 500MG TAB.')))
        .toBeVisible()
        .whileElement(by.id('PrescriptionHistory'))
        .scroll(50, 'down')
    } else if (subNavigationArray.slice(-1)[0] === 'Received June 12, 2008') {
      await waitFor(element(by.text('Received June 12, 2008')))
        .toBeVisible()
        .whileElement(by.id('claimsHistoryID'))
        .scroll(100, 'down')
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
  await toggleRemoteConfigFlag(CommonE2eIdConstants.CLAIM_PHASE_TOGGLE_TEXT)

  await device.launchApp({ newInstance: false })
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
